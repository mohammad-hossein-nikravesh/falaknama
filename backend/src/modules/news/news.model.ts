import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/** A short, dated sky happening. No page of its own: a card on the Landing page and in /news. */
@Schema({ timestamps: true, versionKey: false })
export class NewsEntity extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  /** Plain text. */
  @Prop({ required: true, trim: true })
  body: string;

  @Prop()
  image?: string;

  @Prop({ required: true })
  startsAt: Date;

  /** Unset for a one-day happening. */
  @Prop({ type: Date, default: null })
  endsAt: Date | null;
}

export type NewsDocument = NewsEntity;

export const NewsEntitySchema = SchemaFactory.createForClass(NewsEntity);
NewsEntitySchema.index({ startsAt: -1 });
