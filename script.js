window.addEventListener('load', function() {
    // Lógica de Pop-ups
    const welcomePopup = document.getElementById('popup-overlay');
    const welcomeCloseBtn = document.getElementById('popup-close');
    const welcomeCtaBtn = document.getElementById('popup-cta-btn'); 
    if(welcomePopup) welcomePopup.style.display = 'flex';
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
    const selectedGames = new Set();
    
    // --- LÓGICA PARA EL CARRITO MÓVIL ---
    const mobileCartTrigger = document.getElementById('mobile-cart-trigger');
    const mobileCartContainer = document.getElementById('mobile-cart-container');
    const mobileCartClose = document.getElementById('mobile-cart-close');
    const mobileSelectionCount = document.getElementById('mobile-selection-count');
    const mobileCartContent = document.querySelector('.mobile-cart-content');
    const mobileWhatsappLink = document.getElementById('mobile-whatsapp-link');

    if (mobileCartTrigger) {
        mobileCartTrigger.addEventListener('click', () => {
            mobileCartContainer.classList.add('visible');
        });
    }
    if (mobileCartClose) {
        mobileCartClose.addEventListener('click', () => {
            mobileCartContainer.classList.remove('visible');
        });
    }

    // --- LÓGICA DE BÚSQUEDA ---
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    if(searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const query = searchInput.value.trim().toLowerCase();
            if (query === '') return;

            let gameFound = false;
            for (const card of gameCards) {
                const gameTitle = card.querySelector('.game-title').innerText.toLowerCase();
                if (gameTitle.includes(query)) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    card.classList.add('highlight');
                    setTimeout(() => {
                        card.classList.remove('highlight');
                    }, 2500);

                    gameFound = true;
                    break; 
                }
            }

            if (!gameFound) {
                if(notFoundPopup) notFoundPopup.style.display = 'flex';
            }
            searchInput.value = '';
        });
    }

    const findCardByTitle = (title) => {
        for (const card of gameCards) {
            if (card.querySelector('.game-title').innerHTML === title) return card;
        }
        return null;
    };

    const deselectGame = (gameTitle) => {
        const card = findCardByTitle(gameTitle);
        if (card) card.classList.remove('selected');
        selectedGames.delete(gameTitle);
        updateSelectionDisplay();
    };

    const updateSelectionDisplay = () => {
        if (!selectedGamesList) return;
        selectedGamesList.innerHTML = '';
        const hasSelection = selectedGames.size > 0;
        if(clearCartBtn) clearCartBtn.style.display = hasSelection ? 'block' : 'none';
        if(whatsappLink) whatsappLink.style.display = hasSelection ? 'block' : 'none';

        selectedGames.forEach(gameTitle => {
            const listItem = document.createElement('li');
            const isCustom = !findCardByTitle(gameTitle);
            if (isCustom) listItem.classList.add('custom-game');

            const titleSpan = document.createElement('span');
            titleSpan.textContent = gameTitle.replace(/<br\s*\/?>/ig, ' ');
            listItem.appendChild(titleSpan);

            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '&times;';
            removeBtn.className = 'remove-game-btn';
            removeBtn.title = 'Quitar juego';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deselectGame(gameTitle);
            });
            listItem.appendChild(removeBtn);
            selectedGamesList.appendChild(listItem);
        });

        if(hasSelection && whatsappLink) {
            let message = '¡Hola! 👋 Quisiera consultar sobre estos juegos:\n\n';
            let count = 1;
            selectedGames.forEach(gameTitle => {
                const cleanTitle = gameTitle.replace(/<br\s*\/?>/ig, ' ');
                message += `*${count}.* ${cleanTitle}\n`;
                count++;
            });
            message += '\n¡Gracias! 😊';
            const encodedMessage = encodeURIComponent(message);
            whatsappLink.href = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        }

        if(selectionCount) selectionCount.textContent = selectedGames.size;

        // --- ACTUALIZACIÓN DE LA UI MÓVIL ---
        if(mobileSelectionCount) mobileSelectionCount.textContent = selectedGames.size;
        if(mobileCartContent) {
            const ul = document.createElement('ul');
            ul.innerHTML = selectedGamesList.innerHTML;
            mobileCartContent.innerHTML = ''; // Limpiar contenido anterior
            mobileCartContent.appendChild(ul);

            // Re-asignar eventos a los botones de eliminar del carrito móvil
            mobileCartContent.querySelectorAll('.remove-game-btn').forEach(btn => {
                const title = btn.previousElementSibling.textContent;
                // Encontrar el título original (con <br> si lo tuviera) para deseleccionar
                const originalTitle = [...selectedGames].find(g => g.replace(/<br\s*\/?>/ig, ' ') === title);
                if (originalTitle) {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        deselectGame(originalTitle);
                    });
                }
            });
        }
        if (mobileWhatsappLink && whatsappLink) mobileWhatsappLink.href = whatsappLink.href;
        
        if (mobileCartTrigger) {
            mobileCartTrigger.classList.toggle('visible', selectedGames.size > 0);
            if (selectedGames.size === 0) {
                mobileCartContainer.classList.remove('visible');
            }
        }
    };

    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            const gameTitle = card.querySelector('.game-title').innerHTML;
            if (selectedGames.has(gameTitle)) {
                deselectGame(gameTitle);
            } else {
                if (selectedGames.size < maxSelection) {
                    card.classList.add('selected');
                    selectedGames.add(gameTitle);
                    updateSelectionDisplay();
                } else {
                    alert('Puedes seleccionar un máximo de ' + maxSelection + ' juegos.');
                }
            }
        });
    });

    if(clearCartBtn) clearCartBtn.addEventListener('click', () => {
        [...selectedGames].forEach(title => deselectGame(title));
    });
    
    if(addCustomGameBtn) addCustomGameBtn.addEventListener('click', () => {
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
    });

    updateSelectionDisplay(); // Llamada inicial para establecer el estado correcto
});