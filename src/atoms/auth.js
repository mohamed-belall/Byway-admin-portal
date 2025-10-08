import { atom } from "jotai";

export const authAtom = atom({
  isAuthenticated: !!localStorage.getItem("token"),
  // user: null,
  token: localStorage.getItem("token") || null,
  // role: localStorage.getItem("role") || null,
});

export const loadingAtom = atom(false);
