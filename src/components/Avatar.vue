<template>
  <img
    :alt="$t('avatar', { name })"
    :src="`https://crafthead.net/helm/${key}/8`"
    :title="title ? $t('avatar', { name }) : ''"
    class="avatar"
    @error="replaceWithDefault"
  />
</template>

<script>
import defaultSkin from '../assets/defaultskin.png';

export default {
  props: {
    id: {
      required: true,
    },
    name: {
      required: false,
    },
    title: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    key() {
      return this.id.replace(/-/g, '');
    },
  },
  methods: {
    replaceWithDefault(e) {
      e.target.src = defaultSkin;
    },
  },
};
</script>

<style lang="scss">
.avatar {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: pixelated;
}
</style>
