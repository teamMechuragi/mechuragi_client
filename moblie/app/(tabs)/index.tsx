import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabOneScreen() {
  const webViewRef = useRef<WebView>(null);

  const handleMessage = async (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);

      if (message.action === 'OPEN_GALLERY') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
          alert('갤러리 접근 권한이 필요합니다.');
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          quality: 0.8,
          selectionLimit: message.maxPhotos || 4,
        });

        if (!result.canceled && result.assets) {
          webViewRef.current?.postMessage(JSON.stringify({
            type: 'PHOTOS_SELECTED',
            photos: result.assets.map(asset => ({
              uri: asset.uri,
              width: asset.width,
              height: asset.height,
            }))
          }));
        }
      }

      if (message.action === 'OPEN_CAMERA') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        
        if (status !== 'granted') {
          alert('카메라 접근 권한이 필요합니다.');
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
        });

        if (!result.canceled && result.assets) {
          webViewRef.current?.postMessage(JSON.stringify({
            type: 'PHOTOS_SELECTED',
            photos: result.assets.map(asset => ({
              uri: asset.uri,
              width: asset.width,
              height: asset.height,
            }))
          }));
        }
      }
    } catch (error) {
      console.error('메시지 처리 실패:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://mechuragi.kro.kr/Home' }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        startInLoadingState={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
});