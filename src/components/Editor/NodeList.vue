<template>
  <div class="node-list">
    <h2 v-html="$tc('editor.nodes.permissionsCount', nodes.length)"/>

    <div class="node-list-header">
      <div class="sorting-tabs">
        <div
          :class="{ 'node-select-all': true, 'selected': allSelected }"
          :title="$t('editor.nodes.selectAll')"
          @click="selectAll"
        >
          <span></span>
        </div>

        <div
          :class="{'active': sort.method === 'key'}"
          :title="$t('editor.nodes.sort.permission')"
          class="permission"
          @click="changeSort('key')"
        >
          {{ $t('editor.permissions') }}
          <font-awesome
            v-if="sort.method === 'key'"
            :class="{'reverse': !sort.desc}"
            icon="chevron-circle-down"
          />
        </div>

        <div
          :class="{'active': sort.method === 'value'}"
          :title="$t('editor.nodes.sort.value')"
          class="value"
          @click="changeSort('value')"
        >
          {{ $t('editor.value') }}
          <font-awesome
            v-if="sort.method === 'value'"
            :class="{'reverse': !sort.desc}"
            icon="chevron-circle-down"
          />
        </div>

        <div
          :class="{'active': sort.method === 'expiry'}"
          :title="$t('editor.nodes.sort.expiry')"
          class="expiry"
          @click="changeSort('expiry')"
        >
          {{ $t('editor.expiry') }}
          <font-awesome
            v-if="sort.method === 'expiry'"
            :class="{'reverse': !sort.desc}"
            icon="chevron-circle-down"/>
        </div>

        <div
          :class="{'active': sort.method === 'contexts'}"
          :title="$t('editor.nodes.sort.contexts')"
          class="context"
          @click="changeSort('contexts')"
        >
          {{ $t('editor.contexts') }}
          <font-awesome
            v-if="sort.method === 'contexts'"
            :class="{'reverse': !sort.desc}"
            icon="chevron-circle-down"
          />
        </div>

        <div class="delete-column"></div>
      </div>
    </div>

    <virtual-list
      :data-component="Node"
      :data-sources="sortedNodes"
      :estimate-size="42"
      :keeps="50"
      class="node-list-scroll"
      data-key="id"
    />
  </div>
</template>

<script>
import sortBy from 'lodash.sortby';
import VirtualList from 'vue-virtual-scroll-list';
import Node from './Node.vue';

export default {
  name: 'NodeList',
  components: {
    VirtualList,
  },
  props: {
    nodes: Array,
  },
  data() {
    return {
      sort: {
        method: null,
        desc: true,
      },
    };
  },
  computed: {
    Node() {
      return Node;
    },
    sortedNodes() {
      let sorted;
      if (['key', 'value', 'expiry'].indexOf(this.sort.method) >= 0) {
        sorted = sortBy(this.nodes, [this.sort.method]);
      } else {
        sorted = sortBy(this.nodes, node => node.context[this.sort.method]);
      }

      if (this.sort.desc) {
        return sorted;
      }
      return sorted.reverse();
    },
    selectedNodes() {
      return this.$store.getters.selectedNodeIds;
    },
    currentSelectedNodes() {
      const map = this.nodes.map(node => node.id);

      return this.selectedNodes.filter(nodeId => map.indexOf(nodeId) !== -1);
    },
    allSelected() {
      return this.nodes.length && this.nodes.length === this.currentSelectedNodes.length;
    },
  },
  methods: {
    changeSort(method) {
      if (this.sort.method === method) {
        this.sort.desc = !this.sort.desc;
      } else {
        this.sort.desc = true;
      }

      this.sort.method = method;
    },
    selectAll() {
      if (this.allSelected) {
        this.$store.commit('deselectAllSessionNodes', this.nodes);
      } else {
        this.$store.commit('selectAllSessionNodes', this.nodes);
      }
    },
  },
};
</script>

<style lang="scss">
.node-list {
  background-color: rgba(255, 255, 255, .2);
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  h2 {
    font-size: 1.25rem;
    margin: 0 0 .5rem;
    padding: .5rem 1rem 0;

    span {
      margin-left: .5em;
      opacity: .5;
    }
  }

  .node-list-header {
    background-color: rgb(67, 67, 78);
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    position: sticky;
    top: 0;
    z-index: 10;

    .sorting-tabs {
      display: flex;

      > div {
        padding: .5em 1em;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: bold;

        &.active {
          background: rgba(255, 255, 255, .1);
        }

        &.node-select-all {
          flex: 0 0 auto;

          span {
            display: block;
            width: 1.5rem;
            height: 1.5rem;
            border: 2px solid $grey;
            position: relative;
          }

          &.selected {
            span {
              &:after {
                position: absolute;
                display: block;
                content: '';
                width: 1rem;
                height: .5rem;
                border: 4px solid $brand-color;
                border-top: 0;
                border-right: 0;
                transform: rotate(-45deg);
              }
            }
          }
        }

        &.delete-column {
          pointer-events: none;
          flex: 0 0 3rem;
          margin-right: .5rem;
        }

        svg {
          opacity: .5;
          transition: transform .3s;

          &.reverse {
            transform: rotate(180deg);
          }
        }

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        &.permission {
          flex: 2 2 30%;
        }

        &.value {
          flex: 1 1 10%;
        }

        &.expiry {
          flex: 1 1 15%;
        }

        &.context {
          flex: 1 1 20%;
        }
      }
    }
  }

  > ul {
    margin: 0;
    padding: 0;
    padding-bottom: 8em;
    list-style: none;
  }

  // TODO: figure out if it's possible to use transitions with virtual scroller
  //&-enter, &-leave-to {
  //  opacity: 0;
  //  transform: translateX(10%);
  //}

  //&-leave-active {
  //  position: absolute;
  //  background: $red;
  //  width: 100%;
  //  pointer-events: none;
  //}
  .node-list-scroll {
    overflow-y: scroll;
    overflow-x: hidden;
    flex: 1;
  }
}
</style>
