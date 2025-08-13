// app/api/dev-login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase"; // Using client-side Firebase for simplicity here,
// but ideally use Admin SDK for server-side
import * as bcrypt from 'bcryptjs'; // You'll need to install bcrypt if you haven't already

export async function POST(req: NextRequest) {
    const { instanceId, apiKey, activeTab } = await req.json();

    if (!instanceId || !apiKey || !activeTab) {
        return NextResponse.json({ message: 'Instance ID, API Key, and Role are required.' }, { status: 400 });
    }

    try {
        const q = query(
            collection(db, "developerRegistrations"),
            where("instanceId", "==", instanceId),
            where("instanceRole", "==", activeTab)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return NextResponse.json({ message: 'Kredensial tidak valid atau peran salah. Silakan periksa kembali.' }, { status: 401 });
        }

        const doc = querySnapshot.docs[0];
        const storedHashedApiKey = doc.data().apiKey;

        // Compare the provided API key with the stored hash
        const isMatch = await bcrypt.compare(apiKey, storedHashedApiKey);

        if (isMatch) {
            // You might want to set a session cookie here or return a token
            return NextResponse.json({ success: true, message: `Login berhasil sebagai ${activeTab} dengan ID: ${instanceId}` });
        } else {
            return NextResponse.json({ message: 'Kredensial tidak valid atau peran salah. Silakan periksa kembali.' }, { status: 401 });
        }

    } catch (error) {
        console.error("Error during API Key verification:", error);
        return NextResponse.json({ message: 'Terjadi kesalahan server.' }, { status: 500 });
    }
}