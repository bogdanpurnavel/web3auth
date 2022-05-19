<template>
  <q-layout view="hHh lPR lFf">
    <div>
      <HeaderComponent />
    </div>
    <div style="padding: 50px">
      <router-view />
    </div>
  </q-layout>
</template>

<script>
  import HeaderComponent  from "./components/structure/Header";

  export default {
    name: "App",
    components: {
      HeaderComponent,
  },
    data() {
      return {
      };
    },
  };
</script>
<style scoped lang="scss">
</style>
