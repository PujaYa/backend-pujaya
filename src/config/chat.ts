import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class chatGatewayConfig extends IoAdapter {
    createIOServer(port: number, options?: ServerOptions) {
        const server = super.createIOServer(port, options);
        server.path(process.env.WEBSOCKET_PATH || '/chat');
        server.cors({
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true,
        });
        return server;
    }
}