import { create } from "zustand";
import { devtools } from "zustand/middleware";

const pageStore = set => {
  return {
    byPages: {},
    allPages: [],
    setPages: pageList => {
      const pageIds = [];

      pageList.forEach(item => {
<<<<<<< HEAD
        const { pageId, pageName } = item;

        pageIds.push({ [pageId]: pageName });
=======
        const { pageId, name, _id } = item;

        pageIds.push(_id);
>>>>>>> ✨ [Feat] 비교 선택 가능한 페이지 상태 정규화

        set(state => {
          state.byPages = {
            ...state.byPages,
<<<<<<< HEAD
            [pageId]: {
              name: pageName,
=======
            [_id]: {
              name,
>>>>>>> ✨ [Feat] 비교 선택 가능한 페이지 상태 정규화
              node_id: pageId,
            },
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
