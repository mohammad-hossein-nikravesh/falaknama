import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FaqEntity, FaqEntitySchema } from './faq.model';
import { FaqsController, SiteFaqsController } from './faqs.controller';
import { FaqsRepository } from './faqs.repository';
import { FaqsService } from './faqs.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FaqEntity.name, schema: FaqEntitySchema },
    ]),
  ],
  controllers: [FaqsController, SiteFaqsController],
  providers: [FaqsService, FaqsRepository],
})
export class FaqsModule {}
