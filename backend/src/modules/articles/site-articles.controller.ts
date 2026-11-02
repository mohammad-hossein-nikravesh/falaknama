import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { PaginationQueryDto } from '../common/dto';
import { ArticlesService } from './articles.service';

/** Published Articles for visitors. */
@ApiTags('site')
@Public()
@Controller('site/articles')
export class SiteArticlesController {
  constructor(private readonly articles: ArticlesService) {}

  @Get()
  list(@Query() query: PaginationQueryDto) {
    return this.articles.publishedPage(query);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.articles.findPublished(slug);
  }
}
