<template>
  <NewConversationLayout>
    <TopMenuWrapper>
      <div class="menuFlexGroup">
        <BackButton />
      </div>

      <ZKButton
        button-type="largeButton"
        color="primary"
        label="Next"
        size="0.8rem"
        @click="goToPreview()"
      />
    </TopMenuWrapper>

    <div class="container">
      <NewConversationControlBar />

      <div class="contentFlexStyle">
        <div ref="titleInputRef" :style="{ paddingLeft: '0.5rem' }">
          <div v-if="titleError" class="titleErrorMessage">
            <q-icon name="mdi-alert-circle" class="titleErrorIcon" />
            Title is required to continue
          </div>

          <q-input
            v-model="conversationDraft.title"
            borderless
            no-error-icon
            placeholder="What do you want to ask?"
            type="textarea"
            autogrow
            :maxlength="MAX_LENGTH_TITLE"
            required
            :error="titleError"
            class="large-text-input"
            @update:model-value="clearTitleError"
          >
            <template #after>
              <div class="wordCountDiv">
                {{ conversationDraft.title.length }} /
                {{ MAX_LENGTH_TITLE }}
              </div>
            </template>
          </q-input>
        </div>

        <div>
          <div class="editor-style">
            <ZKEditor
              v-model="conversationDraft.content"
              placeholder="Body text. Provide context or relevant resources. Make sure it's aligned with the main question!"
              min-height="5rem"
              :focus-editor="false"
              :show-toolbar="true"
              :add-background-color="false"
              @update:model-value="checkWordCount()"
            />

            <div class="wordCountDiv">
              <q-icon
                v-if="bodyWordCount > MAX_LENGTH_BODY"
                name="mdi-alert-circle"
                class="bodySizeWarningIcon"
              />
              <span
                :class="{
                  wordCountWarning: bodyWordCount > MAX_LENGTH_BODY,
                }"
                >{{ bodyWordCount }}
              </span>
              &nbsp; / {{ MAX_LENGTH_BODY }}
            </div>
          </div>

          <div v-if="conversationDraft.poll.enabled">
            <PollComponent ref="pollComponentRef" />
          </div>
        </div>
      </div>
    </div>

    <NewConversationRouteGuard
      ref="routeGuardRef"
      :allowed-routes="['/conversation/new/review/']"
    />

    <PreLoginIntentionDialog
      v-model="showLoginDialog"
      :ok-callback="onLoginCallback"
      :active-intention="'newConversation'"
    />
  </NewConversationLayout>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import ZKButton from "src/components/ui-library/ZKButton.vue";
import TopMenuWrapper from "src/components/navigation/header/TopMenuWrapper.vue";
import ZKEditor from "src/components/ui-library/ZKEditor.vue";
import { useNewPostDraftsStore } from "src/stores/newConversationDrafts";
import {
  MAX_LENGTH_TITLE,
  MAX_LENGTH_BODY,
  validateHtmlStringCharacterCount,
} from "src/shared/shared";
import { storeToRefs } from "pinia";
import { useLoginIntentionStore } from "src/stores/loginIntention";
import NewConversationLayout from "src/components/newConversation/NewConversationLayout.vue";
import NewConversationControlBar from "src/components/newConversation/NewConversationControlBar.vue";
import NewConversationRouteGuard from "src/components/newConversation/NewConversationRouteGuard.vue";
import BackButton from "src/components/navigation/buttons/BackButton.vue";
import PreLoginIntentionDialog from "src/components/authentication/intention/PreLoginIntentionDialog.vue";
import PollComponent from "src/components/newConversation/PollComponent.vue";

const bodyWordCount = ref(0);
const exceededBodyWordCount = ref(false);
const titleError = ref(false);

const router = useRouter();

// Disable the warning since Vue template refs can be potentially null
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
const routeGuardRef = ref<InstanceType<
  typeof NewConversationRouteGuard
> | null>(null);

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
const pollComponentRef = ref<InstanceType<typeof PollComponent> | null>(null);
const titleInputRef = ref<HTMLDivElement | null>(null);

const { createEmptyDraft, validateForReview } = useNewPostDraftsStore();
const { conversationDraft } = storeToRefs(useNewPostDraftsStore());

const { createNewConversationIntention } = useLoginIntentionStore();

const showLoginDialog = ref(false);

function onLoginCallback() {
  createNewConversationIntention();
}

function checkWordCount() {
  bodyWordCount.value = validateHtmlStringCharacterCount(
    conversationDraft.value.content,
    "conversation"
  ).characterCount;

  if (bodyWordCount.value > MAX_LENGTH_BODY) {
    exceededBodyWordCount.value = true;
  } else {
    exceededBodyWordCount.value = false;
  }
}

function scrollToPollingRef() {
  if (conversationDraft.value.poll.enabled) {
    setTimeout(function () {
      pollComponentRef.value?.$el?.scrollIntoView({
        behavior: "smooth",
        inline: "start",
      });
    }, 100);
  } else {
    conversationDraft.value.poll.options = createEmptyDraft().poll.options;
  }
}

function scrollToTitleInput() {
  setTimeout(function () {
    titleInputRef.value?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 100);
}

function scrollToPollComponent() {
  setTimeout(function () {
    pollComponentRef.value?.$el?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 100);
}

function clearTitleError() {
  if (titleError.value) {
    titleError.value = false;
  }
}

async function goToPreview() {
  const validation = validateForReview();

  if (!validation.isValid) {
    // Handle errors based on validation result
    if (validation.errors.title) {
      titleError.value = true;
      scrollToTitleInput();
    } else if (validation.errors.poll) {
      // Trigger poll component validation to show error UI
      pollComponentRef.value?.triggerValidation();
      scrollToPollComponent();
    }
    // Note: body validation errors are handled by the editor component itself
    return;
  }

  titleError.value = false;
  routeGuardRef.value?.unlockRoute();
  await router.push({ name: "/conversation/new/review/" });
}

watch(
  () => conversationDraft.value.poll.enabled,
  (enablePolling) => {
    if (enablePolling === true) {
      scrollToPollingRef();
    }
  }
);
</script>

<style scoped lang="scss">
.title-style {
  font-size: 1.1rem;
  font-weight: 600;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.editor-style {
  padding-bottom: 2rem;
  font-size: 1rem;
}

.wordCountDiv {
  display: flex;
  justify-content: right;
  align-items: center;
  color: $color-text-weak;
  font-size: 1rem;
}

.wordCountWarning {
  color: $negative;
  font-weight: bold;
}

.bodySizeWarningIcon {
  font-size: 1rem;
  padding-right: 0.5rem;
}

.cardBackground {
  background-color: white;
}

.organizationSection {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.organizationFlexList {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contentFlexStyle {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top: 2rem;
  padding-bottom: 8rem;
}

.titleErrorMessage {
  display: flex;
  align-items: center;
  color: $negative;
  font-size: 0.9rem;
}

.titleErrorIcon {
  font-size: 1rem;
  margin-right: 0.5rem;
}

.large-text-input :deep(.q-field__control) {
  font-size: 1.2rem;
}

.large-text-input :deep(.q-field__native) {
  font-weight: 500;
}
</style>
