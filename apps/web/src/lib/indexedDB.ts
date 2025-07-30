// apps/web/src/lib/indexedDB.ts
"use client";

const DB_NAME = 'AethelithDB';
const DB_VERSION = 1;
const STORE_NAME = 'sensitiveData';

let db: IDBDatabase | null = null;
let encryptionKey: CryptoKey | null = null; // Kunci enkripsi akan disimpan di memori

// WARNING: Untuk demo, kunci enkripsi akan dihasilkan atau didapatkan secara sederhana.
// DALAM PRODUKSI, KUNCI INI HARUS DITURUNKAN DARI SESUATU YANG HANYA DIKETAHUI PENGGUNA (misalnya, password)
// MENGGUNAKAN PBKDF2 ATAU ALGORITMA DERIVASI KUNCI YANG AMAN, DAN TIDAK PERNAH DISIMPAN SECARA PERSISTEN.
const MASTER_KEY_SEED = 'super-secret-aethelith-key-seed-for-demo-only'; // GANTI INI DI PRODUKSI!

async function getEncryptionKey(): Promise<CryptoKey> {
    if (encryptionKey) {
        return encryptionKey;
    }

    // Untuk demo, kita akan derive kunci dari seed string.
    // Dalam aplikasi nyata, ini bisa dari password pengguna atau token sesi yang aman.
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(MASTER_KEY_SEED),
        { name: "PBKDF2" }, // Menggunakan PBKDF2 untuk demonstrasi derivasi
        false, // Tidak bisa diekstrak
        ["deriveKey"]
    );

    encryptionKey = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode("aethelith-salt"), // Salt unik untuk setiap derivasi
            iterations: 100000, // Jumlah iterasi yang tinggi untuk keamanan
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true, // Bisa diekstrak (untuk disimpan/ditransmisikan jika perlu, tapi tidak disarankan)
        ["encrypt", "decrypt"]
    );

    return encryptionKey;
}

// Fungsi untuk mengenkripsi data menggunakan AES-GCM
async function encryptAES(data: string): Promise<{ iv: Uint8Array; encryptedData: ArrayBuffer }> {
    const key = await getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization Vector (IV) 12 bytes untuk AES-GCM
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

// Fungsi untuk mendekripsi data menggunakan AES-GCM
async function decryptAES(iv: Uint8Array, encryptedData: ArrayBuffer): Promise<string> {
    const key = await getEncryptionKey();

    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encryptedData
    );

    return new TextDecoder().decode(decrypted);
}


function openDb(): Promise<IDBDatabase> {
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
            // PERBAIKAN DI SINI: Menggunakan .error daripada .errorCode
            const requestTarget = event.target as IDBRequest;
            console.error("IndexedDB error:", requestTarget.error);
            reject(requestTarget.error);
        };
    });
}

// Fungsi untuk menyimpan data ke IndexedDB
// Sekarang menerima data asli (NIK, Alamat, Tanggal Lahir) dan mengenkripsinya di sini
export async function encryptAndStoreData(
    uid: string,
    fullName: string,
    nik: string, // Data asli
    alamat: string, // Data asli
    tanggalLahir: string // Data asli
) {
    if (!db) {
        db = await openDb();
    }

    // Enkripsi data sensitif sebelum disimpan
    const encryptedNik = await encryptAES(nik);
    const encryptedAlamat = await encryptAES(alamat);
    const encryptedTanggalLahir = await encryptAES(tanggalLahir);

    return new Promise<void>((resolve, reject) => {
        const transaction = db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        // Simpan IV bersama dengan data terenkripsi agar bisa didekripsi nanti
        const dataToStore = {
            uid,
            fullName, // fullName tidak dienkripsi
            encryptedNik: Array.from(new Uint8Array(encryptedNik.encryptedData)), // Convert ArrayBuffer to array for IndexedDB
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
    });
}

// Fungsi untuk mengambil data dari IndexedDB dan mendekripsinya
export async function getAndDecryptSensitiveData(uid: string): Promise<{
    fullName: string;
    nik: string;
    alamat: string;
    tanggalLahir: string;
} | null> {
    if (!db) {
        db = await openDb();
    }
    return new Promise(async (resolve, reject) => {
        const transaction = db!.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);

        const request = store.get(uid);

        request.onsuccess = async (event) => {
            const result = (event.target as IDBRequest).result;
            if (result) {
                try {
                    // Konversi kembali dari Array ke Uint8Array/ArrayBuffer
                    const decryptedNik = await decryptAES(
                        new Uint8Array(result.ivNik),
                        new Uint8Array(result.encryptedNik).buffer
                    );
                    const decryptedAlamat = await decryptAES(
                        new Uint8Array(result.ivAlamat),
                        new Uint8Array(result.encryptedAlamat).buffer
                    );
                    const decryptedTanggalLahir = await decryptAES(
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
                resolve(null); // Data tidak ditemukan
            }
        };
        request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
}