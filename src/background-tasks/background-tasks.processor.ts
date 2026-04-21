import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('background-tasks')
export class BackgroundTasksProcessor {
  constructor(private readonly mailerService: MailerService) {}

  @Process('heavy-task')
  async handleHeavyTask(job: Job) {
    console.log(`Processing heavy task ${job.id}...`);
    // Simulate heavy work
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(`Heavy task ${job.id} completed! Data:`, job.data);
  }

  @Process('send-email')
  async handleSendEmail(job: Job) {
    console.log(`Sending email to ${job.data.email}...`);
    try {
      // In a real app, this would send an actual email
      // await this.mailerService.sendMail({
      //   to: job.data.email,
      //   subject: 'Welcome!',
      //   template: 'welcome',
      //   context: { name: job.data.name },
      // });
      console.log(`Email sent to ${job.data.email} successfully!`);
    } catch (error) {
      console.error(`Failed to send email to ${job.data.email}`, error);
    }
  }
}
