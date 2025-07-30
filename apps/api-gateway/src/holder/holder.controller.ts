// apps/api-gateway/src/holder/holder.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { HolderService } from './holder.service';
import { CreateHolderDto } from './dto/create-holder.dto';

@Controller('holders') // Endpoint utama akan menjadi /holders
export class HolderController {
  constructor(private readonly holderService: HolderService) { }

  @Post('register-profile') // Endpoint untuk pendaftaran profil awal
  async registerProfile(@Body() createHolderDto: CreateHolderDto) {
    return this.holderService.create(createHolderDto);
  }

  // Endpoint untuk update walletAddress setelah complete-profile
  @Post('update-wallet/:uid')
  async updateWallet(@Param('uid') uid: string, @Body('walletAddress') walletAddress: string) {
    // Di sini Anda akan memverifikasi ZKP yang dikirim dari frontend
    // const zkProof = body.zkProof; // Anda akan menerima ini juga
    // const isZkpValid = await this.zkpService.verify(zkProof); // Contoh verifikasi ZKP

    // if (!isZkpValid) {
    //   throw new BadRequestException('Invalid ZKP proof.');
    // }

    return this.holderService.updateWalletAddress(uid, walletAddress);
  }

  @Get()
  async findAll() {
    return this.holderService.findAll();
  }

  @Get(':uid')
  async findOne(@Param('uid') uid: string) {
    return this.holderService.findByFirebaseUid(uid);
  }
}