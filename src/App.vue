<template>
  <v-app>
    <v-main>
      <BaseDataTable/>
    </v-main>
  </v-app>
</template>

<script>

import BaseDataTable from './components/BaseDataTable.vue';

export default {
  name: 'App',

  components: {
    BaseDataTable
},

  data: () => ({
    
  }),
};
</script>
