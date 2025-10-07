import { boot } from "quasar/wrappers";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { queryClient } from "src/utils/query/client";

export default boot(({ app }) => {
  app.use(VueQueryPlugin, {
    queryClient,
  });
});
