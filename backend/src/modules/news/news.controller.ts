import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesEnum } from '../auth/enums/roles.enum';
import { PaginationQueryDto } from '../common/dto';
import { BaseController } from '../common/generic/base.controller';
import { CreateNewsDto, UpdateNewsDto } from './dto';
import { NewsDocument, NewsEntity } from './news.model';
import { NewsService } from './news.service';

/** Admin CRUD. Visitors read through SiteNewsController. */
@ApiTags('news')
@Roles(RolesEnum.ADMIN)
@Controller('news')
export class NewsController extends BaseController<
  NewsDocument,
  CreateNewsDto,
  UpdateNewsDto
>(NewsEntity, CreateNewsDto, UpdateNewsDto, 'News') {
  constructor(private readonly news: NewsService) {
    super(news);
  }

  /** Replaces the generic list: newest first, with a total. */
  @Get()
  @ApiOperation({ summary: 'Page of News items for the Admin panel' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.news.adminPage(query);
  }
}
