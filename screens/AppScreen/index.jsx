import { Route, Routes, useNavigate } from "react-router-native";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect } from "react";

import AppBar from "../../components/AppBar";
import ButtonBar from "../../components/ButtonBar";
import { ruta } from "../../src/config.js";

const RoutesComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const tryCon = setInterval(() => {
      validacionConeccion();
      console.log("Ready");
    }, 10000);

    const validacionConeccion = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");

        if (token !== null) {
          const rs = await axios.get(`${ruta}/prueba`, {
            headers: {
              token: token,
            },
          });
        }
      } catch (error) {
        clearInterval(tryCon);
        Alert.alert("Error de coneccion", "Inicie session de nuevo");
        navigate("/");
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <AppBar />
      <Routes>
        <Route
          path="/"
          element={
            <View>
              <Text>Panel 1</Text>
              <Button
                title={"Click aca"}
                onPress={() => {
                  navigate("/app/mundo2");
                }}
              />
            </View>
          }
        />
        <Route
          path="/mundo2"
          element={
            <View>
              <Text>Panel 2</Text>
              <Button
                title={"Click aca"}
                onPress={() => {
                  navigate("/app/");
                }}
              />
              <Button
                title={"Cerrar sesion"}
                onPress={async () => {
                  await AsyncStorage.clear();
                  navigate("/");
                }}
              />
            </View>
          }
        />
      </Routes>
      <ButtonBar />
    </View>
  );
};

export default RoutesComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    flexDirection: "column",
    justifyContent: "space-between",
  },
});
