<template>
  <div>
    <AnalysisSectionWrapper>
      <template #header>
        <AnalysisTitleHeader
          :show-star-in-title="false"
          title="What do most people agree on?"
        >
          <template #action-button>
            <div @click="switchTab()">
              <AnalysisActionButton type="viewMore" />
            </div>
          </template>
        </AnalysisTitleHeader>
      </template>

      <template #body>
        <ConsensusItem
          v-for="consensusItem in compactMode ? itemList.slice(0, 3) : itemList"
          :id="consensusItem.id"
          :key="consensusItem.description"
          :description="consensusItem.description"
          :num-agree="consensusItem.totalNumAgree"
          :num-pass="consensusItem.totalNumPass"
          :num-disagree="consensusItem.totalNumDisagree"
          :num-no-vote="consensusItem.totalNumNoVote"
        />
      </template>
    </AnalysisSectionWrapper>
  </div>
</template>

<script setup lang="ts">
import AnalysisSectionWrapper from "../common/AnalysisSectionWrapper.vue";
import AnalysisTitleHeader from "../common/AnalysisTitleHeader.vue";
import AnalysisActionButton from "../common/AnalysisActionButton.vue";
import ConsensusItem from "../consensusTab/ConsensusItem.vue";
import { OpinionConsensusItem } from "src/utils/component/analysis/analysisTypes";
import { ShortcutItem } from "src/utils/component/analysis/shortcutBar";

defineProps<{
  itemList: OpinionConsensusItem[];
  compactMode: boolean;
}>();

const currentTab = defineModel<ShortcutItem>();

function switchTab() {
  currentTab.value = "Majority";
}
</script>

<style lang="scss" scoped></style>
