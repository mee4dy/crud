import { FilterType } from '../../common/enums/filter-type.enum';
export interface Filter {
    key: string;
    type?: FilterType;
}
