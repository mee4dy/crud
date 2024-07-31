import { Migration } from './migration';

export class Migration_1_4_24 extends Migration {
  public up() {
    const replacements = [{ regex: 'fetch(true)', replacement: 'fetch({ applyQuery: true })' }];

    this.replace(replacements);
  }

  public down() {}
}
