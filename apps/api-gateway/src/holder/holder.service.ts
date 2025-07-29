import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { CreateHolderDto } from './dto/create-holder.dto';

const ENCRYPTION_KEY = crypto
    .createHash('sha256')
    .update(String(process.env.ENCRYPT_KEY || 'secret'))
    .digest();

const IV_LENGTH = 16;

@Injectable()
export class HolderService {
    constructor(
        @InjectModel('Holder') private holderModel: Model<any>,
    ) { }

    encryptData(data: any): string {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    }

    async create(dto: CreateHolderDto): Promise<any> {
        const encrypted = this.encryptData(dto);
        const created = new this.holderModel({ encryptedData: encrypted });
        return created.save();
    }

    async findAll(): Promise<any[]> {
        return this.holderModel.find();
    }
}
