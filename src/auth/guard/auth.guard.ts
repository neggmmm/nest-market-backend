import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        const token = request.cookies?.access_token ||  (authHeader && authHeader.startsWith('Bearer ')? authHeader.split(' ')[1] : null);
        if(!token){
            throw new UnauthorizedException("No Token Provided");
        }
        try{
            const payload = this.jwtService.verify(token);
            request.user = payload;
            return true;
        }catch(err){
            throw new UnauthorizedException('Invalid Token')
        }
    }
}