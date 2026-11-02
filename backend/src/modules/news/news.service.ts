import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '../common/generic/base.service';
import { PaginationQueryDto } from '../common/dto';
import { CreateNewsDto, NewsQueryDto, UpdateNewsDto } from './dto';
import { NewsDocument } from './news.model';
import { NewsRepository } from './news.repository';

@Injectable()
export class NewsService extends BaseService<
  NewsDocument,
  CreateNewsDto,
  UpdateNewsDto
> {
  constructor(protected readonly repository: NewsRepository) {
    super(repository, 'News');
  }

  async create(dto: CreateNewsDto): Promise<NewsDocument> {
    this.checkRange(dto.startsAt, dto.endsAt);
    return super.create(dto);
  }

  async update(id: string, dto: UpdateNewsDto): Promise<NewsDocument> {
    if (dto.startsAt || dto.endsAt) {
      const current = await this.repository.findById(id);
      this.checkRange(
        dto.startsAt ?? current?.startsAt,
        dto.endsAt === undefined ? current?.endsAt : dto.endsAt,
      );
    }
    return super.update(id, dto);
  }

  adminPage({ offset = 0, limit = 20 }: PaginationQueryDto) {
    return this.repository.archive(offset, limit);
  }

  sitePage({ scope, offset = 0, limit = 12 }: NewsQueryDto) {
    const capped = Math.min(limit, 30);
    return scope === 'current'
      ? this.repository.current(offset, capped)
      : this.repository.archive(offset, capped);
  }

  private checkRange(start?: string | Date, end?: string | Date | null) {
    if (start && end && new Date(end) < new Date(start)) {
      throw new BadRequestException(
        'تاریخ پایان نمی‌تواند پیش از تاریخ شروع باشد',
      );
    }
  }
}
