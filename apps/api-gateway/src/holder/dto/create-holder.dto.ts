// apps/api-gateway/src/holder/dto/create-holder.dto.ts
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateHolderDto {
    @IsString()
    @IsNotEmpty()
    uid: string; // Firebase UID

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    // Anda akan menambahkan ini nanti:
    // @IsString()
    // @IsNotEmpty()
    // walletAddress?: string;

    // @IsString() // ZKP proof adalah string JSON atau sejenisnya
    // @IsNotEmpty()
    // zkProof?: string;
}