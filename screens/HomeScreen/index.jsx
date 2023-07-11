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
import { useNavigate, useSearchParams } from "react-router-native";
import * as Progress from "react-native-progress";

import colors from "../../src/colors";
import { ruta } from "../../src/config";

const RowData = ({ title, value }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginVertical: 2,
        padding: 3,
      }}
    >
      <Text style={{ width: 100, marginLeft: 15 }}>{title}</Text>
      <Text>{value}</Text>
    </View>
  );
};

const OrderRowData = ({ data, machine }) => {
  const [number, setNumber] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const getData = () => {
      const ordenes = data.reduce((acc, obj) => {
        if (obj.idMachine === machine) {
          return acc + 1;
        }
        return acc;
      }, 0);

      const sinCompletar = data.reduce((acc, obj) => {
        if (obj.idMachine === machine && obj.stepValue === 1) {
          return acc + 1;
        }
        return acc;
      }, 0);

      if (ordenes === 0) {
        setCompleted(0);
      } else {
        const progreso = ((ordenes - sinCompletar) / ordenes).toFixed(4);
        setCompleted(progreso);
      }

      setNumber(ordenes);
    };
    getData();
  }, [machine, data]);

  return (
    <View
      style={{
        flexDirection: "row",
        marginVertical: 2,
        padding: 3,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ width: 60, marginLeft: 15 }}>{machine}</Text>
      <Text style={{ width: 10, marginLeft: 1 }}>{number}</Text>
      <Text style={{ width: 60, marginHorizontal: 5, textAlign: "right" }}>
        {completed * 100} %
      </Text>
      <Text>
        <Progress.Bar progress={completed} width={100} />
      </Text>
    </View>
  );
};

const AdminComponent = ({ token, year, month, idWorker, fechaActual }) => {
  const [dataRequest, setDataRequest] = useState([]);
  const [dataOrder, setDataOrder] = useState([]);
  const [machine, setMachine] = useState([
    "BCO_01",
    "BOR_01",
    "COS_01",
    "IMP_01",
    "REC_01",
    "REM_01",
  ]);

  useEffect(() => {
    const getDataSolicitud = async () => {
      try {
        const rsRequest = await axios.get(
          `${ruta}/maintenancerequest/data/${month}/${year}`,
          {
            headers: {
              token: token,
            },
          }
        );

        const rsOrder = await axios.get(
          `${ruta}/maintenanceorder/graf/${month}/${year}`,
          {
            headers: {
              token: token,
            },
          }
        );

        setDataRequest(rsRequest.data);
        setDataOrder(rsOrder.data);
      } catch (error) {
        console.log(error);
      }
    };
    getDataSolicitud();
  }, [fechaActual]);

  return (
    <View>
      <Text style={styles.subtitulo}>
        Resumen del mes {month} del año {year}
      </Text>
      <View style={styles.formRequest}>
        <Text style={{ marginBottom: 5 }}>
          Numero de solicitudes en el mes : {dataRequest.length}
        </Text>
        <View>
          <Text style={styles.subtitulo}>Solicitudes por maquina</Text>
          <RowData
            title={machine[0]}
            value={dataRequest.reduce((acc, obj) => {
              if (obj.idMachine === machine[0]) {
                return acc + 1;
              }
              return acc;
            }, 0)}
          />
          <RowData
            title={machine[1]}
            value={dataRequest.reduce((acc, obj) => {
              if (obj.idMachine === machine[1]) {
                return acc + 1;
              }
              return acc;
            }, 0)}
          />
          <RowData
            title={machine[2]}
            value={dataRequest.reduce((acc, obj) => {
              if (obj.idMachine === machine[2]) {
                return acc + 1;
              }
              return acc;
            }, 0)}
          />
          <RowData
            title={machine[3]}
            value={dataRequest.reduce((acc, obj) => {
              if (obj.idMachine === machine[3]) {
                return acc + 1;
              }
              return acc;
            }, 0)}
          />
          <RowData
            title={machine[4]}
            value={dataRequest.reduce((acc, obj) => {
              if (obj.idMachine === machine[4]) {
                return acc + 1;
              }
              return acc;
            }, 0)}
          />
          <RowData
            title={machine[5]}
            value={dataRequest.reduce((acc, obj) => {
              if (obj.idMachine === machine[5]) {
                return acc + 1;
              }
              return acc;
            }, 0)}
          />
        </View>

        <View>
          <Text style={styles.subtitulo}>
            Ordenes de mantenimiento y cumplimiento
          </Text>
          <OrderRowData data={dataOrder} machine={machine[0]} />
          <OrderRowData data={dataOrder} machine={machine[1]} />
          <OrderRowData data={dataOrder} machine={machine[2]} />
          <OrderRowData data={dataOrder} machine={machine[3]} />
          <OrderRowData data={dataOrder} machine={machine[4]} />
          <OrderRowData data={dataOrder} machine={machine[5]} />
        </View>
      </View>
    </View>
  );
};

