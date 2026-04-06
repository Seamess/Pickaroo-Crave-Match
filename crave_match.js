document.addEventListener('DOMContentLoaded', () => {
    // Data for the swiping cards (top to bottom)
    const foodCards = [
        { id: 1, name: 'Burger Joints', subtitle: 'Fast, classic cravings', icon: 'fa-solid fa-burger' },
        { id: 2, name: 'Milk & drinks', subtitle: 'Sweet & refreshing', icon: 'fa-solid fa-mug-hot' },
        { id: 3, name: 'Pizza Time', subtitle: 'Great for sharing', icon: 'fa-solid fa-pizza-slice' },
        { id: 4, name: 'Sushi Bar', subtitle: 'Fresh & clean', icon: 'fa-solid fa-fish' },
        { id: 5, name: 'Spicy & Savory', subtitle: 'Hot cravings', icon: 'fa-solid fa-pepper-hot' }
    ];

    const cardContainer = document.getElementById('card-container');
    let currentIndex = 0;
    
    // Render cards in reverse order so the first one is on top
    function renderCards() {
        cardContainer.innerHTML = '';
        const reversedCards = [...foodCards].reverse();
        
        reversedCards.forEach((food, index) => {
            const zIndex = index + 1;
            // The top card in the visual stack needs the highest index, but our array is reversed.
            // Wait, if reverse(): last item in array (which was first) is rendered last, so it gets highest DOM layering naturally.
            const scale = 1 - ((foodCards.length - 1 - index) * 0.05);
            const translateY = (foodCards.length - 1 - index) * -15;

            const cardHTML = `
                <div class="swipe-card" id="card-${food.id}" style="z-index: ${zIndex}; transform: scale(${scale}) translateY(${translateY}px);">
                    <div class="card-icon"><i class="${food.icon}"></i></div>
                    <h2 class="card-title">${food.name}</h2>
                    <p class="card-subtitle">${food.subtitle}</p>
                </div>
            `;
            cardContainer.innerHTML += cardHTML;
        });
    }

    renderCards();

    // Interaction controls
    const btnNo = document.getElementById('btn-no');
    const btnYes = document.getElementById('btn-yes');

    function swipeTopCard(direction) {
        if (currentIndex >= foodCards.length) return;

        const currentFood = foodCards[currentIndex];
        const topCardElem = document.getElementById(`card-${currentFood.id}`);
        
        if (topCardElem) {
            // Apply animation class based on direction
            if (direction === 'left') {
                topCardElem.classList.add('card-swipe-left');
            } else {
                topCardElem.classList.add('card-swipe-right');
            }

            currentIndex++;

            // Animate remaining cards up
            setTimeout(() => {
                topCardElem.remove();
                updateRemainingCards();

                // If empty, show match result!
                if (currentIndex >= foodCards.length) {
                    showMatchResult();
                }
            }, 300); // Wait for transition
        }
    }

    function updateRemainingCards() {
        const remaining = foodCards.length - currentIndex;
        for (let i = currentIndex; i < foodCards.length; i++) {
            const card = document.getElementById(`card-${foodCards[i].id}`);
            if (card) {
                const stackPos = i - currentIndex;
                const scale = 1 - (stackPos * 0.05);
                const translateY = stackPos * -15;
                card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
            }
        }
    }

    function showMatchResult() {
        Swal.fire({
            html: `
                <div style="text-align: center; font-family: 'Inter', sans-serif; padding-top: 10px;">
                    <div style="background: rgba(232, 54, 131, 0.1); width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto;">
                        <i class="fa-solid fa-location-dot" style="font-size: 2rem; color: var(--cerise);"></i>
                    </div>
                    <h2 style="margin: 0 0 8px 0; color: #111; font-size: 1.5rem; font-weight: 700;">Hub Secured!</h2>
                    <p style="color: var(--gray-text); font-size: 0.95rem; margin: 0 0 25px 0;">Match found! Now let's pick your specific meals.</p>
                    
                    <div style="background: #fbfcff; border-radius: 20px; padding: 16px; text-align: left; margin-bottom: 25px; border: 1px solid rgba(0,0,0,0.05); box-shadow: inset 0 2px 5px rgba(0,0,0,0.02);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span style="font-size: 0.75rem; font-weight: 700; color: var(--cerise); text-transform: uppercase; letter-spacing: 0.5px;">Main Match (4 Votes)</span>
                                <div style="font-weight: 600; color: #111; margin-top: 4px; font-size: 1rem;">Pizza & Burgers</div>
                            </div>
                            <div style="background: rgba(232, 54, 131, 0.1); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;"><i class="fa-solid fa-pizza-slice" style="color: var(--cerise); font-size: 1rem;"></i></div>
                        </div>
                        
                        <div style="height: 1px; background: rgba(0,0,0,0.05); margin: 15px 0;"></div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span style="font-size: 0.75rem; font-weight: 700; color: var(--turquoise); text-transform: uppercase; letter-spacing: 0.5px;">Ally Drop (1 Vote)</span>
                                <div style="font-weight: 600; color: #111; margin-top: 4px; font-size: 1rem;">Sushi (500m away)</div>
                            </div>
                            <div style="background: rgba(29, 225, 206, 0.1); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;"><i class="fa-solid fa-fish" style="color: var(--turquoise); font-size: 1rem;"></i></div>
                        </div>
                    </div>

                    <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(29, 225, 206, 0.1); color: #0fa294; font-weight: 700; font-size: 0.9rem; padding: 10px 20px; border-radius: 20px;">
                        <i class="fa-solid fa-shop"></i> Uptown Mall Hub
                    </div>
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: 'Select Food from Hub <i class="fa-solid fa-arrow-right" style="margin-left: 5px;"></i>',
            confirmButtonColor: '#1DE1CE',
            allowOutsideClick: false,
            customClass: { popup: 'modern-modal' }
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'shared_order.html';
            }
        });
    }

    btnNo.addEventListener('click', () => swipeTopCard('left'));
    btnYes.addEventListener('click', () => swipeTopCard('right'));

});