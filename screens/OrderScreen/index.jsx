import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useNavigate } from "react-router-native";

import colors from "../../src/colors";
import { ruta } from "../../src/config";

const RowFormRequest = ({ children, title }) => {
  return (
    <View>
      <Text style={styles.textForm}>{title}</Text>
      {children}
    </View>
  );
};

const MyDateTimePicker = ({
  date,
  setDate,
  timeWork,
  start,
  setStart,
  finish,
  setFinish,
}) => {
  useEffect(() => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    setStart(`${year}-${month}-${day} ${hours}:${minutes}:00`);
  }, [date]);

  useEffect(() => {
    const newDate = new Date(date.getTime() + timeWork * 60000);

    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    const hours = String(newDate.getHours()).padStart(2, "0");
    const minutes = String(newDate.getMinutes()).padStart(2, "0");

    setFinish(`${year}-${month}-${day} ${hours}:${minutes}:00`);
  }, [timeWork, date]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = async () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 5,
      }}
    >
      <Button onPress={showDatepicker} title="Cambiar fecha" />
      <Button onPress={showTimepicker} title="Cambiar hora" />
    </View>
  );
};

const OrderScreen = () => {
  const navigate = useNavigate();

  const [machine, setMachine] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState("");

  const [procedure, setProcedure] = useState([]);
  const [selectedProcedure, setSelectedProcedure] = useState("");

  const [priority, setPriority] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState("");

  const [timeWork, setTimeWork] = useState(0);

  const [worker, setWorker] = useState("");

  const [token, setToken] = useState("");

  const [date, setDate] = useState(new Date());
  const [start, setStart] = useState("");
  const [finish, setFinish] = useState("");

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
        const rsPriority = await axios.get(`${ruta}/priority/`, {
          headers: {
            token: token,
          },
        });
        setPriority(rsPriority.data);
        const payload = jwtDecode(token);
        setWorker(payload.id);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [token]);

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

  useEffect(() => {
    const getData = async () => {
      try {
        const rsProcedureData = await axios.get(
          `${ruta}/maintenanceprocedure/b/${selectedProcedure}`,
          {
            headers: {
              token: token,
            },
          }
        );
        setTimeWork(rsProcedureData.data.workload);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [selectedProcedure, selectedMachine]);

  const onSubmit = async () => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de pedir la orden de mantenimiento?",
      [
        {
          text: "No",
          style: "cancel",
          onPress: () => console.log("Acción cancelada"),
        },
        {
          text: "Sí",
          onPress: async () => {
            try {
              const dataSubmit = {
                stepValue: 1,
                startOrder: start,
                finishOrder: finish,
                idWorker: worker,
                idPriority: selectedPriority,
                idMaintenanceProcedure: selectedProcedure,
              };

              const rs = await axios.post(
                `${ruta}/maintenanceorder/`,
                dataSubmit,
                {
                  headers: {
                    token: token,
                  },
                }
              );
              if (rs.data.messege == 1) {
                navigate("/app/calendar/");
              }
            } catch (error) {
              console.log(error);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.formRequest}>
          <Text style={styles.titulo}>formulario para orden de mantenimie</Text>
          <View
            style={{
              borderWidth: 2,
              padding: 10,
              borderRadius: 20,
              borderColor: colors.grey[0],
            }}
          >
            <RowFormRequest title="Seleccione la maquina">
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
            </RowFormRequest>

            <RowFormRequest title="Seleccione el procedimiento">
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
            </RowFormRequest>

            <RowFormRequest title="Seleccione la prioridad">
              <Picker
                selectedValue={selectedPriority}
                onValueChange={(itemValue) => setSelectedPriority(itemValue)}
                style={styles.picker}
              >
                {priority.map((prioridad) => {
                  return (
                    <Picker.Item
                      key={prioridad.idPriority}
                      label={prioridad.name}
                      value={prioridad.idPriority}
                      style={{
                        fontSize: 11,
                        color: prioridad.color,
                      }}
                    />
                  );
                })}
              </Picker>
            </RowFormRequest>

            <RowFormRequest title="Seleccione la fecha y hora de inicio">
              <MyDateTimePicker
                date={date}
                setDate={setDate}
                timeWork={timeWork}
                start={start}
                setStart={setStart}
                finish={finish}
                setFinish={setFinish}
              />
            </RowFormRequest>

            <RowFormRequest title="Hora estimada de inicio">
              <Text
                style={{
                  backgroundColor: colors.grey[0],
                  padding: 10,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {start}
              </Text>
            </RowFormRequest>
            <RowFormRequest title="Hora estimada de culminacion">
              <Text
                style={{
                  backgroundColor: colors.grey[0],
                  padding: 10,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {finish}
              </Text>
            </RowFormRequest>

            <TouchableOpacity
              style={styles.buttonForm}
              onPress={() => {
                onSubmit();
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: colors.white,
                  fontWeight: "bold",
                }}
              >
                CREAR ORDEN
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  titulo: {
    fontSize: 15,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 10,
  },
  formRequest: {
    padding: 5,
    margin: 5,
  },
  textForm: {
    padding: 5,
    textAlign: "justify",
  },
  inputForm: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: colors.grey[0],
    fontSize: 11,
    marginBottom: 10,
  },
  textError: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.danger,
    textAlign: "center",
  },
  buttonForm: {
    backgroundColor: colors.success,
    margin: 10,
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
  picker: {
    backgroundColor: colors.grey[0],
    marginBottom: 10,
    fontWeight: "bold",
  },
  pickerItem: {
    fontSize: 11,
    color: colors.grey[5],
  },
});
