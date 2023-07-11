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
    <View style={styles.profileText}>
      <Text style={styles.profileTag}>Evidencia </Text>
      <View style={styles.imageView}>
        {imageData && (
          <Image source={{ uri: imageData }} style={styles.image} />
        )}
      </View>
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

  useEffect(() => {
    const getData = async () => {
      try {
        const rs = await axios.get(`${ruta}/maintenancereport/${id}`, {
          headers: {
            token: token,
          },
        });
        setDatos(rs.data);
        console.log(rs.data);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [id]);

  const getFecha = (date) => {
    const fecha = new Date(date);
    return fecha.toLocaleString();
  };

  return (
    <View style={styles.modalContainer}>
      <DataRow
        title="ID Orden y Reporte"
        value={datos && datos.idMaintenanceOrder}
      />

      <DataRow title="Titulo del reporte" value={datos && datos.title} />
      <DataRow
        title="Tipo de mantenimiento"
        value={datos && datos.nameStrategy}
      />
      <DataRow
        title="Lugar de mantenimiento"
        value={datos && datos.namePlace}
      />
      <DataRow title="Maquina" value={datos && datos.nameMachine} />
      <DataRow title="Parte" value={datos && datos.namePart} />
      <DataRow title="SupParte" value={datos && datos.nameSubpart} />
      <DataRow title="Encargado" value={datos && datos.longname} />
      <DataRow
        title="Inicio programado"
        value={datos && getFecha(datos.startOrder)}
      />
      <DataRow
        title="Fin programado"
        value={datos && getFecha(datos.finishOrder)}
      />
      <DataRow
        title="Timpo programado"
        value={datos && datos.workload + " minutos"}
      />

      <DataRow
        title="Inicio reportado"
        value={datos && getFecha(datos.startReport)}
      />
      <DataRow
        title="Fin reportado"
        value={datos && getFecha(datos.finishReport)}
      />
      <DataRow
        title="Timpo reportado"
        value={datos && datos.timeCount + " minutos"}
      />
      <DataRow title="Observacion" value={datos && datos.observation} />
      <ImageRequest link={datos && datos.image} token={token} />
    </View>
  );
};

const RequestRow = ({ id, date, token, toggle, settoggle }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    const getDate = () => {
      const fechaHora = new Date(date);
      setFecha(fechaHora.toLocaleString());
    };
    getDate();
  }, [toggle]);

  return (
    <View style={styles.requestRow}>
      <Text>{id}</Text>
      <Text>{fecha}</Text>

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
                  informacion del reporte de mantenimiento
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

const ViewReportScreen = () => {
  const [token, setToken] = useState("");
  const [data, setData] = useState(null);
  const [toggleState, setToggleState] = useState(false);
  useEffect(() => {
    const getData = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");
        setToken(token);
        const data = await axios.get(`${ruta}/maintenancereport/`, {
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
        <Text style={styles.titulo}>Buscar Reporte</Text>
        <View>
          {data &&
            data.map((item) => {
              return (
                <RequestRow
                  id={item.idMaintenanceReport}
                  date={item.startReport}
                  key={item.idMaintenanceReport}
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

export default ViewReportScreen;

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
  image: { width: "100%", height: "100%", resizeMode: "contain" },
  imageView: {
    height: 250,
    width: 250,
    alignSelf: "center",
    overflow: "hidden",
  },
});
