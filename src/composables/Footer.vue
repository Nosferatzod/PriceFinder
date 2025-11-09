<template>
  <footer class="main-footer">
    <div class="footer-content">
      <div class="footer-main">
        <div class="footer-brand">
          <h3><i class="fas fa-camera"></i> PriceFinder</h3>
          <p>Encontre os melhores preços usando inteligência artificial</p>
          <div class="social-links">
            <a href="#" class="social-link">
              <i class="fab fa-facebook"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
        
        <div class="footer-links-grid">
          <div class="link-group">
            <h4>Produto</h4>
            <a href="#" class="footer-link">Como funciona</a>
            <a href="#" class="footer-link">Recursos</a>
            <a href="#" class="footer-link">Preços</a>
            <a href="#" class="footer-link">API</a>
          </div>
          
          <div class="link-group">
            <h4>Empresa</h4>
            <a href="#" class="footer-link">Sobre nós</a>
            <a href="#" class="footer-link">Carreiras</a>
            <a href="#" class="footer-link">Blog</a>
            <a href="#" class="footer-link">Imprensa</a>
          </div>
          
          <div class="link-group">
            <h4>Suporte</h4>
            <a href="#" class="footer-link">Ajuda</a>
            <a href="#" class="footer-link">Contato</a>
            <a href="#" class="footer-link">Status</a>
            <a href="#" class="footer-link">Community</a>
          </div>
          
          <div class="link-group">
            <h4>Legal</h4>
            <a href="#" class="footer-link">Privacidade</a>
            <a href="#" class="footer-link">Termos</a>
            <a href="#" class="footer-link">Cookies</a>
            <a href="#" class="footer-link">Licenças</a>
          </div>
        </div>
      </div>
      
      <div class="contact-promo">
        <div class="promo-content">
          <h3>🚀 Quer implementar em seu e-commerce?</h3>
          <p>Nossa tecnologia de busca por imagem pode revolucionar suas vendas</p>
          <div class="promo-features">
            <div class="feature">
              <i class="fas fa-robot"></i>
              <span>IA Avançada</span>
            </div>
            <div class="feature">
              <i class="fas fa-bolt"></i>
              <span>Processamento Rápido</span>
            </div>
            <div class="feature">
              <i class="fas fa-chart-line"></i>
              <span>+30% Conversão</span>
            </div>
          </div>
          <button class="contact-btn" @click="contactUs">
            <i class="fas fa-envelope"></i> Fale Conosco
          </button>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-info">
          <p>&copy; 2024 PriceFinder. Todos os direitos reservados.</p>
          <p>Feito com <i class="fas fa-heart text-danger"></i> para revolucionar suas compras</p>
        </div>
        <div class="footer-badges">
          <span class="badge">
            <i class="fas fa-shield-alt"></i> 100% Seguro
          </span>
          <span class="badge">
            <i class="fas fa-lock"></i> Privacidade
          </span>
          <span class="badge">
            <i class="fas fa-bolt"></i> Rápido
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  emits: ['contact'],
  setup(props, { emit }) {
    const contactUs = () => {
      emit('contact')
    }

    return {
      contactUs
    }
  }
}
</script>

<style scoped>
.main-footer {
  margin-top: 60px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-main {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 50px;
  padding: 50px 0 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-brand h3 {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: white;
}

.footer-brand p {
  color: #b0b7c3;
  margin-bottom: 25px;
  line-height: 1.6;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.social-link:hover {
  background: var(--primary);
  transform: translateY(-3px);
}

.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.link-group h4 {
  color: white;
  margin-bottom: 20px;
  font-size: 1.1rem;
  font-weight: 600;
}

.footer-link {
  display: block;
  color: #b0b7c3;
  text-decoration: none;
  padding: 8px 0;
  transition: color 0.3s ease;
  font-size: 0.95rem;
}

.footer-link:hover {
  color: white;
  padding-left: 5px;
}

.contact-promo {
  padding: 50px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.promo-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.promo-content h3 {
  font-size: 2rem;
  margin-bottom: 15px;
  color: white;
}

.promo-content p {
  color: #b0b7c3;
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.promo-features {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.feature {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-weight: 500;
}

.feature i {
  color: var(--accent);
  font-size: 1.2rem;
}

.contact-btn {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  border: none;
  padding: 15px 35px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 25px rgba(106, 17, 203, 0.3);
}

.contact-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(106, 17, 203, 0.4);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 0;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-info p {
  color: #b0b7c3;
  margin: 5px 0;
}

.footer-badges {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.badge {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(10px);
}

.badge i {
  font-size: 0.8rem;
}

@media (max-width: 1024px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .footer-links-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .footer-main {
    padding: 40px 0 30px;
  }
  
  .footer-links-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .promo-features {
    flex-direction: column;
    gap: 20px;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-brand {
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .promo-content h3 {
    font-size: 1.6rem;
  }
}
</style>