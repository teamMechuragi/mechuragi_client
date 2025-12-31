import { useEffect, useRef } from 'react';
import { View, Image, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. AI 기반 메뉴 추천 서비스
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // 2. echuragi 텍스트 로고 먼저
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 700,
        delay: 200,
        useNativeDriver: true,
      }),
      // 3. 메추라기 로고 나중에
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setTimeout(() => {
        router.push('/(tabs)');
      }, 1000);
    });
  }, [router]);

  return (
    <View style={styles.container}>
      {/* 배경 */}
      <Image
        source={require('../assets/splashBG.png')}
        style={styles.background}
        resizeMode="cover"
      />

      <View style={styles.content}>
        {/* AI 기반 메뉴 추천 서비스 */}
        <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
          AI 기반 메뉴 추천 서비스
        </Animated.Text>

        {/* echuragi 텍스트 로고 */}
        <Animated.Image
          source={require('../assets/textLogo.png')}
          style={[
            styles.textLogo,
            { opacity: textOpacity },
          ]}
          resizeMode="contain"
        />

        {/* 메추라기 로고 */}
        <Animated.Image
          source={require('../assets/Logo.png')}
          style={[
            styles.logo,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // 🔥 완전 가운데
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 20, // 🔥 간격 조정
  },
  textLogo: {
    width: 250,
    height: 60,
    marginBottom: 30, // 🔥 간격 조정
  },
  logo: {
    width: 150,
    height: 150,
  },
});