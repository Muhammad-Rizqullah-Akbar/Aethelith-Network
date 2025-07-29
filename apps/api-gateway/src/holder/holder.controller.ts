import { Controller, Post, Body, Get } from '@nestjs/common';
import { HolderService } from './holder.service';
import { CreateHolderDto } from './dto/create-holder.dto';

@Controller('holder')
export class HolderController {
  constructor(private readonly holderService: HolderService) {}

  @Post('submit-kyc')
  async submitKyc(@Body() dto: CreateHolderDto) {
    return this.holderService.create(dto);
  }

  @Get('list')
  async getAll() {
    return this.holderService.findAll();
  }
}
