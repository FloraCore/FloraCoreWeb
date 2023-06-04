<template>
  <div class="node">
    <div class="main" @click="open = !open">
      <span :class="source.type" class="type">
        {{ source.type }}
      </span>

      <span class="details">
        <code>{{ source.details || `meta: ${source.key}` }}</code>
      </span>

      <span :class="source.result" class="value">
        <font-awesome :icon="valueIcon" fixed-width/>
      </span>
    </div>
    <transition name="slide">
      <div v-if="open" class="content">
        <div class="col-2">
          <pre class="code">{{ source.content.join("\n") }}</pre>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Avatar from '../Avatar.vue';

export default {
  components: {
    Avatar,
  },
  props: {
    source: Object,
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    valueIcon() {
      switch (this.source.result) {
        case 'true':
          return 'check';
        case 'false':
          return 'times';
        default:
          return 'minus';
      }
    },
  },
};
</script>

<style lang="scss">
.verbose-viewer {
  .node {
    margin-bottom: .25rem;

    &:focus {
      outline: 1px $brand-color solid;
    }

    .main {
      padding: .25rem 1rem;
      display: flex;
      cursor: pointer;

      &:hover {
        background: rgba(255, 255, 255, .1);
      }
    }

    .type {
      margin-right: 1rem;
      display: flex;
      align-items: center;
      min-width: 10rem;

      img {
        width: 1rem;
        margin-right: .5rem;
      }
      &.all{
        color: WHITE;
      }
      &.party{
        color: #5865F2;
      }
      &.staff{
        color: cyan;
      }
      &.guild{
        color: green;
      }
      &.admin{
        color: tomato;
      }
    }

    .details {
      flex: 1;
    }

    .value {
      &.true {
        color: $brand-color;
      }

      &.false {
        color: tomato;
      }

      &.undefined,
      &.null {
        color: grey;
      }

      svg {
        margin-left: 1rem;
      }

      &.null {
        svg {
          opacity: 0;
        }
      }
    }

    .content {
      background: rgba(0, 0, 0, .2);
      padding: .5rem 1rem;
      display: flex;
      white-space: normal;

      .col-1 {
        flex: 1;
      }

      .col-2 {
        display: flex;
        flex-direction: column;
        flex: 2;
      }

      table {
        td:first-child {
          width: 25%;
        }
      }

      code {
        word-break: break-all;
      }

      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
    }
  }
}
</style>
