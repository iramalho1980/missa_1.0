document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close');
    const songItems = document.querySelectorAll('.song-item[data-image]');
    const searchInput = document.getElementById('search');
    const allSongItems = document.querySelectorAll('.song-item');

    // Função para abrir o modal com a imagem ou PDF
    function openModal(imageSrc) {
        // Verifica se é um PDF
        if (imageSrc.toLowerCase().endsWith('.pdf')) {
            // Para PDFs, abre em uma nova aba
            window.open(imageSrc, '_blank');
        } else {
            // Para imagens, abre no modal
            modalImage.src = imageSrc;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Previne scroll do body
        }
    }

    // Função para fechar o modal
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restaura scroll do body
        setTimeout(() => {
            modalImage.src = '';
        }, 300);
    }

    // Event listeners para os itens de cânticos com imagens
    songItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            if (imageSrc) {
                openModal(imageSrc);
            }
        });

        // Adiciona efeito de hover mais pronunciado para itens clicáveis
        item.style.cursor = 'pointer';
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Event listener para fechar o modal
    closeBtn.addEventListener('click', closeModal);

    // Fechar modal clicando fora da imagem
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Fechar modal com a tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Funcionalidade de pesquisa
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        allSongItems.forEach(item => {
            const songText = item.querySelector('span').textContent.toLowerCase();
            const isVisible = songText.includes(searchTerm);
            
            if (isVisible) {
                item.style.display = 'block';
                item.style.animation = 'slideInUp 0.3s ease-out forwards';
            } else {
                item.style.display = 'none';
            }
        });

        // Se não há termo de pesquisa, mostra todos os itens
        if (searchTerm === '') {
            allSongItems.forEach((item, index) => {
                item.style.display = 'block';
                item.style.animation = `slideInUp 0.6s ease-out forwards`;
                item.style.animationDelay = `${0.1 * index}s`;
            });
        }
    });

    // Adiciona efeito de foco no campo de pesquisa
    searchInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });

    searchInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });

    // Adiciona indicador visual para itens sem imagem
    const itemsWithoutImage = document.querySelectorAll('.song-item:not([data-image])');
    itemsWithoutImage.forEach(item => {
        item.style.opacity = '0.7';
        item.style.cursor = 'default';
        
        // Adiciona tooltip para indicar que não há imagem disponível
        item.title = 'Imagem não disponível';
        
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
            this.style.opacity = '0.8';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.opacity = '0.7';
        });
    });

    // Animação de entrada suave para os elementos
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observa todos os elementos animáveis
    document.querySelectorAll('.song-item, .main-title, .search-section, .section-title').forEach(el => {
        observer.observe(el);
    });

    // Adiciona efeito de ripple nos botões clicáveis
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    // Adiciona CSS para o efeito ripple
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .song-item {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 140, 0, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // Aplica o efeito ripple aos itens clicáveis
    songItems.forEach(item => {
        item.addEventListener('click', createRipple);
    });

    console.log('Pasta da Missa - Aplicação carregada com sucesso!');
    console.log(`${songItems.length} cânticos com imagens disponíveis`);
    console.log(`${allSongItems.length} cânticos no total`);
});

