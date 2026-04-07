import { RefreshToken } from "../entities/refreshToken";

export interface RefreshTokenRepository{
    findByToken(token:string): Promise<RefreshToken| null>;
    save(data:SaveRefreshTokenData): Promise<RefreshToken>
    deleteById(id:number):Promise<void>
    deleteByToken(token:string): Promise<void>
}

export interface SaveRefreshTokenData {
    token: string;
    expiresAt: Date;
    userId: number;
}
