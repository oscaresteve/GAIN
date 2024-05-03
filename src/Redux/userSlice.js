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
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      const userAllTrainingsDataSnap = await getUserAllTrainings(email);
      if (userAllTrainingsDataSnap !== false) {
        dispatch(setUserAllTrainingsData(userAllTrainingsDataSnap));
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchUserTrainingDayData = (email) => {
  return async (dispatch, getState) => {
    try {
      dispatch(fetchUserAllTrainingsData(email));
      const state = getState();
      const userAllTrainingsData = state.user.userAllTrainingsData;
      const userTrainingDayDataSnap = await getUserTrainingDay(email);
      if (userTrainingDayDataSnap) {
        dispatch(setUserTrainingDayData(userTrainingDayDataSnap));
      } else {
        const userTrainingPrimaryData = userAllTrainingsData?.find(
          (userTrainingData) => userTrainingData.primary === true
        );
        if (userTrainingPrimaryData) {
          await newUserTrainingDay(email, userTrainingPrimaryData);
          const newUserTrainingDayDataSnap = await getUserTrainingDay(email);
          dispatch(setUserTrainingDayData(newUserTrainingDayDataSnap));
        } else {
          // No hay training marcado como primario
        }
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

export const setUserTrainingPrimary = (userTrainingName) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const userData = state.user.userData;
      const userAllTrainingsData = state.user.userAllTrainingsData;
      const newUserAllTrainingsData = userAllTrainingsData.map(
        (userTrainingData) => {
          if (userTrainingData.trainingName === userTrainingName) {
            return { ...userTrainingData, primary: true };
          } else {
            return { ...userTrainingData, primary: false };
          }
        }
      );
      newUserAllTrainingsData.map((userTrainingData) => {
        dispatch(saveUserTrainingData(userData.email, userTrainingData));
      });
    } catch (error) {
      console.error(error);
    }
  };
};

export const clearUserSession = () => {
  return async (dispatch) => {
    try {
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem("userAllTrainingsData");
      await AsyncStorage.removeItem("userTrainingDayData");
      // Add any other keys you have stored in AsyncStorage related to the user session

      // Then dispatch logOutUser to reset the Redux state
      dispatch(logOutUser());
    } catch (error) {
      console.error("Error clearing user session:", error);
    }
  };
};

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    userAllTrainingsData: null,
    userTrainingDayData: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUserAllTrainingsData: (state, action) => {
      state.userAllTrainingsData = action.payload;
    },
    setUserTrainingDayData: (state, action) => {
      state.userTrainingDayData = action.payload;
    },
    logOutUser: (state) => {
      state.userData = null;
      state.userAllTrainingsData = null;
      state.userTrainingDayData = null;
    },
  },
});

export const {
  setUserData,
  setUserAllTrainingsData,
  setUserTrainingDayData,
  logOutUser,
} = userSlice.actions;
export const selectUserData = (state) => state.user.userData;
export const selectUserAllTrainingsData = (state) =>
  state.user.userAllTrainingsData;
export const selectUserTrainingDayData = (state) =>
  state.user.userTrainingDayData;
export default userSlice.reducer;
