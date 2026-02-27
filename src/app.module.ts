import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ProductsModule } from './modules/products/products.module'
import { MessageModule } from './base/config/message/message.module'
import { EnvConfigModule } from './base/config/env/env-config.module'
import { LoggerModule } from './base/config/logger/logger.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [MessageModule, EnvConfigModule, LoggerModule, ProductsModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
