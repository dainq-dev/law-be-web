import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCertificateDto } from './create-certificate.dto';

export class UpdateCertificateDto extends PartialType(
  OmitType(CreateCertificateDto, ['human_resource_id'] as const),
) {}