const WorkerComponent = ({ idWorker, token, fechaActual }) => {
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const rsWorkList = await axios.get(
          `${ruta}/maintenanceorder/inicio/${fechaActual}/${idWorker}`,
          {
            headers: {
              token: token,
            },
          }
        );
        setData(rsWorkList.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [token, idWorker, fechaActual]);

  return (
    <View>
      <Text style={styles.subtitulo}>
        Actividades para el dia de hoy : {fechaActual}
      </Text>
      <View style={styles.formRequest}>
        {data.map((item) => {
          const date1 = new Date(item.startOrder);
          const date2 = new Date(item.finishOrder);

          return (
            <TouchableOpacity
              style={styles.item}
              key={item.idMaintenanceOrder}
              onPress={() => {
                if (item.stepValue == 1) {
                  Alert.alert(
                    "Reporte de mantenimiento",
                    "¿Estás seguro de continuar al reporte de mantenimiento?",
                    [
                      {
                        text: "No",
                        style: "cancel",
                        onPress: () => console.log("No"),
                      },
                      {
                        text: "Sí",
                        onPress: () => {
                          navigate(`/app/report/${item.idMaintenanceOrder}`);
                        },
                      },
                    ]
                  );
                }
              }}
            >
              <View style={{ margin: 1 }}>
                <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
                <Text style={{ padding: 3 }}>
                  - Inicio : {date1.toLocaleString()}
                </Text>
                <Text style={{ padding: 3 }}>
                  - Fin : {date2.toLocaleString()}
                </Text>
                <Text style={{ padding: 3 }}>
                  - Estado :{" "}
                  {item.stepValue == 1 ? (
                    <Text
                      style={{
                        color: colors.danger,
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      En proceso
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: colors.success,
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      Completado
                    </Text>
                  )}
                </Text>
                <Text style={{ padding: 3 }}>
                  - Tiempo de trabajo : {item.workload} minutos
                </Text>
                <Text style={{ padding: 3 }}>
                  - Maquina : {item.nameMachine}
                </Text>
                <Text style={{ padding: 3 }}>- Parte : {item.namePart}</Text>
                <Text style={{ padding: 3 }}>
                  - Subparte : {item.nameSubPart}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const HomeScreen = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [idWorker, setIdWorker] = useState("");
  const [level, setLevel] = useState(null);
  const [payload, setPayload] = useState("");
  const [fechaActual, setFechaActual] = useState("");
  const [mes, setMes] = useState("");
  const [año, setAño] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");
        setToken(token);
        setPayload(jwtDecode(token));
        setIdWorker(jwtDecode(token).id);
        setLevel(jwtDecode(token).levelWork);
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        const day = ("0" + currentDate.getDate()).slice(-2);
        setMes(month);
        setAño(year);
        setFechaActual(year + "-" + month + "-" + day);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.formRequest}>
          <Text style={styles.titulo}>Pagina de inicio</Text>
          <View style={styles.formRequest}>
            <Text style={{ textAlign: "justify" }}>
              Bienvenido{" "}
              <Text
                style={{ fontWeight: "bold", backgroundColor: colors.grey[1] }}
              >
                {payload.largename}
              </Text>{" "}
              al aplicativo movil para la Gestion de Mantenimiento de la empresa
              Textiletia y Bordaduria Señor de Burgos
            </Text>
          </View>
          <View style={styles.formRequest}>
            {level && level == 1 ? (
              <AdminComponent
                token={token}
                month={mes}
                year={año}
                idWorker={idWorker}
                fechaActual={fechaActual}
              />
            ) : (
              <WorkerComponent
                idWorker={idWorker}
                token={token}
                fechaActual={fechaActual}
              />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

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
  subtitulo: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 5,
  },
  formRequest: {
    padding: 5,
    margin: 5,
  },
  textForm: {
    padding: 5,
    textAlign: "justify",
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
  item: {
    backgroundColor: "white",
    flex: 1,
    padding: 5,
    marginRight: 5,
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 10,
  },
});
