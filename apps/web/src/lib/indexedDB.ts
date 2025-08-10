"use client";
// lib/indexedDB.ts

const DB_NAME = 'AethelithDB';
const DB_VERSION = 1;
const STORE_NAME = 'userData';

// ...existing code...

/**
 * Fungsi gabungan: Ambil dan dekripsi data sensitif user
 * Mirip dengan getDecryptedUserData, tapi bisa ditambah logika khusus jika perlu
 */
export async function getAndDecryptSensitiveData(
    uid: string,
    accessPasswordOrIdToken: string
): Promise<UserData | null> {
    return await getDecryptedUserData(uid, accessPasswordOrIdToken);
}
// ...existing code...

let db: IDBDatabase | null = null;

// Fungsi helper untuk mengkonversi ArrayBuffer ke Base64 (untuk tujuan logging/debugging)
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return btoa(binary);
}

// Interface tipe data yang disimpan di IndexedDB
export interface StoredUserData {
    uid: string;
    fullName: string;
    // Data terenkripsi dan IV masing-masing
    encryptedNik: ArrayBuffer;
    ivNik: ArrayBuffer;
    encryptedAlamat: ArrayBuffer;
    ivAlamat: ArrayBuffer;
    encryptedTanggalLahir: ArrayBuffer;
    ivTanggalLahir: ArrayBuffer;
    // Salt unik per pengguna untuk derivasi kunci utama
    keyDerivationSalt: ArrayBuffer; // <--- PENTING: Salt untuk derivasi kunci
    timestamp: string;
}

// Interface tipe data yang sudah didekripsi
export interface UserData {
    fullName: string;
    nik: string;
    alamat: string;
    tanggalLahir: string;
}

/**
 * Membuka koneksi ke IndexedDB. Menggunakan singleton pattern.
 */
export async function openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (db) {
            console.log("Using existing IndexedDB connection.");
            resolve(db);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const dbInstance = (event.target as IDBOpenDBRequest).result;
            if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                dbInstance.createObjectStore(STORE_NAME, { keyPath: 'uid' });
                console.log(`IndexedDB object store '${STORE_NAME}' created.`);
            }
        };

        request.onsuccess = (event) => {
            db = (event.target as IDBOpenDBRequest).result;
            console.log("IndexedDB opened successfully.");
            resolve(db);
        };

        request.onerror = (event) => {
            const target = event.target as IDBRequest;
            console.error("IndexedDB open error:", target.error);
            reject(target.error);
        };
    });
}

/**
 * Derive kunci enkripsi AES-GCM dari keyMaterial (misalnya ID Token atau password).
 * Salt harus unik per pengguna, jadi disediakan sebagai argumen.
 * Jika tidak ada salt (untuk enkripsi pertama kali), generate yang baru.
 */
