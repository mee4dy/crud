import { PipeTransform, Injectable } from '@nestjs/common';
import qs from 'qs';

@Injectable()
export class QueryParsePipe implements PipeTransform {
  transform(value: string) {
    return qs.parse(value);
  }
}
