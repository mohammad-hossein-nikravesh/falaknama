import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../common/generic/base.repository';
import { FaqDocument, FaqEntity } from './faq.model';

@Injectable()
export class FaqsRepository extends BaseRepository<FaqDocument> {
  constructor(@InjectModel(FaqEntity.name) model: Model<FaqDocument>) {
    super(model);
  }

  /** There are only a handful, so always the whole list. */
  ordered() {
    return this.entityModel.find().sort({ order: 1, createdAt: 1 });
  }
}
