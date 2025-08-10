// lib/indexedDB.ts
'use client';

// Nama dan versi database IndexedDB.
const DB_NAME = 'AethelithDB';
const DB_VERSION = 1;
// Nama object store di dalam database.
const STORE_NAME = 'userData';

// Variabel global untuk menyimpan instance database agar tidak perlu membuka koneksi berulang kali.
let db: IDBDatabase | null = null;

// Tipe data untuk objek yang akan disimpan di IndexedDB.
// NOTE: gunakan ArrayBuffer untuk field binary yang disimpan agar tidak terjadi ambiguitas generic di TS.
interface StoredUserData {
    uid: string;
    fullName: string;
    encryptedNik: ArrayBuffer;
    ivNik: ArrayBuffer;                 // <-- ArrayBuffer (bukan Uint8Array)
    encryptedAlamat: ArrayBuffer;
    ivAlamat: ArrayBuffer;
    encryptedTanggalLahir: ArrayBuffer;
    ivTanggalLahir: ArrayBuffer;
    timestamp: string;
}

/**
 * Membuka koneksi ke IndexedDB dan membuat object store jika belum ada.
 * Menggunakan singleton pattern untuk menghindari koneksi ganda.
 * @returns {Promise<IDBDatabase>} Instance database IndexedDB.
 */
async function openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        // Jika koneksi sudah ada, langsung kembalikan.
        if (db) {
            resolve(db);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        // Handler untuk menangani upgrade database, seperti saat versi berubah.
        request.onupgradeneeded = (event) => {
            const dbInstance = (event.target as IDBOpenDBRequest).result;
            // Buat object store dengan 'uid' sebagai key path jika belum ada.
            if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                dbInstance.createObjectStore(STORE_NAME, { keyPath: 'uid' });
            }
        };

        // Handler saat koneksi berhasil dibuka.
        request.onsuccess = (event) => {
            db = (event.target as IDBOpenDBRequest).result;
            resolve(db);
        };

        // Handler saat terjadi error pada koneksi.
        request.onerror = (event) => {
            const requestTarget = event.target as IDBRequest;
            console.error("IndexedDB error:", requestTarget.error);
            reject(requestTarget.error);
        };
    });
}

/**
 * Menurunkan (derive) kunci enkripsi dari material kunci (seperti ID Token) menggunakan PBKDF2.
 * Ini adalah cara yang aman untuk membuat kunci enkripsi yang kuat dari string.
 * @param {string} keyMaterial Material kunci, misalnya ID Token pengguna.
 * @returns {Promise<CryptoKey>} Kunci enkripsi AES-GCM yang siap pakai.
 */
async function deriveEncryptionKey(keyMaterial: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterialBytes = await crypto.subtle.importKey(
        "raw",
        enc.encode(keyMaterial),
        { name: "PBKDF2" },
        false, // Kunci tidak dapat diekspor
        ["deriveKey"]
    );

    // Derivasi kunci PBKDF2 menjadi kunci AES-GCM 256-bit.
    const encryptionKey = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            // Salt unik untuk setiap aplikasi, membantu mencegah serangan rainbow table.
            salt: enc.encode("aethelith-salt"),
            iterations: 100000, // Jumlah iterasi yang tinggi untuk kekuatan yang lebih baik.
            hash: "SHA-256",
        },
        keyMaterialBytes,
        { name: "AES-GCM", length: 256 },
        false, // Kunci tidak dapat diekspor
        ["encrypt", "decrypt"]
    );

    return encryptionKey;
}

/**
 * Mengenkripsi data string menggunakan algoritma AES-GCM.
 * Mengembalikan IV sebagai ArrayBuffer (salinan) agar aman disimpan ke IndexedDB.
 * @param {CryptoKey} key Kunci enkripsi.
 * @param {string} data Data string yang akan dienkripsi.
 * @returns {Promise<{ iv: ArrayBuffer; encryptedData: ArrayBuffer }>} Objek berisi IV dan data terenkripsi.
 */
async function encryptAES(key: CryptoKey, data: string): Promise<{ iv: ArrayBuffer; encryptedData: ArrayBuffer }> {
    // Initialization Vector (IV) harus unik untuk setiap enkripsi.
    const ivUint8 = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);

    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: ivUint8 }, // SubtleCrypto menerima Uint8Array (ArrayBufferView)
        key,
        encodedData
    );

    // Buat salinan ArrayBuffer yang tepat dari iv agar tidak bergantung pada underlying buffer yang lebih besar.
    const ivCopy = ivUint8.slice().buffer; // slice() membuat copy Uint8Array sehingga .buffer adalah ArrayBuffer yang tepat untuk ukuran iv

    return {
        iv: ivCopy,
        encryptedData: encrypted as ArrayBuffer
    };
}

