import { Inject, Injectable } from '@nestjs/common';
import { DevConfigService } from './common/providers/DevConfigService';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getHello(): string {
    return 'Hello I am learning Nest.js Fundamentals';
  }
  getENV(): any {
    console.log(this.configService);
    return this.configService.get<string>('database.name').toString();
  }
}
