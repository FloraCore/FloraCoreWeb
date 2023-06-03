<template>
  <div>
    <h2>{{ $t('editor.groups.create') }}</h2>
    <div class="row">
      <div class="col">
        <div class="form-group">
          <label for="groupName">{{ $t('editor.groups.name') }}</label>
          <input id="groupName" :value="group.name" type="text" @input="updateGroupName($event)">
        </div>
        <div class="form-group">
          <label for="displayName">{{ $t('editor.groups.displayName') }}</label>
          <input id="displayName" v-model="group.displayName" type="text">
        </div>
        <div class="form-group">
          <label for="parent">{{ $t('editor.groups.parent') }}</label>
          <select id="parent" v-model="group.parent" name="parent">
            <option value="0">{{ $t('editor.groups.none') }}</option>
            <option v-for="groupItem in props" :key="groupItem.id" :value="groupItem.id">
              {{ groupItem.displayName }}
            </option>
          </select>
        </div>
      </div>
      <div class="col">
        <div class="form-group">
          <label for="weight">{{ $t('editor.groups.weight') }}</label>
          <input id="weight" v-model="group.weight" type="number">
        </div>
        <div class="form-group">
          <label for="prefix">{{ $t('editor.groups.prefix') }}</label>
          <input id="prefix" v-model="group.prefix" type="text">
        </div>
        <div class="form-group">
          <label for="suffix">{{ $t('editor.groups.suffix') }}</label>
          <input id="suffix" v-model="group.suffix" type="text">
        </div>
      </div>
    </div>
    <button class="save-button" type="button" @click="addGroup">
      <font-awesome icon="plus-circle"/>
      {{ $t('editor.groups.add') }}
    </button>
  </div>
</template>

<script>

export default {
  name: 'CreateGroup',
  data() {
    return {
      group: {
        name: '',
        displayName: '',
        weight: 0,
        parent: 0,
        prefix: '',
        suffix: '',
      },
    };
  },
  props: {
    props: Array,
  },
  computed: {},
  methods: {
    updateGroupName(event) {
      this.group.name = event.target.value.toLowerCase().replace(' ', '-');
    },

    addGroup() {
      if (this.group.name !== '') {
        const result = this.$store.dispatch('addGroup', this.group);

        if (result === 'success') this.$emit('close');
      }
    },
  },
};
</script>

<style lang="scss">

</style>
