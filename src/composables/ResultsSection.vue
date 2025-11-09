<template>
  <section class="card results-section">
    <div class="results-header">
      <div class="header-left">
        <h2>🎯 Resultados Encontrados</h2>
        <p class="results-subtitle">Melhores ofertas para o seu produto</p>
      </div>
      <div class="header-right">
        <div class="results-count">
          <span class="count">{{ filteredResults.length }}</span>
          <span class="label">ofertas disponíveis</span>
        </div>
      </div>
    </div>
    
    <div class="filters-section">
      <div class="filters">
        <div class="filter-group">
          <label>Ordenar por:</label>
          <select class="filter-select" v-model="sortBy" @change="onFiltersChange">
            <option value="price_asc">Menor Preço</option>
            <option value="price_desc">Maior Preço</option>
            <option value="rating">Melhor Avaliação</option>
            <option value="store">Loja</option>
            <option value="shipping">Frete Grátis</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Filtrar por loja:</label>
          <select class="filter-select" v-model="storeFilter" @change="onFiltersChange">
            <option value="all">Todas as Lojas</option>
            <option v-for="store in stores" :key="store.id" :value="store.id">
              {{ store.name }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Mostrar:</label>
          <select class="filter-select" v-model="itemsPerPage" @change="onFiltersChange">
            <option value="12">12 itens</option>
            <option value="24">24 itens</option>
            <option value="48">48 itens</option>
          </select>
        </div>
      </div>
      
      <div class="quick-stats">
        <div class="stat">
          <i class="fas fa-money-bill-wave"></i>
          <span>Economia média: <strong>{{ averageSavings }}%</strong></span>
        </div>
        <div class="stat">
          <i class="fas fa-shipping-fast"></i>
          <span>Frete grátis: <strong>{{ freeShippingCount }}</strong></span>
        </div>
        <div class="stat">
          <i class="fas fa-star"></i>
          <span>Avaliação: <strong>{{ averageRating }}/5</strong></span>
        </div>
      </div>
    </div>
    
    <div class="results-grid" v-if="filteredResults.length > 0">
      <div 
        v-for="result in paginatedResults" 
        :key="result.id"
        class="result-card"
        :class="{ 'featured': result.featured, 'best-price': isBestPrice(result) }"
      >
        <div class="result-badges">
          <span v-if="result.featured" class="badge featured-badge">
            <i class="fas fa-crown"></i> DESTAQUE
          </span>
          <span v-if="isBestPrice(result)" class="badge best-price-badge">
            <i class="fas fa-trophy"></i> MELHOR PREÇO
          </span>
          <span v-if="result.discount > 0" class="badge discount-badge">
            {{ result.discount }}% OFF
          </span>
          <span v-if="result.shipping === 'Grátis'" class="badge shipping-badge">
            <i class="fas fa-shipping-fast"></i> FRETE GRÁTIS
          </span>
        </div>
        
        <div class="result-image">
          <img :src="result.image" :alt="result.title" @error="handleImageError">
          <div class="image-overlay">
            <button class="btn-overlay" @click="viewProduct(result)">
              <i class="fas fa-external-link-alt"></i>
            </button>
          </div>
        </div>
        
        <div class="result-info">
          <div class="result-store">
            <div class="store-logo" :style="{ backgroundColor: result.store.color }">
              {{ result.store.logo }}
            </div>
            <span class="store-name">{{ result.store.name }}</span>
            <div class="store-rating">
              <i class="fas fa-star"></i>
              <span>{{ result.rating }}</span>
            </div>
          </div>
          
          <div class="result-title">{{ result.title }}</div>
          
          <div class="result-pricing">
            <div class="price-main">R$ {{ result.price.toFixed(2) }}</div>
            <div v-if="result.oldPrice" class="price-old">
              R$ {{ result.oldPrice.toFixed(2) }}
            </div>
            <div v-if="result.discount > 0" class="price-savings">
              Economize R$ {{ (result.oldPrice - result.price).toFixed(2) }}
            </div>
          </div>
          
          <div class="result-shipping">
            <i class="fas fa-truck"></i>
            <span>{{ result.shipping }}</span>
            <span class="delivery-time">• {{ result.delivery }}</span>
          </div>
          
          <div class="result-reviews">
            <i class="fas fa-comment"></i>
            <span>{{ result.reviews.toLocaleString() }} avaliações</span>
          </div>
          
          <div class="result-actions">
            <a :href="result.url" target="_blank" class="btn btn-primary btn-small">
              <i class="fas fa-shopping-cart"></i> Comprar Agora
            </a>
            <button 
              class="btn btn-outline-primary btn-small" 
              @click="toggleSaveResult(result.id)"
              :class="{ 'saved': savedResults.includes(result.id) }"
            >
              <i class="fas" :class="savedResults.includes(result.id) ? 'fa-heart' : 'far fa-heart'"></i>
            </button>
            <button class="btn btn-outline-secondary btn-small" @click="shareResult(result)">
              <i class="fas fa-share"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-results">
      <div class="no-results-content">
        <i class="fas fa-search fa-3x"></i>
        <h3>Nenhum resultado encontrado</h3>
        <p>Tente ajustar os filtros ou usar uma imagem diferente.</p>
        <button class="btn btn-primary" @click="$emit('change-image')">
          <i class="fas fa-exchange-alt"></i> Tentar Outra Imagem
        </button>
      </div>
    </div>
    
    <div v-if="filteredResults.length > 0" class="pagination">
      <button 
        class="btn btn-outline-primary" 
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <i class="fas fa-chevron-left"></i> Anterior
      </button>
      
      <div class="page-info">
        Página {{ currentPage }} de {{ totalPages }}
      </div>
      
      <button 
        class="btn btn-outline-primary" 
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Próxima <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </section>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'ResultsSection',
  props: {
    results: Array,
    stores: Array
  },
  emits: ['change-image'],
  setup(props) {
    const sortBy = ref('price_asc')
    const storeFilter = ref('all')
    const itemsPerPage = ref('12')
    const currentPage = ref(1)
    const savedResults = ref([])

    const filteredResults = computed(() => {
      let filtered = [...props.results]
      
      if (storeFilter.value !== 'all') {
        filtered = filtered.filter(result => result.store.id === storeFilter.value)
      }
      
      switch (sortBy.value) {
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
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredResults.value.length / parseInt(itemsPerPage.value))
    })

    const paginatedResults = computed(() => {
      const start = (currentPage.value - 1) * parseInt(itemsPerPage.value)
      const end = start + parseInt(itemsPerPage.value)
      return filteredResults.value.slice(start, end)
    })

    const averageSavings = computed(() => {
      const discounts = props.results
        .filter(r => r.discount > 0)
        .map(r => r.discount)
      return discounts.length > 0 
        ? Math.round(discounts.reduce((a, b) => a + b) / discounts.length)
        : 0
    })

    const freeShippingCount = computed(() => {
      return props.results.filter(r => r.shipping === 'Grátis').length
    })

    const averageRating = computed(() => {
      const ratings = props.results.map(r => parseFloat(r.rating))
      return (ratings.reduce((a, b) => a + b) / ratings.length).toFixed(1)
    })

    const onFiltersChange = () => {
      currentPage.value = 1
    }

    const isBestPrice = (result) => {
      if (filteredResults.value.length === 0) return false
      return result.price === Math.min(...filteredResults.value.map(r => r.price))
    }

    const toggleSaveResult = (resultId) => {
      const index = savedResults.value.indexOf(resultId)
      if (index > -1) {
        savedResults.value.splice(index, 1)
      } else {
        savedResults.value.push(resultId)
      }
    }

    const shareResult = (result) => {
      const text = `Encontrei ${result.title} por R$ ${result.price.toFixed(2)} na ${result.store.name}`
      if (navigator.share) {
        navigator.share({
          title: 'PriceFinder - Melhor Oferta',
          text: text,
          url: result.url
        })
      } else {
        navigator.clipboard.writeText(`${text} - ${result.url}`)
        alert('Link copiado para a área de transferência!')
      }
    }

    const viewProduct = (result) => {
      window.open(result.url, '_blank')
    }

    const handleImageError = (event) => {
      event.target.style.display = 'none'
      event.target.parentNode.innerHTML = '<div class="image-placeholder"><i class="fas fa-image"></i></div>'
    }

    return {
      sortBy,
      storeFilter,
      itemsPerPage,
      currentPage,
      savedResults,
      filteredResults,
      paginatedResults,
      totalPages,
      averageSavings,
      freeShippingCount,
      averageRating,
      onFiltersChange,
      isBestPrice,
      toggleSaveResult,
      shareResult,
      viewProduct,
      handleImageError
    }
  }
}
</script>

