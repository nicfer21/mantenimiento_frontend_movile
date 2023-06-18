import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";

const RequestScreen = () => {
  const [token, setToken] = useState("");
  useEffect(() => {
    const getData = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");
        setToken(token);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <View>
      <Text>Request</Text>
    </View>
  );
};

export default RequestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
});
