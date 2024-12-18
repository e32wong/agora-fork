<template>
  <div>
    <div class="container">
      <div v-if="isAuthenticated">
        <SettingsSection :settings-item-list="accountSettings" title="Account" />
      </div>

      <SettingsSection :settings-item-list="aboutSettings" title="About" />

      <div v-if="isAuthenticated">
        <SettingsSection :settings-item-list="supportSettings" title="Support" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import SettingsSection from "src/components/settings/SettingsSection.vue";
import { useAuthenticationStore } from "src/stores/authentication";
import { usePostStore } from "src/stores/post";
import { useBackendAuthApi } from "src/utils/api/auth";
import { type SettingsInterface } from "src/utils/component/settings/settings";
import { getWebCryptoStore } from "src/utils/crypto/store";
import { useDialog } from "src/utils/ui/dialog";
import { useRouter } from "vue-router";

const { isAuthenticated } = storeToRefs(useAuthenticationStore());
const { showDeleteAccountDialog } = useDialog();
const { loadPostData } = usePostStore();

const backendAuth = useBackendAuthApi();
const router = useRouter();

async function logoutCleanup() {
  const cryptoStore = await getWebCryptoStore();
  cryptoStore.keystore.clearStore();
  isAuthenticated.value = false;
  await loadPostData(false);
  router.push({ name: "default-home-feed" });
}

async function logoutRequested() {
  await backendAuth.logout();
  logoutCleanup();
}

const accountSettings: SettingsInterface[] = [
  {
    icon: "mdi-logout",
    label: "Log out",
    action: logoutRequested,
    routeName: "",
    isWarning: false
  },
];

const aboutSettings: SettingsInterface[] = [
  {
    icon: "mdi-key",
    label: "Privacy policy",
    action: () => { },
    routeName: "privacy",
    isWarning: false
  },
  {
    icon: "mdi-file-document",
    label: "Terms of service",
    action: () => { },
    routeName: "terms",
    isWarning: false
  },
];

const supportSettings: SettingsInterface[] = [
  {
    icon: "mdi-delete",
    label: "Delete Account",
    action: processDeleteAccount,
    routeName: "",
    isWarning: true
  },
];

function processDeleteAccount() {
  showDeleteAccountDialog(logoutCleanup);
}

</script>

<style scoped lang="scss">
.container {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 2rem;
}
</style>
