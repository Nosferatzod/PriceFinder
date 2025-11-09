import { ref } from 'vue'

export function usePriceSearch() {
  const stores = [
    { id: 'amazon', name: 'Amazon', logo: 'A', color: '#FF9900' },
    { id: 'mercadolivre', name: 'Mercado Livre', logo: 'ML', color: '#FFF159' },
    { id: 'americanas', name: 'Americanas', logo: 'A', color: '#FF0000' },
    { id: 'magazineluiza', name: 'Magazine Luiza', logo: 'ML', color: '#FF6B00' },
    { id: 'casasbahia', name: 'Casas Bahia', logo: 'CB', color: '#0040FF' },
    { id: 'kabum', name: 'Kabum', logo: 'K', color: '#00A650' },
    { id: 'submarino', name: 'Submarino', logo: 'S', color: '#0000FF' },
    { id: 'shoptime', name: 'Shoptime', logo: 'ST', color: '#FF69B4' }
  ]

  const searchPrices = async (productData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = generateMockResults(productData)
        resolve(results)
      }, 2000)
    })
  }

  const generateMockResults = (productData) => {
    const resultsCount = Math.floor(Math.random() * 8) + 8 // 8-15 resultados
    const results = []
    
    for (let i = 0; i < resultsCount; i++) {
      const store = stores[Math.floor(Math.random() * stores.length)]
      const basePrice = Math.random() * 800 + 50 // 50-850
      const discount = Math.random() > 0.6 ? Math.random() * 0.5 : 0 // 0-50% de desconto
      const finalPrice = parseFloat((basePrice * (1 - discount)).toFixed(2))
      const oldPrice = discount > 0 ? parseFloat(basePrice.toFixed(2)) : null
      const rating = (Math.random() * 2 + 3).toFixed(1) // 3-5 estrelas
      const reviews = Math.floor(Math.random() * 5000)
      const shipping = Math.random() > 0.4 ? 'Grátis' : `R$ ${(Math.random() * 25 + 5).toFixed(2)}`
      const delivery = Math.random() > 0.5 ? '1-2 dias' : '3-5 dias'
      const isFeatured = i === 0 && Math.random() > 0.3
      
      results.push({
        id: `result-${i}-${Date.now()}`,
        title: `${productData.name} - ${getVariant(i)}`,
        price: finalPrice,
        oldPrice: oldPrice,
        discount: discount > 0 ? Math.round(discount * 100) : 0,
        store: store,
        rating: rating,
        reviews: reviews,
        shipping: shipping,
        delivery: delivery,
        image: `https://picsum.photos/300/200?random=${i + Math.floor(Math.random() * 1000)}`,
        url: `https://${store.id}.com/produto-${i}`,
        featured: isFeatured
      })
    }
    
    return results.sort((a, b) => a.price - b.price)
  }

  const getVariant = (index) => {
    const variants = [
      'Modelo Premium',
      'Edição Especial',
      'Kit Completo',
      'Cor Preta',
      'Cor Branca',
      'Tamanho Único',
      'Tamanho M',
      'Tamanho G',
      'Com Acessórios',
      'Versão 2024',
      'Promoção Relâmpago',
      'Últimas Unidades',
      'Frete Grátis',
      'Garantia Estendida'
    ]
    
    return variants[index % variants.length]
  }

  const filterResults = (results, filters) => {
    let filtered = [...results]
    
    if (filters.store !== 'all') {
      filtered = filtered.filter(result => result.store.id === filters.store)
    }
    
    switch (filters.sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'store':
        filtered.sort((a, b) => a.store.name.localeCompare(b.store.name))
        break
      case 'shipping':
        filtered.sort((a, b) => {
          const aFree = a.shipping === 'Grátis' ? 1 : 0
          const bFree = b.shipping === 'Grátis' ? 1 : 0
          return bFree - aFree
        })
        break
    }
    
    return filtered
  }

  return {
    searchPrices,
    filterResults,
    stores
  }
}