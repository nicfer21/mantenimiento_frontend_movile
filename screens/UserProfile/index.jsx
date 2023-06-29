import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigate } from "react-router-native";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";

import { ruta } from "../../src/config";
import colors from "../../src/colors";

const ProfilePart = ({ tag, value, icon }) => {
  return (
    <View style={styles.profileRow}>
      <View style={styles.profileIcon}>
        <Ionicons name={icon} size={40} color={colors.grey[2]} />
      </View>
      <View style={styles.profileText}>
        <Text style={styles.profileTag}>{tag}</Text>
        <Text style={styles.profileData}>{value}</Text>
      </View>
    </View>
  );
};

const UserProfile = () => {
  const [datos, setDatos] = useState({
    dni: "",
    id: "",
    image: "",
    largename: "",
    levelWork: "",
    name: "",
  });
  const [imageData, setImageData] = useState(null);

  const navigate = useNavigate();

  const cerrarSession = async () => {
    Alert.alert("Cerras sesión", "¿Está seguro de cerrar sesión", [
      { text: "No", style: "cancel" },
      {
        text: "Si",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          navigate("/");
        },
      },
    ]);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");
        const tokenDecode = jwtDecode(token);
        setDatos(tokenDecode);
        const response = await axios.get(
          `${ruta}/public/${tokenDecode.image}`,
          {
            headers: {
              token: token,
            },
            responseType: "blob",
          }
        );
        const blob = response.data;
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageData(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.log("Error al cargar la imagen:", error);
      }
    };

    getData();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.imageView}>
          {imageData && (
            <Image source={{ uri: imageData }} style={styles.image} />
          )}
        </View>

        <View style={styles.profileDataContainer}>
          <ProfilePart
            tag={"id del trabajador"}
            value={datos.id}
            icon={"person-circle-outline"}
          />
          <ProfilePart tag={"dni"} value={datos.dni} icon={"man-outline"} />
          <ProfilePart
            tag={"nombre completo"}
            value={datos.largename}
            icon={"document-text-outline"}
          />
          <ProfilePart
            tag={"ocupacion"}
            value={datos.name}
            icon={"construct-outline"}
          />
          <ProfilePart
            tag={"nivel de acceso"}
            value={datos.levelWork}
            icon={"speedometer-outline"}
          />
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity style={styles.button} onPress={cerrarSession}>
              <Text
                style={{
                  textAlign: "center",
                  color: colors.white,
                  fontWeight: "bold",
                }}
              >
                CERRAR SESION
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    alignItems: "center",
  },
  imageView: {
    width: 150,
    height: 150,
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 5,
    borderColor: colors.secondary[0],
    marginVertical: 10,
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  button: {
    backgroundColor: colors.danger,
    marginTop: 40,
    padding: 10,
    borderRadius: 10,
    shadowColor: colors.grey[5],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileDataContainer: {
    marginVertical: 5,
    padding: 10,
    width: "100%",
  },
  profileRow: {
    borderBottomWidth: 2,
    borderBottomColor: colors.grey[2],
    flexDirection: "row",
    padding: 5,
    marginBottom: 5,
  },
  profileIcon: {
    alignContent: "center",
    justifyContent: "center",
    padding: 5,
  },
  profileText: {
    marginLeft: 10,
  },
  profileTag: {
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: 5,
    backgroundColor: colors.secondary[2],
    width: 250,
  },
  profileData: {
    fontSize: 12,
    padding: 5,
    textAlign: "center",
  },
});
