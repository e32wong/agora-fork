<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div ref="postContainerRef" :class="{ fixedHeightContainer: !compactMode }">
      <WidthWrapper :width="'35rem'">
        <ZKHoverEffect :enable-hover="compactMode">
          <div
            class="container postPadding"
            :class="{
              compactBackground: compactMode,
              standardBackground: !compactMode,
            }"
          >
            <div class="innerContainer">
              <!-- TODO: Pass author verified flag here -->
              <PostMetadata
                :poster-user-name="extendedPostData.metadata.authorUsername"
                :created-at="new Date(extendedPostData.metadata.createdAt)"
                :skeleton-mode="skeletonMode"
                :post-slug-id="extendedPostData.metadata.conversationSlugId"
                :author-verified="false"
              />

              <div class="postDiv">
                <div>
                  <div
                    v-if="!skeletonMode"
                    class="titleDiv extraTitleBottomPadding"
                  >
                    {{ extendedPostData.payload.title }}
                  </div>

                  <div v-if="skeletonMode" class="titleDiv">
                    <Skeleton
                      width="100%"
                      height="4rem"
                      border-radius="16px"
                    ></Skeleton>
                  </div>
                </div>

                <div
                  v-if="
                    extendedPostData.payload.body != undefined &&
                    extendedPostData.payload.body.length > 0
                  "
                  class="bodyDiv"
                >
                  <span
                    :class="{ truncate: compactMode }"
                    v-html="extendedPostData.payload.body"
                  ></span>
                </div>

                <ZKCard
                  v-if="
                    extendedPostData.metadata.moderation.status == 'moderated'
                  "
                  padding="1rem"
                  class="lockCardStyle"
                >
                  <PostLockedMessage
                    :moderation-property="extendedPostData.metadata.moderation"
                    :post-slug-id="extendedPostData.metadata.conversationSlugId"
                  />
                </ZKCard>
              </div>

              <div
                v-if="extendedPostData.payload.poll && !skeletonMode"
                class="pollContainer"
              >
                <PollWrapper
                  :poll-options="extendedPostData.payload.poll"
                  :post-slug-id="extendedPostData.metadata.conversationSlugId"
                  :user-response="extendedPostData.interaction"
                />
              </div>

              <div class="bottomButtons">
                <div class="leftButtonCluster">
                  <div v-if="!skeletonMode">
                    <ZKButton
                      :disable="
                        extendedPostData.metadata.moderation.status ==
                        'moderated'
                      "
                      text-color="color-text-weak"
                      size="0.8rem"
                      :label="
                        (
                          extendedPostData.metadata.opinionCount +
                          commentCountOffset
                        ).toString()
                      "
                      icon="mdi-comment-outline"
                      @click.stop.prevent="clickedCommentButton()"
                    />
                  </div>
                  <div v-if="skeletonMode">
                    <Skeleton
                      width="3rem"
                      height="2rem"
                      border-radius="16px"
                    ></Skeleton>
                  </div>
                </div>

                <div>
                  <div v-if="!skeletonMode">
                    <ZKButton
                      text-color="color-text-weak"
                      size="0.8rem"
                      icon="mdi-export-variant"
                      @click.stop.prevent="shareClicked()"
                    />
                  </div>
                  <div v-if="skeletonMode">
                    <Skeleton
                      width="3rem"
                      height="2rem"
                      border-radius="16px"
                    ></Skeleton>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!compactMode" ref="commentSectionRef">
              <CommentSection
                :key="commentSectionKey"
                :post-slug-id="extendedPostData.metadata.conversationSlugId"
                :participant-count="extendedPostData.metadata.participantCount"
                :polis="extendedPostData.polis"
                :is-post-locked="
                  extendedPostData.metadata.moderation.status == 'moderated'
                "
                @deleted="decrementCommentCount()"
              />
            </div>
          </div>
        </ZKHoverEffect>
      </WidthWrapper>
    </div>

    <FloatingBottomContainer
      v-if="!compactMode && isAuthenticated && !isLocked"
    >
      <CommentComposer
        :show-controls="focusCommentElement"
        :post-slug-id="extendedPostData.metadata.conversationSlugId"
        @cancel-clicked="cancelledCommentComposor()"
        @submitted-comment="
          (opinionSlugId: string) => submittedComment(opinionSlugId)
        "
        @editor-focused="focusCommentElement = true"
      />
    </FloatingBottomContainer>
  </div>
</template>

