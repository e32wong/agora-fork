<template>
  <PrimeButton
    variant="outlined"
    rounded
    :class="{
      rootStyleSelected: props.isSelected,
      rootStyleUnselected: !props.isSelected,
    }"
    class="commonStyle"
  >
    <div>{{ label }}</div>
  </PrimeButton>
</template>

<script setup lang="ts">
const props = defineProps<{
  isSelected: boolean;
  label: string;
}>();
</script>

<style lang="postcss" scoped>
.commonStyle {
  border-radius: 10px;
  border-style: solid;
  border-width: 1px;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.commonStyle:hover {
  background-color: #c6c4ff !important;
  border-color: #6b4eff !important;
  color: #6b4eff !important;
}

.rootStyleSelected {
  background-color: #f1eeff;
  color: #6b4eff;
  border-color: #6b4eff;
}

.rootStyleUnselected {
  background-color: #f6f5f8;
  color: #6d6a74;
  border-color: transparent;
}
</style>
