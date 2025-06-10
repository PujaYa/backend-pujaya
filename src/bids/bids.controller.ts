import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { FirebaseAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/types/roles';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(UserRole.PREMIUM)
  async createBid(@Body() createBidDto: CreateBidDto, @Req() req) {
    return this.bidsService.createBid(createBidDto, req.user);
  }

  @Get()
  async getBidsByAuction(@Query('auctionId') auctionId: string) {
    // Devuelve las pujas de la subasta, ordenadas de mayor a menor (más reciente primero)
    return this.bidsService.getBidsByAuction(auctionId);
  }
}
