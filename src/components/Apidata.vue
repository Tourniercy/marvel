<template>

  <v-container>
    <v-row no-gutters v-if="loading">
        <v-col
            v-for="i in 10" :key="i"
            cols="12"
            sm="4"
        >
          <v-skeleton-loader
              class="mx-auto"
              max-width="344"
              type="card"
          ></v-skeleton-loader>
        </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col
          v-for="character in characters" :key="character.id"
          cols="12"
          sm="4"
      >
        <v-card
            class="mx-auto"
            max-width="344"
        >
          <v-img
              v-bind:src="character.thumbnail.path+'.jpg'"
              height="200px"
          ></v-img>

          <v-card-title>
            {{ character.name }}
          </v-card-title>

          <v-card-actions>
            <v-btn
                color="orange lighten-2"
                text
            >
              Detail
            </v-btn>


          </v-card-actions>
        </v-card>
        <br>
      </v-col>
    </v-row>
    <div class="text-center">
      <v-pagination
          v-model="offset"
          :length="total"
          circle
      ></v-pagination>
    </div>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Apidata',
  data() {
    return {
      offset : 1,
      total: 0,
      show: null,
      loading: true,
      characters: []
    }
  },
  mounted() {
    axios
        .get('http://gateway.marvel.com/v1/public/characters?orderBy=name&offset='+this.offset+'&ts=1&apikey=5f30a789bead9d41e5a18b34f8c68733&hash=e1598d387c7946ba66079f451ae93788')
        .then(response => {
          console.log(response)
          this.characters = response.data.data.results
          this.total = parseInt(response.data.data.total/20)
          this.loading = false
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => this.loading = false)
  }
}
</script>