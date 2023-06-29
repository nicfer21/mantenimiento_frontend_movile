import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Agenda, LocaleConfig } from "react-native-calendars";

import colors from "../../src/colors";
import { ruta } from "../../src/config";

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};

const CalendarScreen = () => {
  const [items, setItems] = useState({});

  const loadItems = async (day) => {
    const token = await AsyncStorage.getItem("@token");

    setTimeout(async () => {
      for (let i = -15; i < 15; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!items[strTime]) {
          items[strTime] = [];

          try {
            const { data } = await axios.get(
              `${ruta}/maintenanceorder/calendar/${strTime}`,
              {
                headers: { token: token },
              }
            );

            data.map((dato) => {
              items[strTime].push({
                title: dato.title,
                time: dato.start + " - " + dato.finish,
                state: dato.stepValue,
                worker: dato.longname,
              });
            });
            console.log(data);
          } catch (error) {
            console.log(error);
          }
        }
      }
      const newItems = {};
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 100);
  };

  LocaleConfig.locales["es"] = {
    monthNames: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Marzo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    monthNamesShort: [
      "Ene.",
      "Feb.",
      "Mar.",
      "Abr.",
      "May.",
      "Jun.",
      "Jul.",
      "Ago.",
      "Sep.",
      "Oct.",
      "Nov.",
      "Dic.",
    ],
    dayNames: [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sabado",
    ],
    dayNamesShort: ["Dom.", "Lun.", "Mar.", "Mie.", "Jue.", "Vie.", "Sab."],
    today: "Aujourd'hui",
  };

  LocaleConfig.defaultLocale = "es";

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <View style={{ margin: 10 }}>
          <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
          <Text>Horario : {item.time}</Text>
          <Text>Encargado : {item.worker}</Text>
          {item.state == 1 ? (
            <Text
              style={{
                textAlign: "center",
                color: colors.danger,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              En proceso
            </Text>
          ) : (
            <Text
              style={{
                textAlign: "center",
                color: colors.success,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Completado
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        renderItem={renderItem}
      />
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
});
