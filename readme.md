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
