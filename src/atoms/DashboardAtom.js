import { atom } from "jotai";

export const DashboardAtom = atom({
  instructorsCount: 0,
  studentsCount: 0,
  categoriesCount: 0,
  courseCount: 0,
  walletBalance: 37500,
  walletGrowth: 2.45,
  deposits: 108000,
});
