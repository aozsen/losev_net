import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ActivitiesModule } from './activities/activities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      // Using absolute path from current working directory (app root in Docker)
      database: join(process.cwd(), 'data', 'database.sqlite'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      // In Docker, cwd is /app and frontend is at /app/frontend/dist
      // In local dev, if started from backend/, we need to go up one level
      rootPath: require('fs').existsSync(join(process.cwd(), 'frontend', 'dist'))
        ? join(process.cwd(), 'frontend', 'dist')
        : join(process.cwd(), '..', 'frontend', 'dist'),
      exclude: ['/api/(.*)'],
    }),
    UsersModule,
    AuthModule,
    ActivitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
