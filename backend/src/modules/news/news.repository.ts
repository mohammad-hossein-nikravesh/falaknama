import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../common/generic/base.repository';
import { NewsDocument, NewsEntity } from './news.model';

const DAY = 86_400_000;

@Injectable()
export class NewsRepository extends BaseRepository<NewsDocument> {
  constructor(@InjectModel(NewsEntity.name) model: Model<NewsDocument>) {
    super(model);
  }

  /** News items whose last day has not passed: still within a day of `endsAt`, or of `startsAt` when there is no end. */
  current(offset: number, limit: number) {
    const since = new Date(Date.now() - DAY);
    return this.page(
      {
        $or: [
          { endsAt: { $gte: since } },
          { endsAt: null, startsAt: { $gte: since } },
        ],
      },
      { startsAt: 1 },
      offset,
      limit,
    );
  }

  archive(offset: number, limit: number) {
    return this.page({}, { startsAt: -1 }, offset, limit);
  }
}
