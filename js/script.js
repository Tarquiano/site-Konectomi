document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA GERAL (PARA TODAS AS PÁGINAS) ---
    const hamburger = document.querySelector('.hamburger-button');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');
    if (hamburger) hamburger.addEventListener('click', () => navMenu.classList.toggle('is-active'));
    if (navLinks) navLinks.forEach(link => link.addEventListener('click', () => {
        if (!link.classList.contains('open-legal-popup')) {
             if (navMenu.classList.contains('is-active')) {
                 navMenu.classList.remove('is-active');
             }
        }
    }));

    const header = document.querySelector('.main-header');
    if (header) window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 50));

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
    if (faders) faders.forEach(fader => appearOnScroll.observe(fader));

    // --- LÓGICA DO POPUP DE TERMOS E PRIVACIDADE ---
    const legalPopup = document.getElementById('legal-popup');
    if (legalPopup) {
        const openLegalPopupButtons = document.querySelectorAll('.open-legal-popup');
        const closeLegalPopupButton = legalPopup.querySelector('.close-button');

        const openPopup = (e) => {
            e.preventDefault();
            legalPopup.style.display = 'flex';
        };

        const closePopup = () => {
            legalPopup.style.display = 'none';
        };

        openLegalPopupButtons.forEach(btn => btn.addEventListener('click', openPopup));
        closeLegalPopupButton.addEventListener('click', closePopup);
        window.addEventListener('click', (event) => {
            if (event.target == legalPopup) {
                closePopup();
            }
        });
    }

    // --- LÓGICA DO BANNER DE COOKIES ---
    const cookieBanner = document.getElementById('cookie-banner');
    if (cookieBanner) {
        const acceptCookieBtn = document.getElementById('cookie-accept-btn');
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };
        if (!getCookie('konectomi_cookie_consent')) {
            setTimeout(() => cookieBanner.classList.add('is-visible'), 1500);
        }
        acceptCookieBtn.addEventListener('click', () => {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 365);
            document.cookie = `konectomi_cookie_consent=true;path=/;expires=${expiryDate.toUTCString()}`;
            cookieBanner.classList.remove('is-visible');
        });
    }
    
    // --- LÓGICA DA PÁGINA PRINCIPAL (INDEX.HTML) ---
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

    // --- LÓGICA DO MODAL DE JOGOS (CORRIGIDA) ---
    const gameModal = document.getElementById('game-modal');
    if (gameModal) {
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        // CORREÇÃO APLICADA AQUI: Seleciona todos os .info-button sem depender da estrutura do carrossel.
        const infoButtons = document.querySelectorAll('.info-button'); 
        const gameModalClose = gameModal.querySelector('.close-button');
        const prevArrow = gameModal.querySelector('.carousel-arrow.prev');
        const nextArrow = gameModal.querySelector('.carousel-arrow.next');
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
                gameModal.style.display = 'flex';
            });
        });

        const closeGameModal = () => gameModal.style.display = 'none';
        gameModalClose.addEventListener('click', closeGameModal);
        window.addEventListener('click', (event) => { if (event.target == gameModal) closeGameModal(); });
        nextArrow.addEventListener('click', () => { currentImageIndex = (currentImageIndex + 1) % currentGallery.length; updateModalImage(); });
        prevArrow.addEventListener('click', () => { currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length; updateModalImage(); });
    }

    // --- LÓGICA DO POPUP DE EVENTO ---
    const eventPopup = document.getElementById('event-popup');
    if (eventPopup) {
        const eventPopupClose = document.getElementById('event-popup-close');
        const eventDate = new Date('January 10, 2026 15:00:00 GMT-0300').getTime();

        const popupStart = new Date('December 25, 2025 00:00:00 GMT-0300').getTime();
        const popupEnd = eventDate + (1 * 60 * 60 * 1000); 
        const now = new Date().getTime();

        const popupYearSpan = eventPopup.querySelector('.nav-event-2025');
        if (popupYearSpan) {
            const eventYear = new Date(eventDate).getUTCFullYear();
            popupYearSpan.textContent = String(eventYear);
        }

        const showPopup = () => {
            if (sessionStorage.getItem('eventPopupShown')) return;
            eventPopup.style.display = 'flex';
            sessionStorage.setItem('eventPopupShown', 'true');
        };

        if (now >= popupStart && now <= popupEnd) {
            if (now > eventDate) {
                const p = eventPopup.querySelector('p');
                if (p) p.textContent = 'O evento já aconteceu — confira as novidades e lançamentos na nossa página!';
                const cta = eventPopup.querySelector('.cta-button');
                if (cta) cta.textContent = 'Ver Novidades';
            }
            setTimeout(showPopup, 1500);
        }

        const closeEventPopup = () => eventPopup.style.display = 'none';
        eventPopupClose.addEventListener('click', closeEventPopup);
        window.addEventListener('click', (event) => { if (event.target == eventPopup) closeEventPopup(); });
    }

    // --- LÓGICA DA PÁGINA DO EVENTO (KONECTOMICON.HTML) ---
    const countdownTopContainer = document.getElementById('countdown-container');
    if (countdownTopContainer) {
        
        const eventDate = new Date('January 10, 2026 15:00:00 GMT-0300').getTime();
        const gameLink = "https://www.roblox.com/pt/games/74975667191920/Centro-de-eventos";
        
        const finishedTopContainer = document.getElementById('countdown-finished-content');
        const timerElements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
        
        const countdownBottomContainer = document.getElementById('countdown-container-bottom');
        const finishedBottomContainer = document.getElementById('countdown-finished-content-bottom');

        let countdownInterval;

        const updateTimerDisplay = (element, newValue) => {
            if (!element) return;
            const oldValue = element.textContent;
            if (newValue === oldValue) return;
            element.classList.add('is-changing');
            setTimeout(() => {
                element.textContent = newValue;
                element.classList.remove('is-changing');
            }, 400); 
        };

        const runCountdown = () => {
            const now = new Date().getTime();
            const distance = eventDate - now;

            const earlyAccessTime = 30 * 60 * 1000;
            if (distance < earlyAccessTime) {
                if (countdownInterval) clearInterval(countdownInterval);
                
                countdownTopContainer.style.display = 'none';
                if(countdownBottomContainer) countdownBottomContainer.style.display = 'none';

                finishedTopContainer.style.display = 'block';
                if(finishedBottomContainer) finishedBottomContainer.style.display = 'block';

                if (distance < 0) {
                    finishedTopContainer.querySelector('.countdown-title').textContent = 'O EVENTO COMEÇOU!';
                } else {
                    finishedTopContainer.querySelector('.countdown-title').textContent = 'O EVENTO COMEÇA EM BREVE!';
                }
                return;
            }

            const values = {
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            };

            for (const key in values) {
                const formattedValue = values[key] < 10 ? '0' + String(values[key]) : String(values[key]);
                updateTimerDisplay(timerElements[key], formattedValue);
            }
        };

        const initCountdownAnimation = async () => {
            const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            const animateUnit = async (element, finalValue) => {
                if (!element) return;
                let i = 0;
                const slotInterval = setInterval(() => {
                    const randomValue = Math.floor(Math.random() * 100);
                    const formattedRandom = randomValue < 10 ? '0' + randomValue : randomValue;
                    element.textContent = formattedRandom;
                    i++;
                    if (i > 5) {
                        clearInterval(slotInterval);
                        element.textContent = finalValue;
                    }
                }, 80);
            };

            const now = new Date().getTime();
            const distance = eventDate - now;
            const finalValues = {
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            };

            for (const key in finalValues) {
                finalValues[key] = finalValues[key] < 10 ? '0' + String(finalValues[key]) : String(finalValues[key]);
            }
            
            await animateUnit(timerElements.seconds, finalValues.seconds);
            await sleep(100);
            await animateUnit(timerElements.minutes, finalValues.minutes);
            await sleep(100);
            await animateUnit(timerElements.hours, finalValues.hours);
            await sleep(100);
            await animateUnit(timerElements.days, finalValues.days);

            countdownInterval = setInterval(runCountdown, 1000);
        };
        
        initCountdownAnimation();

        const calendarFunction = () => {
            const eventStart = new Date(eventDate);
            // MODIFICADO: Duração do evento ajustada para 1 hora
            const eventEnd = new Date(eventStart.getTime() + (1 * 60 * 60 * 1000));
            const toUTCString = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            const icsDescription = `O maior evento da Konectomi! Anúncios, lançamentos e muitas surpresas. Não perca!\\n\\nAcesse o evento aqui: ${gameLink}`;
            
            const icsContent = [
                'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
                `UID:${Date.now()}@konectomi.com`,
                `DTSTAMP:${toUTCString(new Date())}`,
                `DTSTART:${toUTCString(eventStart)}`,
                `DTEND:${toUTCString(eventEnd)}`,
                'SUMMARY:Konectomi Con 2026',
                `DESCRIPTION:${icsDescription}`,
                `LOCATION:${gameLink}`,
                'END:VEVENT', 'END:VCALENDAR'
            ].join('\n');
            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'konectomi-con-2026.ics';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            document.getElementById('ics-popup').style.display = 'flex';
        };

        const addToCalendarBtnTop = document.getElementById('add-to-calendar-btn');
        const addToCalendarBtnBottom = document.getElementById('add-to-calendar-btn-bottom');

        if (addToCalendarBtnTop) addToCalendarBtnTop.addEventListener('click', calendarFunction);
        if (addToCalendarBtnBottom) addToCalendarBtnBottom.addEventListener('click', calendarFunction);
        
        const icsPopup = document.getElementById('ics-popup');
        if (icsPopup) {
            const icsPopupClose = document.getElementById('ics-popup-close');
            const icsPopupOkBtn = document.getElementById('ics-popup-ok-btn');
            const closeIcsPopup = () => icsPopup.style.display = 'none';
            icsPopupClose.addEventListener('click', closeIcsPopup);
            icsPopupOkBtn.addEventListener('click', closeIcsPopup);
            window.addEventListener('click', (event) => {
                if (event.target == icsPopup) closeIcsPopup();
            });
        }
    }
});