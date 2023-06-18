import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-native";

import { ruta } from "../../src/config.js";
import colors from "../../src/colors";

const ImageRequest = ({ token, link }) => {
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    const getImage = async () => {
      try {
        const response = await axios.get(`${ruta}/public/${link}`, {
          headers: {
            token: token,
          },
          responseType: "blob",
        });
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
    getImage();
  }, [link]);

  return (
    <View style={styles.imageView}>
      {imageData && <Image source={{ uri: imageData }} style={styles.image} />}
    </View>
  );
};

const DataRow = ({ title, value }) => {
  return (
    <View style={styles.profileText}>
      <Text style={styles.profileTag}>{title}</Text>
      <Text style={styles.profileData}>{value}</Text>
    </View>
  );
};

const RequestModalContent = ({ id, token, toggle, settoggle }) => {
  const [datos, setDatos] = useState(null);
  const [showDate, setShowDate] = useState({
    fecha: "",
    hora: "",
  });
  const [level, setLevel] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const rs = await axios.get(`${ruta}/maintenancerequest/${id}`, {
          headers: {
            token: token,
          },
        });
        setDatos(rs.data);
        const fechaHora = new Date(rs.data.requestDate);
        const fecha = fechaHora.toLocaleDateString();
        const hora = fechaHora.toLocaleTimeString();
        setShowDate({
          fecha: fecha,
          hora: hora,
        });
        jwtDecode(token).levelWork === 1 ? setLevel(true) : setLevel(false);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [toggle]);

  const changeRequestState = async () => {
    try {
      Alert.alert("Cambio de estado", "¿Está seguro de cambiar de estado", [
        { text: "No", style: "cancel" },
        {
          text: "Si",
          style: "destructive",
          onPress: async () => {
            const change = datos.requestState === 1 ? 0 : 1;

            const rs = await axios.patch(
              `${ruta}/maintenancerequest/${id}`,
              {
                requestState: change,
              },
              {
                headers: {
                  token: token,
                },
              }
            );

            toggle ? settoggle(false) : settoggle(true);
          },
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.modalContainer}>
      <DataRow
        title="ID solicitud"
        value={datos && datos.idMaintenanceRequest}
      />
      <DataRow title="Asunto" value={datos && datos.title} />

      <DataRow title="id trabajador" value={datos && datos.idWorker} />
      <DataRow title="redactado por" value={datos && datos.longname} />

      <DataRow title="fecha" value={showDate.fecha} />
      <DataRow title="hora" value={showDate.hora} />

      <DataRow title="id maquina" value={datos && datos.idMachine} />
      <DataRow title="maquina" value={datos && datos.machineName} />

      <DataRow title="lugar" value={datos && datos.placeName} />
      <DataRow
        title="Estado"
        value={datos && datos.requestState === 1 ? "Visto" : "No visto"}
      />
      <DataRow title="descripcion" value={datos && datos.description} />

      {level && level ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => changeRequestState()}
        >
          <Text
            style={{
              color: colors.white,
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Cambiar estado
          </Text>
        </TouchableOpacity>
      ) : null}

      <ImageRequest link={datos && datos.image} token={token} />
    </View>
  );
};

const RequestRow = ({ id, date, state, machine, token, toggle, settoggle }) => {
  const [showDate, setShowDate] = useState({
    fecha: "---",
    hora: "000",
  });
  const [modalVisible, setModalVisible] = useState(false);

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
  }, [toggle]);

  return (
    <View style={styles.requestRow}>
      <Text>{id}</Text>
      <Text>{machine}</Text>
      <Text>{showDate.fecha}</Text>
      <Text>{showDate.hora}</Text>
      {state === 1 ? (
        <Ionicons name="eye" size={17} color={colors.success} />
      ) : (
        <Ionicons name="eye-off" size={17} color={colors.danger} />
      )}

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Ionicons name="search" size={20} color={colors.secondary[0]} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <View
            style={{
              backgroundColor: colors.grey[0],
              padding: 10,
              width: "90%",
              borderRadius: 15,
            }}
          >
            <ScrollView>
              <View>
                <Text style={styles.titulo}>
                  informacion de la solicitud de mantenimiento
                </Text>

                <RequestModalContent
                  id={id}
                  token={token}
                  toggle={toggle}
                  settoggle={settoggle}
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setModalVisible(false)}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Cerrar
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const RequestScreen = () => {
  const [token, setToken] = useState("");
  const [data, setData] = useState(null);
  const [toggleState, setToggleState] = useState(false);
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
  }, [toggleState]);

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
                  token={token}
                  toggle={toggleState}
                  settoggle={setToggleState}
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
    marginBottom: 10,
  },
  requestRow: {
    padding: 5,
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.grey[0],
    borderStyle: "dotted",
  },
  profileText: {
    marginHorizontal: 5,
    marginTop: 5,
  },
  profileTag: {
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: 1,
    backgroundColor: colors.secondary[2],
    width: "100%",
    paddingHorizontal: 5,
  },
  profileData: {
    fontSize: 10,
    padding: 5,
    textAlign: "center",
    backgroundColor: colors.white,
  },
  modalContainer: {
    padding: 2,
  },
  button: {
    backgroundColor: colors.grey[4],
    padding: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
    shadowColor: colors.grey[5],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    alignSelf: "center",
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  imageView: {
    width: 250,
    height: 250,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: colors.grey[3],
    marginVertical: 10,
    alignSelf: "center",
  },
});
