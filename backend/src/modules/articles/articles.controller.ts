import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesEnum } from '../auth/enums/roles.enum';
import { PaginationQueryDto } from '../common/dto';
import { BaseController } from '../common/generic/base.controller';
import { ArticleDocument, ArticleEntity } from './article.model';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto } from './dto';

/** Admin CRUD. Visitors read through SiteArticlesController. */
@ApiTags('articles')
@Roles(RolesEnum.ADMIN)
@Controller('articles')
export class ArticlesController extends BaseController<
  ArticleDocument,
  CreateArticleDto,
  UpdateArticleDto
>(ArticleEntity, CreateArticleDto, UpdateArticleDto, 'Article') {
  constructor(private readonly articles: ArticlesService) {
    super(articles);
  }

  /** Replaces the generic list: drafts included, newest edit first, with a total. */
  @Get()
  @ApiOperation({ summary: 'Page of Articles for the Admin panel' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.articles.adminPage(query);
  }
}
