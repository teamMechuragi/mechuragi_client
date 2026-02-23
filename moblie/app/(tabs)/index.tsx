import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabOneScreen() {
  const webViewRef = useRef<WebView>(null);

  // 알림 핸들러 설정 - 타입 명시
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async (notification: Notifications.Notification) => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      } as Notifications.NotificationBehavior),
    });
  }, []);

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

      if (message.action === 'REQUEST_NOTIFICATION_PERMISSION') {
        if (!Device.isDevice) {
          webViewRef.current?.postMessage(JSON.stringify({
            type: 'NOTIFICATION_PERMISSION_RESULT',
            granted: false,
            error: 'NOT_DEVICE'
          }));
          return;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        webViewRef.current?.postMessage(JSON.stringify({
          type: 'NOTIFICATION_PERMISSION_RESULT',
          granted: finalStatus === 'granted',
          status: finalStatus
        }));
      }

      if (message.action === 'GET_PUSH_TOKEN') {
        try {
          const token = await Notifications.getExpoPushTokenAsync();
          
          webViewRef.current?.postMessage(JSON.stringify({
            type: 'PUSH_TOKEN_RESULT',
            token: token.data
          }));
        } catch (error) {
          webViewRef.current?.postMessage(JSON.stringify({
            type: 'PUSH_TOKEN_RESULT',
            error: String(error)
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
        source={{ uri: 'https://mechuragi.site/' }}
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