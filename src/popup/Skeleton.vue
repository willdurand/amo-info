<template>
  <div class="skeleton" />
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
$border-radius: 0.25rem;
$light-gray: #ededf0;

.skeleton {
  animation: pulse 1s infinite ease-in-out;
  border-radius: $border-radius;
  min-height: 1em;
  width: 100%;
}

@keyframes pulse {
  0% {
    background-color: rgba($light-gray, 0.5);
  }
  50% {
    background-color: rgba($light-gray, 1);
  }
  100% {
    background-color: rgba($light-gray, 0.5);
  }
}
</style>
