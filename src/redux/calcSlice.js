import { createSlice } from "@reduxjs/toolkit";
import { TYPESOFCALCULATION } from "../components/DateCalculator/constants";

/* Данные всех калькуляторов. Хранятся пока пользователь находится в разделе калькуляторов и переключается между ними. */
export const calcSlice = createSlice({
  name: "calc",
  initialState: {
    mathFormula: "",
    mathInput: "0",
    mathIsResult: true,
    mathLimit: false,
    dateType: TYPESOFCALCULATION.OWN,
    dateFrom: false,
    dateTo: false,
    dateCount: false,
    dateFormat: 0,
    savType: "choise",
    savStartDate: "",
    savFinalDate: "",
    savNeededSum: false,
    savPeriod: 0,
    savPeriodCount: false,
    savPeriodicity: 0,
    savPayment: false,
    textCalc: ''
  },
  reducers: {
    setFormula: (state, action) => {
      state.mathFormula = action.payload
    },
    setInput: (state, action) => {
      state.mathInput = action.payload
    },
    setIsResult: (state, action) => {
      state.mathIsResult = action.payload
    },
    setLimit: (state, action) => {
      state.mathLimit = action.payload
    },
    setDateType: (state, action) => {
      state.dateType = action.payload;
    },
    setDateFrom: (state, action) => {
      state.dateFrom = action.payload;
    },
    setDateTo: (state, action) => {
      state.dateTo = action.payload;
    },
    setDateCount: (state, action) => {
      state.dateCount = action.payload;
    },
    setDateFormat: (state, action) => {
      state.dateFormat = action.payload
    },
    setSavType: (state, action) => {
      state.savType = action.payload;
    },
    setSavStartDate: (state, action) => {
      state.savStartDate = action.payload;
    },
    setSavFinalDate: (state, action) => {
      state.savFinalDate = action.payload;
    },
    setSavNeededSum: (state, action) => {
      state.savNeededSum = action.payload;
    },
    setSavPayment: (state, action) => {
      state.savPayment = action.payload;
    },
    setSavPeriodCount: (state, action) => {
      state.savPeriodCount = action.payload;
    },
    setSavPeriod: (state, action) => {
      state.savPeriod = action.payload;
    },
    setSavPeriodicity: (state, action) => {
      state.savPeriodicity = action.payload;
    },
    setTextCalc: (state, action) => {
      state.textCalc = action.payload
    },
    // не используется, но пусть пока будет
    clearAll: (state) => {
        state.savPeriodicity = 0;
        state.savPeriod = 0;
        state.savPeriodCount = false;
        state.savPayment = false;
        state.savNeededSum = false;
        state.savFinalDate = "";
        state.savStartDate = "";
        state.savType = "choise";
        state.dateFormat = 0;
        state.dateCount = false;
        state.dateTo = false;
        state.dateType = TYPESOFCALCULATION.OWN;
        state.dateFrom = false;
        state.mathFormula = "";
        state.mathInput = "0";
        state.mathIsResult = true;
        state.mathLimit = false;
        state.textCalc = ''

    }
  },
});

export const {
  setDateCount,
  setDateFormat,
  setDateFrom,
  setSavFinalDate,
  setDateTo,
  setDateType,
  setFormula,
  setInput,
  setIsResult,
  setLimit,
  setSavPeriodCount,
  setSavPayment,
  setSavPeriod,
  setSavPeriodicity,
  setSavStartDate,
  setSavNeededSum,
  setSavType,
  setTextCalc,
  clearAll,

} = calcSlice.actions;
