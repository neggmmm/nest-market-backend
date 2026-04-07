export class RefreshToken{
    constructor(
        public readonly id:number,
        public readonly token: string,
        public readonly expiresAt: Date,
        public readonly userId: number,
    ){}
}