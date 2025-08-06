import type { NextApiRequest, NextApiResponse } from 'next';

// API handler untuk integrasi dengan Hyperledger Fabric
// Contoh endpoint: POST /api/register-identity
// Akan diisi logika pemanggilan chaincode sesuai kebutuhan

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(501).json({ message: 'Not implemented yet' });
}
