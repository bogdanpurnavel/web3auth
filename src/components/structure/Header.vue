<template>
  <q-header
    elevated
    bordered
    class="bg-primary text-white q-px-sm"
  >
    <q-toolbar class="q-pr-lg">
        <q-btn
          class="btn-auth items-center goth-medium fs-2_5"
          label="Authorize"
          v-if="!authenticated"
          @click="openAuth"
        />
        <div v-if="authenticated">Authenticated</div>
    </q-toolbar>
  </q-header>
  <Authenticate />
</template>

<script>

export default {
  name: "HeaderComponent",
  components: { },
  data() {
    return {};
  },
  computed: {
    authenticated() {
      return this.$store.state.authenticated;
    },
  },
  mounted() {
  },
  methods: {
    openAuth() {
      this.$store.dispatch("openAuthDialog");
    },
  },
};
</script>

<style scoped lang="scss">
</style>
