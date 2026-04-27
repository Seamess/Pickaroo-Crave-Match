document.addEventListener('DOMContentLoaded', () => {
    // ===========================================
    //  STATE
    // ===========================================
    let cartItems = [];
    let mySubtotal = 0;
    const hubDeliveryFee = 49;
    let selectedPayment = 'gcash';

    const addMoreBtn = document.getElementById('solo-add-btn');
    const selfOrderList = document.getElementById('solo-order-list');
    const totalPriceEl = document.getElementById('solo-total-price');
    const subtotalEl = document.getElementById('solo-subtotal');
    const checkoutBtn = document.getElementById('solo-checkout-btn');
    const paymentMethodsContainer = document.getElementById('solo-payment-methods');
    const discountRow = document.getElementById('solo-discount-row');
    const discountDisplay = document.getElementById('solo-discount-display');

    // ===========================================
    //  LOAD MATCH DATA FROM SESSION
    // ===========================================
    const matchData = JSON.parse(sessionStorage.getItem('singleMatchData') || 'null');
    
    if (matchData && matchData.winner) {
        const matchIcon = document.getElementById('solo-match-icon');
        const matchTitle = document.getElementById('solo-match-title');
        const matchSub = document.getElementById('solo-match-sub');

        matchIcon.textContent = matchData.winner.icon;
        matchTitle.textContent = `${matchData.winner.name} matched!`;
        
        if (matchData.isSuper) {
            matchSub.textContent = '★ Super Crave — you loved this!';
        } else if (matchData.runnerUps && matchData.runnerUps.length > 0) {
            matchSub.textContent = `Also liked: ${matchData.runnerUps.map(r => r.name).slice(0, 2).join(', ')}`;
        } else {
            matchSub.textContent = 'Your top pick from the crave match';
        }
    }

    // ===========================================
    //  RESTAURANTS & MENU (for picker)
    // ===========================================
    const restaurants = [
        {
            name: 'Burger Joint',
            icon: '🍔',
            items: [
                { name: 'Smash Burger', price: 180 },
                { name: 'Cheesy Fries', price: 95 },
                { name: 'Milkshake', price: 120 },
            ]
        },
        {
            name: 'Pizza Corner',
            icon: '🍕',
            items: [
                { name: 'Margherita Pizza', price: 280 },
                { name: 'Garlic Bread', price: 85 },
                { name: 'Pasta Carbonara', price: 195 },
            ]
        },
        {
            name: 'Tokyo Sushi',
            icon: '🍣',
            items: [
                { name: 'California Roll', price: 165 },
                { name: 'Salmon Sashimi', price: 245 },
                { name: 'Gyoza (6pc)', price: 110 },
            ]
        },
        {
            name: 'Tea Station',
            icon: '🧋',
            items: [
                { name: 'Brown Sugar Boba', price: 140 },
                { name: 'Taro Milk Tea', price: 130 },
                { name: 'Matcha Latte', price: 155 },
            ]
        }
    ];

    // ===========================================
    //  ADD FROM HUB (Restaurant Picker)
    // ===========================================
    addMoreBtn.addEventListener('click', () => {
        const restaurantHTML = restaurants.map((r, idx) => `
            <div class="restaurant-option" data-idx="${idx}" style="cursor: pointer;">
                <div class="r-icon">${r.icon}</div>
                <div>
                    <div class="r-name">${r.name}</div>
                    <div class="r-desc">${r.items.length} items available</div>
                </div>
            </div>
        `).join('');

        Swal.fire({
            title: 'Pick a Restaurant',
            html: `<div class="restaurant-grid">${restaurantHTML}</div>`,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Close',
            customClass: { popup: 'modern-modal' },
            didOpen: () => {
                document.querySelectorAll('.restaurant-option').forEach(el => {
                    el.addEventListener('click', () => {
                        Swal.close();
                        const restaurant = restaurants[el.dataset.idx];
                        showMenuPicker(restaurant);
                    });
                });
            }
        });
    });

    function showMenuPicker(restaurant) {
        const menuHTML = restaurant.items.map((item, idx) => `
            <div class="restaurant-option" data-idx="${idx}" style="cursor: pointer;">
                <div class="r-icon" style="background: var(--turquoise-soft); font-size: 0.9rem;">${restaurant.icon}</div>
                <div style="flex: 1;">
                    <div class="r-name">${item.name}</div>
                    <div class="r-desc">${restaurant.name}</div>
                </div>
                <div style="font-weight: 700; color: var(--turquoise); font-size: 0.9rem;">₱${item.price}.00</div>
            </div>
        `).join('');

        Swal.fire({
            title: `${restaurant.icon} ${restaurant.name}`,
            html: `<div class="restaurant-grid">${menuHTML}</div>`,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Back',
            customClass: { popup: 'modern-modal' },
            didOpen: () => {
                document.querySelectorAll('.restaurant-option').forEach(el => {
                    el.addEventListener('click', () => {
                        const item = restaurant.items[el.dataset.idx];
                        addItemToCart(item, restaurant);
                        Swal.close();
                    });
                });
            }
        });
    }

    function addItemToCart(item, restaurant) {
        // Clear empty state on first add
        if (cartItems.length === 0) {
            selfOrderList.innerHTML = '';
            selfOrderList.classList.remove('empty-cart');
        }

        cartItems.push({ ...item, restaurant: restaurant.name });
        mySubtotal += item.price;

        const itemEl = document.createElement('div');
        itemEl.className = 'order-item';
        itemEl.style.animationDelay = `${cartItems.length * 0.05}s`;
        itemEl.innerHTML = `
            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
                    <span style="font-weight: 600; font-size: 0.85rem; color: var(--text-primary);">${item.name}</span>
                    <span style="font-weight: 700; color: var(--turquoise); font-size: 0.85rem;">₱${item.price}.00</span>
                </div>
                <div style="font-size: 0.72rem; color: var(--text-secondary);">${restaurant.name}</div>
            </div>
        `;
        selfOrderList.appendChild(itemEl);

        // Recalculate
        recalculateTotals();

        // Quick toast
        const Toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            customClass: { popup: 'modern-modal' },
            didOpen: (toast) => {
                toast.style.marginTop = '60px';
                toast.style.fontSize = '0.8rem';
            }
        });
        Toast.fire({ icon: 'success', title: `${item.name} added!` });
    }

    // ===========================================
    //  TOTALS RECALCULATION
    // ===========================================
    function recalculateTotals() {
        const subtotal = mySubtotal;
        const total = subtotal + hubDeliveryFee;
        
        // Check for stack discount (basket ≥ ₱500 = 5% off)
        let discount = 0;
        if (subtotal >= 500) {
            discount = Math.round(subtotal * 0.05);
            discountRow.style.display = 'flex';
            discountDisplay.textContent = `-₱${discount}.00`;
        } else {
            discountRow.style.display = 'none';
        }

        const finalTotal = total - discount;

        subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
        totalPriceEl.textContent = `₱${finalTotal.toFixed(2)}`;
    }

    // ===========================================
    //  PAYMENT METHOD SELECTION
    // ===========================================
    paymentMethodsContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.method-card');
        if (!card) return;

        document.querySelectorAll('.method-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedPayment = card.dataset.method;

        // Subtle feedback
        card.style.transform = 'scale(0.93)';
        setTimeout(() => card.style.transform = '', 150);
    });

    // ===========================================
    //  CHECKOUT
    // ===========================================
    checkoutBtn.addEventListener('click', () => {
        if (cartItems.length === 0) {
            Swal.fire({
                title: 'Nothing in your cart',
                text: 'Add some items from the Hub first!',
                icon: 'warning',
                confirmButtonText: 'Got it',
                customClass: { popup: 'modern-modal' }
            });
            return;
        }

        const paymentNames = {
            gcash: 'GCash',
            maya: 'Maya',
            card: 'Credit/Debit Card',
            cod: 'Cash on Delivery',
            qrph: 'QR Ph'
        };

        checkoutBtn.textContent = 'Placing Order...';
        checkoutBtn.style.opacity = '0.7';
        checkoutBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            checkoutBtn.textContent = 'Order Placed! 🚀';
            checkoutBtn.style.background = 'var(--turquoise)';
            checkoutBtn.style.opacity = '1';

            const matchInfo = matchData && matchData.winner 
                ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                       <span style="color: #6B7280;">Crave Match</span>
                       <span style="font-weight: 600; color: #1A1A2E;">${matchData.winner.icon} ${matchData.winner.name}</span>
                   </div>` 
                : '';

            Swal.fire({
                html: `
                    <div style="text-align: center; font-family: 'Inter', sans-serif; padding-top: 8px;">
                        <div style="font-size: 2.5rem; margin-bottom: 8px;">🎉</div>
                        <h2 style="margin: 0 0 4px 0; font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 1.3rem; color: #1A1A2E;">Order Placed!</h2>
                        <p style="color: #6B7280; font-size: 0.85rem; margin: 0 0 16px 0;">Your meal is being prepared.</p>
                        
                        <div style="background: #FAF8F5; border-radius: 12px; padding: 12px; font-size: 0.82rem; text-align: left; margin-bottom: 12px;">
                            ${matchInfo}
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: #6B7280;">Payment</span>
                                <span style="font-weight: 600; color: #1A1A2E;">${paymentNames[selectedPayment]}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: #6B7280;">Total</span>
                                <span style="font-weight: 700; color: #1DE1CE;">${totalPriceEl.textContent}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: #6B7280;">Items</span>
                                <span style="font-weight: 600; color: #1A1A2E;">${cartItems.length} item${cartItems.length > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                        
                        <div style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; color: #0fa294; font-weight: 600;">
                            <i class="fa-solid fa-truck-fast"></i> Estimated: 20-30 min
                        </div>
                    </div>
                `,
                confirmButtonText: 'Track Order <i class="fa-solid fa-location-dot" style="margin-left: 4px;"></i>',
                confirmButtonColor: '#1DE1CE',
                customClass: { popup: 'modern-modal' }
            });

            setTimeout(() => {
                checkoutBtn.textContent = 'Place My Order';
                checkoutBtn.style.background = 'var(--turquoise)';
                checkoutBtn.style.pointerEvents = '';
            }, 3000);
        }, 1500);
    });

    // ===========================================
    //  INIT
    // ===========================================
    recalculateTotals();
});
