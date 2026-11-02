import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

/** A piece of astrology writing with its own page at /articles/<slug>. */
@Schema({ timestamps: true, versionKey: false })
export class ArticleEntity extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true, lowercase: true, unique: true })
  slug: string;

  /** Shown on cards and as the page's meta description. */
  @Prop({ required: true, trim: true })
  summary: string;

  @Prop()
  coverImage?: string;

  /** Sanitised HTML (common/utils/rich-text.ts). */
  @Prop({ required: true })
  body: string;

  @Prop({
    type: String,
    enum: Object.values(ArticleStatus),
    default: ArticleStatus.DRAFT,
  })
  status: ArticleStatus;

  /** Visible publicly once published and this moment has passed. */
  @Prop()
  publishedAt?: Date;

  @Prop({ default: 1 })
  readingMinutes: number;
}

export type ArticleDocument = ArticleEntity;

export const ArticleEntitySchema = SchemaFactory.createForClass(ArticleEntity);
ArticleEntitySchema.index({ status: 1, publishedAt: -1 });
