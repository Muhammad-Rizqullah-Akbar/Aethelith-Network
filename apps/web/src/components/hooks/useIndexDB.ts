// apps/web/src/lib/indexedDB.ts

// Kode ini mengasumsikan Anda memiliki IndexedDB yang sudah dikonfigurasi
// dengan object store bernama 'userData'.

export async function encryptAndStoreData(uid: string, fullName: string, nik: string, alamat: string, tanggalLahir: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("AethelithDB", 1);

        request.onerror = (event) => {
            reject("IndexedDB error: " + (event.target as IDBOpenDBRequest).error);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            db.createObjectStore("userData", { keyPath: "uid" });
        };

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction(["userData"], "readwrite");
            const store = transaction.objectStore("userData");

            // Data yang akan disimpan. Asumsi enkripsi sudah dilakukan di sini.
            const encryptedData = {
                uid: uid,
                fullName: fullName,
                nik: nik,
                alamat: alamat,
                tanggalLahir: tanggalLahir
            };
            
            store.put(encryptedData);
            
            transaction.oncomplete = () => {
                resolve();
            };

            transaction.onerror = (event) => {
                reject("Transaction error: " + (event.target as IDBTransaction).error);
            };
        };
    });
}

export async function getEncryptedDataByUID(uid: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("AethelithDB", 1);

        request.onerror = (event) => {
            reject("IndexedDB error: " + (event.target as IDBOpenDBRequest).error);
        };

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction(["userData"]);
            const store = transaction.objectStore("userData");
            
            const getRequest = store.get(uid);

            getRequest.onsuccess = () => {
                resolve(getRequest.result);
            };

            getRequest.onerror = (event) => {
                reject("Get request error: " + (event.target as IDBRequest).error);
            };
        };
    });
}

