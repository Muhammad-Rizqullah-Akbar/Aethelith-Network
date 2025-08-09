// apps/web/src/lib/indexedDB.ts
"use client";

const DB_NAME = 'AethelithDB';
const DB_VERSION = 1;
const STORE_NAME = 'userData';

let db: IDBDatabase | null = null;

/**
 * Derives an encryption key from a given key material (e.g., Firebase ID Token).
 * This ensures the key is unique to the user's session and not statically stored.
 *
 * @param keyMaterial The key material to derive the encryption key from.
 * @returns A promise that resolves to a CryptoKey.
 */
async function deriveEncryptionKey(keyMaterial: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterialBytes = await crypto.subtle.importKey(
        "raw",
        enc.encode(keyMaterial),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    const encryptionKey = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode("aethelith-salt"),
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterialBytes,
        { name: "AES-GCM", length: 256 },
        false, // Kunci tidak bisa diekstrak, ini lebih aman
        ["encrypt", "decrypt"]
    );

    return encryptionKey;
}

/**
 * Encrypts data using AES-GCM with a provided key.
 */
async function encryptAES(key: CryptoKey, data: string): Promise<{ iv: Uint8Array; encryptedData: ArrayBuffer }> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);

    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encodedData
    );

    return {
        iv: iv,
        encryptedData: encrypted // This is already an ArrayBuffer
    };
}

/**
 * Decrypts data using AES-GCM with a provided key.
 *
 * @param key The CryptoKey for decryption.
 * @param iv The Initialization Vector (Uint8Array).
 * @param encryptedData The encrypted data (ArrayBuffer).
 * @returns A promise that resolves to the decrypted string.
 */
async function decryptAES(key: CryptoKey, iv: Uint8Array, encryptedData: ArrayBuffer): Promise<string> {
    // Ensuring encryptedData is an ArrayBuffer is critical for crypto.subtle.decrypt
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", },
        key,
        encryptedData
    );

    return new TextDecoder().decode(decrypted);
}

/**
 * Opens and initializes the IndexedDB database.
 */
async function openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const dbInstance = (event.target as IDBOpenDBRequest).result;
            if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                dbInstance.createObjectStore(STORE_NAME, { keyPath: 'uid' });
            }
        };

        request.onsuccess = (event) => {
            db = (event.target as IDBOpenDBRequest).result;
            resolve(db);
        };

        request.onerror = (event) => {
            const requestTarget = event.target as IDBRequest;
            console.error("IndexedDB error:", requestTarget.error);
            reject(requestTarget.error);
        };
    });
}

/**
 * Encrypts and stores sensitive user data in IndexedDB.
 * Requires a unique keyMaterial (e.g., user's ID Token) for encryption.
 */
export async function encryptAndStoreData(
    uid: string,
    keyMaterial: string,
    fullName: string,
    nik: string,
    alamat: string,
    tanggalLahir: string
): Promise<void> {
    try {
        // 1. Dapatkan kunci enkripsi terlebih dahulu
        const key = await deriveEncryptionKey(keyMaterial);

        // 2. Lakukan semua operasi enkripsi secara asinkron
        const encryptedNikPromise = encryptAES(key, nik);
        const encryptedAlamatPromise = encryptAES(key, alamat);
        const encryptedTanggalLahirPromise = encryptAES(key, tanggalLahir);

        // Tunggu semua enkripsi selesai secara paralel
        const [encryptedNik, encryptedAlamat, encryptedTanggalLahir] = await Promise.all([
            encryptedNikPromise,
            encryptedAlamatPromise,
            encryptedTanggalLahirPromise
        ]);

        // 3. Persiapkan objek data yang akan disimpan
        const dataToStore = {
            uid,
            fullName,
            // Store ArrayBuffer and Uint8Array directly. IndexedDB handles these types natively.
            encryptedNik: encryptedNik.encryptedData, // This is already an ArrayBuffer
            ivNik: encryptedNik.iv, // This is already a Uint8Array
            encryptedAlamat: encryptedAlamat.encryptedData,
            ivAlamat: encryptedAlamat.iv,
            encryptedTanggalLahir: encryptedTanggalLahir.encryptedData,
            ivTanggalLahir: encryptedTanggalLahir.iv,
            timestamp: new Date().toISOString()
        };

        // 4. Pastikan database terbuka
        const database = await openDb();

        // 5. MULAI TRANSAKSI SEKARANG dan LAKUKAN OPERASI PUT SECARA LANGSUNG
        return new Promise<void>((resolve, reject) => {
            const transaction = database.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.put(dataToStore);

            request.onsuccess = () => {
                console.log('Data successfully put into IndexedDB.');
                resolve();
            };
            request.onerror = (event) => {
                console.error('Error putting data into IndexedDB:', (event.target as IDBRequest).error);
                reject((event.target as IDBRequest).error);
            };

            // Tambahkan penanganan untuk complete/error transaksi
            transaction.oncomplete = () => {
                console.log('IndexedDB transaction completed.');
            };
            transaction.onerror = (event) => {
                console.error('IndexedDB transaction error:', (event.target as IDBTransaction).error);
                reject((event.target as IDBTransaction).error);
            };
            transaction.onabort = (event) => {
                console.warn('IndexedDB transaction aborted.');
                reject(new Error('Transaction aborted.'));
            };
        });

    } catch (error) {
        console.error('Failed to encrypt or store data in IndexedDB:', error);
        throw error;
    }
}

