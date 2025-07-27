import { http, createConfig } from 'wagmi';
import { hardhat } from 'wagmi/chains';

export const config = createConfig({
  chains: [hardhat],
  transports: {
    [hardhat.id]: http('http://192.168.1.5:7545'), // <-- GANTI DENGAN IP GANACHE ANDA
  },
});