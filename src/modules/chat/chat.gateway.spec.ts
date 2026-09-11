jest.mock('@nestjs/jwt', () => ({ JwtService: class JwtService {} }));

import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../redis/redis.service';
import { Namespace, Socket } from 'socket.io';

describe('ChatGateway access control', () => {
  const userId = 'user-1';
  const conversationId = 'conversation-1';
  let gateway: ChatGateway;
  let client: Socket;
  const socketActions = { join: jest.fn(), leave: jest.fn(), emit: jest.fn() };
  const chat = { saveMessage: jest.fn(), getMessages: jest.fn() };
  const prisma = {
    user: { findUnique: jest.fn() },
    conversation: { findFirst: jest.fn() },
  };
  const jwt = { verifyAsync: jest.fn() };
  const redis = { exists: jest.fn() };

  beforeEach(() => {
    jest.resetAllMocks();
    jwt.verifyAsync.mockResolvedValue({ sub: userId, exp: 9999999999 });
    redis.exists.mockResolvedValue(0);
    prisma.user.findUnique.mockResolvedValue({ id: userId, status: 'ACTIVE' });
    prisma.conversation.findFirst.mockResolvedValue({ id: conversationId });
    client = {
      handshake: { auth: { token: 'access-token' }, headers: {} },
      ...socketActions,
      rooms: new Set([`conversation:${conversationId}`]),
    } as unknown as Socket;
    gateway = new ChatGateway(
      chat as unknown as ChatService,
      prisma as unknown as PrismaService,
      jwt as unknown as JwtService,
      { get: () => 'test-secret' } as unknown as ConfigService,
      redis as unknown as RedisService,
    );
    gateway.server = {
      to: jest.fn().mockReturnValue({
        emit: socketActions.emit,
      }),
      // sockets: new Map([['client', client]]),
    } as unknown as Namespace;
  });

  it('rejects revoked tokens before joining a room', async () => {
    redis.exists.mockResolvedValue(1);
    await expect(
      gateway.joinConversation(client, { conversationId }),
    ).rejects.toThrow('Unauthorized');
    expect(socketActions.join).not.toHaveBeenCalled();
  });

  it('rejects expired tokens', async () => {
    jwt.verifyAsync.mockRejectedValue(new Error('jwt expired'));
    await expect(
      gateway.joinConversation(client, { conversationId }),
    ).rejects.toThrow('Unauthorized');
  });

  it('denies outsiders access to message history', async () => {
    prisma.conversation.findFirst.mockResolvedValue(null);
    await expect(
      gateway.getMessages(client, { conversationId, limit: 50, offset: 0 }),
    ).rejects.toThrow('Conversation access denied');
    expect(chat.getMessages).not.toHaveBeenCalled();
  });

  it('rejects an empty message without writing to the database', async () => {
    await expect(
      gateway.sendMessage(client, { conversationId, text: '  ' }),
    ).rejects.toThrow('Message text or file URL is required');
    expect(chat.saveMessage).not.toHaveBeenCalled();
  });

  it('uses the verified sender and delivers saved messages to authorized listeners', async () => {
    const dto = {
      conversationId,
      text: 'Hello',
    };
    const message = {
      id: 'message-1',
      ...dto,
      senderId: userId,
    };
    chat.saveMessage.mockResolvedValue(message);
    await gateway.sendMessage(client, dto);
    await expect(gateway.sendMessage(client, dto)).resolves.toEqual(message);
    expect(gateway.server.to).toHaveBeenCalledWith(
    `conversation:${conversationId}`,
  );
    expect(chat.saveMessage).toHaveBeenCalledWith(userId, dto);
    expect(socketActions.emit).toHaveBeenCalledWith('newMessage', message);
  });

  it('broadcasts the message to the correct conversation room', async () => {
    prisma.conversation.findFirst
      .mockResolvedValueOnce({ id: conversationId })
      .mockResolvedValue(null);
    chat.saveMessage.mockResolvedValue({ id: 'message-1', conversationId });
    await gateway.sendMessage(client, { conversationId, text: 'Hello' });
    expect(socketActions.emit).not.toHaveBeenCalled();
    expect(socketActions.leave).toHaveBeenCalledWith(
      `conversation:${conversationId}`,
    );
  });
});
