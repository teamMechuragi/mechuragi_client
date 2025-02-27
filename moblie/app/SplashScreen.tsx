import { useEffect } from "react";
import { View, Text, Image, ImageBackground, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useRouter } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function SplashScreenComponent() {
  const router = useRouter();

  useEffect(() => {
    const prepare = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
      await SplashScreen.hideAsync();
      router.replace("/(tabs)"); // 홈 화면으로 이동
    };

    prepare();
  }, []);

  return (
    <ImageBackground source={require("../assets/splashBG.png")} style={styles.background}>
      <View style={styles.overlay}>

        {/* AI 기반 메뉴 추천 서비스 텍스트 */}
        <Text style={styles.text}>AI 기반 메뉴 추천 서비스</Text>

        {/* 첫 번째 로고 (텍스트 포함된 로고) */}
        <Image source={require("../assets/textLogo.png")} style={styles.logo1} />
        
        {/* 두 번째 로고 (아이콘 형태 로고) */}
        <Image source={require("../assets/Logo.png")} style={styles.logo2} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    alignItems: "center",
    position: "absolute",
  },
  logo1: {
    width: 200, // 첫 번째 로고 크기 조절
    height: 50,
    marginBottom: 10, // 텍스트와의 간격 조절
  },
  text: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 20, // 두 번째 로고와의 간격 조절
  },
  logo2: {
    width: 150, // 두 번째 로고 크기 조절
    height: 150,
  },
});