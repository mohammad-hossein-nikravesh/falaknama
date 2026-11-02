import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/** A question and answer shown on the Landing page, lowest `order` first. */
@Schema({ timestamps: true, versionKey: false })
export class FaqEntity extends Document {
  @Prop({ required: true, trim: true })
  question: string;

  /** Plain text. */
  @Prop({ required: true, trim: true })
  answer: string;

  @Prop({ default: 0 })
  order: number;
}

export type FaqDocument = FaqEntity;

export const FaqEntitySchema = SchemaFactory.createForClass(FaqEntity);
