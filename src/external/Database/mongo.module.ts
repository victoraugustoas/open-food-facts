import { Module } from '@nestjs/common';
import * as process from 'node:process';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_URL),
  ],
})
export class MongoModule {}
