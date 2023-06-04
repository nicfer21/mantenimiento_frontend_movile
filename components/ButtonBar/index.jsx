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

const ButtonLink = ({ to, title, icon }) => {
  const navigate = useNavigate();

  const styleLink =
    useLocation().pathname === to
      ? {
          color: "#69548e",
          typeIcon: "sharp",
          fontW: "bold",
        }
      : {
          color: "#616161",
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
            fontSize: 10,
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
        <ButtonLink to={"/app/profile"} title={"Perfil"} icon={"md-person"} />
      </ScrollView>
    </View>
  );
};

export default ButtonBar;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    backgroundColor: "#cccccc",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#a7a7a7",
  },
  button: {
    padding: 5,
    width: 60,
    alignItems: "center",
  },
});
