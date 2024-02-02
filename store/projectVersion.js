import { create } from "zustand";

const useProjectVersionStore = create(set => {
  return {
    versionInformation: {
      byDates: {},
      allDates: [],
    },
    setVersion: versionList => {
      versionList.forEach(version => {
        const { id, created_at: createdAt, label } = version;

        const createdDate = createdAt.slice(0, 10);
        const createdTime = createdAt.slice(11, 16);

        return set(state => {
          if (!state.versionInformation.byDates[createdDate]) {
            state.versionInformation.byDates[createdDate] = [];
          }

          state.versionInformation = {
            ...state.versionInformation,
            byDates: {
              ...state.versionInformation.byDates,
              [createdDate]: {
                ...state.versionInformation.byDates[createdDate],
                [id]: { label: label || createdTime },
              },
            },
            allDates: Array.from(
              new Set([...state.versionInformation.allDates, createdDate]),
            ),
          };

          return state.versionInformation;
        });
      });
    },
    clearVersion: () => {
      return set(state => {
        state.versionInformation = {
          byDates: {},
          allDates: [],
        };

        return state.versionInformation;
      });
    },
  };
});

export default useProjectVersionStore;
