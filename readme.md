## Intro

Create a backend and frontend in 5 minutes!
With our powerful full stack crud system, customize it to suit you.

## Installation

```
npm install @mee4dy/crud
```

## Running migrations

```
npm --prefix ./node_modules/@mee4dy/crud run migrate
```

## Package structure

- **Common**
  - Interfaces, Enums, Decorators
- **Fronted**
  - Vuex Store, Vuex ORM Mode (new)
  - Vuex Form
  - UI
    - Nuxt Crud: Panel, Table (Bootstrap VUE)
- **Backend**
  - NestJS
    - Controller
    - Service
    - Decorators

## Features

- Vuex CRUD - includes storage, requests to the backend: receiving, creating, deleting, updating
- Vuex CRUD (ORM mode) - allows you to work with data in the store in ORM style
- Vuex Forms - creation/editing modes. Compatible with CRUD backend
- CRUD Controller and CRUD Service for NestJS, with controller-level scoping support
- (Beta) Support for entity relationships. Ability to connect entities to each other
- Full compatibility of front-end components and back-end components of the CRUD system
- Convenient examples, versatility of use, customizable

## Vuex Store

### Params

| Param          | Type                    | Default | Description                                                                                                                       |
| -------------- | ----------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| endpoints      | `Object`                | -       | An object that defines the API endpoints for the CRUD operations. You can customize these endpoints by providing your own values. |
| pk             | `String`                | 'id'    | The name of the primary key field in your data. This is used to uniquely identify each item.                                      |
| filters        | `Array<String\|Object>` | ['pk']  | An array of default filter options. These filters will be applied by default when making API calls.                               |
| groups         | `Array<String\|Object>` | ['pk']  | An array of default group options. These options will be used for grouping the data.                                              |
| orders         | `Array<String>`         | ['pk']  | An array of default sorting options. These options will be used for sorting the data.                                             |
| fields         | `Array<Object>`         | []      | An array of fields to be fetched from the API. Only these fields will be stored in the state.                                     |
| defaultFilters | `Object`                | {}      | Object of default filters. (Example: `{ post_id: 1` }`)                                                                           |
| defaultOrders  | `Object`                | {}      | Object of default orders. (Example: `{ pk: 'desc' }`)                                                                             |
| defaultGroups  | `Array<String>`         | []      | An array of default grouping options. These options will be selected by default when grouping the data.                           |

### Getters

`getState(path)`  
`getCtx`  
`getPK`  
`getItems`  
`getItemsORM`  
`getIncludes`  
`getFields`  
`getLoading`  
`getSelectedFilters`  
`getSelectedGroups`  
`getSelectedOrders`  
`getDefaultFilters`  
`getDefaultGroups`  
`getDefaultOrders`  
`getParams`  
`getEndpoint`  
`getFilters`  
`getGroups`  
`getOrders`

### Mutations

`setState(path, value)`  
`setCtx(ctx)`  
`setFields(fields)`  
`setItems(items)`  
`pushItem(item)`  
`setLoading(status)`  
`setQuery(query)`  
`update({ pk, data, level? })`  
`delete({ pk, level? })`  
`setSelectedFilters(value)`  
`setSelectedGroups(value)`  
`setSelectedOrders(value)`

### Actions

`setCtx()`  
`setQuery(query)`  
`setQuerySelectedFilters(query)`  
`setQuerySelectedGroups(query)`  
`setQuerySelectedOrders(query)`  
`syncSelectedToQuery()`  
`setItems(items)`  
`fetch({ applyQuery?, filters?, groups?, orders? })`  
`create({ data })`  
`update({ pk, data, level? })`  
`delete({ pk, level? })`

### Example store

```javascript
import { CrudStore } from '@mee4dy/crud';

const crud = new CrudStore({
  pk: 'post_id',
  endpoints: {
    fetch: '/posts',
    delete: '/posts/delete',
    update: '/posts/update',
  },
  filters: [
    { label: 'ID', key: 'pk' },
    { label: 'ID Category', key: 'category_id' },
    { label: 'Title', key: 'title', type: 'text' },
  ],
  fields: [
    {
      key: 'pk',
      label: 'ID',
      sortable: true,
      centered: true,
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
    },
    {
      key: 'category.name', // Nested field key
      label: 'Category',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      type: 'boolean',
    },
    {
      key: 'created_at',
      label: 'Created date',
      sortable: true,
      type: 'datetime',
    },
    {
      key: 'updated_at',
      label: 'Updated date',
      sortable: true,
      type: 'datetime',
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: true,
    },
  ],
});

