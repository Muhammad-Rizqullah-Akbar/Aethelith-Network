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
        encryptedData: encrypted
    };
}

/**
 * Decrypts data using AES-GCM with a provided key.
 */
async function decryptAES(key: CryptoKey, iv: Uint8Array, encryptedData: ArrayBuffer): Promise<string> {
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
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
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'uid' });
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
    if (!db) {
        db = await openDb();
    }
    
    return new Promise<void>(async (resolve, reject) => {
        try {
            const transaction = db!.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const key = await deriveEncryptionKey(keyMaterial);
            
            const encryptedNik = await encryptAES(key, nik);
            const encryptedAlamat = await encryptAES(key, alamat);
            const encryptedTanggalLahir = await encryptAES(key, tanggalLahir);

            const dataToStore = {
                uid,
                fullName,
                encryptedNik: Array.from(new Uint8Array(encryptedNik.encryptedData)),
                ivNik: Array.from(encryptedNik.iv),
                encryptedAlamat: Array.from(new Uint8Array(encryptedAlamat.encryptedData)),
                ivAlamat: Array.from(encryptedAlamat.iv),
                encryptedTanggalLahir: Array.from(new Uint8Array(encryptedTanggalLahir.encryptedData)),
                ivTanggalLahir: Array.from(encryptedTanggalLahir.iv),
                timestamp: new Date().toISOString()
            };

            const request = store.put(dataToStore);

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject((event.target as IDBRequest).error);
        } catch (error) {
            reject(error);
        }
    });
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
                        
                        const decryptedNik = await decryptAES(
                            key,
                            new Uint8Array(result.ivNik),
                            new Uint8Array(result.encryptedNik).buffer
                        );
                        const decryptedAlamat = await decryptAES(
                            key,
                            new Uint8Array(result.ivAlamat),
                            new Uint8Array(result.encryptedAlamat).buffer
                        );
                        const decryptedTanggalLahir = await decryptAES(
                            key,
                            new Uint8Array(result.ivTanggalLahir),
                            new Uint8Array(result.encryptedTanggalLahir).buffer
                        );

                        resolve({
                            fullName: result.fullName,
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
