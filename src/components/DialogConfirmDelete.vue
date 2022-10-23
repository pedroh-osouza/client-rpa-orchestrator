<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-card-title class="text-h5"
        >Deseja Mesmo Deletar esse Robô?</v-card-title
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="$emit('update:dialogDelete')">Cancelar</v-btn>
        <v-btn color="blue darken-1" text @click="$emit('deleteItemConfirm')">OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
      
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialogDelete: Boolean
  }
};
</script>