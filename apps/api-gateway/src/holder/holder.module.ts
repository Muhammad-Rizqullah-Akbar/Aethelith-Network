import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HolderController } from './holder.controller';
import { HolderService } from './holder.service';
import { HolderSchema } from './schemas/holder.schema'; // <-- PASTIKAN path ini benar

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Holder', schema: HolderSchema }]) // ⬅️ PENTING!
    ],
    controllers: [HolderController],
    providers: [HolderService],
})
export class HolderModule { }
