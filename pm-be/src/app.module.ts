import { AppConfigModule } from '@core/modules/app-config.module';
import { DbConfigModule } from '@core/modules/db-config.module';
import { ApiModule } from '@modules/api.module';
import { JwtAuthGuard } from '@core/strategy/jwt-auth.guard';
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerIntercepter } from '@core/interceptors/logger.intercepter';
import { ResponseInterceptor } from '@core/interceptors/response.interceptor';
import { JwtStrategy } from '@core/strategy/jwt.strategy';
import { getJwtSecretKey } from '@core/services/common.service';

@Module({
  imports: [AppConfigModule, DbConfigModule, ApiModule],
  providers: [
    {
      provide: 'JWT_SECRET',
      useFactory: async () => getJwtSecretKey(),
    },
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerIntercepter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
