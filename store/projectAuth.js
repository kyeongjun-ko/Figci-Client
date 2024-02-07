import { create } from "zustand";
import { devtools } from "zustand/middleware";

const authStore = set => {
  return {
    auth: {
      code: null,
      state: "figci",
    },
    setAuth: tokenQueryObject => {
      set(state => {
        state.auth = {
          ...state.auth,
          ...tokenQueryObject,
        };

        return state;
      });
    },
    clearAuth: () => {
      return set(state => {
        state.auth = {
          code: null,
          state: "figci",
        };

        return state;
      });
    },
  };
};

const useAuthStore = create(devtools(authStore));

export default useAuthStore;
