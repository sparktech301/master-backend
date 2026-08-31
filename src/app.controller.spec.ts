import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return hello response', () => {
      expect(appController.getHello()).toEqual({
        message: 'Hello World!',
        data: 'This is a sample NestJS application using TypeScript 6.0.3 with NodeNext module system and ES2023 target.',
      });
    });
  });
});
