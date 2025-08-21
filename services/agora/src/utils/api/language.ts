import { api } from "boot/axios";
import { DefaultApiAxiosParamCreator, DefaultApiFactory } from "src/api";
import type { AxiosErrorResponse, AxiosSuccessResponse } from "./common";
import { useCommonApi } from "./common";
import { useNotify } from "../ui/notify";
import type { ApiV1UserLanguagePreferencesUpdatePostRequest } from "src/api";
import type { SupportedDisplayLanguageCodes } from "src/shared/languages";
import {
  zodLanguagePreferences,
  type LanguagePreferences as LanguagePreferencesData,
} from "src/shared/types/zod";

export function useBackendLanguageApi() {
  const {
    buildEncodedUcan,
    createRawAxiosRequestConfig,
    createAxiosErrorResponse,
  } = useCommonApi();

  const { showNotifyMessage } = useNotify();

  type FetchLanguagePreferencesSuccessResponse =
    AxiosSuccessResponse<LanguagePreferencesData>;
  type FetchLanguagePreferencesResponse =
    | FetchLanguagePreferencesSuccessResponse
    | AxiosErrorResponse;

  async function getLanguagePreferences({
    currentDisplayLanguage,
  }: {
    currentDisplayLanguage: SupportedDisplayLanguageCodes;
  }): Promise<FetchLanguagePreferencesResponse> {
    try {
      const { url, options } =
        await DefaultApiAxiosParamCreator().apiV1UserLanguagePreferencesGetPost(
          {
            currentDisplayLanguage,
          }
        );
      const encodedUcan = await buildEncodedUcan(url, options);
      const response = await DefaultApiFactory(
        undefined,
        undefined,
        api
      ).apiV1UserLanguagePreferencesGetPost(
        {
          currentDisplayLanguage,
        },
        createRawAxiosRequestConfig({ encodedUcan })
      );

      const parsed = zodLanguagePreferences.safeParse(response.data);

      if (!parsed.success) {
        throw new Error("Failed to parse language preferences");
      }

      return {
        status: "success",
        data: parsed.data,
      };
    } catch (e) {
      console.error("Failed to fetch language preferences:", e);
      // Don't show notification for language preference fetch failures
      // as this might be called on app initialization
      return createAxiosErrorResponse(e);
    }
  }

  type UpdateLanguagePreferencesSuccessResponse = AxiosSuccessResponse<void>;
  type UpdateLanguagePreferencesResponse =
    | UpdateLanguagePreferencesSuccessResponse
    | AxiosErrorResponse;

  async function updateLanguagePreferences({
    spokenLanguages,
    displayLanguage,
  }: LanguagePreferencesData): Promise<UpdateLanguagePreferencesResponse> {
    try {
      const params: ApiV1UserLanguagePreferencesUpdatePostRequest = {
        spokenLanguages: spokenLanguages,
        displayLanguage: displayLanguage,
      };

      const { url, options } =
        await DefaultApiAxiosParamCreator().apiV1UserLanguagePreferencesUpdatePost(
          params
        );
      const encodedUcan = await buildEncodedUcan(url, options);
      await DefaultApiFactory(
        undefined,
        undefined,
        api
      ).apiV1UserLanguagePreferencesUpdatePost(
        params,
        createRawAxiosRequestConfig({ encodedUcan })
      );

      return {
        status: "success",
        data: undefined,
      };
    } catch (e) {
      console.error("Failed to update language preferences:", e);
      showNotifyMessage("Failed to save language preferences");
      return createAxiosErrorResponse(e);
    }
  }

  return {
    getLanguagePreferences,
    updateLanguagePreferences,
  };
}
