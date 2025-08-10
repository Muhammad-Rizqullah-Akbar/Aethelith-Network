import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HolderModule } from '../holder/holder.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost:27017'), 
        HolderModule,
    ],
})
export class AppModule { }
