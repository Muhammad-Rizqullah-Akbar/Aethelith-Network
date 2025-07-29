import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // <-- PASTIKAN INI JUGA DIIMPOR!
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HolderModule } from '../holder/holder.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017'), 
    HolderModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }