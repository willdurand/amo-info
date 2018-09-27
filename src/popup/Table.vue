<template>
  <table class="Table">
    <tr v-for="item in items">
      <td class="Table-item-name">
        {{ item.name | humanize }}
      </td>
      <td
        class="Table-item-state"
        v-bind:class="{ 'Table-item-state--enabled': item.enabled }"
      >
        {{ item.enabled ? 'ON' : 'OFF' }}
      </td>
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

.Table {
  width: 100%;
}

.Table-item-name {
  padding: 5px 10px 5px 0;
}

.Table-item-state {
  font-weight: 600;
  text-align: right;

  &--enabled {
    color: $blue-70;
  }
}
</style>
