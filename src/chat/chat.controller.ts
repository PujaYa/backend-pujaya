import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request } from 'express';
import { FirebaseAuthGuard } from '../auth/guards/auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Endpoint para obtener las conversaciones del owner autenticado
  @UseGuards(FirebaseAuthGuard)
  @Get('owner/conversations')
  async getOwnerConversations(@Req() req: Request) {
    const ownerId = (req as any).user?.id;
    if (!ownerId) throw new Error('No owner id found in request');
    const rawConvs = await this.chatService.getOwnerConversations(ownerId);
    console.log('Owner conversations:', rawConvs, 'OwnerId:', ownerId);
    // Map to frontend-friendly keys
    return rawConvs.map((conv: any) => ({
      auctionId: conv.auction_id,
      auctionTitle: conv.auction_name,
      bidderId: conv.bidder_id,
      bidderName: conv.bidder_name,
      room: conv.room,
      lastmessagetext: conv.lastMessageText,
      lastmessageat: conv.lastMessageAt,
    }));
  }

  // Endpoint para obtener las conversaciones del usuario autenticado (como owner o bidder)
  @UseGuards(FirebaseAuthGuard)
  @Get('user/conversations')
  async getUserConversations(@Req() req: Request) {
    const userId = (req as any).user?.id;
    if (!userId) throw new Error('No user id found in request');
    const rawConvs = await this.chatService.getUserConversations(userId);
    // Map to frontend-friendly keys
    return rawConvs.map((conv: any) => ({
      auctionId: conv.auction_id,
      auctionTitle: conv.auction_name,
      otherUserId: conv.other_user_id,
      otherUserName: conv.other_user_name,
      room: conv.room,
      lastmessagetext: conv.lastMessageText,
      lastmessageat: conv.lastMessageAt,
    }));
  }
}
