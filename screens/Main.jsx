import { NativeRouter, Routes, Route, useNavigate } from "react-router-native";

import LoginScreen from "./LoginScreen";
import AppScreen from "./AppScreen";

const Main = () => {
  return (
    <NativeRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/app/*" element={<AppScreen />} />
      </Routes>
    </NativeRouter>
  );
};

export default Main;
