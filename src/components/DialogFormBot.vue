<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-dialog v-model="dialog" max-width="500px">

    <v-card>

      <v-card-title>
        <span class="text-h5">Robôs</span>
      </v-card-title>

      <v-card-text>
        <v-form v-model="formValid" lazy-validation>
        <v-container>
          <v-row>
              <v-col cols="12" sm="6" md="12">
                <v-text-field v-model="item.name" label="Nome" :rules="nameRules" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-text-field v-model="item.public_id" label="ID Público" :rules="idRules" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-file-input
                  :rules="[
                    (value) => {
                      return value || 'Requerido';
                    },
                  ]"
                  accept=""
                  v-model="item.file"
                  label="Diretório Uipath"
                  prepend-icon="mdi-folder"
                >
                </v-file-input>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="$emit('update:dialog')">
          Cancelar
        </v-btn>
        <v-btn :disabled="!formValid" color="blue darken-1" @click="$emit(action)">
          {{ action }}
        </v-btn>
      </v-card-actions>

    </v-card>

  </v-dialog>
  
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    item: Object,
    action: String,
  },
  data(){
    return {
      nameRules: [
        v=> !! v || 'Requerido' 
      ],
      idRules: [
        v=> !! v || 'Requerido' 
      ],
      formValid: false
    }
  }
};
</script>
