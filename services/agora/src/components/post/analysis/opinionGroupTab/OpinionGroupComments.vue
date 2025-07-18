<template>
  <div class="opinion-group-comments">
    <div class="header-flex-style">
      <h2 class="title">
        Opinions <span class="count">{{ itemList.length }}</span>
      </h2>

      <div class="group-selector">
        <q-btn
          flat
          round
          dense
          icon="mdi-chevron-left"
          @click="navigateToPreviousMode"
        />
        <span class="group-name">{{ currentModeName }}</span>
        <q-btn
          flat
          round
          dense
          icon="mdi-chevron-right"
          @click="navigateToNextMode"
        />
      </div>
    </div>

    <div v-if="itemList.length === 0" class="no-comments">
      No opinions available for this group.
    </div>

    <div v-else>
      <ConsensusItem
        v-for="comment in itemList"
        :key="comment.opinionSlugId"
        :conversation-slug-id="props.conversationSlugId"
        :opinion-slug-id="comment.opinionSlugId"
        :description="comment.opinion"
        :num-agree="getActiveVotes(comment).numAgrees"
        :num-pass="0"
        :num-disagree="getActiveVotes(comment).numDisagrees"
        :num-participants="getActiveVotes(comment).numUsers"
        :opinion-item="comment"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { OpinionItem } from "src/shared/types/zod";
import type { ExtendedConversationPolis, PolisKey } from "src/shared/types/zod";
import ConsensusItem from "../consensusTab/ConsensusItem.vue";

const props = defineProps<{
  conversationSlugId: string;
  itemList: OpinionItem[];
  currentClusterTab: PolisKey;
  polis: ExtendedConversationPolis;
}>();

const displayMode = ref<"current" | "all_other_groups" | "all_others">(
  "current"
);

watch(
  () => props.currentClusterTab,
  () => {
    displayMode.value = "current";
  }
);

function getActiveVotes(comment: OpinionItem) {
  const currentClusterStats = comment.clustersStats.find(
    (cv) => cv.key === props.currentClusterTab
  );
  const allOthersClustersStats = comment.clustersStats.filter(
    (clusterStats) => clusterStats.key !== props.currentClusterTab
  );
  switch (displayMode.value) {
    case "current":
      return (
        currentClusterStats || {
          numAgrees: 0,
          numDisagrees: 0,
          // numPass: 0,
          numUsers: 0,
        }
      );
    case "all_other_groups":
      return {
        numAgrees: Object.values(allOthersClustersStats).reduce(
          (sum, clusterStats) => sum + clusterStats.numAgrees,
          0
        ),
        numDisagrees: Object.values(allOthersClustersStats).reduce(
          (sum, clusterStats) => sum + clusterStats.numDisagrees,
          0
        ),
        numUsers: Object.values(allOthersClustersStats).reduce(
          (sum, clusterStats) => sum + clusterStats.numUsers,
          0
        ),
      };
    case "all_others":
      return {
        numAgrees:
          comment.numAgrees -
          (currentClusterStats !== undefined
            ? currentClusterStats.numAgrees
            : 0),
        numDisagrees:
          comment.numDisagrees -
          (currentClusterStats !== undefined
            ? currentClusterStats.numDisagrees
            : 0),
        numUsers:
          comment.numParticipants -
          (currentClusterStats !== undefined
            ? currentClusterStats.numUsers
            : 0),
      };
  }
}

const currentModeName = computed(() => {
  return displayMode.value === "current"
    ? "This group"
    : displayMode.value === "all_others"
      ? "All others"
      : "All other groups";
});

const toggleNextMode = () => {
  displayMode.value =
    displayMode.value === "current"
      ? "all_other_groups"
      : displayMode.value === "all_other_groups"
        ? "all_others"
        : "current";
};

const togglePreviousMode = () => {
  displayMode.value =
    displayMode.value === "current"
      ? "all_others"
      : displayMode.value === "all_other_groups"
        ? "current"
        : "all_other_groups";
};

const navigateToPreviousMode = togglePreviousMode;
const navigateToNextMode = toggleNextMode;
</script>

<style lang="scss" scoped>
.opinion-group-comments {
  padding: 1rem 0;
}

.title {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  color: #434149;
}

.count {
  font-size: 0.9rem;
  color: #9a97a4;
  margin-left: 0.5rem;
}

.group-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.group-name {
  font-size: 0.9rem;
  font-weight: 500;
}

.no-comments {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.header-flex-style {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
}
</style>
