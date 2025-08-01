<template>
  <DrawerLayout
    :general-props="{
      addGeneralPadding: false,
      addBottomPadding: true,
      enableFooter: false,
      enableHeader: true,
      reducedWidth: true,
    }"
  >
    <template #header>
      <DefaultMenuBar
        :has-back-button="true"
        :has-close-button="false"
        :has-login-button="false"
        :has-menu-button="false"
        :fixed-height="true"
      >
        <template #middle> Settings </template>
      </DefaultMenuBar>
    </template>

    <div class="container">
      <div v-if="isGuestOrLoggedIn">
        <SettingsSection :settings-item-list="accountSettings" />
      </div>

      <SettingsSection :settings-item-list="aboutSettings" />

      <div v-if="isGuestOrLoggedIn">
        <SettingsSection :settings-item-list="deleteAccountSettings" />
      </div>

      <div v-if="isLoggedIn">
        <SettingsSection :settings-item-list="logoutSettings" />
      </div>

      <div v-if="isLoggedIn && profileData.isModerator">
        <SettingsSection :settings-item-list="moderatorSettings" />
      </div>
    </div>
  </DrawerLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import DefaultMenuBar from "src/components/navigation/header/DefaultMenuBar.vue";
import SettingsSection from "src/components/settings/SettingsSection.vue";
import DrawerLayout from "src/layouts/DrawerLayout.vue";
import { useAuthenticationStore } from "src/stores/authentication";
import { useUserStore } from "src/stores/user";
import { useBackendAccountApi } from "src/utils/api/account";
import { useBackendAuthApi } from "src/utils/api/auth";
import { useAuthSetup } from "src/utils/auth/setup";
import type { SettingsInterface } from "src/utils/component/settings/settings";
import { useDialog } from "src/utils/ui/dialog";
import { useNotify } from "src/utils/ui/notify";
import { computed } from "vue";
import { useRouter } from "vue-router";

const { isGuestOrLoggedIn, isLoggedIn } = storeToRefs(useAuthenticationStore());
const { profileData } = storeToRefs(useUserStore());

const { showDeleteAccountDialog } = useDialog();

const { deleteUserAccount } = useBackendAccountApi();
const router = useRouter();
const { showNotifyMessage } = useNotify();
const { logoutRequested } = useAuthSetup();

const { updateAuthState } = useBackendAuthApi();

const deleteAccountLabel = computed(() =>
  isLoggedIn.value ? "Delete Account" : "Delete Guest Account"
);

const accountSettings: SettingsInterface[] = [
  {
    label: "Profile",
    action: () => {
      void router.push({ name: "/settings/account/profile/" });
    },
    style: "none",
  },
  {
    label: "Content Preference",
    action: () => {
      void router.push({ name: "/settings/account/content-preference/" });
    },
    style: "none",
  },
];

const aboutSettings: SettingsInterface[] = [
  {
    label: "Privacy Policy",
    action: () => {
      void router.push({ name: "/legal/privacy/" });
    },
    style: "none",
  },
  {
    label: "Terms of Service",
    action: () => {
      void router.push({ name: "/legal/terms/" });
    },
    style: "none",
  },
];

const logoutSettings: SettingsInterface[] = [
  {
    label: "Log Out",
    action: () => {
      void logoutRequested();
    },
    style: "warning",
  },
];

const moderatorSettings: SettingsInterface[] = [
  {
    label: "Moderator - Organization",
    action: () => {
      void router.push({
        name: "/settings/account/administrator/organization/",
      });
    },
    style: "none",
  },
];

const deleteAccountSettings: SettingsInterface[] = [
  {
    label: deleteAccountLabel.value,
    action: processDeleteAccount,
    style: "negative",
  },
];

function processDeleteAccount() {
  showDeleteAccountDialog(() => {
    void (async () => {
      try {
        await deleteUserAccount();
        await updateAuthState({ partialLoginStatus: { isKnown: false } });
        showNotifyMessage("Account deleted");
      } catch (e) {
        console.error("Failed to delete user account", e);
        showNotifyMessage("Oops! Account deletion failed. Please try again");
      }
    })();
  });
}
</script>

<style scoped lang="scss">
.container {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
</style>