/**
 * Retrieves and decrypts sensitive user data from IndexedDB.
 * Requires a unique keyMaterial (e.g., user's ID Token) for decryption.
 */
export async function getAndDecryptSensitiveData(uid: string, keyMaterial: string): Promise<{
    fullName: string;
    nik: string;
    alamat: string;
    tanggalLahir: string;
} | null> {
    if (!db) {
        db = await openDb();
    }

    return new Promise(async (resolve, reject) => {
        try {
            const transaction = db!.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(uid);

            request.onsuccess = async (event) => {
                const result = (event.target as IDBRequest).result;
                if (result) {
                    try {
                        const key = await deriveEncryptionKey(keyMaterial);

                        // PERUBAHAN UTAMA: Pastikan data yang diambil adalah ArrayBuffer.
                        // IndexedDB harusnya mengembalikan ArrayBuffer jika itu yang disimpan.
                        // Jika tidak, kita perlu mengkonversinya.
                        // Casting `result.encryptedNik` to `ArrayBuffer` directly as IndexedDB should store it as such.
                        // If `result.encryptedNik` is coming back as a plain Array (due to some serialization issue),
                        // we'd need `new Uint8Array(result.encryptedNik).buffer`.
                        // Given the previous `Uint8Array(encryptedNik.encryptedData)` was removed,
                        // `result.encryptedNik` should directly be an ArrayBuffer.

                        // Let's add explicit type definitions for the stored object structure
                        // to help TypeScript during retrieval.
                        interface StoredUserData {
                            uid: string;
                            fullName: string;
                            encryptedNik: ArrayBuffer; // Expecting ArrayBuffer
                            ivNik: Uint8Array; // Expecting Uint8Array
                            encryptedAlamat: ArrayBuffer;
                            ivAlamat: Uint8Array;
                            encryptedTanggalLahir: ArrayBuffer;
                            ivTanggalLahir: Uint8Array;
                            timestamp: string;
                        }

                        const userData: StoredUserData = result; // Assert the type of the retrieved result

                        const decryptedNik = await decryptAES(
                            key,
                            userData.ivNik,
                            userData.encryptedNik // No .buffer needed if it's already ArrayBuffer
                        );
                        const decryptedAlamat = await decryptAES(
                            key,
                            userData.ivAlamat,
                            userData.encryptedAlamat
                        );
                        const decryptedTanggalLahir = await decryptAES(
                            key,
                            userData.ivTanggalLahir,
                            userData.encryptedTanggalLahir
                        );

                        resolve({
                            fullName: userData.fullName,
                            nik: decryptedNik,
                            alamat: decryptedAlamat,
                            tanggalLahir: decryptedTanggalLahir
                        });
                    } catch (decryptError) {
                        console.error("Error decrypting data from IndexedDB:", decryptError);
                        reject(decryptError);
                    }
                } else {
                    resolve(null);
                }
            };
            request.onerror = (event) => reject((event.target as IDBRequest).error);
        } catch (error) {
            reject(error);
        }
    });
}