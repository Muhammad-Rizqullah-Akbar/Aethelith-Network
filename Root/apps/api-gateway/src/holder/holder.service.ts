// apps/api-gateway/src/holder/holder.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import * as crypto from 'crypto'; // Tidak diperlukan untuk enkripsi data inti pengguna

import { CreateHolderDto } from './dto/create-holder.dto';
import { Holder, HolderDocument } from './schemas/holder.schema'; // Import skema yang benar

// ENCRYPTION_KEY dan IV_LENGTH tidak diperlukan di sini jika tidak mengenkripsi data inti.
// Jika Anda punya data lain yang perlu dienkripsi di backend, baru gunakan fungsi ini.
/*
const ENCRYPTION_KEY = crypto
    .createHash('sha256')
    .update(String(process.env.ENCRYPT_KEY)) // Pastikan ENCRYPT_KEY selalu di-set di environment
    .digest();

const IV_LENGTH = 16;
*/

@Injectable()
export class HolderService {
    constructor(
        @InjectModel(Holder.name) private holderModel: Model<HolderDocument>, // Gunakan Holder.name
    ) { }

    // Fungsi enkripsi ini bisa dihapus atau dipindahkan ke utilitas terpisah
    // jika hanya digunakan untuk data non-inti yang sangat spesifik.
    /*
    encryptData(data: any): string {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    }
    */

    async create(dto: CreateHolderDto): Promise<HolderDocument> {
        // Cek apakah UID sudah ada untuk menghindari duplikasi
        const existingHolder = await this.holderModel.findOne({ firebaseUid: dto.uid }).exec();
        if (existingHolder) {
            // Jika sudah ada, bisa update atau throw error
            // Untuk pendaftaran, kita anggap ini error karena user sudah terdaftar
            throw new ConflictException('User with this Firebase UID already exists.');
        }

        // Data langsung disimpan tanpa enkripsi di sini, sesuai desain privasi.
        // Data sensitif (NIK, Alamat, Tgl Lahir) tidak pernah sampai ke sini.
        const createdHolder = new this.holderModel({
            firebaseUid: dto.uid,
            email: dto.email,
            fullName: dto.fullName,
            // walletAddress dan zkProof akan ditambahkan di endpoint lain (complete-profile)
        });
        return createdHolder.save();
    }

    async findByFirebaseUid(uid: string): Promise<HolderDocument | null> {
        return this.holderModel.findOne({ firebaseUid: uid }).exec();
    }

    // Fungsi untuk mengupdate holder setelah complete-profile (misalnya menambahkan walletAddress)
    async updateWalletAddress(uid: string, walletAddress: string): Promise<HolderDocument | null> {
        return this.holderModel.findOneAndUpdate(
            { firebaseUid: uid },
            { walletAddress },
            { new: true } // Mengembalikan dokumen yang sudah diupdate
        ).exec();
    }

    async findAll(): Promise<HolderDocument[]> {
        return this.holderModel.find().exec();
    }
}