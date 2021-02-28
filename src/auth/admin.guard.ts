import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = context.switchToHttp().getRequest().headers.authorization;

    if (token === 'Bearer 12345') {
      context.switchToHttp().getRequest().user = {
        uuid: '0000-1111-2222-3333-4444',
        role: 'admin',
      };
      return true;
    }
    return false;
  }
}
