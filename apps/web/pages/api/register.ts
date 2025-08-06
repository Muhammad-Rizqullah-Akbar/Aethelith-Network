import type { NextApiRequest, NextApiResponse } from 'next';
import { Wallets, Gateway } from 'fabric-network';
import FabricCAServices from 'fabric-ca-client';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Konfigurasi jaringan Fabric (update sesuai environment Anda)
const ccpPath = process.env.FABRIC_CONNECTION_PROFILE || '/workspaces/Aethelith-Network/packages/fabric-network/fabric-samples/test-network/connection-org1.json';
const walletPath = process.env.FABRIC_WALLET_PATH || '/workspaces/Aethelith-Network/packages/fabric-network/wallet';
const channelName = 'mychannel';
const chaincodeName = 'identity-verification-chaincode';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password, fullName, email, nik, birthPlace, birthDate, address } = req.body;
  if (!username || !password || !fullName || !email || !nik || !birthPlace || !birthDate || !address) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Parse connection profile JSON
    const ccpJSON = fs.readFileSync(path.resolve(ccpPath), 'utf8');
    const ccp = JSON.parse(ccpJSON);

    // 1. Setup CA client
    const caInfo = ccp.certificateAuthorities[Object.keys(ccp.certificateAuthorities)[0]];
    const caTLSCACerts = caInfo.tlsCACerts.path;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

    // 2. Setup wallet
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // 3. Enroll admin jika belum ada
    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
      const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
      await wallet.put('admin', {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
      } as any);
    }

    // 4. Register dan enroll user
    const userExists = await wallet.get(username);
    if (!userExists) {
      const provider = wallet.getProviderRegistry().getProvider(adminIdentity!.type);
      const adminUser = await provider.getUserContext(adminIdentity!, 'admin');
      const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username, role: 'client' }, adminUser);
      const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret });
      await wallet.put(username, {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
      } as any);
    }

    // 5. Connect ke gateway dan kirim transaksi ke chaincode
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: username,
      discovery: { enabled: true, asLocalhost: true },
    });
    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);

    await contract.submitTransaction(
      'RegisterIdentity',
      username,
      fullName,
      email,
      nik,
      birthPlace,
      birthDate,
      address
    );

    await gateway.disconnect();

    res.status(200).json({
      message: 'Identity registered',
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
