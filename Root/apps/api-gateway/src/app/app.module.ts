import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HolderModule } from '../holder/holder.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27019'), 
    HolderModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }