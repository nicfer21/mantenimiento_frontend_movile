import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocation, useNavigate } from "react-router-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

import colors from "../../src/colors";

const ButtonLink = ({ to, title, icon }) => {
  const navigate = useNavigate();
  const styleLink =
    useLocation().pathname === to
      ? {
          color: colors.secondary[1],
          typeIcon: "sharp",
          fontW: "bold",
        }
      : {
          color: colors.grey[3],
          typeIcon: "outline",
          fontW: "normal",
        };

  const relocate = () => {
    navigate(to);
  };

  return (
    <TouchableOpacity onPress={relocate}>
      <View style={styles.button}>
        <Ionicons
          name={`${icon}-${styleLink.typeIcon}`}
          size={25}
          color={styleLink.color}
        />
        <Text
          style={{
            fontSize: 6,
            textAlign: "center",
            fontWeight: `${styleLink.fontW}`,
            color: `${styleLink.color}`,
          }}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const ButtonBar = () => {
  const [levelWork, setLevelWork] = useState(2);
  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("@token");
      const payload = jwtDecode(token);
      setLevelWork(payload.levelWork);
    };
    getToken();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <ButtonLink to={"/app/"} title={"Inicio"} icon={"home"} />
        <ButtonLink to={"/app/machine/"} title={"Maquinas"} icon={"cube"} />
        <ButtonLink
          to={"/app/setrequest/"}
          title={"Solicitar"}
          icon={"document"}
        />
        <ButtonLink
          to={"/app/viewrequest/"}
          title={"Solicitudes"}
          icon={"documents"}
        />
        <ButtonLink
          to={"/app/procedure/"}
          title={"Procedimientos"}
          icon={"document-text"}
        />

        <ButtonLink
          to={"/app/calendar/"}
          title={"Calendario"}
          icon={"calendar"}
        />

        {levelWork === 1 ? (
          <ButtonLink
            to={"/app/order"}
            title={"Orden"}
            icon={"document-attach"}
          />
        ) : null}

        <ButtonLink to={"/app/profile/"} title={"Perfil"} icon={"md-person"} />
      </ScrollView>
    </View>
  );
};

export default ButtonBar;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    backgroundColor: colors.grey[0],
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.grey[1],
  },
  button: {
    padding: 5,
    width: 65,
    alignItems: "center",
  },
});
