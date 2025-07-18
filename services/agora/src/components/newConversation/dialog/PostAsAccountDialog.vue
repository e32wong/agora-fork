<template>
  <q-dialog v-model="showDialog" position="bottom">
    <ZKBottomDialogContainer>
      <div
        class="account-option"
        :class="{
          'account-option--selected': isAccountSelected(
            false,
            profileData.userName
          ),
        }"
        @click="setPostAs(false, profileData.userName)"
      >
        <UserAvatar
          :user-identity="profileData.userName"
          :size="32"
          class="account-avatar"
        />
        <span class="account-name">{{ profileData.userName }}</span>
      </div>

      <div
        v-for="organizationName in profileData.organizationList"
        :key="organizationName"
        class="account-option"
        :class="{
          'account-option--selected': isAccountSelected(true, organizationName),
        }"
        @click="setPostAs(true, organizationName)"
      >
        <UserAvatar
          :user-identity="organizationName"
          :size="32"
          class="account-avatar"
        />
        <span class="account-name">{{ organizationName }}</span>
      </div>
    </ZKBottomDialogContainer>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ZKBottomDialogContainer from "src/components/ui-library/ZKBottomDialogContainer.vue";
import UserAvatar from "src/components/account/UserAvatar.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "src/stores/user";
import { useNewPostDraftsStore } from "src/stores/newConversationDrafts";

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { profileData } = storeToRefs(useUserStore());
const { conversationDraft } = storeToRefs(useNewPostDraftsStore());

const showDialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

function setPostAs(isOrganization: boolean, name: string) {
  conversationDraft.value.postAs.postAsOrganization = isOrganization;
  if (isOrganization) {
    conversationDraft.value.postAs.organizationName = name;
  } else {
    conversationDraft.value.postAs.organizationName = "";
  }
  showDialog.value = false;
}

function isAccountSelected(isOrganization: boolean, name: string): boolean {
  if (isOrganization) {
    return (
      conversationDraft.value.postAs.postAsOrganization &&
      conversationDraft.value.postAs.organizationName === name
    );
  } else {
    return !conversationDraft.value.postAs.postAsOrganization;
  }
}
</script>

<style scoped lang="scss">
.account-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &--selected {
    background-color: rgba(25, 118, 210, 0.12);

    &:hover {
      background-color: rgba(25, 118, 210, 0.16);
    }
  }
}

.account-avatar {
  margin-right: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.account-name {
  font-size: 16px;
  font-weight: 500;
}
</style>
