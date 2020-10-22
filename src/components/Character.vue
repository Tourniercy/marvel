<template>

  <v-container>

    <v-row v-if="count === 0">
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
            v-bind:src="character.thumbnail.path+'.jpg'"
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
        <span class="text-body-1">Nom : </span><span class="font-weight-black">{{ character.name }}</span><br><br>
        <span class="text-body-1">Description : </span><span class="font-weight-black">{{ character.description.length > 1 ? character.description : 'Aucune description'}}</span><br>

      </v-col>
    </v-row>
    <v-row>
      <v-col
          cols="12"
          sm="12">
        <p class="text-h5 text-center mt-10"
        >Liste des comics associés </p>
        <v-row no-gutters v-if="loadingComics">
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
        <v-row v-else-if="totalComics === 0">
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
                  @click="$router.push({ name: 'Comic' , params: { id: comic.id } })"
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
        <div class="text-center" v-if="totalComics !== 0">
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
import router from "@/router";
export default {
  name: 'Character',
  data() {
    return {
      loading: true,
      character: null,
      count : 0,
      comics : [],
      loadingComics : true,
      offsetComics : 0,
      pageComics: 1,
      totalComics: 0,

    }
  },

  methods:{
    updatePaginationComics (pagination) {
      this.loadingComics = true;
      this.offsetComics = pagination*20-20
      this.pageComics = pagination
      this.getComicsFromCharacter()
    },
    getCharacter: function() {
      let request = '';
        request = 'http://gateway.marvel.com/v1/public/characters/'+this.$route.params.id+'?apikey='+process.env.VUE_APP_API_KEY+''
      axios
          .get(request)
          .then(response => {
            if (response.data.data.count) {
              this.character = response.data.data.results[0]
              this.count = response.data.data.count
              request = 'http://gateway.marvel.com/v1/public/characters/'+this.$route.params.id+'/comics?orderBy=title&apikey='+process.env.VUE_APP_API_KEY+''
              axios
                  .get(request)
                  .then(response => {
                    if (response.data.data.count) {
                      this.comics = response.data.data.results
                      console.log(response.data)
                    }
                    this.totalComics = Math.ceil(response.data.data.total/20)
                    this.loadingComics = false
                    this.loading = false
                  })
                  .catch(() => {
                    return router.push({ path: `/Error/` })
                  })
                  .finally(() => {
                    this.loading = false
                    this.loadingComics = false
                  }
            )
            }
          })
          .catch(() => {
            return router.push({ path: `/Error/` })
          })
    },
    getComicsFromCharacter: function () {
              let request = '';
              request = 'http://gateway.marvel.com/v1/public/characters/'+this.$route.params.id+'/comics?orderBy=title&offset='+this.offset+'&apikey='+process.env.VUE_APP_API_KEY+''
              axios
                  .get(request)
                  .then(response => {
                    if (response.data.data.count) {
                      this.comics = response.data.data.results
                    }
                    this.loadingComics = false
                  })
                  .catch(error => {
                    console.log(error)
                  })
                  .finally(() =>this.loadingComics = false)
    }
  },
  mounted() {
    this.getCharacter()
  }
}
</script>

