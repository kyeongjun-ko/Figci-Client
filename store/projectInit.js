import { create } from "zustand";
import { devtools } from "zustand/middleware";

const initStore = set => {
  return {
    status: {
      fileKey: null,
      beforeVersion: null,
      afterVersion: null,
      pageId: null,
    },
    setStatus: newStatus => {
      set(state => {
        state.status = {
          ...state.status,
          ...newStatus,
        };

        return state;
      });
    },
    clearPage: () => {
      return set(state => {
        state.status = {
          ...state.status,
          pageId: null,
        };

        return state;
      });
    },
    clearVersion: () => {
      return set(state => {
        state.status = {
          ...state.status,
          beforeVersion: null,
          afterVersion: null,
          pageId: null,
        };

        return state;
      });
    },
    clearProject: () => {
      return set(state => {
        state.status = {
          fileKey: null,
          beforeVersion: null,
          afterVersion: null,
          pageId: null,
        };

        return state;
      });
    },
  };
};

const usePageStatusStore = create(devtools(initStore));

export default usePageStatusStore;
