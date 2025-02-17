import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@QueueEventsListener('time-book-queue')
export class AppListener extends QueueEventsHost {
  private logger = new Logger(AppListener.name);
  @OnQueueEvent('active')
  onQueueEventActive(job: any) {
    this.logger.log(`Job has been started!`);
    this.logger.log(job);
  }

  @OnQueueEvent('completed')
  onQueueEventCompleted(job: Job, result: any) {
    this.logger.log(`Job has been completed!!`);
  }
  @OnQueueEvent('failed')
	onQueueFailed(job: Job, err: any) {
		this.logger.log(`Job has been failed: ${job.id}`);
		this.logger.log({ err });
	}

	@OnQueueEvent('error')
	onQueueError(err: any) {
		this.logger.log(`Job has got error: `);
		this.logger.log({ err });
  }
  
}
