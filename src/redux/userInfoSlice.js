import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "./apiRequest";

export const getProfilePageData = createAsyncThunk(
  'userInfo/getProfilePageData', 
  async () => {
      const response = await apiRequest("/profile/get")
    return response   
    }  
)

/* Хранятся данные о пользователе: 
имя, email, массивы заметок, событий, устройства, история математического калькулятора, галерея генератора картинок */
export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    name: "",
    email: "",
    notesCount: 0,
    notes: [],
    events: [],
    devices: [],
    math: [],
    imgGallery: [],
  },
  reducers: {
    saveName: (state, action) => {
      state.name = action.payload;
    },
    saveEmail: (state, action) => {
      state.email = action.payload;
    },
    setNotesCount: (state, action) => {
      state.notesCount += action.payload;
    },
    saveNote: (state, action) => {
      let newNote = action.payload;
      state.notes = [
        ...state.notes.filter((item) => item.date !== newNote.date),
        newNote,
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    saveEvent: (state, action) => {
      let newEvent = action.payload;
      state.events = [
        ...state.events.filter((item) => item.id !== newEvent.id),
        newEvent,
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    saveDevice: (state, action) => {
      let newDevice = action.payload;
      state.devices = newDevice.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    },
    saveMath: (state, action) => {
      let newMath = action.payload;
      state.math = [
        ...state.math.filter((item) => item.date !== newMath.date),
        newMath,
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    saveImgToGallery: (state, action) => {
      const newImg = action.payload;
      state.imgGallery = [
        ...state.imgGallery.filter((item) => item.date !== newImg.date),
        newImg,
      ].sort((a, b) => parseInt(b.date) - parseInt(a.date));
    },
    clearNotes: (state) => {
      state.notes = [];
      state.notesCount = 0;
    },
    clearEvents: (state) => {
      state.events = [];
    },
    clearMath: (state) => {
      state.math = [];
    },
    clearImgGallery: (state) => {
      state.imgGallery = [];
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter((el) => el.date !== action.payload);
    },
    deleteDevice: (state, action) => {
      state.devices = state.devices.filter((el) => el._id !== action.payload);
    },
    deleteEvent: (state, action) => {
      state.events = state.events.filter((el) => el.id !== action.payload);
    },
    deleteMath: (state, action) => {
      state.math = state.math.filter((el) => el.date !== action.payload);
    },
    deleteImgFromGallery: (state, action) => {
      state.imgGallery = state.imgGallery.filter(
        (el) => el._id !== action.payload
      );
    },
    updateNote: (state, action) => {
      let newNote = action.payload;
      state.notes = [
        ...state.notes.filter((el) => el.date !== action.payload.date),
        newNote,
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
  },
  extraReducers (builder) {
    builder.addCase(getProfilePageData.fulfilled, (state, action) => {
        state.name = action.payload.name
      state.email = action.payload.email
      state.notes = action.payload.notes
      state.events = action.payload.events
      state.notesCount = action.payload.notesCount
    })
      

  }
});

export const {
  saveName,
  saveEmail,
  setNotesCount,
  saveNote,
  saveDevice,
  saveEvent,
  saveMath,
  saveImgToGallery,
  clearNotes,
  clearEvents,
  clearMath,
  clearImgGallery,
  deleteNote,
  deleteDevice,
  deleteEvent,
  deleteMath,
  deleteImgFromGallery,
  updateNote,
} = userInfoSlice.actions;
