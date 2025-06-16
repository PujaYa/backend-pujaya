import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { chatGatewayConfig } from '../config/chat';

@WebSocketGateway(chatGatewayConfig)
export class ChatGateway {
@SubscribeMessage('joinRoom')
handleJoinRoom(@MessageBody() data: { room: string }, @ConnectedSocket() client: Socket) {
    client.join(data.room);
    client.to(data.room).emit('message', {
    sender: 'system',
    text: 'Un nuevo usuario se ha unido al chat',
    });
}

@SubscribeMessage('message')
handleMessage(
    @MessageBody() data: { room: string, sender: string, text: string },
    @ConnectedSocket() client: Socket,
) {
    client.to(data.room).emit('message', data);
}
}