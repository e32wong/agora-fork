<template>
  <div class="options-list">
    <div
      v-for="(option, index) in options"
      :key="index"
      class="option-item"
      :class="{ selected: isSelected(option) }"
      @click="selectOption(option)"
    >
      <div class="option-header">{{ option.title }}</div>
      <div class="option-description">{{ option.description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface OptionItem {
  title: string;
  description: string;
  value: string;
}

interface Props {
  options: OptionItem[];
  selectedValue: string;
}

interface Emits {
  (e: "update:selectedValue", value: string): void;
  (e: "optionSelected", option: OptionItem): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

function isSelected(option: OptionItem): boolean {
  return props.selectedValue === option.value;
}

function selectOption(option: OptionItem): void {
  emit("update:selectedValue", option.value);
  emit("optionSelected", option);
}
</script>

<style scoped lang="scss">
.options-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.option-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.option-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.option-item.selected {
  background-color: rgba(25, 118, 210, 0.12);

  &:hover {
    background-color: rgba(25, 118, 210, 0.16);
  }
}

.option-header {
  font-size: 1.1rem;
  font-weight: 500;
}

.option-description {
  color: $color-text-weak;
  font-size: 1rem;
  line-height: 1.4;
}
</style>
