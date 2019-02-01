<template>
  <table class="DataTable">
    <tr v-for="item in items" v-bind:key="item.name">
      <td class="DataTable-item-name">
        {{ item.name | humanize }}
      </td>
      <td
        class="DataTable-item-state"
        v-bind:class="{ 'DataTable-item-state--enabled': item.enabled }"
      >
        {{ item.enabled ? 'ON' : 'OFF' }}
      </td>
    </tr>
    <tr v-if="items.length === 0">
      <td colspan="2">none</td>
    </tr>
  </table>
</template>

<script>
import humanize from 'string-humanize';

export default {
  props: {
    items: Array,
  },
  filters: {
    humanize(str) {
      return humanize(str);
    },
  },
};
</script>

<style lang="scss" scoped>
$blue-70: #003eaa;

.DataTable {
  width: 100%;
}

.DataTable-item-name {
  padding: 5px 10px 5px 0;
}

.DataTable-item-state {
  font-weight: 600;
  text-align: right;

  &--enabled {
    color: $blue-70;
  }
}
</style>
