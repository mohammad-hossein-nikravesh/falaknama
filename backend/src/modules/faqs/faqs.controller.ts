import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesEnum } from '../auth/enums/roles.enum';
import { BaseController } from '../common/generic/base.controller';
import { CreateFaqDto, UpdateFaqDto } from './dto';
import { FaqDocument, FaqEntity } from './faq.model';
import { FaqsService } from './faqs.service';

/** Admin CRUD. Visitors read through SiteFaqsController. */
@ApiTags('faqs')
@Roles(RolesEnum.ADMIN)
@Controller('faqs')
export class FaqsController extends BaseController<
  FaqDocument,
  CreateFaqDto,
  UpdateFaqDto
>(FaqEntity, CreateFaqDto, UpdateFaqDto, 'FAQ') {
  constructor(private readonly faqs: FaqsService) {
    super(faqs);
  }

  /** Replaces the generic list: the whole list, in display order. */
  @Get()
  @ApiOperation({ summary: 'All FAQs in display order' })
  findAll() {
    return this.faqs.ordered();
  }
}

@ApiTags('site')
@Public()
@Controller('site/faqs')
export class SiteFaqsController {
  constructor(private readonly faqs: FaqsService) {}

  @Get()
  list() {
    return this.faqs.ordered();
  }
}
