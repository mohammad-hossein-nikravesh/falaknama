import { Injectable } from '@nestjs/common';
import { BaseService } from '../common/generic/base.service';
import { CreateFaqDto, UpdateFaqDto } from './dto';
import { FaqDocument } from './faq.model';
import { FaqsRepository } from './faqs.repository';

@Injectable()
export class FaqsService extends BaseService<
  FaqDocument,
  CreateFaqDto,
  UpdateFaqDto
> {
  constructor(protected readonly repository: FaqsRepository) {
    super(repository, 'FAQ');
  }

  ordered() {
    return this.repository.ordered();
  }
}
