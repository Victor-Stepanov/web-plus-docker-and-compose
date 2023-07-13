import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../users/entities/user.entity';

export const AuthUser = createParamDecorator(
  (data: never, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
