<template>

  <v-container>
    <v-card
        elevation="2"
    >
      <v-row no-gutters align="center"
             justify="center">
        <v-col
            cols="12"
            sm="4"
        >
          <v-skeleton-loader v-if="loading"
                             class="mx-auto"
                             type="image"
                             width="344"
                             height="344"
          >
          </v-skeleton-loader>
          <v-img
              v-else
              class="mx-auto"
              v-bind:src="comic.thumbnail.path+'.jpg'"
              max-width="344"
          ></v-img>

        </v-col>
        <v-col
            cols="12"
            sm="8"
            v-if="loading">
          <v-skeleton-loader
              class="mx-auto"
              type="text"
          >
          </v-skeleton-loader>
          <v-skeleton-loader
              class="mx-auto"
              type="text"
          >
          </v-skeleton-loader>
        </v-col>

        <v-col
            v-else
            cols="12"
            sm="8"

        >
          <span class="text-body-1">Nom : </span><span class="font-weight-black">{{ comic.title }}</span><br><br>
          <span class="text-body-1">Description : </span><span class="font-weight-black">{{ comic.description ? comic.description : 'Aucune description'}}</span><br><br>
          <span class="text-body-1">Date de sortie : </span><span class="font-weight-black">{{ comic.dates[0] ? comic.dates[0].date.split('T')[0]: 'Aucune date retournée'}}</span><br><br>
          <span class="text-body-1">Prix : </span><span class="font-weight-black">{{ comic.prices[0] ? comic.prices[0].price + '$' : 'Aucune description'}}</span><br><br>

        </v-col>
      </v-row>
    </v-card>
      <v-row>
      <v-col
          cols="12"
          sm="12">
        <p class="text-h5 text-center mt-10"
        >Liste des personnages associés </p>
        <v-row no-gutters v-if="loadingCharacters">
          <v-col
              v-for="i in 100" :key="i"
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
        <v-row v-else-if="totalCharacters === 0">
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
        <div class="text-center" v-if="totalCharacters !== 0">
          <v-pagination
              v-model="pageCharacters"
              :length="totalCharacters"
              total-visible="10"
              circle
              @input="updatePaginationCharacters"

          ></v-pagination>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import router from "@/router";
export default {
  name: 'Comic',
  data() {
    return {
      loading: true,
      comic: null,
      characters : [],
      loadingCharacters : true,
      offsetCharacters : 0,
      pageCharacters: 1,
      totalCharacters: 0,

    }
  },

  methods:{
    updatePaginationCharacters(pagination) {
      this.loadingCharacters = true;
      this.offsetCharacters = pagination*20-20
      this.pageCharacters = pagination
      this.getCharactersFromComic()
    },
    getComic: function() {
      let request = '';
      request = 'http://gateway.marvel.com/v1/public/comics/'+this.$route.params.id+'?apikey='+process.env.VUE_APP_API_KEY+''
      axios
          .get(request)
          .then(response => {
            if (response.data.data.count) {
              this.comic = response.data.data.results[0]
              request = 'http://gateway.marvel.com/v1/public/comics/'+this.$route.params.id+'/characters?orderBy=name&apikey='+process.env.VUE_APP_API_KEY+''
              axios
                  .get(request)
                  .then(response => {
                    if (response.data.data.count) {
                      this.characters = response.data.data.results
                      console.log(response.data.data.results)
                    }
                    this.totalCharacters = Math.ceil(response.data.data.total/20)
                    this.loadingCharacters = false
                    this.loading = false
                  })
                  .catch(() => {
                    return router.push({ path: `/Error/` })
                  })
                  .finally(() => {
                        this.loading = false
                        this.loadingCharacters = false
                      }
                  )
            }
          })
          .catch( () => {
            return router.push({ path: `/Error/` })
          })
    },
    getCharactersFromComic: function () {
      let request = '';
      request = 'http://gateway.marvel.com/v1/public/comics/'+this.$route.params.id+'/characters?orderBy=name&offset='+this.offset+'&apikey='+process.env.VUE_APP_API_KEY+''
      axios
          .get(request)
          .then(response => {
            if (response.data.data.count) {
              this.comics = response.data.data.results
            }
            this.loadingCharacters = false
          })
          .catch(() => {
            return router.push({ path: `/Error/` })
          })
          .finally(() =>this.loadingCharacters = false)
    }
  },
  mounted() {
    this.getComic()
  }
}
</script>

