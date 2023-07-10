import { Route, Routes, useNavigate } from "react-router-native";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";

import AppBar from "../../components/AppBar";
import ButtonBar from "../../components/ButtonBar";
import { ruta } from "../../src/config.js";

import HomeScreen from "../../screens/HomeScreen";
import UserProfile from "../../screens/UserProfile";
import MachineScreen from "../../screens/MachineScreen";
import RequestScreen from "../../screens/RequestScreen";
import ViewRequestScreen from "../../screens/ViewRequestScreen";
import ProcedureScreen from "../../screens/ProcedureScreen";
import CalendarScreen from "../../screens/CalendarScreen";
import OrderScreen from "../../screens/OrderScreen";
import ReportScreen from "../../screens/ReportScreen";
import ViewReportScreen from "../../screens/ViewReportScreen";

import colors from "../../src/colors";

const RoutesComponent = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  useEffect(() => {
    const tryCon = setInterval(async () => {
      await validacionConeccion();
    }, 10000);

    const validacionConeccion = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");
        setToken(token);
        const rs = await axios.get(`${ruta}/prueba`, {
          headers: {
            token: token,
          },
          timeout: 5000,
        });
        console.log("Ready");
        clearInterval(tryCon);
      } catch (error) {
        clearInterval(tryCon);
        Alert.alert("Error de coneccion", "Inicie session de nuevo");
        await AsyncStorage.clear();
        navigate("/");
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <AppBar />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/machine" element={<MachineScreen />} />
        <Route path="/setrequest" element={<RequestScreen />} />
        <Route path="/viewrequest" element={<ViewRequestScreen />} />
        <Route path="/procedure" element={<ProcedureScreen />} />
        <Route path="/calendar" element={<CalendarScreen />} />
        <Route path="/order" element={<OrderScreen />} />
        <Route path="/report/:idOrder" element={<ReportScreen />} />
        <Route path="/viewreport/" element={<ViewReportScreen />} />
      </Routes>
      <ButtonBar />
    </View>
  );
};

export default RoutesComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "space-between",
  },
});
