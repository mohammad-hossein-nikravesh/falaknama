import { Module } from '@nestjs/common';
import { ArticlesModule } from '../articles/articles.module';
import { SeoController } from './seo.controller';
import { SeoService } from './seo.service';

@Module({
  imports: [ArticlesModule],
  controllers: [SeoController],
  providers: [SeoService],
})
export class SeoModule {}
