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
      <div class="upload-features">
        <div class="feature-item">
          <i class="fas fa-brain"></i>
          <span>Reconhecimento por IA</span>
        </div>
        <div class="feature-item">
          <i class="fas fa-bolt"></i>
          <span>Busca em tempo real</span>
        </div>
        <div class="feature-item">
          <i class="fas fa-store"></i>
          <span>+50 lojas comparadas</span>
        </div>
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
        <i class="fas fa-camera"></i> Tirar Foto
      </button>
      <button class="btn btn-outline-primary" @click="onSampleClick">
        <i class="fas fa-images"></i> Usar Exemplo
      </button>
    </div>
    
    <div class="upload-tips">
      <h4>Dicas para melhor reconhecimento:</h4>
      <ul>
        <li>📸 Tire a foto com boa iluminação</li>
        <li>🎯 Foque no produto principal</li>
        <li>📱 Evite imagens muito escuras ou borradas</li>
        <li>🛍️ Mostre o produto de diferentes ângulos</li>
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
    const cameraSupported = ref(true)

    onMounted(() => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        cameraSupported.value = false
      }
    })

    const onUploadAreaClick = () => {
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
      if (files.length > 0) {
        emit('file-selected', files[0])
      }
    }

    const onFileSelect = (e) => {
      const file = e.target.files[0]
      if (file) {
        emit('file-selected', file)
      }
    }

    const onCaptureClick = () => {
      emit('open-camera')
    }

    const onSampleClick = () => {
      emit('use-sample')
    }

    return {
      fileInput,
      isDragOver,
      cameraSupported,
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
.upload-section {
  text-align: center;
}

.upload-area {
  border: 3px dashed var(--primary);
  border-radius: 20px;
  padding: 60px 30px;
  margin: 25px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(106, 17, 203, 0.03);
}

.upload-area.active {
  border-color: var(--accent);
  background: rgba(0, 184, 148, 0.05);
  transform: scale(1.02);
}

.upload-area:hover {
  background: rgba(106, 17, 203, 0.08);
  border-color: var(--secondary);
}

.upload-icon {
  font-size: 70px;
  color: var(--primary);
  margin-bottom: 20px;
}

.upload-text {
  font-size: 1.4rem;
  margin-bottom: 10px;
  font-weight: 600;
  color: var(--dark);
}

.upload-info {
  color: #666;
  margin-bottom: 30px;
  font-size: 1rem;
}

.upload-features {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary);
  font-weight: 500;
}

.feature-item i {
  font-size: 1.2rem;
}

.upload-tips {
  margin-top: 30px;
  padding: 20px;
  background: rgba(0, 184, 148, 0.05);
  border-radius: 10px;
  text-align: left;
}

.upload-tips h4 {
  color: var(--accent);
  margin-bottom: 15px;
  text-align: center;
}

.upload-tips ul {
  list-style: none;
  padding: 0;
}

.upload-tips li {
  padding: 8px 0;
  color: #555;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .upload-area {
    padding: 40px 20px;
  }
  
  .upload-features {
    flex-direction: column;
    gap: 15px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>