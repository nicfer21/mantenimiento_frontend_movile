import { Route, Routes, useNavigate } from "react-router-native";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect } from "react";

import AppBar from "../../components/AppBar";
import ButtonBar from "../../components/ButtonBar";
import { ruta } from "../../src/config.js";

import HomeScreen from "../../screens/HomeScreen";
import UserProfile from "../../screens/UserProfile";
import MachineScreen from "../../screens/MachineScreen";
import colors from "../../src/colors";

const RoutesComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const tryCon = setInterval(async () => {
      await validacionConeccion();
      console.log("Ready");
    }, 10000);

    const validacionConeccion = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");

        const rs = await axios.get(`${ruta}/prueba`, {
          headers: {
            token: token,
          },
          timeout: 5000,
        });
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
