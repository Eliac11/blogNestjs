import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from './jwtconst';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      console.log("not in token")
      throw new UnauthorizedException();
    }
    try {
      console.log(jwtSecret, token == "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInVzZXJuYW1lIjoiMSIsImlhdCI6MTcxNDU3Njg1MiwiZXhwIjoxNzE0NTc2OTEyfQ.l7m0VvdGOaxA00h9DjAIX7_vYui2IElhaglqV4tj31o")
      const payload = this.jwtService.verify(
        token,
        {
          secret: jwtSecret
        }
      );

      request['user'] = payload;
    } catch {
      console.log("token is not valid")
      throw new UnauthorizedException();
      
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
