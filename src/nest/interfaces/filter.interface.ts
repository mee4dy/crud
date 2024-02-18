import { FilterType } from '../enums/filter-type.enum';

export interface Filter {
  key: string;
  type?: FilterType;
}
