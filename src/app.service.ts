import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string; data: string } {
    return {
      message: 'Hello World!',
      data: 'This is a sample NestJS application using TypeScript 6.0.3 with NodeNext module system and ES2023 target.',
    };
  }
}
