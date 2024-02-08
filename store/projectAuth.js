import { create } from "zustand";

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

const useAuthStore = create(authStore);

export default useAuthStore;
