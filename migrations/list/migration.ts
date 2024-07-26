const findParentDir = require('find-parent-dir');
const replace = require('replace');

export abstract class Migration {
  protected defaultReplace = {
    recursive: true,
    exclude: 'node_modules',
  };

  protected getBasePath() {
    return findParentDir.sync(process.cwd(), 'node_modules/@mee4dy/crud');
  }

  protected replace(replacements) {
    const projectPath = this.getBasePath();

    for (const replacement of replacements) {
      replace({
        paths: [projectPath],
        ...this.defaultReplace,
        ...replacement,
      });
    }
  }

  abstract up();

  abstract down();
}