/**
 * Mendekripsi data ArrayBuffer menggunakan algoritma AES-GCM.
 * @param {CryptoKey} key Kunci dekripsi.
 * @param {ArrayBuffer} ivBuffer Initialization Vector (sebagai ArrayBuffer) yang digunakan saat enkripsi.
 * @param {ArrayBuffer} encryptedData Data yang akan didekripsi.
 * @returns {Promise<string>} Data yang telah didekripsi sebagai string.
 */
async function decryptAES(key: CryptoKey, ivBuffer: ArrayBuffer, encryptedData: ArrayBuffer): Promise<string> {
    // Pastikan encryptedData adalah ArrayBuffer
    const dataToDecrypt = encryptedData instanceof ArrayBuffer ? encryptedData : new Uint8Array(encryptedData).buffer;

    // SubtleCrypto menerima BufferSource; kita bisa pakai Uint8Array view di atas ArrayBuffer yang disimpan.
    const ivView = new Uint8Array(ivBuffer);

    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivView },
        key,
        dataToDecrypt
    );

    return new TextDecoder().decode(decrypted);
}


/**
 * Mengenkripsi dan menyimpan data pengguna sensitif ke IndexedDB.
 * Data dienkripsi per-field untuk fleksibilitas.
 * @param {string} uid ID unik pengguna.
 * @param {string} keyMaterial ID Token pengguna.
 * @param {string} fullName Nama lengkap pengguna.
 * @param {string} nik Nomor Induk Kependudukan.
 * @param {string} alamat Alamat pengguna.
 * @param {string} tanggalLahir Tanggal lahir pengguna.
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
        const key = await deriveEncryptionKey(keyMaterial);

        // Enkripsi semua data sensitif secara paralel.
        const [encryptedNik, encryptedAlamat, encryptedTanggalLahir] = await Promise.all([
            encryptAES(key, nik),
            encryptAES(key, alamat),
            encryptAES(key, tanggalLahir)
        ]);

        const dataToStore: StoredUserData = {
            uid,
            fullName,
            encryptedNik: encryptedNik.encryptedData,
            ivNik: encryptedNik.iv, // ArrayBuffer
            encryptedAlamat: encryptedAlamat.encryptedData,
            ivAlamat: encryptedAlamat.iv,
            encryptedTanggalLahir: encryptedTanggalLahir.encryptedData,
            ivTanggalLahir: encryptedTanggalLahir.iv,
            timestamp: new Date().toISOString()
        };

        const database = await openDb();

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

            // Tambahkan handler untuk memastikan transaksi selesai atau gagal
            transaction.oncomplete = () => {
                console.log('IndexedDB transaction completed.');
            };
            transaction.onerror = (event) => {
                console.error('IndexedDB transaction error:', (event.target as IDBTransaction).error);
            };
            transaction.onabort = () => {
                console.warn('IndexedDB transaction aborted.');
            };
        });

    } catch (error) {
        console.error('Failed to encrypt or store data in IndexedDB:', error);
        throw error;
    }
}

/**
 * Mengambil dan mendekripsi data pengguna sensitif dari IndexedDB.
 * @param {string} uid ID unik pengguna.
 * @param {string} keyMaterial ID Token pengguna.
 * @returns {Promise<{ fullName: string; nik: string; alamat: string; tanggalLahir: string; } | null>} Objek data pengguna yang telah didekripsi, atau null jika data tidak ditemukan.
 */
export async function getAndDecryptSensitiveData(uid: string, keyMaterial: string): Promise<{
    fullName: string;
    nik: string;
    alamat: string;
    tanggalLahir: string;
} | null> {
    try {
        const database = await openDb();

        const dataToDecrypt = await new Promise<StoredUserData | undefined>((resolve, reject) => {
            const transaction = database.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(uid);

            request.onsuccess = (event) => {
                const result = (event.target as IDBRequest).result;
                resolve(result);
            };
            request.onerror = (event) => {
                reject((event.target as IDBRequest).error);
            };
        });

        if (!dataToDecrypt) {
            console.error('Data pengguna tidak ditemukan di IndexedDB.');
            return null;
        }

        const key = await deriveEncryptionKey(keyMaterial);

        // Dekripsi data secara paralel untuk performa yang lebih baik.
        const [decryptedNik, decryptedAlamat, decryptedTanggalLahir] = await Promise.all([
            decryptAES(key, dataToDecrypt.ivNik, dataToDecrypt.encryptedNik),
            decryptAES(key, dataToDecrypt.ivAlamat, dataToDecrypt.encryptedAlamat),
            decryptAES(key, dataToDecrypt.ivTanggalLahir, dataToDecrypt.encryptedTanggalLahir)
        ]);

        return {
            fullName: dataToDecrypt.fullName,
            nik: decryptedNik,
            alamat: decryptedAlamat,
            tanggalLahir: decryptedTanggalLahir
        };

    } catch (error) {
        console.error('Gagal mengambil atau mendekripsi data dari IndexedDB:', error);
        throw error;
    }
}
