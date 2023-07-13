import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtSecret = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => {
  return {
    secret: configService.get('jwt_secret'),
  };
};
