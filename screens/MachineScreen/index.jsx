import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ruta } from "../../src/config.js";
import colors from "../../src/colors";

const DataRow = ({ title, value }) => {
  return (
    <View style={styles.profileText}>
      <Text style={styles.profileTag}>{title}</Text>
      <Text style={styles.profileData}>{value}</Text>
    </View>
  );
};

const MachineImage = ({ token, link }) => {
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

const MachineSection = ({ idMachine, token }) => {
  const goLink = (link) => {
    Linking.openURL(link);
  };
  const [datos, setDatos] = useState({});
  useEffect(() => {
    const getDataMachine = async () => {
      try {
        const rs = await axios.get(`${ruta}/machine/${idMachine}`, {
          headers: {
            token: token,
          },
        });
        setDatos(rs.data);
      } catch (error) {
        console.log(error);
      }
    };
    getDataMachine();
  }, [idMachine]);

  return (
    <View style={styles.section}>
      <Text style={styles.titulo}>informacion de la maquina</Text>
      <MachineImage token={token} link={datos.image} />
      <View style={{ padding: 5 }}>
        <DataRow title={"Maquina"} value={datos.name} />
        <DataRow title={"Codigo"} value={datos.idMachine} />
        <DataRow title={"Marca"} value={datos.brand} />
        <DataRow title={"Modelo"} value={datos.model} />
        <DataRow title={"Descripcion"} value={datos.description} />
        <View style={styles.profileText}>
          <Text style={styles.profileTag}>Hoja de datos</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              goLink(datos.dataSheet);
            }}
          >
            <Text style={{ textAlign: "center" }}>Ir a la Hoja</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const PartsSection = ({ idMachine, token }) => {
  const [parts, setParts] = useState([]);

  useEffect(() => {
    const getParts = async () => {
      try {
        const rs = await axios.get(`${ruta}/part/parent/${idMachine}`, {
          headers: {
            token: token,
          },
        });
        setParts(rs.data);
      } catch (error) {
        console.log(error);
      }
    };
    getParts();
  }, [idMachine]);

  return (
    <View style={styles.section}>
      <Text style={styles.titulo}>Partes y Subpartes</Text>
      <View style={{ marginVertical: 10 }}>
        {parts.map((part) => {
          return (
            <View key={part.idPart} style={styles.partContainer}>
              <Text style={styles.titulo}>Parte "{part.name}"</Text>
              <DataRow title="codigo" value={part.idPart} />
              <DataRow title="parte" value={part.name} />
              <DataRow title="descripcion" value={part.description} />
              <SubpartSection idPart={part.idPart} token={token} />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const SubpartSection = ({ idPart, token }) => {
  const [subparts, setSubparts] = useState([]);

  useEffect(() => {
    const getSubParts = async () => {
      try {
        const rs = await axios.get(`${ruta}/subpart/parent/${idPart}`, {
          headers: {
            token: token,
          },
        });
        setSubparts(rs.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSubParts();
  }, [idPart]);

  return (
    <View>
      {subparts.map((subpart) => {
        return (
          <View key={subpart.idSubPart} style={styles.subpartContainer}>
            <Text style={styles.titulo}>subparte "{subpart.name}"</Text>
            <DataRow title="Codigo" value={subpart.idSubPart} />
            <DataRow title="Subparte" value={subpart.name} />
            <DataRow title="descripcion" value={subpart.description} />
          </View>
        );
      })}
    </View>
  );
};

const MachineScreen = () => {
  const [data, setdata] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");
        const rs = await axios.get(`${ruta}/machine/`, {
          headers: {
            token: token,
          },
        });
        setdata(rs.data);
        setToken(token);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.machineContainer}>
          <Text style={styles.titulo}>maquinas</Text>

          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue) => setSelectedValue(itemValue)}
            style={styles.picker}
          >
            {data.map((maquina) => {
              return (
                <Picker.Item
                  key={maquina.idMachine}
                  label={`${maquina.idMachine} - ${maquina.name}`}
                  value={maquina.idMachine}
                  style={styles.pickerItem}
                />
              );
            })}
          </Picker>
          <MachineSection idMachine={selectedValue} token={token} />
        </View>

        <View style={styles.infoContainer}>
          <PartsSection idMachine={selectedValue} token={token} />
        </View>
      </View>
    </ScrollView>
  );
};

export default MachineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  machineContainer: {
    padding: 5,
    margin: 5,
  },
  titulo: {
    fontSize: 15,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
  },
  section: {
    margin: 5,
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 5,
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
    width: "20%",
  },
  picker: {
    backgroundColor: colors.grey[0],
    margin: 5,
  },
  pickerItem: {
    fontSize: 12,
    color: colors.grey[5],
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  imageView: {
    width: 150,
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: colors.grey[3],
    marginVertical: 10,
    alignSelf: "center",
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
  },
  profileData: {
    fontSize: 10,
    padding: 5,
    textAlign: "justify",
  },
  button: {
    backgroundColor: colors.grey[0],
    marginTop: 5,
    padding: 5,
    borderRadius: 10,
    shadowColor: colors.grey[5],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "60%",
    alignSelf: "center",
  },
  infoContainer: {
    padding: 5,
    margin: 5,
  },
  partContainer: {
    margin: 10,
    padding: 5,
    borderWidth: 2,
    borderStyle: "dotted",
    borderRadius: 15,
    borderColor: colors.grey[2],
  },
  subpartContainer: {
    margin: 10,
    padding: 5,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 15,
    borderColor: colors.grey[1],
  },
});
