<template>

  <v-container>
    <v-col>
      <v-combobox
          v-model="searchValue"
          :items="resultSearch"
          :loading="loading"
          :search-input.sync="search"
          item-text="name"
          label="Recherche d'un personnage ..."
      >
      </v-combobox>

    </v-col>
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
    <v-row v-else-if="count === 0">
      <v-col
          cols="12"
      >
        <p class="subtitle-2 text-center">
          Pas de résultat
        </p>
      </v-col>
    </v-row>
    <v-row no-gutters v-else>
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
                @click="$router.push({ name: 'Character' , params: { id: character.id } })"
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
    <div class="text-center" v-if="count !== 0">
      <v-pagination
          v-model="page"
          :length="total"
          total-visible="10"
          circle
          @input="updatePagination"

      ></v-pagination>
    </div>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Characters',
  data() {
    return {
      resultSearch : [],
      offset : 0,
      page: 1,
      total: 0,
      loading: true,
      characters: [], 
      search : null,
      query : null,
      count : 0,
      searchValue: null,
    }
  },

  methods:{
    updatePagination (pagination) {
      this.loading = true;
      this.offset = pagination*20-20
      this.page = pagination
      this.getCharacters()
    },
    getCharacters: function() {
      let request = '';
      if (this.query) {
        request = 'http://gateway.marvel.com/v1/public/characters?nameStartsWith='+encodeURIComponent(this.query)+'&orderBy=name&offset='+this.offset+'&apikey='+process.env.VUE_APP_API_KEY+''
      } else {
        request = 'http://gateway.marvel.com/v1/public/characters?orderBy=name&offset='+this.offset+'&apikey='+process.env.VUE_APP_API_KEY+''
      }
      axios
          .get(request)
          .then(response => {
            if (this.query) {
              this.resultSearch = response.data.data.results
            }
            if (response.data.data.count) {
              this.characters = response.data.data.results
              this.total = Math.ceil(response.data.data.total/20)
            }
            this.count = response.data.data.count;
            this.loading = false

          })
          .catch(error => {
            console.log(error)
          })
          .finally(() => this.loading = false)
    },
    fetchEntriesDebounced() {
      // cancel pending call
      clearTimeout(this._timerId)
      // delay new call 500ms
      this._timerId = setTimeout(() => {
        this.getCharacters()
      }, 500)

    }
  },
  watch: {
    search(query, previous) {
      if (query === previous) {
        return
      }
      this.search = query
      this.page = 0
      this.offset = 0
      this.loading = true
      this.query = query
      this.fetchEntriesDebounced()

    },
  },
  mounted() {
    console.log(process.env)
    this.getCharacters()
  }
}
</script>
