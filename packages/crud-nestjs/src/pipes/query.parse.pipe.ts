import { PipeTransform, Injectable } from '@nestjs/common';
import qs from 'qs';

@Injectable()
export class QueryParsePipe implements PipeTransform {
  transform(value: any, metadata) {
    if (metadata.type === 'query') {
      return qs.parse(value);
    }

    return value;
  }
}
