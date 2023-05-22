import { StyleSheet, Text, View } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import { ruta } from "../src/config.js";

import AppBar from "./AppBar/index.jsx";
import ButtonBar from "./ButtonBar/index.jsx";

const Main = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const obtenerData = async () => {
      try {
        const response = await axios.get(`${ruta}/machine`);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    obtenerData();
  }, []);

  return (
    <View style={styles.container}>
      <AppBar />
      <View>
        {data.map((machine) => {
          return <Text key={machine.idMachine}>{machine.idMachine}</Text>;
        })}
      </View>
      <ButtonBar />
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
