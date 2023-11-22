import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidateDtoPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToInstance(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            const error = errors.map((e) => e.constraints);
            throw new BadRequestException(JSON.stringify(error));
        }
        return value;
    }

    private toValidate(metatype: any): boolean {
        const types: any[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
