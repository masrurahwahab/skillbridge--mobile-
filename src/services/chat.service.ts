import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';

import { API_BASE_URL } from '@/constants/config';
import { tokenStorage } from './api';
import type { MessageDto } from '@/types/api';

let connection: HubConnection | null = null;

function buildConnection(): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/hubs/chat`, {
      accessTokenFactory: async () => (await tokenStorage.get()) ?? '',
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Warning)
    .build();
}

export const chatService = {
  async connect(): Promise<HubConnection> {
    if (!connection) {
      connection = buildConnection();
    }
    if (connection.state === HubConnectionState.Disconnected) {
      await connection.start();
    }
    return connection;
  },

  async joinSwap(swapId: string): Promise<void> {
    const hub = await this.connect();
    await hub.invoke('JoinSwap', swapId);
  },

  async leaveSwap(swapId: string): Promise<void> {
    if (connection?.state === HubConnectionState.Connected) {
      await connection.invoke('LeaveSwap', swapId);
    }
  },

  async sendMessage(swapId: string, text: string): Promise<void> {
    const hub = await this.connect();
    await hub.invoke('SendMessage', swapId, text);
  },

  async sendTyping(swapId: string): Promise<void> {
    const hub = await this.connect();
    await hub.invoke('Typing', swapId);
  },

  onMessage(handler: (message: MessageDto) => void): () => void {
    if (!connection) return () => {};
    connection.on('ReceiveMessage', handler);
    return () => connection?.off('ReceiveMessage', handler);
  },

  onTyping(handler: (swapId: string, userId: string) => void): () => void {
    if (!connection) return () => {};
    connection.on('UserTyping', handler);
    return () => connection?.off('UserTyping', handler);
  },

  async disconnect(): Promise<void> {
    if (connection) {
      await connection.stop();
      connection = null;
    }
  },
};
