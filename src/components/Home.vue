<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <Apidata/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Apidata from "@/components/Apidata";

  export default {
    name: 'Home',
    components: {Apidata},
    data: () => ({
    }),
  }
</script>
