document.addEventListener('DOMContentLoaded', () => {
    // ===========================================
    //  FOOD DATA — Emotion tailored decks
    // ===========================================
    const emotionDecks = {
        'comfort': [
            { id: 1, name: 'Wood-fired Pizza', subtitle: 'Charred crust, fresh mozzarella', icon: '🍕', image: 'images/woodfired_pizza.png', category: 'Italian' },
            { id: 2, name: 'Fried Chicken', subtitle: 'Extra crispy, golden perfection', icon: '🍗', image: 'images/fried_chicken.png', category: 'Comfort Food' },
            { id: 3, name: 'Mac & Cheese', subtitle: 'Creamy, baked, ultimate comfort', icon: '🧀', image: 'images/smash_burger.png', category: 'American' },
            { id: 4, name: 'Desserts', subtitle: 'Macarons, cakes & sweet treats', icon: '🧁', image: 'images/desserts_sweets.png', category: 'Sweets' },
            { id: 5, name: 'Ramen Bowls', subtitle: 'Rich broth, warm from the inside', icon: '🍜', image: 'images/ramen_bowl.png', category: 'Japanese' }
        ],
        'stress': [
            { id: 11, name: 'Smash Burgers', subtitle: 'Juicy, cheesy, messy goodness', icon: '🍔', image: 'images/smash_burger.png', category: 'Fast Food' },
            { id: 12, name: 'Korean BBQ', subtitle: 'Grilled meat, unlimited sides', icon: '🥩', image: 'images/fried_chicken.png', category: 'Korean' },
            { id: 13, name: 'Loaded Tacos', subtitle: 'Street-style with all the fixings', icon: '🌮', image: 'images/loaded_tacos.png', category: 'Mexican' },
            { id: 14, name: 'Spicy Wings', subtitle: 'Saucy, fiery, finger-licking good', icon: '🔥', image: 'images/fried_chicken.png', category: 'American' },
            { id: 15, name: 'Boba Milk Tea', subtitle: 'Brown sugar, chewy pearls', icon: '🧋', image: 'images/boba_milktea.png', category: 'Drinks' }
        ],
        'happy': [
            { id: 21, name: 'Fresh Sushi', subtitle: 'Clean, elegant, premium cuts', icon: '🍣', image: 'images/sushi_platter.png', category: 'Japanese' },
            { id: 22, name: 'Steak & Sides', subtitle: 'Perfectly seared, melt-in-mouth', icon: '🥩', image: 'images/smash_burger.png', category: 'Western' },
            { id: 23, name: 'Dim Sum', subtitle: 'Steamed dumplings & rolls', icon: '🥟', image: 'images/ramen_bowl.png', category: 'Chinese' },
            { id: 24, name: 'Aesthetic Desserts', subtitle: 'Beautiful pastries & cakes', icon: '🍰', image: 'images/desserts_sweets.png', category: 'Sweets' },
            { id: 25, name: 'Cocktails', subtitle: 'Fruity & refreshing', icon: '🍸', image: 'images/boba_milktea.png', category: 'Drinks' }
        ],
        'light': [
            { id: 31, name: 'Poke Bowls', subtitle: 'Fresh, healthy, colorful', icon: '🥗', image: 'images/sushi_platter.png', category: 'Healthy' },
            { id: 32, name: 'Açaí Bowls', subtitle: 'Fruity, fresh, Instagram-worthy', icon: '🫐', image: 'images/desserts_sweets.png', category: 'Healthy' },
            { id: 33, name: 'Smoothie Blends', subtitle: 'Tropical fruits, power greens', icon: '🥤', image: 'images/boba_milktea.png', category: 'Drinks' },
            { id: 34, name: 'Salad Wraps', subtitle: 'Crisp greens, light dressing', icon: '🥙', image: 'images/loaded_tacos.png', category: 'Healthy' },
            { id: 35, name: 'Pho Noodle Soup', subtitle: 'Aromatic broth, fresh herbs', icon: '🍲', image: 'images/ramen_bowl.png', category: 'Vietnamese' }
        ]
    };

    let foodCards = [];
    let currentIndex = 0;
    let craved = [];
    let noped = [];
    let currentMood = '';
    let cardStartTime = 0; // For time tracking

    const cardContainer = document.getElementById('single-card-container');
    const progressDotsContainer = document.getElementById('single-progress-dots');
    const swipeView = document.getElementById('single-swipe-view');
    const emotionScreen = document.getElementById('emotion-screen');
    const btnNo = document.getElementById('single-btn-no');
    const btnYes = document.getElementById('single-btn-yes');
    const btnSuper = document.getElementById('single-btn-super');
    const btnRefresh = document.getElementById('single-btn-refresh');

    // ===========================================
    //  INIT MOOD
    // ===========================================
    window.selectMood = (mood) => {
        currentMood = mood;
        foodCards = [...emotionDecks[mood]];
        currentIndex = 0;
        craved = [];
        noped = [];

        // Transition screens
        emotionScreen.style.opacity = '0';
        setTimeout(() => {
            emotionScreen.style.display = 'none';
            progressDotsContainer.style.display = 'flex';
            swipeView.style.display = 'flex';
            
            // Allow CSS flex to apply, then fade in
            requestAnimationFrame(() => {
                renderCards();
                renderProgressDots();
                cardStartTime = Date.now();
            });
        }, 300);
    };

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
                <img class="card-photo" src="${food.image}" alt="${food.name}" onerror="this.src='images/smash_burger.png';">
                <div class="card-overlay"></div>
                <div class="stamp stamp-super">SUPER</div>
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
    let currentY = 0;

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
        currentY = 0;
        this.classList.add('dragging');
        this.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e) {
        if (!isDragging) return;
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
        const rotation = currentX * 0.08;
        const opacity = Math.max(0.4, 1 - (Math.abs(currentX) + Math.abs(currentY)) / 400);

        this.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;
        this.style.opacity = opacity;

        // Show stamps
        const craveStamp = this.querySelector('.stamp-crave');
        const nopeStamp = this.querySelector('.stamp-nope');
        const superStamp = this.querySelector('.stamp-super');

        if (currentY < -60 && Math.abs(currentY) > Math.abs(currentX)) {
            if (superStamp) superStamp.classList.add('visible');
            if (craveStamp) craveStamp.classList.remove('visible');
            if (nopeStamp) nopeStamp.classList.remove('visible');
        } else if (currentX > 40) {
            if (craveStamp) craveStamp.classList.add('visible');
            if (nopeStamp) nopeStamp.classList.remove('visible');
            if (superStamp) superStamp.classList.remove('visible');
        } else if (currentX < -40) {
            if (nopeStamp) nopeStamp.classList.add('visible');
            if (craveStamp) craveStamp.classList.remove('visible');
            if (superStamp) superStamp.classList.remove('visible');
        } else {
            if (craveStamp) craveStamp.classList.remove('visible');
            if (nopeStamp) nopeStamp.classList.remove('visible');
            if (superStamp) superStamp.classList.remove('visible');
        }
    }

    function onPointerUp(e) {
        if (!isDragging) return;
        isDragging = false;
        this.classList.remove('dragging');

        const threshold = 80;

        if (currentY < -threshold && Math.abs(currentY) > Math.abs(currentX)) {
            swipeTopCard('up');
        } else if (currentX > threshold) {
            swipeTopCard('right');
        } else if (currentX < -threshold) {
            swipeTopCard('left');
        } else {
            // Snap back
            this.style.transform = '';
            this.style.opacity = '';
            const craveStamp = this.querySelector('.stamp-crave');
            const nopeStamp = this.querySelector('.stamp-nope');
            const superStamp = this.querySelector('.stamp-super');
            if (craveStamp) craveStamp.classList.remove('visible');
            if (nopeStamp) nopeStamp.classList.remove('visible');
            if (superStamp) superStamp.classList.remove('visible');
        }
    }

    // ===========================================
    //  BUTTON HANDLERS
    // ===========================================
    btnNo.addEventListener('click', () => {
        if (currentIndex < foodCards.length) {
            const topCardElem = document.getElementById(`card-${foodCards[currentIndex].id}`);
            if (topCardElem) {
                topCardElem.style.transform = 'translateX(-200px) rotate(-15deg)';
                topCardElem.style.opacity = '0';
            }
            swipeTopCard('left');
        }
    });

    btnSuper.addEventListener('click', () => {
        if (currentIndex < foodCards.length) {
            const topCardElem = document.getElementById(`card-${foodCards[currentIndex].id}`);
            if (topCardElem) {
                topCardElem.style.transform = 'translateY(-400px) scale(0.8)';
                topCardElem.style.opacity = '0';
            }
            swipeTopCard('up');
        }
    });

    btnYes.addEventListener('click', () => {
        if (currentIndex < foodCards.length) {
            const topCardElem = document.getElementById(`card-${foodCards[currentIndex].id}`);
            if (topCardElem) {
                topCardElem.style.transform = 'translateX(200px) rotate(15deg)';
                topCardElem.style.opacity = '0';
            }
            swipeTopCard('right');
        }
    });

    // ===========================================
    //  SWIPE LOGIC
    // ===========================================
    function swipeTopCard(direction) {
        if (currentIndex >= foodCards.length) return;

        const currentFood = foodCards[currentIndex];
        const topCardElem = document.getElementById(`card-${currentFood.id}`);
        currentFood.timeSpent = Date.now() - cardStartTime;

        if (topCardElem) {
            if (direction === 'up') {
                currentFood.isSuperCrave = true;
                craved.push(currentFood);
                topCardElem.classList.add('card-swipe-up');
            } else if (direction === 'right') {
                craved.push(currentFood);
                topCardElem.classList.add('card-swipe-right');
            } else {
                noped.push(currentFood);
                topCardElem.classList.add('card-swipe-left');
            }
        }

        currentIndex++;
        renderProgressDots();

        setTimeout(() => {
            if (topCardElem) topCardElem.remove();
            updateRemainingCards();
            cardStartTime = Date.now(); // reset timer for next card

            if (direction === 'up' || currentIndex >= foodCards.length) {
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
    //  REFRESH DECK
    // ===========================================
    btnRefresh.addEventListener('click', () => {
        // Shuffle the current emotion deck
        foodCards = [...emotionDecks[currentMood]].sort(() => Math.random() - 0.5);
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
            cardStartTime = Date.now();
        }, 350);
    });

    // ===========================================
    //  MATCH RESULT AND TIEBREAKER
    // ===========================================
    window.resolveTiebreaker = (foodId) => {
        Swal.close();
        let winningFood = craved.find(f => f.id === foodId);
        finishMatch(winningFood, false);
    };

    function finishMatch(winningFood, isSuper) {
        // Fire confetti
        fireConfetti();

        let htmlOptions = `
            <div style="background: white; border-radius: 12px; padding: 12px 14px; text-align: left; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 12px; position: relative;">
                <span style="font-size: 0.65rem; font-weight: 700; color: white; background: ${isSuper ? '#FFB347' : 'var(--turquoise)'}; padding: 3px 8px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px; position: absolute; right: 10px; top: -10px;">${isSuper ? '★ Super Crave' : '🏆 Ultimate Winner'}</span>
                <div style="font-size: 1.8rem; background: var(--turquoise-soft); width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 12px;">${winningFood.icon}</div>
                <div>
                    <div style="font-weight: 700; color: #1A1A2E; font-size: 1rem; font-family: 'Outfit', sans-serif;">${winningFood.name}</div>
                    <span style="font-size: 0.75rem; color: #6B7280;">Enjoy your cravings!</span>
                </div>
            </div>
        `;

        // Include runner ups if any
        let runnerUps = craved.filter(f => f.id !== winningFood.id);
        if (runnerUps.length > 0) {
            htmlOptions += `<div style="text-align: left; font-size: 0.8rem; color: #9CA3AF; margin-top: 15px; margin-bottom: 5px; font-weight: 600;">You also liked:</div>`;
            runnerUps.slice(0, 2).forEach(food => {
                htmlOptions += `
                    <div style="background: transparent; border: 1px dashed rgba(0,0,0,0.1); border-radius: 10px; padding: 8px 12px; text-align: left; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.2rem;">${food.icon}</span>
                        <span style="font-weight: 600; color: #6B7280; font-size: 0.9rem;">${food.name}</span>
                    </div>
                `;
            });
        }

        Swal.fire({
            html: `
                <div style="text-align: center; font-family: 'Inter', sans-serif; padding-top: 8px;">
                    <h2 style="margin: 0 0 16px 0; color: #1A1A2E; font-size: 1.4rem; font-weight: 700; font-family: 'Outfit', sans-serif;">Your Personal Pick!</h2>
                    
                    <div style="background: #FAF8F5; border-radius: 16px; padding: 14px; margin-bottom: 16px;">
                        ${htmlOptions}
                    </div>
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: 'Browse Restaurants <i class="fa-solid fa-arrow-right" style="margin-left: 5px;"></i>',
            confirmButtonColor: '#1DE1CE',
            allowOutsideClick: false,
            customClass: { popup: 'modern-modal' }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Success!', 'Finding the best restaurants for your cravings...', 'success');
            }
        });
    }

    function showMatchResult() {
        // Show empty state momentarily then modal
        cardContainer.innerHTML = `
            <div class="empty-state">
                <div class="check-circle" style="color: var(--turquoise); font-size: 3rem; margin-bottom: 20px;"><i class="fa-solid fa-check-circle"></i></div>
                <h2 style="font-family: 'Outfit'; font-size: 1.5rem; margin-bottom: 8px;">All Swiped!</h2>
                <p style="color: var(--text-secondary); padding: 0 20px; font-size: 0.95rem;">Building your personal crave list...</p>
            </div>
        `;

        if (craved.length === 0) {
            Swal.fire({
                title: 'No Cravings?',
                text: "You didn't crave anything in this deck. Let's try some new options!",
                icon: 'info',
                confirmButtonText: 'Refresh Deck',
                confirmButtonColor: '#1DE1CE',
                customClass: { popup: 'modern-modal' }
            }).then(() => {
                btnRefresh.click();
            });
            return;
        }

        let superCrave = craved.find(c => c.isSuperCrave);

        setTimeout(() => {
            if (superCrave) {
                finishMatch(superCrave, true);
            } else if (craved.length === 1) {
                finishMatch(craved[0], false);
            } else {
                // Sudden Death Tiebreaker - sort by longest time spent admiring
                craved.sort((a, b) => b.timeSpent - a.timeSpent);
                
                let tieOptions = '';
                craved.forEach(food => {
                    tieOptions += `
                        <button onclick="window.resolveTiebreaker(${food.id})" style="background: white; border: 2px solid #E8E5E0; padding: 12px; border-radius: 12px; width: 100%; display: flex; align-items: center; gap: 12px; margin-bottom: 10px; cursor: pointer; text-align: left; transition: transform 0.1s;">
                            <div style="font-size: 1.8rem; background: #FAF8F5; padding: 8px; border-radius: 10px;">${food.icon}</div>
                            <div>
                                <div style="font-weight: 700; color: #1A1A2E; font-size: 1rem;">${food.name}</div>
                                <div style="font-size: 0.75rem; color: #6B7280; margin-top: 2px;">Admired for: ${(food.timeSpent/1000).toFixed(1)}s</div>
                            </div>
                        </button>
                    `;
                });

                Swal.fire({
                    title: 'Sudden Death! ⚔️',
                    html: `
                        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 16px;">You strongly liked multiple foods. Tap the one you want the most!</p>
                        ${tieOptions}
                    `,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    customClass: { popup: 'modern-modal' }
                });
            }
        }, 1200);
    }
                                <div style="font-size: 0.75rem; color: #6B7280; margin-top: 2px;">Admired for: ${(food.timeSpent/1000).toFixed(1)}s</div>
                            </div>
                        </button>
                    `;
                });

                Swal.fire({
                    title: 'Sudden Death! ⚔️',
                    html: `
                        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 16px;">You strongly liked multiple foods. Tap the one you want the most!</p>
                        ${tieOptions}
                    `,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    customClass: { popup: 'modern-modal' }
                });
            }
        }, 1200);
    }
                let badge = index === 0 ? '<span style="font-size: 0.65rem; font-weight: 700; color: white; background: var(--turquoise); padding: 3px 8px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px; position: absolute; right: 10px; top: -10px;">Top Crave</span>' : '';
                
                htmlOptions += `
                    <div style="background: white; border-radius: 12px; padding: 12px 14px; text-align: left; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 12px; position: relative;">
                        ${badge}
                        <div style="font-size: 1.8rem; background: var(--turquoise-soft); width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 12px;">${food.icon}</div>
                        <div>
                            <div style="font-weight: 700; color: #1A1A2E; font-size: 1rem; font-family: 'Outfit', sans-serif;">${food.name}</div>
                            <span style="font-size: 0.75rem; color: #6B7280;">${food.subtitle}</span>
                        </div>
                    </div>
                `;
            });

            Swal.fire({
                html: `
                    <div style="text-align: center; font-family: 'Inter', sans-serif; padding-top: 8px;">
                        <h2 style="margin: 0 0 16px 0; color: #1A1A2E; font-size: 1.4rem; font-weight: 700; font-family: 'Outfit', sans-serif;">Your Personal Pick!</h2>
                        
                        <div style="background: #FAF8F5; border-radius: 16px; padding: 14px; margin-bottom: 16px;">
                            ${htmlOptions}
                        </div>
                    </div>
                `,
                showConfirmButton: true,
                confirmButtonText: 'Browse Restaurants <i class="fa-solid fa-arrow-right" style="margin-left: 5px;"></i>',
                confirmButtonColor: '#1DE1CE',
                allowOutsideClick: false,
                customClass: { popup: 'modern-modal' }
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire('Success!', 'Finding the best restaurants for your cravings...', 'success');
                }
            });
        }, 1200);
    }

    // ===========================================
    //  CONFETTI
    // ===========================================
    function fireConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const colors = ['#1DE1CE', '#0fa294', '#FFB347', '#66BB6A', '#4A90E2', '#B388FF'];
        const particles = [];

        for (let i = 0; i < 40; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12 - 4,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;

            particles.forEach(p => {
                p.vy += 0.4;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;

                if (p.y < canvas.height) active = true;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            });

            if (active) requestAnimationFrame(animate);
            else ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        animate();
    }

    // Init (We no longer init cards on load, we wait for emotion selection)
    // renderCards();
    // renderProgressDots();
});