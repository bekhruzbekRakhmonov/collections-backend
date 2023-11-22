import { PartialType } from '@nestjs/swagger';
import { CreateCustomFieldDto } from './create-custom_field.dto';

export class UpdateCustomFieldDto extends PartialType(CreateCustomFieldDto) {}
