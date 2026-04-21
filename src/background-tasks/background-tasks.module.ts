import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { BackgroundTasksProcessor } from './background-tasks.processor';
import { BackgroundTasksService } from './background-tasks.service';
import { BackgroundTasksController } from './background-tasks.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'background-tasks',
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'user@example.com',
          pass: 'password',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    }),
  ],
  controllers: [BackgroundTasksController],
  providers: [BackgroundTasksService, BackgroundTasksProcessor],
  exports: [BackgroundTasksService],
})
export class BackgroundTasksModule {}
