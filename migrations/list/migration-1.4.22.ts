import { Migration } from './migration';

export class Migration_1_4_22 extends Migration {
  public up() {
    const replacements = [
      { regex: 'filtersSelected', replacement: 'selectedFilters' },
      { regex: 'FiltersSelected', replacement: 'SelectedFilters' },
      { regex: 'groupsSelected', replacement: 'selectedGroups' },
      { regex: 'GroupsSelected', replacement: 'SelectedGroups' },
      { regex: 'ordersSelected', replacement: 'selectedOrders' },
      { regex: 'OrdersSelected', replacement: 'SelectedOrders' },
      { regex: 'groupsDefault', replacement: 'defaultGroups' },
    ];

    this.replace(replacements);
  }

  public down() {}
}
