<template>
  <OnboardingLayout>
    <template #body><DefaultImageExample /> </template>

    <template #footer>
      <StepperLayout
        :submit-call-back="goToNextRoute"
        :current-step="4"
        :total-steps="5"
        :enable-next-button="isValidUsername"
        :show-next-button="true"
        :show-loading-button="isSubmitButtonLoading"
      >
        <template #header>
          <InfoHeader
            title="Choose your username"
            description=""
            icon-name="mdi-account-circle"
          />
        </template>

        <template #body>
          <div class="container">
            <div>How do you want to appear in Agora?</div>

            <UsernameChange
              :show-submit-button="false"
              @is-valid-username="(value: boolean) => (isValidUsername = value)"
              @user-name="(value: string) => (userName = value)"
            />
          </div>
        </template>
      </StepperLayout>
    </template>
  </OnboardingLayout>
</template>

<script setup lang="ts">
import StepperLayout from "src/components/onboarding/StepperLayout.vue";
import InfoHeader from "src/components/onboarding/InfoHeader.vue";
import { useBackendAccountApi } from "src/utils/api/account";
import UsernameChange from "src/components/account/UsernameChange.vue";
import { ref } from "vue";
import { useUserStore } from "src/stores/user";
import { storeToRefs } from "pinia";
import OnboardingLayout from "src/layouts/OnboardingLayout.vue";
import DefaultImageExample from "src/components/onboarding/backgrounds/DefaultImageExample.vue";
import { useNotify } from "src/utils/ui/notify";
import { useRouter } from "vue-router";

const { submitUsernameChange } = useBackendAccountApi();

const isValidUsername = ref(true);
const userName = ref("");

const { profileData } = storeToRefs(useUserStore());

const { showNotifyMessage } = useNotify();

const isSubmitButtonLoading = ref(false);

const router = useRouter();

async function goToNextRoute() {
  isSubmitButtonLoading.value = true;
  const response = await submitUsernameChange(
    userName.value,
    profileData.value.userName
  );
  if (response.status == "success") {
    await router.push({ name: "/onboarding/step5-preferences/" });
  } else {
    showNotifyMessage("Username is already in use");
  }
  isSubmitButtonLoading.value = false;
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
