import { ref } from 'vue'

export function useImageProcessor() {
  const maxFileSize = 10 * 1024 * 1024 // 10MB
  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  const validateImage = (file) => {
    if (!file) {
      return { isValid: false, message: 'Nenhum arquivo selecionado' }
    }

    if (!supportedFormats.includes(file.type)) {
      return { 
        isValid: false, 
        message: 'Formato não suportado. Use JPG, PNG ou WebP.' 
      }
    }

    if (file.size > maxFileSize) {
      return { 
        isValid: false, 
        message: 'Arquivo muito grande. Tamanho máximo: 10MB.' 
      }
    }

    return { isValid: true, message: 'Arquivo válido' }
  }

  const processImage = async (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const productData = simulateProductRecognition(file.name)
          resolve({
            imageUrl: e.target.result,
            productData: productData
          })
        }
        reader.readAsDataURL(file)
      }, 1500)
    })
  }

  const simulateProductRecognition = (filename) => {
    const categories = ['Eletrônicos', 'Vestuário', 'Casa e Decoração', 'Esportes', 'Livros']
    const brands = ['Samsung', 'Nike', 'Apple', 'Sony', 'Adidas', 'LG', 'Philips']
    
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    const randomBrand = brands[Math.floor(Math.random() * brands.length)]
    const confidence = (Math.random() * 30 + 70).toFixed(1)
    
    const productName = generateProductName(filename, randomCategory)
    
    return {
      name: productName,
      category: randomCategory,
      brand: randomBrand,
      confidence: confidence,
      description: `Produto ${randomCategory.toLowerCase()} da marca ${randomBrand} identificado com alta precisão pela nossa IA. Características analisadas: design, cor, modelo e especificações técnicas.`
    }
  }

  const generateProductName = (filename, category) => {
    const baseName = filename.split('.')[0].replace(/[^a-zA-Z0-9]/g, ' ')
    const prefixes = {
      'Eletrônicos': ['Smartphone', 'Tablet', 'Notebook', 'Fone de Ouvido', 'Smartwatch', 'Câmera Digital'],
      'Vestuário': ['Camiseta', 'Calça', 'Tênis', 'Jaqueta', 'Vestido', 'Moletom'],
      'Casa e Decoração': ['Luminária', 'Cadeira', 'Mesa', 'Vaso Decorativo', 'Tapete', 'Cortina'],
      'Esportes': ['Bola', 'Raquete', 'Tênis Esportivo', 'Equipamento', 'Acessório', 'Suplemento'],
      'Livros': ['Livro', 'Revista', 'Manual', 'Guia', 'Enciclopédia', 'Romance']
    }
    
    const prefix = prefixes[category]?.[Math.floor(Math.random() * prefixes[category].length)] || 'Produto'
    return `${prefix} ${baseName || category} ${Math.floor(Math.random() * 1000)}`
  }

  const capturePhoto = (videoElement) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    
    canvas.width = videoElement.videoWidth
    canvas.height = videoElement.videoHeight
    
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/jpeg', 0.8)
    })
  }

  return {
    validateImage,
    processImage,
    capturePhoto
  }
}