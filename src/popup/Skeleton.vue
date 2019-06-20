<template>
  <div class="skeleton" />
</template>

<script>
export default {};
</script>

<style lang="scss">
@import 'photon-colors/photon-colors.scss';

$border-radius: 0.25rem;

.skeleton {
  animation: pulse 1s infinite ease-in-out;
  border-radius: $border-radius;
  min-height: 1em;
  width: 100%;
}

@keyframes pulse {
  0% {
    background-color: rgba($grey-20, 0.5);
  }
  50% {
    background-color: rgba($grey-20, 1);
  }
  100% {
    background-color: rgba($grey-20, 0.5);
  }
}
</style>