<style scoped>
.results-section {
  padding: 30px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.header-left h2 {
  color: var(--dark);
  margin-bottom: 5px;
}

.results-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.results-count {
  text-align: right;
}

.count {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
}

.label {
  font-size: 0.9rem;
  color: #666;
}

.filters-section {
  margin-bottom: 30px;
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 600;
  color: var(--dark);
  font-size: 0.9rem;
}

.filter-select {
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
  min-width: 150px;
}

.filter-select:focus {
  border-color: var(--primary);
  outline: none;
}

.quick-stats {
  display: flex;
  gap: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
  border-radius: 10px;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--dark);
  font-weight: 500;
}

.stat i {
  color: var(--accent);
  font-size: 1.1rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.result-card {
  border: 2px solid #f8f9fa;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: white;
  position: relative;
}

.result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border-color: var(--primary);
}

.result-card.featured {
  border-color: var(--accent);
  box-shadow: 0 10px 25px rgba(0, 184, 148, 0.2);
}

.result-card.best-price {
  border-color: var(--warning);
  box-shadow: 0 10px 25px rgba(255, 193, 7, 0.2);
}

.result-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 2;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 4px;
  backdrop-filter: blur(10px);
}

.featured-badge {
  background: rgba(0, 184, 148, 0.9);
  color: white;
}

