import migrations from './migrations';

for (const Migration of migrations) {
  try {
    new Migration().up();
  } catch (e) {}
}
