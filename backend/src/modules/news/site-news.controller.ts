import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { NewsQueryDto } from './dto';
import { NewsService } from './news.service';

@ApiTags('site')
@Public()
@Controller('site/news')
export class SiteNewsController {
  constructor(private readonly news: NewsService) {}

  @Get()
  list(@Query() query: NewsQueryDto) {
    return this.news.sitePage(query);
  }
}
