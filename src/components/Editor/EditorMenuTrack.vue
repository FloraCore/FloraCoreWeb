<template>
  <div class="editor-menu-track">
    <h3 @click="toggle = !toggle">
      <span>
        <button :title="$t('editor.tracks.toggleGroup')">
          <font-awesome :rotation="toggle ? 90 : null" fixed-width icon="caret-right"/>
        </button>
        <span>{{ track.id }}</span>
      </span>
      <span class="actions">
        <button :title="$t('editor.tracks.edit')" @click.stop="editTrack">
          <font-awesome fixed-width icon="edit"/>
        </button>
        <button :title="$t('editor.tracks.delete')" @click.stop="deleteTrack">
          <font-awesome fixed-width icon="times"/>
        </button>
      </span>
    </h3>
    <transition name="slide">
      <ul v-if="track.groups.length && toggle">
        <li
          v-for="group in filteredGroups"
          :key="`${track.id}_${group}`"
          :class="{
            'active': currentSession && currentSession.id === group,
            'modified': modifiedSessions.includes(group)
          }"
          :title="$t('editor.groups.edit')"
          @click="changeCurrentSession(group)"
        >
          {{ group }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'editor-menu-track',

  props: {
    track: {
      type: Object,
      required: true,
    },
    filter: {
      type: String,
      required: true,
    },
    currentSession: {
      required: true,
    },
    modifiedSessions: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      toggle: false,
    };
  },

  computed: {
    filteredGroups() {
      return this.track.groups.filter(group => group.includes(this.filter));
    },
  },

  methods: {
    changeCurrentSession(sessionId) {
      this.$store.commit('setCurrentSession', sessionId);
      this.$emit('clear-query');
    },

    editTrack() {
      this.$store.commit('setModal', {
        type: 'createTrack',
        object: {
          track: this.track,
        },
      });
    },

    deleteTrack() {
      this.$store.dispatch('deleteTrack', this.track.id);
    },
  },

  watch: {
    filter(newValue) {
      if (newValue !== '') {
        this.toggle = true;
      }
    },
  },
};
</script>

<style lang="scss">
.editor-menu-track {
  h3 {
    margin: 0;
    padding: .5rem;
    color: $brand-color;
    border-bottom: $grey 1px solid;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;

    &:hover {
      .actions {
        button {
          opacity: .5;
        }
      }
    }

    button {
      background: transparent;
      border: none;
      opacity: .5;
      cursor: pointer;
      color: white;
      font-size: 1.5rem;
      padding: 0;
      margin-right: .5rem;

      svg {
        transition: transform .2s;
      }

      &:hover {
        opacity: 1;
      }

      &[disabled] {
        width: 1em;
      }
    }

    .actions {
      button {
        opacity: 0;
        font-size: 1rem;

        &:hover {
          opacity: 1;
        }
      }
    }
  }
}
</style>
