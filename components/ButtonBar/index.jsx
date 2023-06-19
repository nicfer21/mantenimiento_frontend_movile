import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Link, useLocation, useNavigate } from "react-router-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect } from "react";
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
