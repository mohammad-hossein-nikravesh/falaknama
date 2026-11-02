import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../common/generic/base.repository';
import { ArticleDocument, ArticleEntity, ArticleStatus } from './article.model';

const published = () => ({
  status: ArticleStatus.PUBLISHED,
  publishedAt: { $lte: new Date() },
});

@Injectable()
export class ArticlesRepository extends BaseRepository<ArticleDocument> {
  constructor(@InjectModel(ArticleEntity.name) model: Model<ArticleDocument>) {
    super(model);
  }

  /** Every Article, newest edit first, without bodies. */
  async adminPage(offset: number, limit: number) {
    const [items, total] = await Promise.all([
      this.entityModel
        .find()
        .select('-body')
        .sort({ updatedAt: -1 })
        .skip(offset)
        .limit(limit),
      this.entityModel.countDocuments(),
    ]);
    return { items, total };
  }

  async publishedPage(offset: number, limit: number) {
    const filter = published();
    const [items, total] = await Promise.all([
      this.entityModel
        .find(filter)
        .select('-body')
        .sort({ publishedAt: -1 })
        .skip(offset)
        .limit(limit),
      this.entityModel.countDocuments(filter),
    ]);
    return { items, total };
  }

  findPublishedBySlug(slug: string) {
    return this.entityModel.findOne({
      ...published(),
      slug: slug.toLowerCase(),
    });
  }

  /** Slugs and dates for the sitemap. */
  publishedIndex() {
    return this.entityModel
      .find(published())
      .select('slug updatedAt')
      .sort({ publishedAt: -1 })
      .lean();
  }
}
