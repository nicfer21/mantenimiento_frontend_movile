import { View, Text } from "react-native";
import { useParams } from "react-router-native";

const ReportScreen = () => {
  const { idOrder } = useParams();

  return (
    <View>
      <Text>Reporte {idOrder}</Text>
    </View>
  );
};

export default ReportScreen;
