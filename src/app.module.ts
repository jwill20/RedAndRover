import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RoverModule } from './rover/rover.module';

@Module({
  imports: [RoverModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['env/.env'],
    }),
  ],
})
export class AppModule {}
