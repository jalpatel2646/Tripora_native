import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image, ActivityIndicator, Linking } from 'react-native';
import { CameraView, useCameraPermissions, CameraType, FlashMode } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useCameraStore } from '../src/store/cameraStore';

export default function ReusableCameraScreen() {
  const { mode = 'default' } = useLocalSearchParams<{ mode: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const setCapturedImage = useCameraStore(state => state.setCapturedImage);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={{ backgroundColor: '#F3E8FF', padding: 24, borderRadius: 100, marginBottom: 24 }}>
           <MaterialIcons name="camera-alt" size={48} color="#7C3AED" />
        </View>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionSub}>We need access to capture photos for your {mode === 'receipt' ? 'expenses' : (mode === 'profile' ? 'profile' : 'trips')}.</Text>
        {permission.canAskAgain ? (
          <TouchableOpacity onPress={requestPermission} style={styles.grantBtn}>
            <Text style={styles.grantBtnText}>Allow Camera</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => Linking.openSettings()} style={styles.grantBtn}>
            <Text style={styles.grantBtnText}>Open Settings</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 24, padding: 12 }}>
          <Text style={{ color: '#6B7280', fontWeight: 'bold' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || isProcessing) return;
    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
         quality: 0.8,
         skipProcessing: false,
      });
      if (photo && photo.uri) {
         setPreviewUri(photo.uri);
      }
    } catch (e: any) {
      Alert.alert('Capture Failed', 'Something went wrong capturing the photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmPhoto = () => {
    if (!previewUri) return;
    setCapturedImage(previewUri, mode);
    router.back();
  };

  if (previewUri) {
    return (
      <View style={styles.container}>
         <Image source={{ uri: previewUri }} style={styles.previewImage} resizeMode="cover" />
         <View style={styles.previewControls}>
            <TouchableOpacity onPress={() => setPreviewUri(null)} style={styles.retakeBtn}>
               <MaterialIcons name="refresh" size={20} color="white" style={{ marginRight: 6 }}/>
               <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmPhoto} style={styles.confirmBtn}>
               <MaterialIcons name="check" size={20} color="white" style={{ marginRight: 6 }}/>
               <Text style={styles.confirmText}>Use Photo</Text>
            </TouchableOpacity>
         </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing} 
        enableTorch={flash === 'on'}
        ref={cameraRef}
      />
      <View style={[StyleSheet.absoluteFill, styles.overlay]}>
         <View style={styles.topBar}>
           <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
             <MaterialIcons name="close" size={28} color="white" />
           </TouchableOpacity>
           <TouchableOpacity onPress={() => setFlash(f => f === 'on' ? 'off' : 'on')} style={styles.iconBtn}>
             <MaterialIcons name={flash === 'on' ? "flash-on" : "flash-off"} size={28} color={flash === 'on' ? '#FBBF24' : 'white'} />
           </TouchableOpacity>
         </View>
         
         <View style={styles.bottomBar}>
           <TouchableOpacity onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')} style={styles.iconBtn}>
             <MaterialIcons name="flip-camera-ios" size={28} color="white" />
           </TouchableOpacity>
           
           <TouchableOpacity onPress={takePicture} disabled={isProcessing} style={styles.captureBtn}>
             {isProcessing ? (
               <ActivityIndicator size="large" color="#7C3AED" />
             ) : (
               <View style={styles.captureInner} />
             )}
           </TouchableOpacity>
           
           <View style={{ width: 60 }} />
         </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'transparent', justifyContent: 'space-between', padding: 24, paddingTop: 60, paddingBottom: 50 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  captureBtn: { width: 84, height: 84, borderRadius: 42, borderWidth: 4, borderColor: 'white', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
  captureInner: { width: 68, height: 68, borderRadius: 34, backgroundColor: 'white' },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F9FAFB' },
  permissionTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8, textAlign: 'center' },
  permissionSub: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  grantBtn: { backgroundColor: '#7C3AED', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16, width: '100%', alignItems: 'center', shadowColor: '#7C3AED', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { height: 4, width: 0 } },
  grantBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  previewImage: { flex: 1, width: '100%', height: '100%' },
  previewControls: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 24, paddingBottom: 50, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.7)' },
  retakeBtn: { flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center' },
  retakeText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  confirmBtn: { flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16, backgroundColor: '#7C3AED', alignItems: 'center' },
  confirmText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
