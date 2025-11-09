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
      :show-modal="showCamera"
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
import PreviewSection from '@/composables/PreviewSection.vue'
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
      console.log('Arquivo selecionado:', file.name, file.type, file.size)
      
      const validation = validateImage(file)
      if (!validation.isValid) {
        alert(validation.message)
        return
      }

      showLoadingSection('Analisando imagem com IA...')
      
      try {
        const result = await processImage(file)
        console.log('Processamento concluído:', result.productData)
        
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
      console.log('Abrindo câmera...')
      showCamera.value = true
    }

    const closeCamera = () => {
      console.log('Fechando câmera...')
      showCamera.value = false
    }

    const handleCameraCapture = (file) => {
      console.log('Foto capturada:', file)
      handleFileSelected(file)
    }

    // Imagem de exemplo
    const useSampleImage = () => {
      console.log('Usando imagem de exemplo...')
      const sampleImages = [
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      ]
      
      const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)]
      console.log('Carregando imagem:', randomImage)
      
      // Criar uma imagem de exemplo local se o fetch falhar
      const fallbackImage = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 400
        canvas.height = 300
        const ctx = canvas.getContext('2d')
        
        // Fundo gradiente
        const gradient = ctx.createLinearGradient(0, 0, 400, 300)
        gradient.addColorStop(0, '#6a11cb')
        gradient.addColorStop(1, '#2575fc')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 400, 300)
        
        // Texto
        ctx.fillStyle = 'white'
        ctx.font = 'bold 24px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('📸 Imagem de Exemplo', 200, 150)
        ctx.font = '16px Arial'
        ctx.fillText('Clique em "Usar Exemplo" para testar', 200, 180)
        
        return new Promise((resolve) => {
          canvas.toBlob(blob => {
            const file = new File([blob], 'exemplo.jpg', { type: 'image/jpeg' })
            resolve(file)
          }, 'image/jpeg', 0.9)
        })
      }
      
      // Tentar carregar da URL, se falhar usar fallback
      fetch(randomImage)
        .then(response => {
          if (!response.ok) throw new Error('Falha no carregamento')
          return response.blob()
        })
        .then(blob => {
          const file = new File([blob], 'exemplo.jpg', { type: 'image/jpeg' })
          handleFileSelected(file)
        })
        .catch(error => {
          console.log('Usando imagem fallback:', error)
          fallbackImage().then(handleFileSelected)
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
      console.log('Iniciando busca de preços...')
      showLoadingSection('Buscando os melhores preços...')
      
      try {
        const results = await searchPricesApi(currentProductData.value)
        console.log('Resultados encontrados:', results.length)
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
      alert('📧 Email: contato@pricefinder.com\n📞 Telefone: (11) 99999-9999\n\nEntre em contato para parcerias!')
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