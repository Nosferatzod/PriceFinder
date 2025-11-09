<template>
  <div class="home">
    <AppHeader />
    
    <main class="main-content">
      <!-- Seção de Upload -->
      <UploadSection 
        v-if="currentSection === 'upload'"
        @file-selected="handleFileSelected"
        @open-camera="openCamera"
        @use-sample="useSampleImage"
      />
      
      <!-- Seção de Preview -->
      <PreviewSection 
        v-if="currentSection === 'preview'"
        :image-url="currentImageUrl"
        :product-data="currentProductData"
        @search-prices="searchPrices"
        @change-image="showUploadSection"
      />
      
      <!-- Seção de Carregamento -->
      <LoadingSection 
        v-if="currentSection === 'loading'"
        :message="loadingMessage"
        :progress="loadingProgress"
      />
      
      <!-- Seção de Resultados -->
      <ResultsSection 
        v-if="currentSection === 'results'"
        :results="searchResults"
        :stores="stores"
        @change-image="showUploadSection"
      />
    </main>
    
    <AppFooter @contact="showContactModal" />
    
    <!-- Modal da Câmera -->
    <CameraModal 
      v-if="showCamera"
      @capture="handleCameraCapture"
      @close="closeCamera"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useImageProcessor } from '@/composables/useImageProcessor'
import { usePriceSearch } from '@/composables/usePriceSearch'

// Components
import AppHeader from '@/composables/Header.vue'
import UploadSection from '@/composables/UploadSection.vue'
import PreviewSection from '@/composables/UploadSection.vue'
import LoadingSection from '@/composables/LoadingSection.vue'
import ResultsSection from '@/composables/ResultsSection.vue'
import AppFooter from '@/composables/Footer.vue'
import CameraModal from '@/composables/CameraModal.vue'

export default {
  name: 'HomeView',
  components: {
    AppHeader,
    UploadSection,
    PreviewSection,
    LoadingSection,
    ResultsSection,
    AppFooter,
    CameraModal
  },
  setup() {
    const { validateImage, processImage } = useImageProcessor()
    const { searchPrices: searchPricesApi, stores } = usePriceSearch()

    // Estado da aplicação
    const currentSection = ref('upload')
    const currentImageUrl = ref('')
    const currentProductData = ref(null)
    const searchResults = ref([])
    const loadingMessage = ref('Analisando imagem com IA...')
    const loadingProgress = ref(0)
    const showCamera = ref(false)

    // Manipulação de arquivos
    const handleFileSelected = async (file) => {
      const validation = validateImage(file)
      if (!validation.isValid) {
        alert(validation.message)
        return
      }

      showLoadingSection('Analisando imagem com IA...')
      
      try {
        const result = await processImage(file)
        currentImageUrl.value = result.imageUrl
        currentProductData.value = result.productData
        showPreviewSection()
      } catch (error) {
        console.error('Erro ao processar imagem:', error)
        alert('Erro ao processar a imagem. Tente novamente.')
        showUploadSection()
      }
    }

    // Câmera
    const openCamera = () => {
      showCamera.value = true
    }

    const closeCamera = () => {
      showCamera.value = false
    }

    const handleCameraCapture = (file) => {
      handleFileSelected(file)
      closeCamera()
    }

    // Imagem de exemplo
    const useSampleImage = () => {
      const sampleImages = [
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
      ]
      
      const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)]
      
      fetch(randomImage)
        .then(response => response.blob())
        .then(blob => {
          const file = new File([blob], 'sample-image.jpg', { type: 'image/jpeg' })
          handleFileSelected(file)
        })
        .catch(error => {
          console.error('Erro ao carregar imagem de exemplo:', error)
          alert('Erro ao carregar imagem de exemplo. Tente novamente.')
        })
    }

    // Navegação entre seções
    const showUploadSection = () => {
      currentSection.value = 'upload'
      currentImageUrl.value = ''
      currentProductData.value = null
      searchResults.value = []
    }

    const showPreviewSection = () => {
      currentSection.value = 'preview'
    }

    const showLoadingSection = (message = 'Analisando imagem com IA...') => {
      currentSection.value = 'loading'
      loadingMessage.value = message
      loadingProgress.value = 0
      animateProgressBar()
    }

    const showResultsSection = () => {
      currentSection.value = 'results'
    }

    // Busca de preços
    const searchPrices = async () => {
      showLoadingSection('Buscando os melhores preços...')
      
      try {
        const results = await searchPricesApi(currentProductData.value)
        searchResults.value = results
        showResultsSection()
      } catch (error) {
        console.error('Erro na busca de preços:', error)
        alert('Erro ao buscar preços. Tente novamente.')
        showPreviewSection()
      }
    }

    // Animação da barra de progresso
    const animateProgressBar = () => {
      let width = 0
      const interval = setInterval(() => {
        if (width >= 100) {
          clearInterval(interval)
        } else {
          width += Math.random() * 15
          if (width > 100) width = 100
          loadingProgress.value = width
        }
      }, 300)
    }

    // Modal de contato
    const showContactModal = () => {
      const contactInfo = `
🎯 PriceFinder - Parcerias Comerciais

📧 Email: parceiros@pricefinder.com
📞 Telefone: (11) 99999-9999
💼 Site: www.pricefinder.com/parcerias

🚀 O que oferecemos:
• Tecnologia de IA avançada
• Integração com seu e-commerce
• Aumento de conversão em até 30%
• Suporte técnico dedicado

💡 Interessado? Entre em contato para uma demonstração!
      `.trim()
      
      alert(contactInfo)
    }

    return {
      currentSection,
      currentImageUrl,
      currentProductData,
      searchResults,
      loadingMessage,
      loadingProgress,
      showCamera,
      stores,
      handleFileSelected,
      openCamera,
      closeCamera,
      handleCameraCapture,
      useSampleImage,
      showUploadSection,
      showPreviewSection,
      showLoadingSection,
      showResultsSection,
      searchPrices,
      showContactModal
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.main-content {
  padding-bottom: 40px;
}

/* Animações de transição */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>