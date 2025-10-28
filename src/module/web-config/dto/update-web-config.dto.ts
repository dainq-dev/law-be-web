import { PartialType } from '@nestjs/swagger';
import { CreateWebConfigDto } from './create-web-config.dto';

export class UpdateWebConfigDto extends PartialType(CreateWebConfigDto) {}

