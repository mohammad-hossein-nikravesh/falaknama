import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../common/generic/base.service';
import { PaginationQueryDto } from '../common/dto';
import { cleanArticleHtml, readingMinutes } from '../common/utils/rich-text';
import { t } from '../common/utils/i18n';
import { ArticleDocument, ArticleStatus } from './article.model';
import { ArticlesRepository } from './articles.repository';
import { CreateArticleDto, UpdateArticleDto } from './dto';

@Injectable()
export class ArticlesService extends BaseService<
  ArticleDocument,
  CreateArticleDto,
  UpdateArticleDto
> {
  constructor(protected readonly repository: ArticlesRepository) {
    super(repository, 'Article');
  }

  async create(dto: CreateArticleDto): Promise<ArticleDocument> {
    const article = this.prepare(dto);
    if (dto.status === ArticleStatus.PUBLISHED && !dto.publishedAt)
      article.publishedAt = new Date().toISOString();
    return super.create(article);
  }

  async update(id: string, dto: UpdateArticleDto): Promise<ArticleDocument> {
    const changes = this.prepare(dto);
    // First publication without a chosen date: publish now.
    if (dto.status === ArticleStatus.PUBLISHED && !dto.publishedAt) {
      const current = await this.repository.findById(id);
      if (current && !current.publishedAt)
        changes.publishedAt = new Date().toISOString();
    }
    return super.update(id, changes);
  }

  adminPage({ offset = 0, limit = 20 }: PaginationQueryDto) {
    return this.repository.adminPage(offset, limit);
  }

  publishedPage({ offset = 0, limit = 9 }: PaginationQueryDto) {
    return this.repository.publishedPage(offset, Math.min(limit, 30));
  }

  async findPublished(slug: string) {
    const article = await this.repository.findPublishedBySlug(slug);
    if (!article)
      throw new NotFoundException(t('errors.notFound', { entity: 'Article' }));
    return article;
  }

  publishedIndex() {
    return this.repository.publishedIndex();
  }

  private prepare<T extends UpdateArticleDto>(dto: T) {
    const out: T & { readingMinutes?: number } = { ...dto };
    if (dto.body !== undefined) {
      out.body = cleanArticleHtml(dto.body);
      out.readingMinutes = readingMinutes(out.body);
    }
    return out;
  }
}
