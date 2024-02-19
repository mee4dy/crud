### Installation

```
npm install @mee4dy/crud
```

### Development mode

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

### Package structure

- Common interfaces, enums
- Vuex Store
- NestJS (Service, Controller)
- Vue Crud Table (Bootstrap VUE) `Release soon`

### VuexCrud Params

| Param         | Type                    | Default | Description                                                                                                                       |
| ------------- | ----------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| endpoints     | `Object`                | -       | An object that defines the API endpoints for the CRUD operations. You can customize these endpoints by providing your own values. |
| pk            | `String`                | 'id'    | The name of the primary key field in your data. This is used to uniquely identify each item.                                      |
| filters       | `Array<String\|Object>` | ['pk']  | An array of default filter options. These filters will be applied by default when making API calls.                               |
| groups        | `Array<String\|Object>` | ['pk']  | An array of default group options. These options will be used for grouping the data.                                              |
| orders        | `Array<String>`         | ['pk']  | An array of default sorting options. These options will be used for sorting the data.                                             |
| fields        | `Array<Object>`         | []      | An array of fields to be fetched from the API. Only these fields will be stored in the state.                                     |
| groupsDefault | `Array<String>`         | []      | An array of default grouping options. These options will be selected by default when grouping the data.                           |

### Example store

```javascript
import { VuexCrud } from '@mee4dy/crud';

const crud = new VuexCrud({
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

## Example usage

```vue
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
