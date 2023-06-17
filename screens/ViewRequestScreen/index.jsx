import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ruta } from "../../src/config.js";
import colors from "../../src/colors";

const RequestRow = ({ id, date, state, machine }) => {
  const [showDate, setShowDate] = useState({
    fecha: "---",
    hora: "000",
  });
  useEffect(() => {
    const getDate = () => {
      const fechaHora = new Date(date);
      const fecha = fechaHora.toLocaleDateString();
      const hora = fechaHora.toLocaleTimeString();
      setShowDate({
        fecha: fecha,
        hora: hora,
      });
    };
    getDate();
  }, []);

  return (
    <View>
      <Text>{id}</Text>
      <Text>{machine}</Text>
      <Text>{showDate.fecha}</Text>
      <Text>{showDate.hora}</Text>
      <Text>{state}</Text>
    </View>
  );
};

const RequestScreen = () => {
  const [token, setToken] = useState("");
  const [data, setData] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");
        setToken(token);
        const data = await axios.get(`${ruta}/maintenancerequest/`, {
          headers: {
            token: token,
          },
        });
        setData(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.viewRequest}>
        <Text style={styles.titulo}>Buscar solicitudes</Text>
        <View>
          {data &&
            data.map((item) => {
              return (
                <RequestRow
                  id={item.idMaintenanceRequest}
                  date={item.requestDate}
                  state={item.requestState}
                  machine={item.idMachine}
                  key={item.idMaintenanceRequest}
                />
              );
            })}
        </View>
      </View>
    </View>
  );
};

export default RequestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  viewRequest: {
    padding: 5,
    margin: 5,
  },
  titulo: {
    fontSize: 15,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
  },
});
