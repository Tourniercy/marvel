<template>

  <v-container>
    <v-row no-gutters v-if="loading">
        <v-skeleton-loader
            class="mx-auto"
            max-width="344"
            type="card"
        ></v-skeleton-loader>
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
    <v-row no-gutters v-else align="center"
           justify="center">
      <v-col
          cols="12"
          sm="4"
      >
        <v-img
            class="mx-auto"
            v-bind:src="character.thumbnail.path+'.jpg'"
            max-width="344"
        ></v-img>

      </v-col>
      <v-col
          cols="12"
          sm="8"

      >

        <span class="text-body-1">Nom : </span><span class="font-weight-black">{{ character.name }}</span><br><br>
        <span class="text-body-1">Description : </span><span class="font-weight-black">{{ character.description ? character.description : 'Aucune description'}}</span><br>

      </v-col>
      <v-col
          cols="12"
          sm="12">
        <p class="text-h5 text-center mt-10"
        >Liste des comics associés </p>
        <v-row no-gutters>
        <v-col
            v-for="comic in comics" :key="comic.id"
            cols="12"
            sm="4"
        >
          <v-card
              class="mx-auto"
              max-width="344"
          >
            <v-img
                v-bind:src="comic.thumbnail.path+'.jpg'"
                height="200px"
            ></v-img>

            <v-card-title>
              {{ comic.title }}
            </v-card-title>

            <v-card-actions>
              <v-btn
                  @click="$router.push({ name: 'Character' , params: { id: comic.id } })"
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
        <div class="text-center" v-if="countComics !== 0">
          <v-pagination
              v-model="pageComics"
              :length="totalComics"
              total-visible="10"
              circle
              @input="updatePaginationComics"

          ></v-pagination>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Character',
  data() {
    return {
      loading: true,
      character: null,
      count : 0,
      comics : [],
      loadingComics : true,
      countComics : 0,
      offsetComics : 0,
      pageComics: 1,
      totalComics: 0,

    }
  },

  methods:{
    getCharacter: function() {
      let request = '';
        request = 'http://gateway.marvel.com/v1/public/characters/'+this.$route.params.id+'?ts=1&apikey=5f30a789bead9d41e5a18b34f8c68733&hash=e1598d387c7946ba66079f451ae93788'
      axios
          .get(request)
          .then(response => {
            if (response.data.data.count) {
              this.character = response.data.data.results[0]
              request = 'http://gateway.marvel.com/v1/public/characters/'+this.$route.params.id+'/comics?ts=1&apikey=5f30a789bead9d41e5a18b34f8c68733&hash=e1598d387c7946ba66079f451ae93788'
              axios
                  .get(request)
                  .then(response => {
                    if (response.data.data.count) {
                      this.comics = response.data.data.results
                    }
                    console.log(response.data.data.results);
                    this.countComics = response.data.data.count;
                    this.totalComics = Math.ceil(response.data.data.total/20)

                    this.loadingComics = false

                  })
                  .catch(error => {
                    console.log(error)
                  })
                  .finally(() => this.loading = false)
            }
            this.count = response.data.data.count;
            this.loading = false

          })
          .catch(error => {
            console.log(error)
          })
          .finally(() => this.loading = false)
    },
  },
  mounted() {
    this.getCharacter()
  }
}
</script>

