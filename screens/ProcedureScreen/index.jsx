import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-native";
import { Picker } from "@react-native-picker/picker";

import { ruta } from "../../src/config.js";
import colors from "../../src/colors";

const DataRow = ({ title, value }) => {
  return (
    <View style={styles.procedureText}>
      <Text style={styles.procedureTag}>{title}</Text>
      <Text style={styles.procedureData}>{value}</Text>
    </View>
  );
};

const ProcedureScreen = () => {
  const [token, setToken] = useState("");

  const [machine, setMachine] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState("");

  const [procedure, setProcedure] = useState([]);
  const [selectedProcedure, setSelectedProcedure] = useState("");

  const [procedureData, setProcedureData] = useState(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");
        setToken(token);
        const rsMachine = await axios.get(`${ruta}/machine/`, {
          headers: {
            token: token,
          },
        });
        setMachine(rsMachine.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const rsProcedure = await axios.get(
          `${ruta}/maintenanceprocedure/a/${selectedMachine}`,
          {
            headers: {
              token: token,
            },
          }
        );
        setProcedure(rsProcedure.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [selectedMachine]);

  const getProcedureData = async () => {
    try {
      const rsProcedureData = await axios.get(
        `${ruta}/maintenanceprocedure/b/${selectedProcedure}`,
        {
          headers: {
            token: token,
          },
        }
      );
      setProcedureData(rsProcedureData.data);
      setVisible(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewProcedure}>
        <Text style={styles.titulo}>Lista de Procedimientos</Text>
        <View
          style={{
            borderWidth: 2,
            padding: 10,
            borderRadius: 20,
            borderColor: colors.grey[0],
          }}
        >
          <Text style={styles.textForm}>Seleccione la Maquina</Text>
          <Picker
            selectedValue={selectedMachine}
            onValueChange={(itemValue) => setSelectedMachine(itemValue)}
            style={styles.picker}
          >
            {machine.map((maquina) => {
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

          <Text style={styles.textForm}>Seleccione el procedimiento</Text>
          <Picker
            selectedValue={selectedProcedure}
            onValueChange={(itemValue) => setSelectedProcedure(itemValue)}
            style={styles.picker}
          >
            {procedure.map((procedimiento) => {
              return (
                <Picker.Item
                  key={procedimiento.idMaintenanceProcedure}
                  label={`${procedimiento.idSubPart} -> ${procedimiento.title}`}
                  value={procedimiento.idMaintenanceProcedure}
                  style={styles.pickerItem}
                />
              );
            })}
          </Picker>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              getProcedureData();
            }}
          >
            <Text
              style={{
                color: colors.white,
                fontSize: 10,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Buscar
            </Text>
          </TouchableOpacity>

          {visible ? (
            <View style={styles.viewProcedure}>
              <Text style={styles.titulo}>Informacion del procedimiento</Text>
              <DataRow
                title="Codigo del procedimiento"
                value={procedureData && procedureData.idMaintenanceProcedure}
              />
              <DataRow
                title="titulo del procedimiento"
                value={procedureData && procedureData.title}
              />
              <DataRow
                title="duracion (minutos)"
                value={procedureData && procedureData.workload}
              />

              <View style={styles.procedureText}>
                <Text style={styles.procedureTag}>Hoja de Ruta</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    Linking.openURL(procedureData && procedureData.roadmaps);
                  }}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 10,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Ir a al Documento
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.procedureText}>
                <Text style={styles.procedureTag}>Reglamento de seguridad</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    Linking.openURL(procedureData && procedureData.law);
                  }}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 10,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Ir a al Documento
                  </Text>
                </TouchableOpacity>
              </View>

              <DataRow
                title="Codigo maquina"
                value={procedureData && procedureData.idMachine}
              />
              <DataRow
                title="Maquina"
                value={procedureData && procedureData.nameMachine}
              />

              <DataRow
                title="Codigo parte"
                value={procedureData && procedureData.idPart}
              />
              <DataRow
                title="parte"
                value={procedureData && procedureData.namePart}
              />

              <DataRow
                title="Codigo subparte"
                value={procedureData && procedureData.idSubPart}
              />
              <DataRow
                title="subparte"
                value={procedureData && procedureData.nameSubPart}
              />

              <DataRow
                title="tipo de mantenimiento"
                value={procedureData && procedureData.nameStrategy}
              />
              <DataRow
                title="lugar"
                value={procedureData && procedureData.nameSubPart}
              />
              <DataRow
                title="codigo de encargado"
                value={procedureData && procedureData.idWorker}
              />
              <DataRow
                title="encargado"
                value={procedureData && procedureData.longname}
              />
            </View>
          ) : (
            <></>
          )}
        </View>
      </View>
    </View>
  );
};

export default ProcedureScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  viewProcedure: {
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
  ProcedureRow: {
    padding: 5,
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.grey[0],
    borderStyle: "dotted",
  },
  procedureText: {
    marginHorizontal: 5,
    marginTop: 5,
  },
  procedureTag: {
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: 1,
    backgroundColor: colors.secondary[2],
    width: "100%",
    paddingHorizontal: 5,
  },
  procedureData: {
    fontSize: 10,
    padding: 5,
    textAlign: "justify",
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
  picker: {
    backgroundColor: colors.grey[0],
    marginBottom: 10,
  },
  pickerItem: {
    fontSize: 11,
    color: colors.grey[5],
  },
  textForm: {
    padding: 5,
    textAlign: "justify",
  },
});
