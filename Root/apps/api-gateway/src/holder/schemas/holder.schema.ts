// apps/api-gateway/src/holder/schemas/holder.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HolderDocument = Holder & Document;

@Schema({ timestamps: true }) // Penting untuk createdAt dan updatedAt
export class Holder {
  @Prop({ required: true, unique: true, index: true })
  firebaseUid: string; // UID dari Firebase Auth

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ unique: true, sparse: true }) // sparse: true agar bisa null tapi unik jika ada
  walletAddress?: string; // Akan ditambahkan nanti setelah complete-profile

  // ZKP Proof tidak perlu disimpan di sini, hanya diverifikasi.
  // Jika Anda perlu menyimpan referensi ke bukti, itu bisa jadi hash atau ID bukti.
  // @Prop()
  // zkProofHash?: string;
}

export const HolderSchema = SchemaFactory.createForClass(Holder);