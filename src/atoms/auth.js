import { atom } from "jotai";

export const authAtom = atom({
  isAuthenticated: !!localStorage.getItem("token"),
 
  token: localStorage.getItem("token") || null,
  
});

export const loadingAtom = atom(false);
