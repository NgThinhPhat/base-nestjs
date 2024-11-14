import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { RolesModule } from './roles/roles.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { CatchEverythingFilter } from './catch-everyting.filter';
import { LanguageMiddleware } from './language.middleware';
import { MailModule } from './mail/mail.module';
import { PermissionsModule } from './permissions/permissions.module';
import { SeedsModule } from './seeds/seeds.module';
import * as cookieParser from 'cookie-parser';
import { RolesPermissionsGuard } from './auth/guards/roles-permissions.guard';
import { SeedService } from './seeds/seeds.service';
import { PostModule } from './post/post.module';
import { TagModule } from './tag/tag.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true, // Ensures the config is available globally
    }),
    AuthModule,
    UsersModule,
    MailModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'base-nestjs',
      entities: ['dist/**/entities/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    RolesModule,
    PermissionsModule,
    SeedsModule,
    PostModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesPermissionsGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
  ],
  exports: [TypeOrmModule],
})
export class AppModule {
  constructor(
    private dataSource: DataSource,
    private readonly seedService: SeedService,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LanguageMiddleware).forRoutes('*');
    consumer.apply(cookieParser()).forRoutes('*');
  }
  async onModuleInit() {
    await this.seedService.seed();
    console.log('Seeding completed!');
  }
}
