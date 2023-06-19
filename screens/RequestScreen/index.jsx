import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../../src/colors";
import { ruta } from "../../src/config";
import * as ImagePicker from "expo-image-picker";

const RowFormRequest = ({ children, title }) => {
  return (
    <View>
      <Text style={styles.textForm}>{title}</Text>
      {children}
    </View>
  );
};

const RequestScreen = () => {
  const [token, setToken] = useState("");
  const [idWorker, setIdWorker] = useState("");
  const [place, setPlace] = useState([]);
  const [machine, setMachine] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

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

  const onSubmit = async (dataForm) => {
    if (selectedImage !== null) {
      try {
        const formData = new FormData();

        const imageData = {
          uri: selectedImage.localUri,
          type: "image/jpeg",
          name: "evidencia.jpg",
        };

        formData.append("title", dataForm.title);
        formData.append("description", dataForm.description);
        formData.append("idMachine", selectedMachine);
        formData.append("idPlace", selectedPlace);
        formData.append("idWorker", idWorker);

        formData.append("file", imageData);

        const rs = await axios.post(`${ruta}/maintenancerequest/`, formData, {
          headers: {
            token: token,
            "Content-Type": "multipart/form-data",
          },
        });
        if (rs.data.messege == 1) {
          Alert.alert("Completado", "La solicitud fue enviada correctamente");
          setSelectedImage(null);
          reset();
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "Error al enviar, espere un minuto para volver a enviar"
        );
      }
    } else {
      Alert.alert("Error", "Selecciona una imagen como evidencia");
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");

        const rsMachine = await axios.get(`${ruta}/machine/`, {
          headers: {
            token: token,
          },
        });
        setMachine(rsMachine.data);

        const rsPlace = await axios.get(`${ruta}/place/`, {
          headers: {
            token: token,
          },
        });
        setPlace(rsPlace.data);

        setIdWorker(jwtDecode(token).id);
        setToken(token);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.formRequest}>
        <Text style={styles.titulo}>
          formulario para solicitud de mantenimiento
        </Text>
        <View
          style={{
            borderWidth: 2,
            padding: 10,
            borderRadius: 20,
            borderColor: colors.grey[0],
          }}
        >
          <RowFormRequest title="Asunto de la solicitud">
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Asunto"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.inputForm}
                />
              )}
              name="title"
            />
            {errors.title && (
              <Text style={styles.textError}>Asunto incompleto</Text>
            )}
          </RowFormRequest>

          <RowFormRequest title="Lugar donde ocurrio">
            <Picker
              selectedValue={selectedPlace}
              onValueChange={(itemValue) => setSelectedPlace(itemValue)}
              style={styles.picker}
            >
              {place.map((lugar) => {
                return (
                  <Picker.Item
                    key={lugar.idPlace}
                    label={lugar.name}
                    value={lugar.idPlace}
                    style={styles.pickerItem}
                  />
                );
              })}
            </Picker>
          </RowFormRequest>
          <RowFormRequest title="Maquina en cuestión">
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
          <RowFormRequest title="Descripcion de la solicitud">
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Descripcion"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.inputForm}
                  autoCorrect
                  multiline={true}
                  numberOfLines={5}
                />
              )}
              name="description"
            />
            {errors.description && (
              <Text style={styles.textError}>Descripcion incompleta</Text>
            )}
          </RowFormRequest>
          <RowFormRequest title="Seleccione la evidencia">
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
            onPress={handleSubmit(onSubmit)}
          >
            <Text
              style={{
                textAlign: "center",
                color: colors.white,
                fontWeight: "bold",
              }}
            >
              ENVIAR SOLICITUD
            </Text>
          </TouchableOpacity>
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
});
