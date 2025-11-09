<template>
  <section class="card upload-section">
    <h2>Como funciona?</h2>
    <p>Faça upload de uma foto do produto que deseja encontrar e nossa IA irá buscar os melhores preços em tempo real.</p>
    
    <div 
      class="upload-area" 
      @click="onUploadAreaClick"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
      :class="{ 'active': isDragOver }"
    >
      <div class="upload-icon">
        <i class="fas fa-cloud-upload-alt"></i>
      </div>
      <p class="upload-text">Arraste uma imagem aqui ou clique para selecionar</p>
      <p class="upload-info">Formatos suportados: JPG, PNG, WebP (máx. 10MB)</p>
      
      <!-- Debug info -->
      <div class="debug-info" v-if="debugInfo">
        <small>{{ debugInfo }}</small>
      </div>
    </div>
    
    <input 
      type="file" 
      ref="fileInput"
      accept="image/*" 
      class="d-none"
      @change="onFileSelect"
    >
    
    <div class="action-buttons">
      <button class="btn btn-primary" @click="onCaptureClick" :disabled="!cameraSupported">
        <i class="fas fa-camera"></i> 
        {{ cameraSupported ? 'Tirar Foto' : 'Câmera Não Disponível' }}
      </button>
      <button class="btn btn-outline-primary" @click="onSampleClick">
        <i class="fas fa-images"></i> Usar Exemplo
      </button>
    </div>

    <div class="browser-support">
      <h4>Suporte do Navegador:</h4>
      <ul>
        <li>✅ Chrome: Câmera + Upload</li>
        <li>✅ Firefox: Câmera + Upload</li>
        <li>✅ Safari: Câmera + Upload</li>
        <li>⚠️ Edge: Câmera + Upload</li>
      </ul>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'UploadSection',
  emits: ['file-selected', 'open-camera', 'use-sample'],
  setup(props, { emit }) {
    const fileInput = ref(null)
    const isDragOver = ref(false)
    const cameraSupported = ref(false)
    const debugInfo = ref('')

    onMounted(() => {
      checkCameraSupport()
    })

    const checkCameraSupport = () => {
      const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
      const isHTTPS = window.location.protocol === 'https:' || window.location.hostname === 'localhost'
      
      cameraSupported.value = hasMediaDevices && isHTTPS
      
      debugInfo.value = `MediaDevices: ${hasMediaDevices}, HTTPS: ${isHTTPS}`
      console.log('Suporte à câmera:', {
        mediaDevices: hasMediaDevices,
        https: isHTTPS,
        supported: cameraSupported.value
      })
    }

    const onUploadAreaClick = () => {
      console.log('Clicando no upload area...')
      fileInput.value.click()
    }

    const onDragOver = (e) => {
      e.preventDefault()
      isDragOver.value = true
    }

    const onDragLeave = () => {
      isDragOver.value = false
    }

    const onDrop = (e) => {
      e.preventDefault()
      isDragOver.value = false
      
      const files = e.dataTransfer.files
      console.log('Arquivos soltos:', files.length)
      
      if (files.length > 0) {
        emit('file-selected', files[0])
      }
    }

    const onFileSelect = (e) => {
      const file = e.target.files[0]
      console.log('Arquivo selecionado via input:', file)
      
      if (file) {
        emit('file-selected', file)
      }
    }

    const onCaptureClick = () => {
      console.log('Abrindo câmera...')
      emit('open-camera')
    }

    const onSampleClick = () => {
      console.log('Usando exemplo...')
      emit('use-sample')
    }

    return {
      fileInput,
      isDragOver,
      cameraSupported,
      debugInfo,
      onUploadAreaClick,
      onDragOver,
      onDragLeave,
      onDrop,
      onFileSelect,
      onCaptureClick,
      onSampleClick
    }
  }
}
</script>

<style scoped>
.debug-info {
  margin-top: 10px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  font-family: monospace;
}

.browser-support {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  text-align: left;
}

.browser-support h4 {
  margin-bottom: 10px;
  color: var(--dark);
}

.browser-support ul {
  list-style: none;
  padding: 0;
}

.browser-support li {
  padding: 5px 0;
  font-size: 0.9rem;
}
</style>