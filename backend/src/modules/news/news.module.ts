import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsController } from './news.controller';
import { NewsEntity, NewsEntitySchema } from './news.model';
import { NewsRepository } from './news.repository';
import { NewsService } from './news.service';
import { SiteNewsController } from './site-news.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NewsEntity.name, schema: NewsEntitySchema },
    ]),
  ],
  controllers: [NewsController, SiteNewsController],
  providers: [NewsService, NewsRepository],
})
export class NewsModule {}
