window.addEventListener('load', function() {
    // Lógica de Pop-ups (CORREGIDA)
    const welcomePopup = document.getElementById('popup-overlay');
    const welcomeCloseBtn = document.getElementById('popup-close');
    const welcomeCtaBtn = document.getElementById('popup-cta-btn');
    
    // Se eliminó la lógica de sessionStorage para que el popup siempre aparezca al cargar.
    if (welcomePopup) {
        welcomePopup.style.display = 'flex';
    }

    const closeWelcomePopup = () => { if(welcomePopup) welcomePopup.style.display = 'none'; };
    if(welcomeCloseBtn) welcomeCloseBtn.addEventListener('click', closeWelcomePopup);
    if(welcomeCtaBtn) welcomeCtaBtn.addEventListener('click', closeWelcomePopup);
    if(welcomePopup) welcomePopup.addEventListener('click', (event) => { if (event.target === welcomePopup) closeWelcomePopup(); });

    const notFoundPopup = document.getElementById('not-found-popup');
    const notFoundCloseBtn = document.getElementById('not-found-close');
    const closeNotFoundPopup = () => { if(notFoundPopup) notFoundPopup.style.display = 'none'; };
    if(notFoundCloseBtn) notFoundCloseBtn.addEventListener('click', closeNotFoundPopup);
    if(notFoundPopup) notFoundPopup.addEventListener('click', (event) => { if (event.target === notFoundPopup) closeNotFoundPopup(); });

    // --- LÓGICA DEL CARRITO DE SELECCIÓN ---
    const maxSelection = 5;
    const gameCards = document.querySelectorAll('.game-card');
    const selectedGamesList = document.getElementById('selected-games-list');
    const selectionCount = document.getElementById('selection-count');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const addCustomGameBtn = document.getElementById('add-custom-game-btn');
    const whatsappLink = document.getElementById('whatsapp-link');
    const phoneNumber = '50660331197'; 
    let selectedGames = new Set();
    
    // --- LÓGICA PARA EL CARRITO MÓVIL ---
    const mobileCartTrigger = document.getElementById('mobile-cart-trigger');
    const mobileCartContainer = document.getElementById('mobile-cart-container');
    const mobileCartClose = document.getElementById('mobile-cart-close');
    const mobileSelectionCount = document.getElementById('mobile-selection-count');
    const mobileCartContent = document.querySelector('.mobile-cart-content');
    const mobileWhatsappLink = document.getElementById('mobile-whatsapp-link');
    const mobileAddCustomGameBtn = document.getElementById('mobile-add-custom-game-btn');
    const mobileClearCartBtn = document.getElementById('mobile-clear-cart-btn');

    if (mobileCartTrigger) mobileCartTrigger.addEventListener('click', () => mobileCartContainer.classList.add('visible'));
    if (mobileCartClose) mobileCartClose.addEventListener('click', () => mobileCartContainer.classList.remove('visible'));
    if (mobileClearCartBtn) mobileClearCartBtn.addEventListener('click', () => [...selectedGames].forEach(title => deselectGame(title)));
    if (mobileAddCustomGameBtn) mobileAddCustomGameBtn.addEventListener('click', handleAddCustomGame);

    // --- LÓGICA DE BÚSQUEDA ---
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    if(searchForm) searchForm.addEventListener('submit', handleSearch);

    // --- LÓGICA DE FILTROS ---
    const filterContainer = document.querySelector('.filter-container');
    if (filterContainer) filterContainer.addEventListener('click', handleFilter);

    // --- FUNCIONES PRINCIPALES ---

    function handleAddCustomGame() {
        if (selectedGames.size >= maxSelection) {
            alert('Has alcanzado el límite de ' + maxSelection + ' juegos.');
            return;
        }
        const customGameName = prompt("Escribe el nombre del juego que deseas agregar:");
        if (customGameName && customGameName.trim() !== '') {
            const cleanName = customGameName.trim();
            let isDuplicate = [...selectedGames].some(g => g.replace(/<br\s*\/?>/ig, ' ').toLowerCase() === cleanName.toLowerCase());
            if (isDuplicate) {
                alert('"' + cleanName + '" ya está en tu lista.');
            } else {
                selectedGames.add(cleanName);
                updateSelectionDisplay();
            }
        }
    }

    function handleSearch(event) {
        event.preventDefault();
        const query = searchInput.value.trim().toLowerCase();
        if (query === '') return;
        let gameFound = false;
        gameCards.forEach(card => {
            const gameTitle = card.querySelector('.game-title').innerText.toLowerCase();
            if (gameTitle.includes(query) && !gameFound) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.classList.add('highlight');
                setTimeout(() => card.classList.remove('highlight'), 2500);
                gameFound = true;
            }
        });
        if (!gameFound) notFoundPopup.style.display = 'flex';
        searchInput.value = '';
    }
    
function handleFilter(event) {
        const target = event.target;
        if (!target.classList.contains('filter-btn')) return;

        filterContainer.querySelector('.active').classList.remove('active');
        target.classList.add('active');

        const filterValue = target.dataset.filter;

        gameCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const shouldShow = filterValue === 'all' || filterValue === cardCategory;

            if (shouldShow) {
                // Para mostrar: primero quitamos la clase hide y luego la hacemos visible
                card.classList.remove('hide');
                card.style.display = 'flex';
            } else {
                // Para ocultar: aplicamos la animación y luego la ocultamos del todo
                card.classList.add('hide');
                // Esperamos a que la animación de opacidad/transformación termine
                setTimeout(() => {
                    card.style.display = 'none';
                }, 400); // 400ms, igual que la duración de la transición en CSS
            }
        });
    }

    const findCardByTitle = (title) => [...gameCards].find(card => card.querySelector('.game-title').innerHTML === title);

    const deselectGame = (gameTitle) => {
        const card = findCardByTitle(gameTitle);
        if (card) card.classList.remove('selected');
        selectedGames.delete(gameTitle);
        updateSelectionDisplay();
    };

    function updateSelectionDisplay() {
        if (!selectedGamesList) return;
        selectedGamesList.innerHTML = '';
        const hasSelection = selectedGames.size > 0;
        
        // Actualizar visibilidad de botones
        if(clearCartBtn) clearCartBtn.style.display = hasSelection ? 'block' : 'none';
        if(whatsappLink) whatsappLink.style.display = hasSelection ? 'block' : 'none';
        if(mobileClearCartBtn) mobileClearCartBtn.style.display = hasSelection ? 'block' : 'none';

        if (!hasSelection) {
            const emptyMessage = `<li class="empty-cart-message">🛒<br>¡Tu selección está vacía!</li>`;
            selectedGamesList.innerHTML = emptyMessage;
            if(mobileCartContent) mobileCartContent.innerHTML = `<ul>${emptyMessage}</ul>`;
        } else {
            selectedGames.forEach(gameTitle => {
                const listItem = document.createElement('li');
                if (!findCardByTitle(gameTitle)) listItem.classList.add('custom-game');
                const titleSpan = document.createElement('span');
                titleSpan.textContent = gameTitle.replace(/<br\s*\/?>/ig, ' ');
                listItem.appendChild(titleSpan);
                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = '&times;';
                removeBtn.className = 'remove-game-btn';
                removeBtn.title = 'Quitar juego';
                removeBtn.onclick = (e) => { e.stopPropagation(); deselectGame(gameTitle); };
                listItem.appendChild(removeBtn);
                selectedGamesList.appendChild(listItem);
            });
             if(mobileCartContent) mobileCartContent.innerHTML = `<ul>${selectedGamesList.innerHTML}</ul>`;
        }

        if(hasSelection) {
            let message = '¡Hola! 👋 Quisiera consultar sobre estos juegos:\n\n';
            [...selectedGames].forEach((gameTitle, index) => {
                const cleanTitle = gameTitle.replace(/<br\s*\/?>/ig, ' ');
                message += `*${index + 1}.* ${cleanTitle}\n`;
            });
            message += '\n¡Gracias! 😊';
            const encodedMessage = encodeURIComponent(message);
            const href = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            if (whatsappLink) whatsappLink.href = href;
            if (mobileWhatsappLink) mobileWhatsappLink.href = href;
        }

        if(selectionCount) selectionCount.textContent = selectedGames.size;
        if(mobileSelectionCount) mobileSelectionCount.textContent = selectedGames.size;
        if (mobileCartTrigger) mobileCartTrigger.classList.toggle('visible', hasSelection);
        if (!hasSelection) mobileCartContainer.classList.remove('visible');

        saveSelectionToStorage();
    };

    function handleCardClick(gameTitle) {
        if (selectedGames.has(gameTitle)) {
            deselectGame(gameTitle);
        } else {
            if (selectedGames.size < maxSelection) {
                const card = findCardByTitle(gameTitle);
                if (card) card.classList.add('selected');
                selectedGames.add(gameTitle);
                updateSelectionDisplay();
            } else {
                alert('Puedes seleccionar un máximo de ' + maxSelection + ' juegos.');
            }
        }
    }

    gameCards.forEach(card => card.addEventListener('click', () => handleCardClick(card.querySelector('.game-title').innerHTML)));
    if(clearCartBtn) clearCartBtn.addEventListener('click', () => [...selectedGames].forEach(title => deselectGame(title)));
    if(addCustomGameBtn) addCustomGameBtn.addEventListener('click', handleAddCustomGame);

    // --- NUEVAS FUNCIONES DE INICIALIZACIÓN ---

    function saveSelectionToStorage() {
        localStorage.setItem('juegosSeleccionados', JSON.stringify([...selectedGames]));
    }

    function loadSelectionFromStorage() {
        const juegosGuardados = JSON.parse(localStorage.getItem('juegosSeleccionados'));
        if (juegosGuardados && Array.isArray(juegosGuardados)) {
            selectedGames = new Set(juegosGuardados);
            selectedGames.forEach(gameTitle => {
                const card = findCardByTitle(gameTitle);
                if (card) card.classList.add('selected');
            });
        }
    }

    function animateCardsOnLoad() {
        gameCards.forEach((card, index) => {
            card.style.animation = `slideUpFadeIn 0.5s ease-out forwards`;
            card.style.animationDelay = `${index * 0.04}s`;
        });
    }

    // --- INICIALIZACIÓN ---
    loadSelectionFromStorage();
    updateSelectionDisplay();
    animateCardsOnLoad();
});