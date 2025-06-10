import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async sendContact(
    @Body() body: { name: string; email: string; message: string },
  ) {
    await this.contactService.sendMail(body);
    return { message: 'Message sent successfully' };
  }
}
