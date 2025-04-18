import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthenticationStore = defineStore("authentication", () => {
  const verificationPhoneNumber = ref("");
  const verificationDefaultCallingCode = ref("");
  const isAuthenticated = ref(false);
  const isAuthInitialized = ref(false);

  return {
    isAuthenticated,
    verificationPhoneNumber,
    verificationDefaultCallingCode,
    isAuthInitialized,
  };
});
