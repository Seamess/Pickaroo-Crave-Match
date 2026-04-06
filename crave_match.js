document.addEventListener('DOMContentLoaded', () => {
    // ===========================================
    //  FOOD DATA — 3 decks for refresh feature
    // ===========================================
    const allDecks = [
        [
            { id: 1, name: 'Smash Burgers', subtitle: 'Juicy, cheesy, messy goodness', icon: '🍔', image: 'images/smash_burger.png', category: 'Fast Food' },
            { id: 2, name: 'Wood-fired Pizza', subtitle: 'Charred crust, fresh mozzarella', icon: '🍕', image: 'images/woodfired_pizza.png', category: 'Italian' },
            { id: 3, name: 'Fresh Sushi', subtitle: 'Clean, elegant, premium cuts', icon: '🍣', image: 'images/sushi_platter.png', category: 'Japanese' },
            { id: 4, name: 'Loaded Tacos', subtitle: 'Street-style with all the fixings', icon: '🌮', image: 'images/loaded_tacos.png', category: 'Mexican' },
            { id: 5, name: 'Boba Milk Tea', subtitle: 'Brown sugar, chewy pearls', icon: '🧋', image: 'images/boba_milktea.png', category: 'Drinks' },
            { id: 6, name: 'Ramen Bowls', subtitle: 'Rich broth, soft-boiled egg', icon: '🍜', image: 'images/ramen_bowl.png', category: 'Japanese' },
            { id: 7, name: 'Fried Chicken', subtitle: 'Extra crispy, golden perfection', icon: '🍗', image: 'images/fried_chicken.png', category: 'Comfort Food' },
            { id: 8, name: 'Desserts', subtitle: 'Macarons, cakes & sweet treats', icon: '🧁', image: 'images/desserts_sweets.png', category: 'Sweets' },
        ],
        [
            { id: 9, name: 'Poke Bowls', subtitle: 'Fresh, healthy, colorful', icon: '🥗', image: 'images/sushi_platter.png', category: 'Healthy' },
            { id: 10, name: 'Korean BBQ', subtitle: 'Grilled meat, unlimited sides', icon: '🥩', image: 'images/fried_chicken.png', category: 'Korean' },
            { id: 11, name: 'Pasta & Risotto', subtitle: 'Creamy, hearty Italian classics', icon: '🍝', image: 'images/woodfired_pizza.png', category: 'Italian' },
            { id: 12, name: 'Dim Sum', subtitle: 'Steamed dumplings & rolls', icon: '🥟', image: 'images/ramen_bowl.png', category: 'Chinese' },
            { id: 13, name: 'Açaí Bowls', subtitle: 'Fruity, fresh, Instagram-worthy', icon: '🫐', image: 'images/desserts_sweets.png', category: 'Healthy' },
            { id: 14, name: 'Wings & Ribs', subtitle: 'Saucy, finger-licking good', icon: '🍖', image: 'images/fried_chicken.png', category: 'American' },
            { id: 15, name: 'Bubble Waffles', subtitle: 'Crispy puffs with ice cream', icon: '🧇', image: 'images/desserts_sweets.png', category: 'Sweets' },
            { id: 16, name: 'Shawarma Wraps', subtitle: 'Spiced meat, fresh veggies', icon: '🌯', image: 'images/loaded_tacos.png', category: 'Middle Eastern' },
        ],
        [
            { id: 17, name: 'Thai Curry', subtitle: 'Creamy coconut, fragrant spices', icon: '🍛', image: 'images/ramen_bowl.png', category: 'Thai' },
            { id: 18, name: 'Fish & Chips', subtitle: 'Golden battered, crispy fries', icon: '🐟', image: 'images/fried_chicken.png', category: 'British' },
            { id: 19, name: 'Smoothie Blends', subtitle: 'Tropical fruits, power greens', icon: '🥤', image: 'images/boba_milktea.png', category: 'Drinks' },
            { id: 20, name: 'Steak & Sides', subtitle: 'Perfectly seared, melt-in-mouth', icon: '🥩', image: 'images/smash_burger.png', category: 'Western' },
            { id: 21, name: 'Crepes', subtitle: 'Sweet or savory, paper-thin', icon: '🥞', image: 'images/desserts_sweets.png', category: 'French' },
            { id: 22, name: 'Pho Noodle Soup', subtitle: 'Aromatic broth, fresh herbs', icon: '🍲', image: 'images/ramen_bowl.png', category: 'Vietnamese' },
            { id: 23, name: 'Churros', subtitle: 'Cinnamon sugar, chocolate dip', icon: '🍩', image: 'images/desserts_sweets.png', category: 'Sweets' },
            { id: 24, name: 'Gyoza', subtitle: 'Pan-fried, juicy filling', icon: '🥟', image: 'images/sushi_platter.png', category: 'Japanese' },
        ]
    ];

    let currentDeckIndex = 0;
    let foodCards = [...allDecks[currentDeckIndex]];
    let currentIndex = 0;
    let craved = [];
    let noped = [];

    const cardContainer = document.getElementById('card-container');
    const progressDotsContainer = document.getElementById('progress-dots');
    const btnNo = document.getElementById('btn-no');
    const btnYes = document.getElementById('btn-yes');
    const btnRefresh = document.getElementById('btn-refresh');
    const miniActivity = document.getElementById('mini-activity');

    // ===========================================
    //  RENDER
    // ===========================================
    function renderProgressDots() {
        progressDotsContainer.innerHTML = '';
        foodCards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (i === currentIndex) dot.classList.add('active');
            else if (i < currentIndex) {
                dot.classList.add('done');
                if (craved.find(c => c.id === foodCards[i].id)) dot.classList.add('craved');
                else dot.classList.add('noped');
            }
            progressDotsContainer.appendChild(dot);
        });
    }

    function renderCards() {
        cardContainer.innerHTML = '';
        const remaining = foodCards.slice(currentIndex);
        const toShow = remaining.reverse(); // Show all in stack

        toShow.forEach((food, index) => {
            const stackPos = toShow.length - 1 - index;
            const visualPos = Math.min(stackPos, 2); // Cap visual depth at 3 cards
            const scale = 1 - (visualPos * 0.04);
            const translateY = visualPos * -12;

            const card = document.createElement('div');
            card.className = 'swipe-card';
            card.id = `card-${food.id}`;
            card.style.zIndex = index + 1;
            card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
            
            if (stackPos > 2) {
                card.style.opacity = '0';
                card.style.pointerEvents = 'none';
            }

            card.innerHTML = `
                <img class="card-photo" src="${food.image}" alt="${food.name}" loading="eager">
                <div class="card-overlay"></div>
                <div class="stamp stamp-crave">CRAVE</div>
                <div class="stamp stamp-nope">NOPE</div>
                <div class="card-content">
                    <div class="card-category">${food.icon} ${food.category}</div>
                    <h2 class="card-title">${food.name}</h2>
                    <p class="card-subtitle">${food.subtitle}</p>
                </div>
            `;
            cardContainer.appendChild(card);
        });

        // Attach drag to top card
        const topCard = cardContainer.lastElementChild;
        if (topCard) attachDragListeners(topCard);
    }

    // ===========================================
    //  DRAG GESTURES
    // ===========================================
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;

    function attachDragListeners(card) {
        card.addEventListener('pointerdown', onPointerDown);
        card.addEventListener('pointermove', onPointerMove);
        card.addEventListener('pointerup', onPointerUp);
        card.addEventListener('pointercancel', onPointerUp);
    }

    function onPointerDown(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        currentX = 0;
        this.classList.add('dragging');
        this.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e) {
        if (!isDragging) return;
        currentX = e.clientX - startX;
        const rotation = currentX * 0.08;
        const opacity = Math.max(0.4, 1 - Math.abs(currentX) / 400);

        this.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;
        this.style.opacity = opacity;

        // Show stamps
        const craveStamp = this.querySelector('.stamp-crave');
        const nopeStamp = this.querySelector('.stamp-nope');

        if (currentX > 40) {
            craveStamp.classList.add('visible');
            nopeStamp.classList.remove('visible');
        } else if (currentX < -40) {
            nopeStamp.classList.add('visible');
            craveStamp.classList.remove('visible');
        } else {
            craveStamp.classList.remove('visible');
            nopeStamp.classList.remove('visible');
        }
    }

    function onPointerUp(e) {
        if (!isDragging) return;
        isDragging = false;
        this.classList.remove('dragging');

        const threshold = 80;

        if (currentX > threshold) {
            swipeTopCard('right');
        } else if (currentX < -threshold) {
            swipeTopCard('left');
        } else {
            // Snap back
            this.style.transform = '';
            this.style.opacity = '';
            const craveStamp = this.querySelector('.stamp-crave');
            const nopeStamp = this.querySelector('.stamp-nope');
            if (craveStamp) craveStamp.classList.remove('visible');
            if (nopeStamp) nopeStamp.classList.remove('visible');
        }
    }

    // ===========================================
    //  SWIPE LOGIC
    // ===========================================
    function swipeTopCard(direction) {
        if (currentIndex >= foodCards.length) return;

        const currentFood = foodCards[currentIndex];
        const topCardElem = document.getElementById(`card-${currentFood.id}`);

        if (!topCardElem) return;

        // Track decision
        if (direction === 'right') {
            craved.push(currentFood);
            topCardElem.classList.add('card-swipe-right');
            updateMiniActivity(`You craved ${currentFood.icon} ${currentFood.name}!`);
        } else {
            noped.push(currentFood);
            topCardElem.classList.add('card-swipe-left');
        }

        currentIndex++;
        renderProgressDots();

        setTimeout(() => {
            topCardElem.remove();
            updateRemainingCards();

            if (currentIndex >= foodCards.length) {
                showMatchResult();
            }
        }, 350);
    }

    function updateRemainingCards() {
        const remaining = foodCards.length - currentIndex;
        const cardsInDOM = cardContainer.querySelectorAll('.swipe-card');

        cardsInDOM.forEach((card, i) => {
            const stackPos = cardsInDOM.length - 1 - i;
            const visualPos = Math.min(stackPos, 2);
            const scale = 1 - (visualPos * 0.04);
            const translateY = visualPos * -12;
            
            card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
            
            if (stackPos <= 2) {
                card.style.opacity = '1';
                card.style.pointerEvents = 'auto';
            }
        });

        // Attach drag to new top card
        const topCard = cardContainer.lastElementChild;
        if (topCard) attachDragListeners(topCard);
    }

    // ===========================================
    //  MINI ACTIVITY FEED
    // ===========================================
    const simulatedActivities = [
        { emoji: '🍔', name: 'Raff', action: 'craved Smash Burgers' },
        { emoji: '❌', name: 'Maan', action: 'passed on Tacos' },
        { emoji: '🍗', name: 'John', action: 'craved Fried Chicken' },
        { emoji: '🧋', name: 'Raff', action: 'craved Boba Tea' },
        { emoji: '🍜', name: 'Maan', action: 'craved Ramen' },
    ];
    let simIndex = 0;

    function updateMiniActivity(text) {
        miniActivity.style.opacity = '0';
        miniActivity.style.transform = 'translateY(-10px)';
        miniActivity.style.transition = 'all 0.2s ease';
        setTimeout(() => {
            miniActivity.innerHTML = `<span class="activity-emoji">🔥</span><span>${text}</span>`;
            miniActivity.style.opacity = '1';
            miniActivity.style.transform = 'translateY(0)';
        }, 200);
    }

    // Simulate other users swiping
    setInterval(() => {
        const act = simulatedActivities[simIndex % simulatedActivities.length];
        miniActivity.style.opacity = '0';
        miniActivity.style.transform = 'translateY(-10px)';
        miniActivity.style.transition = 'all 0.2s ease';
        setTimeout(() => {
            miniActivity.innerHTML = `
                <span class="activity-emoji">${act.emoji}</span>
                <span><strong>${act.name}</strong> ${act.action}</span>
            `;
            miniActivity.style.opacity = '1';
            miniActivity.style.transform = 'translateY(0)';
        }, 200);
        simIndex++;
    }, 5000);

    // ===========================================
    //  REFRESH DECK
    // ===========================================
    btnRefresh.addEventListener('click', () => {
        currentDeckIndex = (currentDeckIndex + 1) % allDecks.length;
        foodCards = [...allDecks[currentDeckIndex]];
        currentIndex = 0;
        craved = [];
        noped = [];

        btnRefresh.classList.add('spinning');
        setTimeout(() => btnRefresh.classList.remove('spinning'), 600);

        // Animate out current cards
        const cards = cardContainer.querySelectorAll('.swipe-card');
        cards.forEach((card, i) => {
            card.style.transition = 'all 0.3s ease';
            card.style.transform = `scale(0.5) translateY(40px)`;
            card.style.opacity = '0';
        });

        setTimeout(() => {
            renderCards();
            renderProgressDots();
        }, 350);
    });

    // ===========================================
    //  MATCH RESULT
    // ===========================================
    function showMatchResult() {
        // Determine top match from craved list
        let matchName = 'Smash Burgers';
        let matchIcon = '🍔';
        let matchVotes = craved.length;

        if (craved.length > 0) {
            matchName = craved[0].name;
            matchIcon = craved[0].icon;
        }

        // Second pick
        let secondName = 'Fried Chicken';
        let secondIcon = '🍗';
        if (craved.length > 1) {
            secondName = craved[1].name;
            secondIcon = craved[1].icon;
        }

        // Fire confetti
        fireConfetti();

        // Show empty state momentarily then modal
        cardContainer.innerHTML = `
            <div class="empty-state">
                <div class="check-circle"><i class="fa-solid fa-check"></i></div>
                <h2>All Swiped!</h2>
                <p>You craved ${craved.length} of ${foodCards.length} options. Finding your group match...</p>
            </div>
        `;

        setTimeout(() => {
            Swal.fire({
                html: `
                    <div style="text-align: center; font-family: 'Inter', sans-serif; padding-top: 8px;">
                        <div style="font-size: 2.5rem; margin-bottom: 8px;">🎉</div>
                        <h2 style="margin: 0 0 4px 0; color: #1A1A2E; font-size: 1.4rem; font-weight: 700; font-family: 'Outfit', sans-serif;">Match Found!</h2>
                        <p style="color: #6B7280; font-size: 0.85rem; margin: 0 0 20px 0;">Your group's top cravings are in.</p>
                        
                        <div style="background: #FAF8F5; border-radius: 16px; padding: 14px; text-align: left; margin-bottom: 16px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <span style="font-size: 0.65rem; font-weight: 700; color: #1DE1CE; text-transform: uppercase; letter-spacing: 0.5px;">🏆 Top Match (${Math.max(3, matchVotes)} Votes)</span>
                                    <div style="font-weight: 700; color: #1A1A2E; margin-top: 3px; font-size: 1rem; font-family: 'Outfit', sans-serif;">${matchIcon} ${matchName}</div>
                                </div>
                            </div>
                            
                            <div style="height: 1px; background: rgba(0,0,0,0.06); margin: 12px 0;"></div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <span style="font-size: 0.65rem; font-weight: 700; color: #1DE1CE; text-transform: uppercase; letter-spacing: 0.5px;">Runner Up (2 Votes)</span>
                                    <div style="font-weight: 700; color: #1A1A2E; margin-top: 3px; font-size: 1rem; font-family: 'Outfit', sans-serif;">${secondIcon} ${secondName}</div>
                                </div>
                            </div>
                        </div>

                        <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(29, 225, 206, 0.1); color: #0fa294; font-weight: 700; font-size: 0.8rem; padding: 8px 16px; border-radius: 20px;">
                            <i class="fa-solid fa-shop"></i> Uptown Mall Hub
                        </div>
                    </div>
                `,
                showConfirmButton: true,
                confirmButtonText: 'Order from Hub <i class="fa-solid fa-arrow-right" style="margin-left: 5px;"></i>',
                confirmButtonColor: '#1DE1CE',
                allowOutsideClick: false,
                customClass: { popup: 'modern-modal' }
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'shared_order.html';
                }
            });
        }, 1200);
    }

    // ===========================================
    //  CONFETTI
    // ===========================================
    function fireConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const colors = ['#1DE1CE', '#0fa294', '#FFB347', '#66BB6A', '#4A90E2', '#B388FF'];
        const particles = [];

        for (let i = 0; i < 60; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12 - 4,
                size: Math.random() * 8 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                gravity: 0.15,
                opacity: 1,
            });
        }

        let frame = 0;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.rotation += p.rotationSpeed;
                p.opacity -= 0.012;
                p.vx *= 0.98;

                if (p.opacity > 0) {
                    alive = true;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation * Math.PI / 180);
                    ctx.globalAlpha = p.opacity;
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                    ctx.restore();
                }
            });

            frame++;
            if (alive && frame < 120) {
                requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        animate();
    }

    // ===========================================
    //  BUTTON HANDLERS
    // ===========================================
    btnNo.addEventListener('click', () => {
        // Small shake feedback
        btnNo.style.animation = 'shake 0.3s ease-in-out';
        setTimeout(() => btnNo.style.animation = '', 300);
        swipeTopCard('left');
    });

    btnYes.addEventListener('click', () => {
        // Pulse feedback
        btnYes.style.transform = 'scale(1.15)';
        setTimeout(() => btnYes.style.transform = '', 200);
        swipeTopCard('right');
    });

    // ===========================================
    //  INIT
    // ===========================================
    renderCards();
    renderProgressDots();
});