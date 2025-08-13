// apps/web/src/app/api/register/route.ts
import { NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import bcrypt from 'bcryptjs';
import { db } from "../../../lib/firebase";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Pastikan semua data yang diperlukan ada
        const {
            instanceName, npwp, address, website, sector,
            contactName, position, email, phone,
            usagePurpose, expectedVolume, integrationMethod, instanceRole
        } = body;

        // Generate ID Instansi dan API Key di sisi server
        const newId = `inst-${Math.random().toString(36).substring(2, 11)}`;
        const newApiKey = `api-key-${Math.random().toString(36).substring(2, 14)}`;

        // Hash API Key secara aman menggunakan bcrypt
        const saltRounds = 10;
        const hashedApiKey = await bcrypt.hash(newApiKey, saltRounds);

        // Simpan data ke Firestore. Perhatikan, yang disimpan adalah hash, BUKAN API Key asli.
        await addDoc(collection(db, "developerRegistrations"), {
            instanceName, npwp, address, website, sector,
            contactName, position, email, phone,
            usagePurpose, expectedVolume, integrationMethod, instanceRole,
            instanceId: newId,
            apiKey: hashedApiKey, // Menyimpan hash dari API Key
            createdAt: serverTimestamp(),
        });

        // Kirim respons sukses kembali ke klien.
        // Kirim API Key ASLI-nya, karena ini satu-satunya kesempatan pengguna untuk melihatnya.
        return NextResponse.json({
            success: true,
            instanceId: newId,
            apiKey: newApiKey,
        }, { status: 200 });

    } catch (error) {
        console.error("Error in API route /api/register:", error);
        // Kirim respons error ke klien
        return NextResponse.json({
            success: false,
            error: 'Terjadi kesalahan server saat mendaftar.',
        }, { status: 500 });
    }
}