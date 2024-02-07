import { create } from "zustand";
import { devtools } from "zustand/middleware";

const pageStore = set => {
  return {
    byPages: {},
    allPages: [],
    setPages: pageList => {
      const pageIds = [];

      pageList.forEach(item => {
        const [pageId, pageName] = Object.entries(item)[0];

        pageIds.push({ [pageId]: pageName });

        set(state => {
          state.byPages = {
            ...state.byPages,
            [pageId]: pageName,
          };

          return state;
        });
      });

      set(state => {
        state.allPages = pageIds;

        return state;
      });
    },
  };
};

const usePageListStore = create(devtools(pageStore));

export default usePageListStore;
