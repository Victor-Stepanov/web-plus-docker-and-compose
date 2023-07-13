import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: this.config.get<string>('POSTGRES_HOST'),
      port: this.config.get<number>('POSTGRES_PORT'),
      schema: this.config.get<string>('POSTGRES_DB'),
      username: this.config.get<string>('POSTGRES_USERNAME'),
      password: this.config.get<string>('POSTGRES_PASSWORD'),
      database: this.config.get<string>('POSTGRES_DB'),
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: JSON.parse(this.config.get<string>('POSTGRES_SYNCHRONIZE')),
    };
  }
}
