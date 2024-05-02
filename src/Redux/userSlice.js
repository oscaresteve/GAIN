import { createSlice } from "@reduxjs/toolkit";
import {
  getUserData,
  getUserAllTrainings,
  getUserTrainingDay,
  newUserTrainingDay,
  deleteUserTraining,
  setUserTraining,
  setUserTrainingDay,
} from "../database/Database";

export const fetchUserData = (email) => {
  return async (dispatch) => {
    try {
      const userDataSnap = await getUserData(email);
      if (userDataSnap !== false) {
        dispatch(setUserData(userDataSnap));
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchUserAllTrainingsData = (email) => {
  return async (dispatch) => {
    try {
      const userAllTrainigsDataSnap = await getUserAllTrainings(email);
      if (userAllTrainigsDataSnap !== false) {
        dispatch(setUserAllTrainingsData(userAllTrainigsDataSnap));
      } else {
      }
    } catch (error) {}
  };
};

export const fetchUserTrainingDayData = (email, userTrainingName) => {
  return async (dispatch) => {
    try {
      const userTrainingDayDataSnap = await getUserTrainingDay(email);
      if (userTrainingDayDataSnap !== false) {
        dispatch(setUserTrainingDayData(userTrainingDayDataSnap));
      } else {
        await newUserTrainingDay(email, userTrainingName);
        const newUserTrainingDaySnap = await getUserTrainingDay(email);
        dispatch(setUserTrainingDayData(newUserTrainingDaySnap));
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const saveUserTrainingData = (email, userTrainingData) => {
  return async (dispatch) => {
    try {
      await setUserTraining(email, userTrainingData);
      dispatch(fetchUserAllTrainingsData(email));
    } catch (error) {
      console.error(error);
    }
  };
};

export const deleteUserTrainingData = (email, userTrainingName) => {
  return async (dispatch) => {
    try {
      await deleteUserTraining(email, userTrainingName);
      dispatch(fetchUserAllTrainingsData(email));
    } catch (error) {
      console.error(error);
    }
  };
};

export const setSetDone = (email, groupIndex, exerciseIndex, setIndex) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const newUserTrainingDayData = JSON.parse(
        JSON.stringify(state.user.userTrainingDayData)
      );
      newUserTrainingDayData.groups[groupIndex].exercises[exerciseIndex].sets[
        setIndex
      ].details.done = true;
      dispatch(setUserTrainingDayData(newUserTrainingDayData));
      await setUserTrainingDay(email, newUserTrainingDayData);
    } catch (error) {
      console.error(error);
    }
  };
};

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    userAllTrainigsData: null,
    userTrainingDayData: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUserAllTrainingsData: (state, action) => {
      state.userAllTrainigsData = action.payload;
    },
    setUserTrainingDayData: (state, action) => {
      state.userTrainingDayData = action.payload;
    },
  },
});

export const { setUserData, setUserAllTrainingsData, setUserTrainingDayData } =
  userSlice.actions;
export const selectUserData = (state) => state.user.userData;
export const selectUserAllTrainingsData = (state) =>
  state.user.userAllTrainigsData;
export const selectUserTrainingDayData = (state) =>
  state.user.userTrainingDayData;
export default userSlice.reducer;
