<template>
  <div class="card loading">
    <div class="loading-content">
      <div class="spinner-container">
        <div class="spinner"></div>
        <div class="spinner-ring"></div>
      </div>
      
      <p class="loading-text">{{ message }}</p>
      
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="progress-text">{{ Math.round(progress) }}%</div>
      </div>
      
      <div class="loading-details">
        <div class="detail-item" v-if="currentStep">
          <i class="fas fa-cog fa-spin"></i>
          <span>{{ currentStep }}</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-database"></i>
          <span>Analisando +50 lojas...</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-bolt"></i>
          <span>Processando em tempo real</span>
        </div>
      </div>
      
      <div class="loading-tips">
        <h4>Enquanto isso, saiba que:</h4>
        <ul>
          <li>🔍 Estamos varrendo todas as principais lojas online</li>
          <li>💰 Comparando preços, frete e condições de pagamento</li>
          <li>⭐ Avaliando a reputação dos vendedores</li>
          <li>🚚 Verificando prazos de entrega</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'

export default {
  name: 'LoadingSection',
  props: {
    message: {
      type: String,
      default: 'Analisando imagem com IA...'
    },
    progress: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const currentStep = ref('')
    const steps = [
      'Processando imagem...',
      'Identificando produto...',
      'Analisando características...',
      'Buscando em lojas...',
      'Comparando preços...',
      'Gerando resultados...'
    ]

    let stepIndex = 0

    onMounted(() => {
      updateStep()
    })

    watch(() => props.progress, (newProgress) => {
      if (newProgress >= 100) {
        currentStep.value = 'Finalizando...'
      }
    })

    const updateStep = () => {
      if (stepIndex < steps.length) {
        currentStep.value = steps[stepIndex]
        stepIndex++
        setTimeout(updateStep, 800 + Math.random() * 1200)
      }
    }

    return {
      currentStep
    }
  }
}
</script>

<style scoped>
.loading {
  text-align: center;
  padding: 50px 30px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
}

.loading-content {
  max-width: 500px;
  margin: 0 auto;
}

.spinner-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  width: 100%;
  height: 100%;
  animation: spin 1s linear infinite;
  position: absolute;
  top: 0;
  left: 0;
}

.spinner-ring {
  border: 2px solid rgba(106, 17, 203, 0.2);
  border-radius: 50%;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  animation: pulse 2s ease-in-out infinite;
}

.loading-text {
  font-size: 1.3rem;
  margin-bottom: 25px;
  color: var(--dark);
  font-weight: 600;
}

.progress-container {
  margin-bottom: 30px;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  border-radius: 5px;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 2s infinite;
}

.progress-text {
  font-weight: 600;
  color: var(--primary);
  font-size: 0.9rem;
}

.loading-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-left: 4px solid var(--accent);
}

.detail-item i {
  color: var(--primary);
  width: 20px;
}

.loading-tips {
  text-align: left;
  padding: 20px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  border: 1px solid #e6e8ff;
}

.loading-tips h4 {
  color: var(--primary);
  margin-bottom: 15px;
  text-align: center;
}

.loading-tips ul {
  list-style: none;
  padding: 0;
}

.loading-tips li {
  padding: 8px 0;
  color: #555;
  display: flex;
  align-items: center;
  gap: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

@media (max-width: 768px) {
  .loading {
    padding: 30px 20px;
  }
  
  .loading-text {
    font-size: 1.1rem;
  }
  
  .detail-item {
    padding: 10px 15px;
  }
}
</style>