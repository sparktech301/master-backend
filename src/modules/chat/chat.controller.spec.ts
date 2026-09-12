jest.mock('@nestjs/jwt', () => ({ JwtService: class JwtService {} }));
jest.mock('../auth/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: class JwtAuthGuard {},
}));

import { ChatController, ChatHistoryQueryDto } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from '../../prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('ChatController', () => {
  const req = { user: { id: 'customer-user' } } as Parameters<
    ChatController['sendMessage']
  >[0];
  const chat = {
    getOrCreateConversation: jest.fn(),
    addParticipant: jest.fn(),
    saveMessage: jest.fn(),
    getMessages: jest.fn(),
  };
  const prisma = {
    customerProfile: { findFirst: jest.fn() },
    service: { findFirst: jest.fn() },
    chatSession: { findFirst: jest.fn() },
    user: { findFirst: jest.fn() },
  };
  const gateway = { publishMessage: jest.fn() };
  let controller: ChatController;

  beforeEach(() => {
    jest.resetAllMocks();
    controller = new ChatController(
      chat as unknown as ChatService,
      prisma as unknown as PrismaService,
      gateway as unknown as ChatGateway,
    );
  });

  it('rejects creating a conversation for another customer profile', async () => {
    prisma.customerProfile.findFirst.mockResolvedValue(null);
    await expect(
      controller.getOrCreateConversation(req, {
        customerProfileId: 'other',
        serviceId: 'service',
      }),
    ).rejects.toThrow('Customer profile access denied');
    expect(chat.getOrCreateConversation).not.toHaveBeenCalled();
  });

  it('rejects inactive or deleted services', async () => {
    prisma.customerProfile.findFirst.mockResolvedValue({ id: 'profile' });
    prisma.service.findFirst.mockResolvedValue(null);
    await expect(
      controller.getOrCreateConversation(req, {
        customerProfileId: 'profile',
        serviceId: 'service',
      }),
    ).rejects.toThrow('Service is unavailable');
    expect(chat.getOrCreateConversation).not.toHaveBeenCalled();
  });

  it('prevents a non-owner from adding participants', async () => {
    prisma.chatSession.findFirst.mockResolvedValue(null);
    await expect(
      controller.addParticipant(req, 'conversation', { userId: 'provider' }),
    ).rejects.toThrow('Only the conversation owner');
    expect(chat.addParticipant).not.toHaveBeenCalled();
  });

  it('allows an owner to add an eligible participant', async () => {
    prisma.chatSession.findFirst.mockResolvedValue({ id: 'conversation' });
    prisma.user.findFirst.mockResolvedValue({ id: 'provider' });
    await controller.addParticipant(req, 'conversation', {
      userId: 'provider',
    });
    expect(chat.addParticipant).toHaveBeenCalledWith(
      'conversation',
      'provider',
    );
  });

  it('denies message history to outsiders', async () => {
    prisma.chatSession.findFirst.mockResolvedValue(null);
    await expect(
      controller.getMessages(req, 'conversation', { limit: 50, offset: 0 }),
    ).rejects.toThrow('Conversation access denied');
    expect(chat.getMessages).not.toHaveBeenCalled();
  });

  it('rejects blank messages', async () => {
    prisma.chatSession.findFirst.mockResolvedValue({ id: 'conversation' });
    await expect(
      controller.sendMessage(req, {
        conversationId: 'conversation',
        text: ' ',
      }),
    ).rejects.toThrow('Message text or file URL is required');
    expect(chat.saveMessage).not.toHaveBeenCalled();
  });

  it('uses the authenticated sender and publishes the saved message', async () => {
    prisma.chatSession.findFirst.mockResolvedValue({ id: 'conversation' });
    const dto = { conversationId: 'conversation', text: 'Hello' };
    const message = { id: 'message', ...dto };
    chat.saveMessage.mockResolvedValue(message);
    await expect(controller.sendMessage(req, dto)).resolves.toEqual(message);
    expect(chat.saveMessage).toHaveBeenCalledWith(req.user.id, dto);
    expect(gateway.publishMessage).toHaveBeenCalledWith(message);
  });

  it('converts valid query strings and rejects unsafe pagination', async () => {
    const valid = plainToInstance(ChatHistoryQueryDto, {
      limit: '25',
      offset: '0',
    });
    expect(await validate(valid)).toHaveLength(0);
    expect(valid.limit).toBe(25);
    for (const query of [
      { limit: '101' },
      { offset: '-1' },
      { limit: 'abc' },
    ]) {
      expect(
        (await validate(plainToInstance(ChatHistoryQueryDto, query))).length,
      ).toBeGreaterThan(0);
    }
  });
});
