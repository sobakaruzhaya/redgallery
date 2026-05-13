document.addEventListener('DOMContentLoaded', function() {
    // Анимация появления карточек при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'skewY(-1deg) translateY(0)';
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const posterCards = document.querySelectorAll('.poster-card');
    posterCards.forEach(card => {
        observer.observe(card);
    });

    // Модальное окно для увеличения изображений
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">✕</button>
            <button class="modal-prev">‹</button>
            <button class="modal-next">›</button>
            <img class="modal-image" src="" alt="">
            <div class="modal-info">
                <h2 class="modal-title"></h2>
                <p class="modal-author"></p>
                <p class="modal-year"></p>
                <p class="modal-description"></p>
                <div class="modal-publisher"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Стили для модального окна
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }

        .modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(5px);
        }

        .modal-content {
            position: relative;
            width: 95vw;
            height: 95vh;
            max-width: 95vw;
            max-height: 95vh;
            background: var(--black-soft);
            border: 4px solid var(--gold);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
            display: flex;
            gap: 30px;
            padding: 30px;
            z-index: 1001;
            animation: scaleIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        .modal-close {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            background: var(--red-bright);
            border: 2px solid var(--gold);
            color: var(--white);
            font-size: 24px;
            font-weight: 700;
            cursor: pointer;
            z-index: 1002;
            transition: all 0.2s ease;
        }

        .modal-close:hover {
            background: var(--red-main);
            transform: rotate(90deg);
        }

        .modal-prev,
        .modal-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 60px;
            height: 60px;
            background: var(--red-bright);
            border: 3px solid var(--gold);
            color: var(--white);
            font-size: 48px;
            font-weight: 700;
            cursor: pointer;
            z-index: 1002;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }

        .modal-prev {
            left: 20px;
        }

        .modal-next {
            right: 20px;
        }

        .modal-prev:hover,
        .modal-next:hover {
            background: var(--red-main);
            transform: translateY(-50%) scale(1.1);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }

        .modal-image {
            max-width: 65%;
            max-height: 90vh;
            object-fit: contain;
            border: 3px solid var(--gold);
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
            filter: contrast(1.05) saturate(1.1) brightness(1.02);
        }

        .modal-info {
            flex: 1;
            padding: 30px;
            overflow-y: auto;
            max-height: 90vh;
        }

        .modal-title {
            font-family: 'Arial Black', sans-serif;
            font-size: 36px;
            color: var(--gold);
            text-transform: uppercase;
            margin-bottom: 20px;
            line-height: 1.3;
            text-shadow: 2px 2px 0 var(--black);
        }

        .modal-author {
            font-size: 22px;
            color: var(--white);
            margin-bottom: 12px;
            font-weight: 600;
        }

        .modal-year {
            font-size: 20px;
            color: var(--red-bright);
            font-weight: 700;
            margin-bottom: 20px;
            text-transform: uppercase;
        }

        .modal-description {
            font-size: 20px;
            color: var(--white);
            line-height: 1.8;
            margin-bottom: 20px;
            opacity: 0.95;
        }

        .modal-publisher {
            font-size: 18px;
            color: var(--gold-dark);
            line-height: 1.6;
            padding-top: 20px;
            border-top: 2px solid var(--red-dark);
        }

        @media (max-width: 768px) {
            .modal-content {
                flex-direction: column;
                max-width: 95vw;
                max-height: 95vh;
                overflow-y: auto;
            }

            .modal-image {
                max-width: 100%;
                max-height: 50vh;
            }

            .modal-info {
                max-height: none;
            }
        }
    `;
    document.head.appendChild(modalStyles);

    // Переменная для отслеживания текущего индекса плаката
    let currentPosterIndex = 0;

    // Функция для открытия модального окна с плакатом
    const openModal = (index) => {
        const card = posterCards[index];
        const image = card.querySelector('.poster-image img');
        const title = card.querySelector('.poster-title');
        const author = card.querySelector('.poster-author');
        const year = card.querySelector('.poster-year');
        const description = card.querySelector('.poster-description');
        const publisher = card.querySelector('.poster-publisher');

        const modalImage = modal.querySelector('.modal-image');
        const modalTitle = modal.querySelector('.modal-title');
        const modalAuthor = modal.querySelector('.modal-author');
        const modalYear = modal.querySelector('.modal-year');
        const modalDescription = modal.querySelector('.modal-description');
        const modalPublisher = modal.querySelector('.modal-publisher');

        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalTitle.textContent = title.textContent;
        modalAuthor.textContent = author ? author.textContent : '';
        modalYear.textContent = year ? year.textContent : '';
        modalDescription.textContent = description ? description.textContent : '';
        modalPublisher.textContent = publisher ? publisher.textContent : '';

        currentPosterIndex = index;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Открытие модального окна при клике на изображение
    posterCards.forEach((card, index) => {
        const image = card.querySelector('.poster-image img');
        image.style.cursor = 'pointer';

        image.addEventListener('click', () => {
            openModal(index);
        });
    });

    // Навигация по плакатам
    const prevPoster = () => {
        currentPosterIndex = (currentPosterIndex - 1 + posterCards.length) % posterCards.length;
        openModal(currentPosterIndex);
    };

    const nextPoster = () => {
        currentPosterIndex = (currentPosterIndex + 1) % posterCards.length;
        openModal(currentPosterIndex);
    };

    modal.querySelector('.modal-prev').addEventListener('click', prevPoster);
    modal.querySelector('.modal-next').addEventListener('click', nextPoster);

    // Закрытие модального окна
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);

    // Закрытие по Escape и навигация стрелками
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                prevPoster();
            } else if (e.key === 'ArrowRight') {
                nextPoster();
            }
        }
    });

    // Фильтрация по годам
    const createYearFilter = () => {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'year-filter';
        filterContainer.innerHTML = `
            <button class="filter-btn active" data-year="all">Все годы</button>
            <button class="filter-btn" data-year="1918">1918</button>
            <button class="filter-btn" data-year="1919">1919</button>
            <button class="filter-btn" data-year="1920">1920</button>
            <button class="filter-btn" data-year="1935+">После 1935</button>
        `;

        const filterStyles = document.createElement('style');
        filterStyles.textContent = `
            .year-filter {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-bottom: 40px;
                flex-wrap: wrap;
                padding: 0 20px;
            }

            .filter-btn {
                font-family: 'Arial Black', sans-serif;
                font-size: 16px;
                font-weight: 700;
                color: var(--white);
                background: var(--black-soft);
                border: 3px solid var(--gold);
                padding: 12px 24px;
                text-transform: uppercase;
                letter-spacing: 1px;
                cursor: pointer;
                transition: all 0.3s ease;
                transform: skewX(-5deg);
            }

            .filter-btn:hover {
                background: var(--red-dark);
                border-color: var(--red-bright);
                transform: skewX(-5deg) translateY(-2px);
            }

            .filter-btn.active {
                background: var(--red-bright);
                border-color: var(--gold);
                box-shadow: 0 4px 12px rgba(204, 0, 0, 0.5);
            }
        `;
        document.head.appendChild(filterStyles);

        const gallery = document.querySelector('.gallery-container');
        gallery.parentNode.insertBefore(filterContainer, gallery);

        // Обработка фильтрации
        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const year = btn.dataset.year;

                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                posterCards.forEach(card => {
                    if (year === 'all' || card.dataset.year === year) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'skewY(-1deg) translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'skewY(-1deg) translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    };

    createYearFilter();

    // Счётчик плакатов
    const createCounter = () => {
        const counter = document.createElement('div');
        counter.className = 'poster-counter';
        counter.innerHTML = `
            <div class="counter-content">
                <span class="counter-number">${posterCards.length}</span>
                <span class="counter-label">ПЛАКАТА В КОЛЛЕКЦИИ</span>
            </div>
        `;

        const counterStyles = document.createElement('style');
        counterStyles.textContent = `
            .poster-counter {
                text-align: center;
                margin-bottom: 40px;
                padding: 30px 20px;
                background: linear-gradient(135deg, var(--red-dark) 0%, var(--red-main) 100%);
                border-top: 4px solid var(--gold);
                border-bottom: 4px solid var(--gold);
            }

            .counter-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 20px;
            }

            .counter-number {
                font-family: 'Arial Black', sans-serif;
                font-size: 64px;
                font-weight: 900;
                color: var(--gold);
                text-shadow: 3px 3px 0 var(--black);
            }

            .counter-label {
                font-family: 'Arial Black', sans-serif;
                font-size: 20px;
                font-weight: 700;
                color: var(--white);
                text-transform: uppercase;
                letter-spacing: 2px;
                max-width: 200px;
                line-height: 1.3;
            }

            @media (max-width: 768px) {
                .counter-content {
                    flex-direction: column;
                    gap: 10px;
                }

                .counter-number {
                    font-size: 48px;
                }

                .counter-label {
                    font-size: 16px;
                }
            }
        `;
        document.head.appendChild(counterStyles);

        const subtitleBanner = document.querySelector('.subtitle-banner');
        subtitleBanner.parentNode.insertBefore(counter, subtitleBanner.nextSibling);
    };

    createCounter();

    // Плавная прокрутка вверх
    const createScrollTop = () => {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-top';
        scrollBtn.innerHTML = '↑';
        scrollBtn.title = 'Наверх';
        document.body.appendChild(scrollBtn);

        const scrollStyles = document.createElement('style');
        scrollStyles.textContent = `
            .scroll-top {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                background: var(--red-bright);
                border: 3px solid var(--gold);
                color: var(--white);
                font-size: 32px;
                font-weight: 700;
                cursor: pointer;
                z-index: 100;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            }

            .scroll-top.visible {
                opacity: 1;
                visibility: visible;
            }

            .scroll-top:hover {
                background: var(--red-main);
                transform: translateY(-5px);
            }
        `;
        document.head.appendChild(scrollStyles);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    createScrollTop();

    console.log('🚩 Галерея агитационных плакатов загружена');
    console.log(`📊 Всего плакатов: ${posterCards.length}`);
});