import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class BackgroundTasksService {
  constructor(@InjectQueue('background-tasks') private backgroundQueue: Queue) {}

  async addHeavyTask(data: any) {
    await this.backgroundQueue.add('heavy-task', data);
    return { message: 'Heavy task added to queue' };
  }

  async sendWelcomeEmail(email: string, name: string) {
    await this.backgroundQueue.add('send-email', { email, name });
    return { message: 'Email task added to queue' };
  }
}
