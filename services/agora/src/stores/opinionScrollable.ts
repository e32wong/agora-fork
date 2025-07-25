import { defineStore, storeToRefs } from "pinia";
import type { OpinionItem, VotingOption } from "src/shared/types/zod";
import type { CommentFilterOptions } from "src/utils/component/opinion";
import { ref } from "vue";
import { useAuthenticationStore } from "./authentication";
import { useNotify } from "src/utils/ui/notify";

export const useOpinionScrollableStore = defineStore(
  "opinionScrollable",
  () => {
    const opinionItemListFull = ref<OpinionItem[]>([]);
    const opinionItemListPartial = ref<OpinionItem[]>([]);

    const hasMore = ref(true);

    const { isLoggedIn } = storeToRefs(useAuthenticationStore());
    const { showNotifyMessage } = useNotify();

    function loadMore() {
      const endSliceIndex = Math.min(
        opinionItemListPartial.value.length + 10,
        opinionItemListFull.value.length
      );

      if (endSliceIndex == opinionItemListFull.value.length) {
        hasMore.value = false;
      }

      const slicedList = opinionItemListFull.value.slice(
        opinionItemListPartial.value.length,
        endSliceIndex
      );

      opinionItemListPartial.value =
        opinionItemListPartial.value.concat(slicedList);
    }

    function setupOpinionlist(
      opinionListFull: OpinionItem[],
      opinionSlugId: string
    ) {
      opinionItemListPartial.value = [];
      opinionItemListFull.value = opinionListFull;
      hasMore.value = true;

      if (opinionSlugId.length > 0) {
        // Search for the specific opinion and move it to the front of list
        let moveIndex = 0;
        for (const [index, val] of opinionItemListFull.value.entries()) {
          if (val.opinionSlugId == opinionSlugId) {
            moveIndex = index;
            break;
          }
        }

        if (moveIndex > 0) {
          opinionItemListFull.value.unshift(
            opinionItemListFull.value.splice(moveIndex, 1)[0]
          );
        }
      }

      loadMore();
    }

    function detectOpinionFilterBySlugId(
      commentSlugId: string,
      commentItemsNew: OpinionItem[],
      commentItemsDiscover: OpinionItem[],
      commentItemsModerated: OpinionItem[],
      commentItemsHidden: OpinionItem[]
    ): CommentFilterOptions | "not_found" {
      for (const commentItem of commentItemsDiscover) {
        if (commentItem.opinionSlugId == commentSlugId) {
          return "discover";
        }
      }
      for (const commentItem of commentItemsNew) {
        if (commentItem.opinionSlugId == commentSlugId) {
          return "new";
        }
      }

      for (const commentItem of commentItemsModerated) {
        if (commentItem.opinionSlugId == commentSlugId) {
          return "moderated";
        }
      }

      // TODO: not sure about this if
      if (!isLoggedIn.value) {
        showNotifyMessage("This opinion has been removed by the moderators");
        return "discover";
      } else {
        for (const commentItem of commentItemsHidden) {
          if (commentItem.opinionSlugId == commentSlugId) {
            return "hidden";
          }
        }
      }

      return "not_found";
    }

    function updateOpinionVote(opinionSlugId: string, voteType: VotingOption) {
      const updateOpinionItem = (opinionItem: OpinionItem) => {
        if (opinionItem.opinionSlugId === opinionSlugId) {
          switch (voteType) {
            case "agree":
              opinionItem.numAgrees = opinionItem.numAgrees + 1;
              break;
            case "disagree":
              opinionItem.numDisagrees = opinionItem.numDisagrees + 1;
              break;
            case "pass":
              opinionItem.numPasses = opinionItem.numPasses + 1;
              break;
          }
        }
        return opinionItem;
      };

      opinionItemListPartial.value =
        opinionItemListPartial.value.map(updateOpinionItem);
    }

    function cancelOpinionVote(
      opinionSlugId: string,
      originalVote: VotingOption
    ) {
      const updateOpinionItem = (opinionItem: OpinionItem) => {
        if (opinionItem.opinionSlugId === opinionSlugId) {
          switch (originalVote) {
            case "agree":
              opinionItem.numAgrees = opinionItem.numAgrees - 1;
              break;
            case "disagree":
              opinionItem.numDisagrees = opinionItem.numDisagrees - 1;
              break;
            case "pass":
              opinionItem.numPasses = opinionItem.numPasses - 1;
              break;
          }
        }
        return opinionItem;
      };

      opinionItemListPartial.value =
        opinionItemListPartial.value.map(updateOpinionItem);
    }

    return {
      setupOpinionlist,
      loadMore,
      detectOpinionFilterBySlugId,
      updateOpinionVote,
      cancelOpinionVote,
      opinionItemListPartial,
      hasMore,
    };
  }
);