.best-price-badge {
  background: rgba(255, 193, 7, 0.9);
  color: #212529;
}

.discount-badge {
  background: rgba(220, 53, 69, 0.9);
  color: white;
}

.shipping-badge {
  background: rgba(40, 167, 69, 0.9);
  color: white;
}

.result-image {
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
  background: var(--light);
}

.result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.result-card:hover .result-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.result-card:hover .image-overlay {
  opacity: 1;
}

.btn-overlay {
  background: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.btn-overlay:hover {
  transform: scale(1.1);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #ccc;
}

.result-info {
  padding: 20px;
}

.result-store {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.store-logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 0.8rem;
}

.store-name {
  font-weight: 600;
  color: var(--dark);
  flex: 1;
}

.store-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--warning);
  font-weight: 600;
  font-size: 0.9rem;
}

.result-title {
  font-weight: 600;
  margin-bottom: 15px;
  font-size: 1.1rem;
  line-height: 1.4;
  color: var(--dark);
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.result-pricing {
  margin-bottom: 15px;
}

.price-main {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 5px;
}

.price-old {
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
  margin-bottom: 5px;
}

.price-savings {
  color: var(--success);
  font-weight: 600;
  font-size: 0.9rem;
}

.result-shipping, .result-reviews {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #666;
  font-size: 0.9rem;
}

.result-shipping i {
  color: var(--success);
}

.result-reviews i {
  color: var(--primary);
}

.delivery-time {
  color: #999;
}

.result-actions {
  display: flex;
  gap: 8px;
  margin-top: 15px;
}

.result-actions .btn {
  flex: 1;
  justify-content: center;
}

.result-actions .btn-small {
  padding: 8px 12px;
  flex: 0 0 auto;
}

.btn.saved {
  background: var(--danger);
  color: white;
  border-color: var(--danger);
}

.no-results {
  text-align: center;
  padding: 60px 30px;
}

.no-results-content i {
  color: #ccc;
  margin-bottom: 20px;
}

.no-results-content h3 {
  color: var(--dark);
  margin-bottom: 10px;
}

.no-results-content p {
  color: #666;
  margin-bottom: 25px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.page-info {
  color: #666;
  font-weight: 500;
}

@media (max-width: 768px) {
  .results-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .results-count {
    text-align: left;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .filter-select {
    min-width: 100%;
  }
  
  .quick-stats {
    flex-direction: column;
    gap: 15px;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination {
    flex-direction: column;
    gap: 15px;
  }
}
</style>