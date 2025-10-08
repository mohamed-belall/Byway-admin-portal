import { atom } from "jotai";


export const instructorsAtom = atom({
  items: [],
  pageIndex: 1,
  pageSize: 8,
  totalCount: 0,
  loading: false,
  error: null,
});

export const instructorFiltersAtom = atom({
  search: null,
  pageIndex: 1,
  pageSize: 5,
});


export const searchAtom = atom("");


export const deleteDialogAtom = atom({
  open: false,
  instructorId: null,
  instructorName: null,
  loading: false,
  error: null,
});



export const instructorFormAtom = atom({
  open: false,
  mode: "add", // 'add' or 'edit'
  data: {
    bio: null,
    fullName: null,
    id: null,
    jobTitle: null,
    profilePictureURL: null,
    rate: null
  },
  loading: false,
  error: null,
});


