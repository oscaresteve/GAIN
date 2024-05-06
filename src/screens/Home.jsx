import { View, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import TrainingDayView from "../components/TrainingDayView";
import StartTrainingView from "../components/StartTrainingDayView";
import FinishTrainingView from "../components/EndTrainingDayView";
import AppBar from "../components/AppBar";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUserTrainingDayData,
  selectUserData,
  fetchUserTrainingDayData,
} from "../Redux/userSlice";

export default function Home() {
  const dispatch = useDispatch();
  const userTrainingDayData = useSelector(selectUserTrainingDayData);
  const userData = useSelector(selectUserData);
  const [view, setView] = useState(null);

  useEffect(() => {
    if (userData) {
      dispatch(fetchUserTrainingDayData(userData?.email));
    }
  }, [userData]);

  useEffect(() => {
    if (userTrainingDayData) {
      if (userTrainingDayData.timeEnded) {
        setView(<FinishTrainingView />);
      } else if (userTrainingDayData.timeStarted) {
        setView(<TrainingDayView />);
      } else {
        setView(<StartTrainingView />);
      }
    }
  }, [userTrainingDayData]);

  return (
    <SafeAreaView className="flex-1">
      <AppBar />
      <View>{view}</View>
    </SafeAreaView>
  );
}
