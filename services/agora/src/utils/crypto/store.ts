import * as BrowserCrypto from "../crypto/ucan/implementation/browser.js";
import { type Implementation } from "./ucan/implementation.js";

// localForage instance for storing keys only
let webCryptoStore: Implementation | undefined = undefined;

export async function getWebCryptoStore(): Promise<Implementation> {
  if (webCryptoStore !== undefined) {
    return webCryptoStore;
  }
  webCryptoStore = await BrowserCrypto.implementation({
    storeName: "agora-keys",
  });
  return webCryptoStore;
}
