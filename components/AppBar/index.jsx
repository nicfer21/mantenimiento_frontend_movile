import { View, Text, StyleSheet, Image } from "react-native";
import Constants from "expo-constants";
import colors from "../../src/colors";

const AppBar = () => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          style={styles.logo}
          source={require("../../assets/LogoEmpresa.png")}
        />
        <View>
          <Text style={styles.textlogo1}>
            Textileria y Bordaduria Señor de Burgos
          </Text>
          <Text style={styles.textlogo2}>Gestión del Mantenimiento</Text>
        </View>
      </View>
    </View>
  );
};

export default AppBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.grey[0],
    paddingTop: Constants.statusBarHeight,
    flexDirection: "column",
    justifyContent: "space-between",
    fontFamily: "notoserif",
    borderBottomWidth: 2,
    borderBottomColor: colors.grey[1],
  },
  logo: {
    width: 50,
    height: 50,
    padding: 10,
    margin: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.grey[5],
  },
  logoWorker: {
    width: 30,
    height: 30,
    padding: 10,
    margin: 10,
    borderRadius: 25,
  },
  textlogo1: {
    fontWeight: "bold",
    fontSize: 15,
    paddingVertical: 3,
    textAlign: "justify",
  },
  textlogo2: {
    fontSize: 11,
    paddingBottom: 3,
    textAlign: "right",
  },
});
