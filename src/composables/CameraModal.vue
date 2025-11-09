<template>
  <div class="camera-modal d-flex">
    <div class="camera-overlay" @click="closeCamera"></div>
    <div class="camera-content">
      <div class="camera-header">
        <h3><i class="fas fa-camera"></i> Tirar Foto do Produto</h3>
        <button class="btn-close" @click="closeCamera">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="camera-preview">
        <video ref="videoElement" id="cameraVideo" autoplay playsinline></video>
        <div class="camera-frame">
          <div class="frame-corner top-left"></div>
          <div class="frame-corner top-right"></div>
          <div class="frame-corner bottom-left"></div>
          <div class="frame-corner bottom-right"></div>
        </div>
      </div>
      
      <div class="camera-instructions">
        <div class="instruction-item">
          <i class="fas fa-lightbulb"></i>
          <span>Use boa iluminação</span>
        </div>
        <div class="instruction-item">
          <i class="fas fa-cube"></i>
          <span>Centralize o produto</span>
        </div>
        <div class="instruction-item">
          <i class="fas fa-camera"></i>
          <span>Mantenha a câmera firme</span>
        </div>
      </div>
      
      <div class="camera-actions">
        <button class="btn btn-secondary" @click="switchCamera" v-if="hasMultipleCameras">
          <i class="fas fa-sync-alt"></i> Trocar Câmera
        </button>
        <button class="btn btn-success btn-capture" @click="capturePhoto">
          <i class="fas fa-camera"></i> Capturar Foto
        </button>
        <button class="btn btn-outline-secondary" @click="closeCamera">
          Cancelar
        </button>
      </div>
      
      <div class="camera-error" v-if="error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>{{ error }}</p>
      </div>
    </div>
    
    <!-- Preview da foto capturada -->
    <div v-if="capturedPhoto" class="photo-preview-modal">
      <div class="preview-content">
        <h4>Preview da Foto</h4>
        <img :src="capturedPhoto" alt="Foto capturada" class="preview-image">
        <div class="preview-actions">
          <button class="btn btn-success" @click="confirmPhoto">
            <i class="fas fa-check"></i> Usar Esta Foto
          </button>
          <button class="btn btn-outline-secondary" @click="retakePhoto">
            <i class="fas fa-redo"></i> Tirar Outra
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
  emits: ['capture', 'close'],
  setup(props, { emit }) {
    const videoElement = ref(null)
    const stream = ref(null)
    const error = ref('')
    const hasMultipleCameras = ref(false)
    const capturedPhoto = ref('')
    const isFrontCamera = ref(false)

    onMounted(async () => {
      try {
        await initializeCamera()
        checkMultipleCameras()
      } catch (err) {
        error.value = 'Não foi possível acessar a câmera. Verifique as permissões.'
        console.error('Erro ao acessar a câmera:', err)
      }
    })

    onUnmounted(() => {
      stopCamera()
    })

    const initializeCamera = async (facingMode = 'environment') => {
      stopCamera()
      
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
        }
        isFrontCamera.value = facingMode === 'user'
      } catch (err) {
        throw new Error('Câmera não disponível')
      }
    }

    const stopCamera = () => {
      if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop())
        stream.value = null
      }
    }

    const checkMultipleCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        hasMultipleCameras.value = videoDevices.length > 1
      } catch (err) {
        console.error('Erro ao verificar câmeras:', err)
      }
    }

    const switchCamera = async () => {
      try {
        const newFacingMode = isFrontCamera.value ? 'environment' : 'user'
        await initializeCamera(newFacingMode)
      } catch (err) {
        error.value = 'Erro ao trocar de câmera'
      }
    }

    const capturePhoto = () => {
      if (!videoElement.value) return
      
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      
      canvas.width = videoElement.value.videoWidth
      canvas.height = videoElement.value.videoHeight
      
      context.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        capturedPhoto.value = url
        stopCamera()
      }, 'image/jpeg', 0.9)
    }

    const confirmPhoto = () => {
      if (capturedPhoto.value) {
        // Converter URL do blob para File
        fetch(capturedPhoto.value)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' })
            emit('capture', file)
            closeCamera()
          })
      }
    }

    const retakePhoto = () => {
      capturedPhoto.value = ''
      initializeCamera(isFrontCamera.value ? 'user' : 'environment')
    }

    const closeCamera = () => {
      stopCamera()
      if (capturedPhoto.value) {
        URL.revokeObjectURL(capturedPhoto.value)
      }
      emit('close')
    }

    return {
      videoElement,
      error,
      hasMultipleCameras,
      capturedPhoto,
      capturePhoto,
      switchCamera,
      confirmPhoto,
      retakePhoto,
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
  padding: 0;
  width: 95%;
  max-width: 500px;
  margin: auto;
  z-index: 1001;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.camera-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
}

.camera-header h3 {
  margin: 0;
  font-size: 1.3rem;
}

.btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.camera-preview {
  position: relative;
  width: 100%;
  height: 400px;
  background: #000;
  overflow: hidden;
}

#cameraVideo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  height: 280px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 15px;
}

.frame-corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 3px solid white;
}

.frame-corner.top-left {
  top: -3px;
  left: -3px;
  border-right: none;
  border-bottom: none;
  border-radius: 10px 0 0 0;
}

.frame-corner.top-right {
  top: -3px;
  right: -3px;
  border-left: none;
  border-bottom: none;
  border-radius: 0 10px 0 0;
}

.frame-corner.bottom-left {
  bottom: -3px;
  left: -3px;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 10px;
}

.frame-corner.bottom-right {
  bottom: -3px;
  right: -3px;
  border-left: none;
  border-top: none;
  border-radius: 0 0 10px 0;
}

.camera-instructions {
  display: flex;
  justify-content: space-around;
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.instruction-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.instruction-item i {
  font-size: 1.2rem;
  color: var(--primary);
}

.camera-actions {
  display: flex;
  gap: 12px;
  padding: 20px;
  flex-wrap: wrap;
}

.camera-actions .btn {
  flex: 1;
  min-width: 120px;
  justify-content: center;
}

.btn-capture {
  background: linear-gradient(135deg, var(--success) 0%, var(--accent) 100%);
  border: none;
  font-weight: 600;
  padding: 15px 20px;
}

.btn-capture:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
}

.camera-error {
  background: #fee;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 15px;
  margin: 0 20px 20px;
  text-align: center;
  color: #721c24;
}

.camera-error i {
  font-size: 1.5rem;
  margin-bottom: 10px;
  display: block;
}

.photo-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1002;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-content {
  background: white;
  border-radius: 15px;
  padding: 25px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.preview-content h4 {
  margin-bottom: 20px;
  color: var(--dark);
}

.preview-image {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 10px;
  margin-bottom: 20px;
  border: 2px solid #eee;
}

.preview-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.preview-actions .btn {
  flex: 1;
  min-width: 140px;
  justify-content: center;
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
    width: 250px;
    height: 250px;
  }
  
  .camera-instructions {
    flex-direction: column;
    gap: 15px;
  }
  
  .camera-actions {
    flex-direction: column;
  }
  
  .preview-actions {
    flex-direction: column;
  }
}
</style>