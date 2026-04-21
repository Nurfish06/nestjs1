import { Controller, Post, Body } from '@nestjs/common';
import { BackgroundTasksService } from './background-tasks.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('background-tasks')
@Controller('background-tasks')
export class BackgroundTasksController {
  constructor(private readonly tasksService: BackgroundTasksService) {}

  @Post('heavy')
  @ApiOperation({ summary: 'Queue a heavy task' })
  async queueHeavyTask(@Body() data: any) {
    return this.tasksService.addHeavyTask(data);
  }

  @Post('email')
  @ApiOperation({ summary: 'Queue a welcome email' })
  async queueEmail(@Body() body: { email: string; name: string }) {
    return this.tasksService.sendWelcomeEmail(body.email, body.name);
  }
}