<script setup lang="ts">
import ZKButton from "../ui-library/ZKButton.vue";
import CommentSection from "./views/CommentSection.vue";
import PostMetadata from "./views/PostMetadata.vue";
import PollWrapper from "../poll/PollWrapper.vue";
import FloatingBottomContainer from "../navigation/FloatingBottomContainer.vue";
import CommentComposer from "./views/CommentComposer.vue";
import { usePostStore } from "src/stores/post";
import { computed, onMounted, ref, useTemplateRef } from "vue";
import { useWebShare } from "src/utils/share/WebShare";
import { useRoute, useRouter } from "vue-router";
import { useRouteQuery } from "@vueuse/router";
import ZKHoverEffect from "../ui-library/ZKHoverEffect.vue";
import Skeleton from "primevue/skeleton";
import type { ExtendedConversation } from "src/shared/types/zod";
import { useAuthenticationStore } from "src/stores/authentication";
import ZKCard from "../ui-library/ZKCard.vue";
import PostLockedMessage from "./views/PostLockedMessage.vue";
import { useInfiniteScroll } from "@vueuse/core";
import { useOpinionScrollableStore } from "src/stores/opinionScrollable";
import { storeToRefs } from "pinia";
import WidthWrapper from "../navigation/WidthWrapper.vue";

const props = defineProps<{
  extendedPostData: ExtendedConversation;
  compactMode: boolean;
  skeletonMode: boolean;
}>();

const { isAuthenticated } = useAuthenticationStore();

const commentCountOffset = ref(0);
const commentSectionKey = ref(Date.now());

const commentSectionRef = ref<HTMLElement | null>(null);
const postContainerRef = useTemplateRef<HTMLElement>("postContainerRef");

const router = useRouter();
const route = useRoute();

const { loadPostData } = usePostStore();

const webShare = useWebShare();

const focusCommentElement = ref(false);

const action = useRouteQuery("action");

const { loadMore } = useOpinionScrollableStore();
const { hasMore } = storeToRefs(useOpinionScrollableStore());

useInfiniteScroll(
  postContainerRef,
  () => {
    loadMore();
  },
  {
    distance: 500,
    canLoadMore: () => {
      return hasMore.value;
    },
  }
);

onMounted(() => {
  if (action.value == "comment") {
    setTimeout(() => {
      scrollToCommentSection();
    }, 100);
  }
});

const isLocked = computed(() => {
  if (props.extendedPostData.metadata.moderation.status == "moderated") {
    if (props.extendedPostData.metadata.moderation.action == "lock") {
      return true;
    }
  }
  return false;
});

function decrementCommentCount() {
  commentCountOffset.value -= 1;
}

function scrollToCommentSection() {
  commentSectionRef.value?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

async function submittedComment(opinionSlugId: string) {
  await router.replace({
    query: { opinionSlugId: opinionSlugId, filter: "new" },
  });

  commentCountOffset.value += 1;
  focusCommentElement.value = false;

  commentSectionKey.value += Date.now();

  scrollToCommentSection();
  await loadPostData(false);
}

function cancelledCommentComposor() {
  focusCommentElement.value = false;
}

async function clickedCommentButton() {
  if (route.name != "/conversation/[postSlugId]") {
    await router.push({
      name: "/conversation/[postSlugId]",
      params: {
        postSlugId: props.extendedPostData.metadata.conversationSlugId,
      },
      query: { action: "comment" },
    });
  } else {
    focusCommentElement.value = !focusCommentElement.value;
  }
}

async function shareClicked() {
  const sharePostUrl =
    window.location.origin +
    process.env.VITE_PUBLIC_DIR +
    "/conversation/" +
    props.extendedPostData.metadata.conversationSlugId;
  await webShare.share(
    "Agora - " + props.extendedPostData.payload.title,
    sharePostUrl
  );
}
</script>

<style scoped lang="scss">
.innerContainer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pollContainer {
  padding-bottom: 1rem;
}

.titleDiv {
  font-size: 1.2rem;
  font-weight: 600;
}

.bodyDiv {
  padding-bottom: 1rem;
}

.postDiv {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bottomButtons {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.standardBackground {
  background-color: none;
}

.compactBackground {
  background-color: white;
}

.compactBackground:hover {
  background-color: $mouse-hover-color;
}

.leftButtonCluster {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.postPadding {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  -webkit-box-orient: vertical;
}

.extraTitleBottomPadding {
  padding-bottom: 0.5rem;
}

.lockCardStyle {
  background-color: white;
}

.fixedHeightContainer {
  height: calc(100dvh - 3.5rem);
  overflow-y: scroll;
  overscroll-behavior: none;
}
</style>
