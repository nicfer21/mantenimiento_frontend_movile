import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Button,
} from "react-native";
import { useNavigate, useParams } from "react-router-native";
import axios from "axios";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../../src/colors";
import { ruta } from "../../src/config";
import * as ImagePicker from "expo-image-picker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const RowFormRequest = ({ children, title }) => {
  return (
    <View>
      <Text style={styles.textForm}>{title}</Text>
      {children}
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

const StartTimePicker = ({ startReport, setStartReport }) => {
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setStartReport(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: startReport,
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
    <>
      <RowFormRequest title={"Inicio del mantenimiento"}>
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
        <View>
          <Text
            style={{
              textAlign: "center",
              padding: 5,
              marginVertical: 5,
              backgroundColor: colors.grey[0],
            }}
          >
            {startReport.toLocaleString()}
          </Text>
        </View>
      </RowFormRequest>
    </>
  );
};

const FinishTimePicker = ({ finishReport, setFinishReport }) => {
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setFinishReport(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: finishReport,
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
    <>
      <RowFormRequest title={"Fin del mantenimiento"}>
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
        <View>
          <Text
            style={{
              textAlign: "center",
              padding: 5,
              marginVertical: 5,
              backgroundColor: colors.grey[0],
            }}
          >
            {finishReport.toLocaleString()}
          </Text>
        </View>
      </RowFormRequest>
    </>
  );
};

const ReportScreen = () => {
  const { idOrder } = useParams();
  const [token, setToken] = useState("");
  const [maintenanceData, setMaintenanceData] = useState(null);
  const [start, setStart] = useState("");
  const [finish, setFinish] = useState("");

  const [date, setDate] = useState(new Date());
  const [startReport, setStartReport] = useState(null);
  const [finishReport, setFinishReport] = useState(null);

  const [description, setDescription] = useState("");
  const [idMaintenance, setIdMaintenance] = useState(idOrder);

  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  const openImagePickerAsync = async () => {
    try {
      let permisionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permisionResult.granted === false) {
        Alert.alert("El acceso a la camara es necesaria");
        return;
      }
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (pickerResult.canceled === true) {
        console.log("Se cancelo");
        // esto si no se selecciona una imagen
        return;
      }
      setSelectedImage({ localUri: pickerResult.assets[0].uri });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async () => {
    if (selectedImage !== null) {
      const workload = (finishReport.getTime() - startReport.getTime()) / 60000;

      if (workload >= 1) {
        Alert.alert(
          "Guardar Reporte de Trabajo",
          "¿Está seguro de guardar el siguiente reporte de trabajo?",
          [
            {
              text: "Cancelar",
              onPress: () => console.log("Se cancelo"),
            },
            {
              text: "Guardar Reporte",
              onPress: async () => {
                try {
                  const formData = new FormData();

                  const imageData = {
                    uri: selectedImage.localUri,
                    type: "image/jpeg",
                    name: "evidenciaReporte.jpg",
                  };

                  const year = startReport.getFullYear();
                  const month = String(startReport.getMonth() + 1).padStart(
                    2,
                    "0"
                  );
                  const day = String(startReport.getDate()).padStart(2, "0");
                  const hours = String(startReport.getHours()).padStart(2, "0");
                  const minutes = String(startReport.getMinutes()).padStart(
                    2,
                    "0"
                  );

                  const year1 = finishReport.getFullYear();
                  const month1 = String(finishReport.getMonth() + 1).padStart(
                    2,
                    "0"
                  );
                  const day1 = String(finishReport.getDate()).padStart(2, "0");
                  const hours1 = String(finishReport.getHours()).padStart(
                    2,
                    "0"
                  );
                  const minutes1 = String(finishReport.getMinutes()).padStart(
                    2,
                    "0"
                  );

                  formData.append(
                    "startReport",
                    `${year}-${month}-${day} ${hours}:${minutes}:00`
                  );
                  formData.append(
                    "finishReport",
                    `${year1}-${month1}-${day1} ${hours1}:${minutes1}:00`
                  );

                  formData.append("timeCount", workload);
                  formData.append("observation", description);
                  formData.append("idMaintenanceOrder", idOrder);
                  formData.append("idMaintenanceReport", idOrder);

                  formData.append("file", imageData);

                  const rs = await axios.post(
                    `${ruta}/maintenancereport/`,
                    formData,
                    {
                      headers: {
                        token: token,
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  );

                  if (rs.data.messege == 1) {
                    Alert.alert(
                      "Completado",
                      "La solicitud fue enviada correctamente"
                    );
                    setSelectedImage(null);
                    navigate("/app/");
                  }
                } catch (error) {
                  Alert.alert(
                    "Error",
                    "Error al enviar, espere un minuto para volver a enviar"
                  );
                }
              },
            },
          ]
        );
      } else {
        Alert.alert("Fecha invalida", "Revise la fecha de inicio y fin");
      }

      console.log(workload);
    } else {
      Alert.alert("Error", "Selecciona una imagen como evidencia");
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");

        const rsMaintenanceData = await axios.get(
          `${ruta}/maintenanceorder/${idMaintenance}`,
          {
            headers: {
              token: token,
            },
          }
        );
        setStart(new Date(rsMaintenanceData.data.startOrder));
        setFinish(new Date(rsMaintenanceData.data.finishOrder));

        setStartReport(date);

        const fechaFin = new Date(
          date.getTime() + rsMaintenanceData.data.workload * 60000
        );

        setFinishReport(fechaFin);

        setMaintenanceData(rsMaintenanceData.data);
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
        <View style={styles.formRequest}>
          <Text style={styles.titulo}>reporte de mantenimiento</Text>
          <View
            style={{
              borderWidth: 2,
              padding: 10,
              borderRadius: 20,
              borderColor: colors.grey[0],
            }}
          >
            <Text style={styles.subtitulo}>
              Datos de la order de mantenimiento
            </Text>

            <RowFormRequest title={""}>
              <DataRow
                title={"Titulo"}
                value={maintenanceData && maintenanceData.title}
              />
              <DataRow
                title={"Maquina"}
                value={maintenanceData && maintenanceData.nameMachine}
              />
              <DataRow
                title={"Parte"}
                value={maintenanceData && maintenanceData.namePart}
              />
              <DataRow
                title={"SubParte"}
                value={maintenanceData && maintenanceData.nameSubPart}
              />
              <DataRow
                title={"Tipo de mantenimiento"}
                value={maintenanceData && maintenanceData.nameStrategy}
              />
              <DataRow
                title={"Inicio programado"}
                value={maintenanceData && start.toLocaleString()}
              />
              <DataRow
                title={"Final programado"}
                value={maintenanceData && finish.toLocaleString()}
              />
              <DataRow
                title={"Duracion programada"}
                value={maintenanceData && maintenanceData.workload + " minutos"}
              />
            </RowFormRequest>

            <Text style={styles.subtitulo}>Formulario</Text>

            <RowFormRequest
              title={"Seleccione la fecha y hora del reporte de mantenimiento"}
            >
              {startReport && (
                <StartTimePicker
                  startReport={startReport}
                  setStartReport={setStartReport}
                />
              )}
              {finishReport && (
                <FinishTimePicker
                  finishReport={finishReport}
                  setFinishReport={setFinishReport}
                />
              )}
            </RowFormRequest>

            <RowFormRequest title="Descripcion del reporte">
              <TextInput
                placeholder="Descripcion adicional"
                onChangeText={(text) => {
                  setDescription(text);
                }}
                style={styles.inputForm}
                autoCorrect
                multiline={true}
                numberOfLines={5}
              />
            </RowFormRequest>
            <RowFormRequest title="Seleccione la evidencia para el reporte">
              <Text
                style={{
                  fontSize: 10,
                  paddingHorizontal: 5,
                  color: colors.grey[2],
                }}
              >
                (mantega precionado para cambiar de imagen, foto horizontal como
                se muestra en el ejemplo)
              </Text>

              <TouchableOpacity onLongPress={openImagePickerAsync}>
                <Image
                  style={styles.imagen}
                  source={{
                    uri:
                      selectedImage !== null
                        ? selectedImage.localUri
                        : "https://picsum.photos/1280/720",
                  }}
                />
              </TouchableOpacity>
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
                ENVIAR REPORTE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ReportScreen;

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
  },
  pickerItem: {
    fontSize: 11,
    color: colors.grey[5],
  },
  imagen: {
    height: 200,
    width: 250,
    margin: 10,
    resizeMode: "contain",
    alignSelf: "center",
  },
  profileText: {
    marginHorizontal: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: colors.grey[0],
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
  subtitulo: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
});
