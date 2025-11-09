<template>
  <header class="main-header">
    <div class="header-content">
      <h1><i class="fas fa-camera"></i> PriceFinder</h1>
      <p class="subtitle">Encontre os melhores preços para qualquer produto usando inteligência artificial</p>
      <div class="patrocinador">
        <i class="fas fa-star"></i> Tecnologia avançada de reconhecimento de imagem
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style scoped>
.main-header {
  text-align: center;
  padding: 40px 0;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  border-radius: 20px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.main-header::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
  z-index: 1;
}

.header-content {
  position: relative;
  z-index: 2;
}

.main-header h1 {
  font-size: 3rem;
  margin-bottom: 15px;
  text-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto 20px;
}

.patrocinador {
  background: rgba(255,255,255,0.2);
  padding: 12px 25px;
  border-radius: 50px;
  display: inline-block;
  font-size: 1rem;
  backdrop-filter: blur(10px);
}

@media (max-width: 768px) {
  .main-header h1 {
    font-size: 2.2rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
}
</style>