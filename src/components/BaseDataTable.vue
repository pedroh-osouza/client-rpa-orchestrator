<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="robots"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Robôs</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <template>
            <v-btn color="primary" dark class="mb-2" @click="addItem()">
              Adicionar Robô
            </v-btn>
          </template>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <div>Adicione um Robô</div>
      </template>
    </v-data-table>
    <DialogFormBot
      :dialog.sync="dialog"
      :item.sync="editedItem"
      :action="action"
      @save="save()"
    ></DialogFormBot>
    <DialogConfirmDelete
      :dialogDelete.sync="dialogDelete"
      @deleteItemConfirm="deleteItemConfirm"
    ></DialogConfirmDelete>
  </v-container>
</template>

<script>
import store from "@/config/store";
import DialogFormBot from "./DialogFormBot.vue";
import DialogConfirmDelete from "./DialogConfirmDelete.vue";

export default {
  components: {
    DialogFormBot,
    DialogConfirmDelete
},

  data() {
    return {
      dialog: false,
      dialogDelete: false,
      action: "",
      headers: [
        { text: "Nome", sortable: false, value: "name",},
        { text: "Id Público", value: "public_id", sortable: false },
        { text: "Diretório Xaml", value: "filename", sortable: false },
        { text: "Ações", value: "actions", sortable: false },
      ],
      robots: [],
      editedIndex: -1,
      editedItem: {
        name: null,
        public_id: null,
        filename: null,
        file: null
      },
      defaultItem: {
        name: null,
        public_id: null,
        filename: null,
        file: null
      },
    };
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.fetchRobots();
  },

  methods: {
    fetchRobots() {
      this.robots = store.get("robots");
    },
    deleteItem(item) {
      this.editedIndex = this.robots.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      store.delete('robots', this.editedIndex);
      this.fetchRobots()
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      this.editedItem = this.extractDirectory(this.editedItem)
      store.add("robots", this.editedItem);
      this.fetchRobots();
      this.close();
    },
    addItem() {
      this.action = "save";
      this.dialog = true;
    },
    extractDirectory(robot) {
      let path = robot.file.path;
      robot.filename = path;
      return robot;
    }
  },
};
</script>
