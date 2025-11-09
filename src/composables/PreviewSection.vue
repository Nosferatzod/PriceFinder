<template>
  <section class="card preview-section">
    <h2>Produto Identificado <i class="fas fa-check-circle text-success"></i></h2>
    <div class="preview-container">
      <div class="preview-image-container">
        <img :src="imageUrl" alt="Preview" class="preview-image">
        <div class="image-actions">
          <button class="btn btn-outline-primary btn-small" @click="zoomImage">
            <i class="fas fa-search-plus"></i> Ampliar
          </button>
        </div>
      </div>
      <div class="preview-info">
        <h3 class="product-name">{{ productData.name }}</h3>
        <p class="product-description">{{ productData.description }}</p>
        
        <div class="confidence-indicator">
          <div class="confidence-label">Precisão da IA</div>
          <div class="confidence-bar">
            <div class="confidence-fill" :style="{ width: productData.confidence + '%' }"></div>
          </div>
          <div class="confidence-value">{{ productData.confidence }}%</div>
        </div>
        
        <div class="product-details">
          <div class="detail-item">
            <div class="detail-icon">
              <i class="fas fa-tags"></i>
            </div>
            <div class="detail-value">{{ productData.category }}</div>
            <div class="detail-label">Categoria</div>
          </div>
          <div class="detail-item">
            <div class="detail-icon">
              <i class="fas fa-copyright"></i>
            </div>
            <div class="detail-value">{{ productData.brand }}</div>
            <div class="detail-label">Marca</div>
          </div>
          <div class="detail-item">
            <div class="detail-icon">
              <i class="fas fa-bolt"></i>
            </div>
            <div class="detail-value">{{ processingTime }}s</div>
            <div class="detail-label">Processamento</div>
          </div>
        </div>
        
        <div class="action-buttons">
          <button class="btn btn-success" @click="onSearchClick">
            <i class="fas fa-search-dollar"></i> Buscar Melhores Preços
          </button>
          <button class="btn btn-outline-secondary" @click="onChangeImageClick">
            <i class="fas fa-exchange-alt"></i> Alterar Imagem
          </button>
        </div>
        
        <div class="preview-stats">
          <div class="stat-item">
            <i class="fas fa-store"></i>
            <span>+50 lojas verificadas</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-bolt"></i>
            <span>Preços em tempo real</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-shield-alt"></i>
            <span>Comparação segura</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'PreviewSection',
  props: {
    imageUrl: String,
    productData: Object
  },
  emits: ['search-prices', 'change-image'],
  setup(props, { emit }) {
    const processingTime = ref((Math.random() * 2 + 1).toFixed(1))

    const onSearchClick = () => {
      emit('search-prices')
    }

    const onChangeImageClick = () => {
      emit('change-image')
    }

    const zoomImage = () => {
      // Simula zoom da imagem
      const imageUrl = props.imageUrl
      window.open(imageUrl, '_blank')
    }

    return {
      processingTime,
      onSearchClick,
      onChangeImageClick,
      zoomImage
    }
  }
}
</script>

<style scoped>
.preview-section h2 {
  color: var(--dark);
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  margin-bottom: 20px;
}

.preview-image-container {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.preview-image {
  width: 100%;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.preview-image:hover {
  transform: scale(1.02);
}

.image-actions {
  position: absolute;
  bottom: 15px;
  right: 15px;
}

.preview-info {
  flex: 1;
  min-width: 300px;
}

.product-name {
  font-size: 2rem;
  margin-bottom: 15px;
  color: var(--dark);
  line-height: 1.2;
}

.product-description {
  margin-bottom: 25px;
  font-size: 1.1rem;
  line-height: 1.7;
  color: #555;
}

.confidence-indicator {
  background: rgba(106, 17, 203, 0.05);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 25px;
}

.confidence-label {
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--primary);
}

.confidence-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--success));
  border-radius: 4px;
  transition: width 1s ease;
}

.confidence-value {
  font-weight: 700;
  color: var(--success);
  text-align: right;
}

.product-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.detail-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: transform 0.3s ease;
}

.detail-item:hover {
  transform: translateY(-5px);
}

.detail-icon {
  font-size: 1.5rem;
  color: var(--primary);
  margin-bottom: 10px;
}

.detail-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 5px;
}

.detail-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 25px;
}

.preview-stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
  border-radius: 12px;
  border: 1px solid #e6e8ff;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary);
  font-weight: 500;
}

.stat-item i {
  color: var(--accent);
}

.btn-small {
  padding: 8px 16px;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .preview-container {
    flex-direction: column;
    gap: 25px;
  }
  
  .product-name {
    font-size: 1.6rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .preview-stats {
    flex-direction: column;
    gap: 15px;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>