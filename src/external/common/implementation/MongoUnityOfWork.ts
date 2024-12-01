import { UnityOfWork } from '../base/UnityOfWork';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class MongoUnityOfWork extends UnityOfWork {
  session: mongoose.ClientSession;

  constructor(
    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {
    super();
  }

  async begin(): Promise<void> {
    this.session = await this.connection.startSession();
    this.session.startTransaction();
  }
  async commit(): Promise<void> {
    await this.session.commitTransaction();
    await this.session.endSession();
  }
  async rollback(): Promise<void> {
    await this.session.abortTransaction();
    await this.session.endSession();
  }
}
