"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  userName: string;
  setUserName: (userName: string) => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userName: "",
      setUserName: (userName) => set({ userName }),
    }),
    {
      name: "flexv2-user-name",
      partialize: (state) => ({ userName: state.userName }),
    },
  ),
);