const state = {
  ...crud.state,
};

const getters = {
  ...crud.getters,
};

const actions = {
  ...crud.actions,
};

const mutations = {
  ...crud.mutations,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
```

### Example usage

```html
<template>
  <ui-table :items="items" :fields="fields" :busy="loading"></ui-table>
</template>

<script>
  import { mapActions, mapMutations, mapGetters } from 'vuex';

  export default {
    name: 'PostsTable',
    data() {
      return {};
    },
    computed: {
      ...mapGetters({
        items: 'posts/getItems',
        fields: 'posts/getFields',
        loading: 'posts/getLoading',
      }),
    },
    watch: {
      '$route.query': {
        immediate: true,
        handler(query) {
          this.setQuery(query);
          this.fetch();
        },
      },
    },
    methods: {
      ...mapActions({
        fetch: 'posts/fetch',
        setQuery: 'posts/setQuery',
      }),
    },
  };
</script>
```

## VUEX ORM

```
VUEX ORM provides a convenient tool for editing objects in the VUEX CRUD Store using the ORM approach.
Use the "save", "commit", "delete" methods to work with store objects.
```

### VUE Component

```html
<template>
  <div id="posts">
    <div v-if="loading" class="loader">Loading...</div>
    <div v-else v-for="item of items">
      <h1>{{ item.title }}</h1>
      <div>{{ item.text }}</div>
      <button @click="modifyTitle(item)">Modify title</button>
      <button @click="modifyTitleLocal(item)">Modify title (without save)</button>
      <button @click="deletePost(item)">Delete post</button>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    data() {
      return {};
    },
    computed: {
      ...mapGetters({
        fields: 'posts/getFields',
        items: 'posts/getItemsORM',
        loading: 'posts/getLoading',
      }),
    },
    mounted() {
      this.fetch();
    },
    methods: {
      ...mapActions({
        fetch: 'posts/fetch',
      }),

      modifyTitle(item) {
        item.title = 'New Title!';
        await item.save();
      },
      modifyTitleLocal(item) {
        item.title = 'New Title! (local)';
        item.commit();
      },
      deletePost(item) {
        await item.delete();
      }
    },
  };
</script>
```

### Custom usage ORM

```javascript
const items = [
  { id: 1, child_id: 11, name: 'test' },
  { id: 2, child_id: 12, name: 'test2' },
];

const itemsORM = new ORM(items)
  .setActions({
    update: '...',
    delete: '...',
  })
  .setIncludes(['childs']);

const item = itemsORM[0];

// Update item
item.name = 'test-new';
await item.save();

// OR Commit changes without save
item.commit();

// Delete item
await item.delete();

const itemChild = item.childs[0];

// Update child item
itemChild.name = 'child-name-new';
await itemChild.save();

// OR Commit changes without save
item.commit();

// Delete child
await itemChild.delete();
```

## VUEX FORM

### Store

```js
import { CrudStoreForm } from '@mee4dy/crud';

const crud = new CrudStoreForm({
  endpoints: {
    fetch: '/posts/:pk',
    create: '/posts/create',
    update: '/posts/update',
  },
});

export default crud;
```

### VUE component

```vue
<template>
  <div id="form">
    <b-form @submit.prevent="onSubmit">
      <b-form-group id="input-group-1" label="Title:" label-for="input-1">
        {{ formData }}
        <b-form-input id="input-1" v-model="formData.title" type="text" required></b-form-input>
      </b-form-group>
      <b-btn type="submit" icon="mdi-plus" variant="primary">Submit</b-btn>
    </b-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { mapFormData } from '@mee4dy/crud';

export default {
  computed: {
    formData: mapFormData('posts/form'), // Form state mapping (for changes with mutations)

    ...mapGetters({
      fields: 'posts/form/getFields',
      data: 'posts/form/getData',
      dataDefault: 'posts/form/getDataDefault',
    }),
  },
  methods: {
    ...mapActions({
      init: 'posts/form/init',
      fetch: 'posts/form/fetch',
      submit: 'posts/form/submit',
      reset: 'posts/form/reset',
    }),

    onSubmit() {
      this.submit();
    },

    onReset() {
      this.reset();
    },
  },
  mounted() {
    this.fetch(this.id);
  },
};
</script>
```

## NestJS (Examples)

### CRUD Controller

```
Сontroller routes:
/       - get all items
/:pk    - get item by pk (primary key)
/create - create item
/update - update item
/delete - delete item
```

#### Controller

```typescript
import { CrudController } from '@mee4dy/crud/nestjs';

