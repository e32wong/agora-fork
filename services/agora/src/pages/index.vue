<template>
  <DrawerLayout
    :general-props="{
      addGeneralPadding: false,
      addBottomPadding: false,
      enableFooter: true,
      enableHeader: true,
      reducedWidth: false,
    }"
  >
    <template #header>
      <DefaultMenuBar
        :has-menu-button="true"
        :has-back-button="false"
        :has-close-button="false"
        :has-login-button="true"
        :fixed-height="false"
      >
        <template #middle>
          <img
            v-if="drawerBehavior == 'mobile'"
            :src="agoraLogo"
            class="agoraLogoStyle"
          />
        </template>
      </DefaultMenuBar>

      <WidthWrapper :enable="true">
        <div class="tabCluster">
          <div class="tabItem" @click="selectedTab('following')">
            <ZKTab
              :text="isLoggedIn ? 'Following' : 'Popular'"
              :is-highlighted="currentHomeFeedTab === 'following'"
              :should-underline-on-highlight="false"
            />
          </div>

          <div class="tabItem" @click="selectedTab('new')">
            <ZKTab
              text="New"
              :is-highlighted="currentHomeFeedTab === 'new'"
              :should-underline-on-highlight="false"
            />
          </div>
        </div>
      </WidthWrapper>
    </template>

    <div class="container">
      <CompactPostList />
    </div>

    <NewPostButtonWrapper />
  </DrawerLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import CompactPostList from "src/components/feed/CompactPostList.vue";
import DefaultMenuBar from "src/components/navigation/header/DefaultMenuBar.vue";
import WidthWrapper from "src/components/navigation/WidthWrapper.vue";
import NewPostButtonWrapper from "src/components/post/NewPostButtonWrapper.vue";
import ZKTab from "src/components/ui-library/ZKTab.vue";
import DrawerLayout from "src/layouts/DrawerLayout.vue";
import { useAuthenticationStore } from "src/stores/authentication";
import type { HomeFeedSortOption} from "src/stores/homeFeed";
import { useHomeFeedStore } from "src/stores/homeFeed";
import { useNavigationStore } from "src/stores/navigation";

const agoraLogo = process.env.VITE_PUBLIC_DIR + "/images/icons/agora-wings.svg";

const { drawerBehavior } = storeToRefs(useNavigationStore());

const { currentHomeFeedTab } = storeToRefs(useHomeFeedStore());
const { isLoggedIn } = storeToRefs(useAuthenticationStore());

function selectedTab(tab: HomeFeedSortOption) {
  window.scrollTo({ top: 0, behavior: "smooth" });
  currentHomeFeedTab.value = tab;
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.agoraLogoStyle {
  width: 2rem;
  height: 2rem;
}

.tabCluster {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  font-weight: 600;
  font-size: 1rem;
  padding-bottom: 0.8rem;
}

.tabItem {
  min-width: 8rem;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 15px;
}

.tabItem:hover {
  cursor: pointer;
}
</style>
