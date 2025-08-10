// apps/web/src/app/api/user/get-did/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');

  if (!uid) {
    return NextResponse.json({ error: 'UID is required' }, { status: 400 });
  }

  // Logika di sini untuk mengambil DID dari database
  // atau membuat DID baru berdasarkan UID.
  // Untuk sementara, kita bisa menggunakan DID dummy.
  const dummyDid = `did:aethelith:${uid}`;

  return NextResponse.json({ did: dummyDid });
}