@Controller('/posts')
export class PostsController extends CrudController {
  constructor(private readonly postsService: postsService) {
    super(postsService);
  }
}
```

#### Scope

```typescript
import { CrudController, UseCrudScope } from '@mee4dy/crud/nestjs';

@UseCrudScope((req) => {
  return {
    where: {
      user_id: req.user.id, // Adds a filter by user for all database queries
    },
  };
})
@Controller('/posts')
export class PostsController extends CrudController {
  constructor(private readonly postsService: postsService) {
    super(postsService);
  }
}
```

#### Context object

```typescript
import { CrudController, CrudCtx, UseCrudCtx } from '@mee4dy/crud/nestjs';

@UseGuards(AuthGuard('jwt'))
@UseCrudCtx((req: any) => {
  const user = req.user;

  return {
    user: user,
    // Any other data
  };
})
@Controller('/posts')
export class PostsController extends CrudController {
  constructor(private readonly postsService: postsService) {
    super(postsService);
  }

  @Post('/create')
  async create(@CrudCtx() ctx, @Body('data') data: CreateDto) {
    const user = ctx.user; // User object was passed with UseCrudCtx

    try {
      // ...

      return {
        status: true,
      };
    } catch (e) {
      return {
        status: false,
        error: {
          message: e.message,
          // ...
        },
      };
    }
  }
}
```

#### Custom method

```typescript
import { CrudController } from '@mee4dy/crud/nestjs';

@Controller('/posts')
export class PostsController extends CrudController {
  constructor(private readonly postsService: postsService) {
    super(postsService);
  }

  @Get('/refresh')
  async refresh(@Query('post_id') postID) {
    try {
      const post = await this.postsService.findOne({
        where: {
          post_id: postID,
        },
      });

      if (post) {
        // ...
      }
    } catch (e) {
      console.error(e);
    }
  }
}
```

### CRUD Service

#### Properties

| Param              | Type               | Default                           | Description                                                     |
| ------------------ | ------------------ | --------------------------------- | --------------------------------------------------------------- |
| `pk`               | `string`           | `id`                              | Поле, используемое как первичный ключ.                          |
| `repository`       | `<RepositoryType>` | `-`                               | Репозиторий sequelize для взаимодействия с базой данных.        |
| `limit`            | `number`           | `-`                               | Максимальное количество записей для выборки.                    |
| `allowFilters`     | `Filter[]`         | `[ { key: 'pk' } ]`               | Разрешенные фильтры для выборок.                                |
| `allowGroups`      | `string[]`         | `[]`                              | Разрешенные поля для группировки результатов выборки.           |
| `allowOrders`      | `string[]`         | `[ 'pk' ]`                        | Разрешенные поля для сортировки результатов выборки.            |
| `defaultGroups`    | `string[]`         | `[ 'pk' ]`                        | Поля по умолчанию для группировки результатов выборки.          |
| `defaultOrders`    | `Order[][]`        | `[[ 'pk', OrderDirection.desc ]]` | Поля и порядок сортировки по умолчанию при выполнении запросов. |
| `fields`           | `<FieldType>`      | `-`                               | Поля репозитория для выборок. По умолчанию все поля модели.     |
| `fieldsAdditional` | `<FieldType[]>`    | `-`                               | Кастомные дополнительные поля для выборок.                      |

#### Service

```typescript
import { CrudService } from '@mee4dy/crud/nestjs';

@Injectable()
export class PostsService extends CrudService {
  constructor(
    @InjectModel(Posts)
    private postsModel: typeof Posts
  ) {
    super();
  }

  protected pk = 'post_id';
  protected repository = this.postsModel;
}
```

#### Modify repository

```typescript
import { CrudService } from '@mee4dy/crud/nestjs';

@Injectable()
export class PostsService extends CrudService {
  constructor(
    @InjectModel(Posts)
    private postsModel: typeof Posts
  ) {
    super();

    this.repository = this.postsModel.scope(['withStatitstic']);
  }

  protected pk = 'post_id';
  protected repository;
}
```

## Development mode

```
npm install @mee4dy/crud
npm run dev

// Mount docker volume
volumes:
  - ...
  - ../crud:/app/node_modules/@mee4dy/crud

// NPM Link (inside crud folder)
npm link
```
