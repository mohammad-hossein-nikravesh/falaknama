import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleEntity, ArticleEntitySchema } from './article.model';
import { ArticlesController } from './articles.controller';
import { ArticlesRepository } from './articles.repository';
import { ArticlesService } from './articles.service';
import { SiteArticlesController } from './site-articles.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ArticleEntity.name, schema: ArticleEntitySchema },
    ]),
  ],
  controllers: [ArticlesController, SiteArticlesController],
  providers: [ArticlesService, ArticlesRepository],
  exports: [ArticlesService],
})
export class ArticlesModule {}
