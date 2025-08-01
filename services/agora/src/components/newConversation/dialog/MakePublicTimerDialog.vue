<template>
  <q-dialog v-model="showDialog" position="bottom">
    <ZKBottomDialogContainer>
      <div class="timer-options">
        <div
          v-for="(option, index) in timerOptions"
          :key="index"
          class="option-item"
          :class="{
            selected: isSelected(option),
            'custom-option': option.value === 'custom',
          }"
          @click="selectOption(option)"
        >
          <div class="option-header">{{ getTimerTitle(option.value) }}</div>
        </div>
      </div>
    </ZKBottomDialogContainer>
  </q-dialog>

  <CustomTimerDialog
    v-model:show-dialog="showCustomDialog"
    @go-back="handleGoBack"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useNewPostDraftsStore } from "src/stores/newConversationDrafts";
import ZKBottomDialogContainer from "src/components/ui-library/ZKBottomDialogContainer.vue";
import CustomTimerDialog from "./CustomTimerDialog.vue";

const showDialog = defineModel<boolean>("showDialog", { required: true });

const { conversationDraft } = storeToRefs(useNewPostDraftsStore());

const showCustomDialog = ref<boolean>(false);

interface TimerOption {
  value: "never" | "24hours" | "3days" | "1week" | "1month" | "custom";
  hours?: number;
}

const timerOptions: TimerOption[] = [
  {
    value: "never",
  },
  {
    value: "24hours",
    hours: 24,
  },
  {
    value: "3days",
    hours: 72,
  },
  {
    value: "1week",
    hours: 168,
  },
  {
    value: "1month",
    hours: 720, // 30 days
  },
  {
    value: "custom",
  },
];

function getTimerTitle(value: TimerOption["value"]): string {
  const titleMap: Record<TimerOption["value"], string> = {
    never: "Never",
    "24hours": "After 24 hours",
    "3days": "After 3 days",
    "1week": "After 1 week",
    "1month": "After 1 month",
    custom: "Custom",
  };
  return titleMap[value];
}

const selectedValue = ref<TimerOption["value"]>("never");

function isSelected(option: TimerOption): boolean {
  return selectedValue.value === option.value;
}

function selectOption(option: TimerOption): void {
  selectedValue.value = option.value;

  if (option.value === "never") {
    conversationDraft.value.privateConversationSettings.hasScheduledConversion =
      false;
    showDialog.value = false;
  } else if (option.value === "custom") {
    showDialog.value = false;
    showCustomDialog.value = true;
  } else if (option.hours) {
    conversationDraft.value.privateConversationSettings.hasScheduledConversion =
      true;
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + option.hours);
    conversationDraft.value.privateConversationSettings.conversionDate =
      targetDate;
    showDialog.value = false;
  }
}

function handleGoBack(): void {
  showCustomDialog.value = false;
  showDialog.value = true;
}
</script>

<style scoped lang="scss">
.timer-options {
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

.custom-option {
  .custom-preview {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: #6b7280;
    font-style: italic;
  }
}
</style>