export async function deriveEncryptionKey(keyMaterial: string, salt?: ArrayBuffer): Promise<{ key: CryptoKey; saltUsed: ArrayBuffer }> {
    const enc = new TextEncoder();
    // Gunakan salt yang disediakan atau generate yang baru
    const currentSalt = salt ? new Uint8Array(salt) : crypto.getRandomValues(new Uint8Array(16)); // 16 bytes = 128 bits

    try {
        const keyMaterialBytes = await crypto.subtle.importKey(
            "raw",
            enc.encode(keyMaterial),
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );

        const derivedKey = await crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: currentSalt,
                iterations: 100000,
                hash: "SHA-256",
            },
            keyMaterialBytes,
            { name: "AES-GCM", length: 256 },
            true, // set to true if you need to export the key (e.g., for testing or transferring), else false
            ["encrypt", "decrypt"]
        );
        console.log("Encryption key derived successfully.");
        return { key: derivedKey, saltUsed: currentSalt.buffer }; // Kembalikan salt yang digunakan
    } catch (error) {
        console.error("Error deriving encryption key:", error);
        throw new Error(`Failed to derive encryption key. Check key derivation parameters. Original error: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Enkripsi data string menggunakan AES-GCM dan menghasilkan IV unik.
 */
export async function encryptAES(
    key: CryptoKey,
    data: string
): Promise<{ iv: ArrayBuffer; encryptedData: ArrayBuffer }> {
    const ivUint8 = crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for AES-GCM IV is standard
    const encodedData = new TextEncoder().encode(data);

    try {
        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: ivUint8 },
            key,
            encodedData
        );

        return { iv: ivUint8.buffer, encryptedData: encrypted as ArrayBuffer };
    } catch (error) {
        console.error("Error during AES encryption:", error);
        throw new Error(`Failed to encrypt data. Original error: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Dekripsi data terenkripsi menggunakan AES-GCM dengan IV yang diberikan.
 */
export async function decryptAES(
    key: CryptoKey,
    ivBuffer: ArrayBuffer,
    encryptedData: ArrayBuffer
): Promise<string> {
    const ivView = new Uint8Array(ivBuffer); // Ensure IV is a Uint8Array view
    const dataToDecrypt = encryptedData instanceof ArrayBuffer ? encryptedData : new Uint8Array(encryptedData).buffer; // Safegaurd

    try {
        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: ivView },
            key,
            dataToDecrypt
        );
        return new TextDecoder().decode(decrypted);
    } catch (error) {
        console.error("Error during AES decryption:", error, "Key:", key, "IV:", ivBuffer, "Encrypted Data:", encryptedData);
        throw new Error(`Decryption failed. This usually means the encryption key (derived from password/token) is incorrect or the data is corrupted. Original error: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Enkripsi dan simpan data pengguna ke IndexedDB.
 */
export async function encryptAndStoreData(
    uid: string,
    userPasswordOrIdToken: string, // Lebih jelas sebagai input key material
    fullName: string,
    nik: string,
    alamat: string,
    tanggalLahir: string
): Promise<void> {
    try {
        // Derive kunci utama dan dapatkan salt baru (karena ini enkripsi pertama)
        const { key, saltUsed } = await deriveEncryptionKey(userPasswordOrIdToken);
        console.log("Starting data encryption for storage...");

        const [encryptedNik, encryptedAlamat, encryptedTanggalLahir] = await Promise.all([
            encryptAES(key, nik),
            encryptAES(key, alamat),
            encryptAES(key, tanggalLahir),
        ]);

        const dataToStore: StoredUserData = {
            uid,
            fullName,
            encryptedNik: encryptedNik.encryptedData,
            ivNik: encryptedNik.iv,
            encryptedAlamat: encryptedAlamat.encryptedData,
            ivAlamat: encryptedAlamat.iv,
            encryptedTanggalLahir: encryptedTanggalLahir.encryptedData,
            ivTanggalLahir: encryptedTanggalLahir.iv,
            keyDerivationSalt: saltUsed, // <--- PENTING: Simpan salt ini!
            timestamp: new Date().toISOString(),
        };

        // --- Logging tambahan untuk debugging ---
        console.log("Data to be stored (encrypted parts as Base64 for console view):");
        console.log("  encryptedNik (Base64):", arrayBufferToBase64(encryptedNik.encryptedData));
        console.log("  ivNik (Base64):", arrayBufferToBase64(encryptedNik.iv));
        console.log("  encryptedAlamat (Base64):", arrayBufferToBase64(encryptedAlamat.encryptedData));
        console.log("  ivAlamat (Base64):", arrayBufferToBase64(encryptedAlamat.iv));
        console.log("  encryptedTanggalLahir (Base64):", arrayBufferToBase64(encryptedTanggalLahir.encryptedData));
        console.log("  ivTanggalLahir (Base64):", arrayBufferToBase64(encryptedTanggalLahir.iv));
        console.log("  keyDerivationSalt (Base64):", arrayBufferToBase64(saltUsed));
        // --- End Logging ---

        const database = await openDb();

        return new Promise<void>((resolve, reject) => {
            const transaction = database.transaction([STORE_NAME], "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(dataToStore);

            request.onsuccess = () => {
                console.log("Data successfully put into IndexedDB for UID:", uid);
                resolve();
            };

            request.onerror = (event) => {
                const error = (event.target as IDBRequest).error;
                console.error("Error putting data into IndexedDB for UID:", uid, error);
                reject(new Error(`Failed to store data in IndexedDB: ${error?.message || 'Unknown error'}`));
            };

            transaction.oncomplete = () => {
                console.log("IndexedDB transaction completed for storing data.");
            };

            transaction.onerror = (event) => {
                const error = (event.target as IDBTransaction).error;
                console.error("IndexedDB transaction error during store:", error);
                reject(new Error(`IndexedDB transaction error: ${error?.message || 'Unknown error'}`));
            };

            transaction.onabort = () => {
                console.warn("IndexedDB transaction aborted.");
                reject(new Error("IndexedDB transaction aborted."));
            }
        });
    } catch (error) {
        console.error("Failed to encrypt or store data in IndexedDB (outer catch):", error);
        throw error;
    }
}

/**
 * Ambil dan dekripsi data pengguna dari IndexedDB.
 */
export async function getDecryptedUserData(
    uid: string,
    accessPasswordOrIdToken: string // Lebih jelas sebagai input key material
): Promise<UserData | null> {
    let database: IDBDatabase;
    try {
        database = await openDb();
    } catch (openDbError) {
        console.error('Initial Error opening IndexedDB in getDecryptedUserData:', openDbError);
        throw new Error(`Failed to open local database. Original error: ${openDbError instanceof Error ? openDbError.message : String(openDbError)}`);
    }

    return await new Promise<UserData | null>((resolve, reject) => {
        let resolvedOrRejected = false;

        const transaction = database.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        console.log(`Attempting to retrieve record for UID: ${uid} from IndexedDB.`);
        const request = store.get(uid);

        const timeoutId = setTimeout(() => {
            if (!resolvedOrRejected) {
                resolvedOrRejected = true;
                const timeoutError = new Error('IndexedDB request timed out when fetching user data.');
                console.error(timeoutError);
                reject(timeoutError);
            }
        }, 7000);

        request.onerror = (event) => {
            if (resolvedOrRejected) return;
            resolvedOrRejected = true;
            clearTimeout(timeoutId);
            const error = (event.target as IDBRequest).error;
            console.error('IndexedDB get request error for UID:', uid, error);
            reject(new Error(`IndexedDB read error for user data. Original error: ${error?.message || 'Unknown error'}`));
        };

        request.onsuccess = async (event) => {
            if (resolvedOrRejected) return;
            resolvedOrRejected = true;
            clearTimeout(timeoutId);

            try {
                const record: StoredUserData | undefined = (event.target as IDBRequest).result;

                if (!record) {
                    console.warn(`No record found in IndexedDB for uid: ${uid}. Returning null.`);
                    resolve(null);
                    return;
                }

                console.log('Record successfully retrieved from IndexedDB:', record);

                // PENTING: Gunakan salt yang disimpan untuk derivasi kunci
                const { key } = await deriveEncryptionKey(accessPasswordOrIdToken, record.keyDerivationSalt);

                if (!key) { // Safety check
                    throw new Error('Derived encryption key is unexpectedly null/undefined after derivation.');
                }
                console.log('Attempting to decrypt data with derived key...');

                const [nik, alamat, tanggalLahir] = await Promise.all([
                    decryptAES(key, record.ivNik, record.encryptedNik),
                    decryptAES(key, record.ivAlamat, record.encryptedAlamat),
                    decryptAES(key, record.ivTanggalLahir, record.encryptedTanggalLahir),
                ]);

                console.log('Data successfully decrypted!');
                resolve({
                    fullName: record.fullName,
                    nik,
                    alamat,
                    tanggalLahir,
                });
            } catch (decryptionError) {
                console.error('Error during data decryption (likely incorrect password/token or corrupted data):', decryptionError);
                // Re-throw specific decryption error
                reject(decryptionError);
            }
        };

        transaction.onerror = (event) => {
            if (resolvedOrRejected) return;
            resolvedOrRejected = true;
            clearTimeout(timeoutId);
            const error = (event.target as IDBTransaction).error;
            console.error('IndexedDB transaction error during get:', error);
            reject(new Error(`IndexedDB transaction error when fetching: ${error?.message || 'Unknown error'}`));
        };

        transaction.onabort = () => {
            if (resolvedOrRejected) return;
            resolvedOrRejected = true;
            clearTimeout(timeoutId);
            console.warn("IndexedDB transaction aborted during get.");
            reject(new Error("IndexedDB transaction aborted when fetching."));
        }
    });
}