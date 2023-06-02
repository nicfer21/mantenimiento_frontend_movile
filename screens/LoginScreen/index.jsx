import { useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigate } from "react-router-native";
import { useForm, Controller } from "react-hook-form";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";

import { ruta } from "../../src/config.js";

const LoginScreen = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const rs = await axios.post(`${ruta}/login`, data);
      const response = rs.data;

      if (response.messege === "OK") {
        await AsyncStorage.setItem("@token", response.token);
        navigate("/app");
      } else {
        Alert.alert(
          "Error",
          "Datos invalidos, escriba de nuevo las credenciales"
        );
        reset();
      }
    } catch (error) {
      Alert.alert("Error", "Error de conexion");
    }
  };

  useEffect(() => {
    const validacionToken = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");

        if (token !== null) {
          const rs = await axios.get(`${ruta}/prueba`, {
            headers: {
              token: token,
            },
          });
          rs.data.type === 0 ? navigate("/app") : navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    };
    validacionToken();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.containerLogin}>
        <View>
          <Text style={styles.textLogin}>TEXTILERIA Y BORDADURIA</Text>
          <Text style={styles.headerLogin}>SEÑOR DE BURGOS</Text>
          <Text style={styles.textLogin}>GESTION DE MANTENIMIENTO</Text>
        </View>

        <View style={{ paddingVertical: 10 }}>
          <Image
            style={styles.image}
            source={require("../../assets/LogoEmpresa.png")}
          />
        </View>

        <View>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Codigo de usuario"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.inputLogin}
              />
            )}
            name="username"
          />
          {errors.username && (
            <Text style={styles.textError}>Usuario incompleto</Text>
          )}

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Contraseña"
                onBlur={onBlur}
                secureTextEntry={true}
                onChangeText={onChange}
                value={value}
                style={styles.inputLogin}
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text style={styles.textError}>Constraseña incompleta</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.buttonLogin}
          onPress={handleSubmit(onSubmit)}
        >
          <Text
            style={{ textAlign: "center", color: "#fff", fontWeight: "bold" }}
          >
            INICIAR SESION
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c8c8c8",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  containerLogin: {
    padding: 25,
    paddingHorizontal: 40,
    borderRadius: 25,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 12,
      height: 12,
    },
    elevation: 25,
  },
  headerLogin: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textLogin: {
    fontSize: 12,
    fontWeight: "200",
    textAlign: "center",
  },
  image: {
    width: 60,
    height: 60,
    alignSelf: "center",
    margin: 10,
  },
  inputLogin: {
    marginTop: 15,
    padding: 10,
    borderRadius: 25,
    backgroundColor: "#ccc",
    textAlign: "center",
  },
  textError: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ff0000",
    textAlign: "center",
    paddingTop: 2,
    paddingBottom: 5,
  },
  buttonLogin: {
    backgroundColor: "#00bb2d",
    marginTop: 40,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
