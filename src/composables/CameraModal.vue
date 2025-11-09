<template>
  <div class="camera-modal" v-if="showModal">
    <div class="camera-overlay" @click="closeCamera"></div>
    <div class="camera-content">
      <div class="camera-header">
        <h3><i class="fas fa-camera"></i> Câmera</h3>
        <button class="btn-close" @click="closeCamera">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="camera-preview">
        <div v-if="!cameraActive" class="camera-loading">
          <div class="spinner"></div>
          <p>Iniciando câmera...</p>
        </div>
        
        <video 
          v-else
          ref="videoElement" 
          autoplay 
          playsinline
          class="camera-video"
        ></video>
        
        <div v-if="cameraActive" class="camera-frame">
          <div class="frame-corner top-left"></div>
          <div class="frame-corner top-right"></div>
          <div class="frame-corner bottom-left"></div>
          <div class="frame-corner bottom-right"></div>
        </div>
      </div>
      
      <div class="camera-controls">
        <div class="camera-info" v-if="cameraError">
          <i class="fas fa-exclamation-triangle"></i>
          <p>{{ cameraError }}</p>
        </div>
        
        <div class="camera-buttons">
          <button 
            class="btn btn-capture" 
            @click="capturePhoto"
            :disabled="!cameraActive"
          >
            <i class="fas fa-camera"></i>
            Tirar Foto
          </button>
          
          <button 
            class="btn btn-switch" 
            @click="switchCamera"
            v-if="hasMultipleCameras && cameraActive"
          >
            <i class="fas fa-sync-alt"></i>
            Trocar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'CameraModal',
  props: {
    showModal: Boolean
  },
  emits: ['capture', 'close'],
  setup(props, { emit }) {
    const videoElement = ref(null)
    const stream = ref(null)
    const cameraActive = ref(false)
    const cameraError = ref('')
    const hasMultipleCameras = ref(false)
    const currentFacingMode = ref('environment')
    const devices = ref([])

    onMounted(async () => {
      await checkCameras()
      if (props.showModal) {
        initializeCamera()
      }
    })

    const checkCameras = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices()
        devices.value = mediaDevices.filter(device => device.kind === 'videoinput')
        hasMultipleCameras.value = devices.value.length > 1
        console.log('Câmeras disponíveis:', devices.value.length)
      } catch (error) {
        console.error('Erro ao verificar câmeras:', error)
      }
    }

    const initializeCamera = async (facingMode = 'environment') => {
      cameraError.value = ''
      cameraActive.value = false
      
      // Parar stream anterior se existir
      if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop())
      }

      try {
        const constraints = {
          video: { 
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        }
        
        stream.value = await navigator.mediaDevices.getUserMedia(constraints)
        
        if (videoElement.value) {
          videoElement.value.srcObject = stream.value
          videoElement.value.onloadedmetadata = () => {
            cameraActive.value = true
          }
        }
        
        currentFacingMode.value = facingMode
      } catch (error) {
        console.error('Erro ao acessar câmera:', error)
        cameraError.value = this.getErrorMessage(error)
        
        // Tentar câmera frontal se a traseira falhar
        if (facingMode === 'environment' && !cameraError.value.includes('permissão')) {
          setTimeout(() => initializeCamera('user'), 1000)
        }
      }
    }

    const getErrorMessage = (error) => {
      if (error.name === 'NotAllowedError') {
        return 'Permissão de câmera negada. Por favor, permita o acesso à câmera.'
      } else if (error.name === 'NotFoundError') {
        return 'Nenhuma câmera encontrada no dispositivo.'
      } else if (error.name === 'NotSupportedError') {
        return 'Navegador não suporta acesso à câmera.'
      } else if (error.name === 'NotReadableError') {
        return 'Câmera está sendo usada por outro aplicativo.'
      } else {
        return 'Erro ao acessar a câmera: ' + error.message
      }
    }

    const switchCamera = () => {
      const newFacingMode = currentFacingMode.value === 'environment' ? 'user' : 'environment'
      initializeCamera(newFacingMode)
    }

    const capturePhoto = () => {
      if (!videoElement.value || !cameraActive.value) return
      
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      
      // Usar dimensões reais do vídeo
      canvas.width = videoElement.value.videoWidth
      canvas.height = videoElement.value.videoHeight
      
      // Desenhar a imagem no canvas
      context.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height)
      
      // Converter para blob
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'photo.jpg', { 
            type: 'image/jpeg',
            lastModified: Date.now()
          })
          emit('capture', file)
          closeCamera()
        } else {
          cameraError.value = 'Erro ao capturar foto'
        }
      }, 'image/jpeg', 0.9)
    }

    const closeCamera = () => {
      if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop())
        stream.value = null
      }
      cameraActive.value = false
      emit('close')
    }

    return {
      videoElement,
      cameraActive,
      cameraError,
      hasMultipleCameras,
      capturePhoto,
      switchCamera,
      closeCamera
    }
  }
}
</script>

<style scoped>
.camera-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
}

.camera-content {
  position: relative;
  background: white;
  border-radius: 20px;
  width: 95%;
  max-width: 500px;
  max-height: 90vh;
  z-index: 1001;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.camera-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
}

.camera-header h3 {
  margin: 0;
  font-size: 1.3rem;
}

.btn-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.camera-preview {
  position: relative;
  width: 100%;
  height: 400px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.camera-loading {
  color: white;
  text-align: center;
}

.camera-loading .spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 250px;
  height: 250px;
  pointer-events: none;
}

.frame-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid white;
}

.frame-corner.top-left {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.frame-corner.top-right {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.frame-corner.bottom-left {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

.frame-corner.bottom-right {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

.camera-controls {
  padding: 20px;
  background: #f8f9fa;
}

.camera-info {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  text-align: center;
  color: #856404;
}

.camera-info i {
  font-size: 1.5rem;
  margin-bottom: 10px;
  display: block;
}

.camera-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-capture {
  background: linear-gradient(135deg, var(--success) 0%, var(--accent) 100%);
  color: white;
  flex: 2;
  justify-content: center;
  font-size: 1.1rem;
}

.btn-capture:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(40, 167, 69, 0.3);
}

.btn-switch {
  background: var(--light);
  color: var(--dark);
  border: 2px solid #dee2e6;
  flex: 1;
}

.btn-switch:hover {
  background: #e9ecef;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .camera-content {
    width: 100%;
    height: 100%;
    max-width: none;
    border-radius: 0;
  }
  
  .camera-preview {
    height: 60vh;
  }
  
  .camera-frame {
    width: 200px;
    height: 200px;
  }
  
  .camera-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>