<template>
  <table class="DataTable">
    <template v-if="!items">
      <tr v-for="n in 2">
        <td class="DataTable-item-name">
          <Skeleton />
        </td>
        <td class="DataTable-item-state">
          <Skeleton />
        </td>
      </tr>
    </template>
    <template v-else>
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
    </template>
  </table>
</template>

<script>
import humanize from 'string-humanize';

import Skeleton from './Skeleton';

export default {
  components: {
    Skeleton,
  },
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
@import 'photon-colors/photon-colors.scss';

.DataTable {
  width: 100%;
}

.DataTable-item-name {
  padding: 5px 10px 5px 0;
}

.DataTable-item-state {
  text-align: right;

  &--enabled {
    color: $blue-70;
  }
}
</style>
