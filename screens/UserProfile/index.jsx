import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigate } from "react-router-native";
import axios from "axios";
import { ruta } from "../../src/config";

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
    <View styles={styles.container}>
      <ScrollView>
        <View style={styles.containerScroll}>
          {imageData && (
            <Image source={{ uri: imageData }} style={styles.image} />
          )}
          <Button
            title="Cerrar sesion"
            onPress={async () => {
              await AsyncStorage.clear();
              navigate("/");
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
  },
  containerScroll: {},
  image: { width: 200, height: 200 },
});
