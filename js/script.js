document.addEventListener('DOMContentLoaded', () => {
    
    // --- MENU HAMBURGUER PARA MOBILE ---
    const hamburger = document.querySelector('.hamburger-button');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');
    hamburger.addEventListener('click', () => navMenu.classList.toggle('is-active'));
    navLinks.forEach(link => link.addEventListener('click', () => navMenu.classList.remove('is-active')));

    // --- EFEITOS GERAIS DA INTERFACE ---
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 50));
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);
    faders.forEach(fader => appearOnScroll.observe(fader));
    
    // --- TEXTO ROTATIVO ---
    const rotatingText = document.getElementById('rotating-text');
    if (rotatingText) {
        const words = [
            { text: 'Criatividade', class: 'text-gradient-green' },
            { text: 'Respeito', class: 'text-gradient-blue' },
            { text: 'Inovação', class: 'text-gradient-purple' },
            { text: 'Conexão', class: 'text-gradient-green' }
        ];
        let wordIndex = 0;

        setInterval(() => {
            wordIndex = (wordIndex + 1) % words.length;
            const newWord = words[wordIndex];

            rotatingText.style.opacity = '0';
            rotatingText.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                rotatingText.textContent = newWord.text;
                rotatingText.className = newWord.class;
                rotatingText.style.opacity = '1';
                rotatingText.style.transform = 'translateY(0)';
            }, 500);
        }, 3000);
    }

    // --- FUNCIONALIDADE DO MODAL ---
    const modal = document.getElementById('game-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const infoButtons = document.querySelectorAll('.info-button');
    const closeButton = document.querySelector('.close-button');
    const prevArrow = document.querySelector('.carousel-arrow.prev');
    const nextArrow = document.querySelector('.carousel-arrow.next');

    let currentGallery = [];
    let currentImageIndex = 0;

    const updateModalImage = () => {
        if (currentGallery.length > 0) {
            modalImg.src = currentGallery[currentImageIndex];
            modalImg.alt = `Imagem ${currentImageIndex + 1} de ${modalTitle.textContent}`;
        }
    };

    infoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.game-card');
            const title = card.querySelector('h3').textContent;
            const gameId = card.dataset.gameId;
            const imageCount = parseInt(card.dataset.imageCount, 10);
            const description = card.dataset.desc;

            currentGallery = [];
            for (let i = 1; i <= imageCount; i++) {
                const imageName = card.classList.contains('is-placeholder') ? 'placeholder-game.png' : `${gameId}_${i}.png`;
                currentGallery.push(`assets/images/${imageName}`);
            }
            
            currentImageIndex = 0;
            modalTitle.textContent = title;
            modalDesc.textContent = description;
            updateModalImage();
            
            const showArrows = currentGallery.length > 1;
            prevArrow.style.display = showArrows ? 'flex' : 'none';
            nextArrow.style.display = showArrows ? 'flex' : 'none';
            
            modal.style.display = 'flex';
        });
    });

    const closeModal = () => modal.style.display = 'none';
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => { if (event.target == modal) closeModal(); });
    nextArrow.addEventListener('click', () => { currentImageIndex = (currentImageIndex + 1) % currentGallery.length; updateModalImage(); });
    prevArrow.addEventListener('click', () => { currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length; updateModalImage(); });

    // --- FUNCIONALIDADE DO BANNER DE COOKIES ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookieBtn = document.getElementById('cookie-accept-btn');

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };
    
    if (!getCookie('konectomi_cookie_consent')) {
        setTimeout(() => {
            cookieBanner.classList.add('is-visible');
        }, 1500);
    }

    acceptCookieBtn.addEventListener('click', () => {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 365);
        
        document.cookie = `konectomi_cookie_consent=true;path=/;expires=${expiryDate.toUTCString()}`;
        cookieBanner.classList.remove('is-visible');
    });

});
