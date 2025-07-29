import { Schema } from 'mongoose';

export const HolderSchema = new Schema({
  encryptedData: String,
  createdAt: { type: Date, default: Date.now },
});
