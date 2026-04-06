document.addEventListener('DOMContentLoaded', () => {
    // ===========================================
    //  STATE
    // ===========================================
    let cartItems = [];
    let mySubtotal = 0;
    const groupItemsTotal = 780; // Raff: 210 + Maan: 350 + John: 220
    const hubDeliveryFee = 49;
    const allyDropFee = 15;
    let selectedPayment = 'gcash';
    let splitMode = 'even';

    const addMoreBtn = document.getElementById('add-more-btn');
    const selfOrderList = document.getElementById('self-order-list');
    const totalPriceEl = document.getElementById('total-price');
    const subtotalEl = document.getElementById('subtotal-display');
    const checkoutBtn = document.getElementById('lock-order-btn');
    const splitModeControl = document.getElementById('split-mode');
    const paymentMethodsContainer = document.getElementById('payment-methods');
    const miniFeed = document.getElementById('mini-feed');
    const discountRow = document.getElementById('discount-row');
    const discountDisplay = document.getElementById('discount-display');
    const yourShareEl = document.getElementById('your-share');

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

        // Update feed
        updateFeed(`You added ${item.name} from ${restaurant.name}`);

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
        const subtotal = groupItemsTotal + mySubtotal;
        const total = subtotal + hubDeliveryFee + allyDropFee;
        
        // Check for stack discount
        let discount = 0;
        // Basket size discount: ₱500+ = 5%
        if (subtotal >= 500) {
            discount = Math.round(subtotal * 0.05);
            discountRow.style.display = 'flex';
            discountDisplay.textContent = `-₱${discount}.00`;
        }

        const finalTotal = total - discount;

        subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
        totalPriceEl.textContent = `₱${finalTotal.toFixed(2)}`;

        // Update split amounts
        updateSplitAmounts(finalTotal);
    }

    function updateSplitAmounts(total) {
        const splitRows = document.querySelectorAll('.split-row .split-amount');
        const memberCount = 4;

        if (splitMode === 'even') {
            const perPerson = total / memberCount;
            splitRows.forEach(el => {
                el.textContent = `₱${perPerson.toFixed(2)}`;
            });
            // Your share
            if (yourShareEl) yourShareEl.textContent = `₱${perPerson.toFixed(2)}`;
        } else if (splitMode === 'item') {
            // By item: each person pays for their own items + split of delivery/fees
            const feePerPerson = (hubDeliveryFee + allyDropFee) / memberCount;
            splitRows[0].textContent = `₱${(mySubtotal + feePerPerson).toFixed(2)}`; // You
            splitRows[1].textContent = `₱${(210 + feePerPerson).toFixed(2)}`; // Raff
            splitRows[2].textContent = `₱${(350 + feePerPerson).toFixed(2)}`; // Maan
            splitRows[3].textContent = `₱${(220 + feePerPerson).toFixed(2)}`; // John
            if (yourShareEl) yourShareEl.textContent = splitRows[0].textContent;
        }
        // Custom mode: amounts stay manually editable (not implemented in prototype)
    }

    // ===========================================
    //  SPLIT MODE TOGGLE
    // ===========================================
    splitModeControl.addEventListener('click', (e) => {
        const btn = e.target.closest('.seg-btn');
        if (!btn) return;

        document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        splitMode = btn.dataset.mode;

        const currentTotal = parseFloat(totalPriceEl.textContent.replace('₱', '').replace(',', ''));
        updateSplitAmounts(currentTotal);
    });

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
    //  LIVE FEED
    // ===========================================
    const feedMessages = [
        { text: '<strong>Maan</strong> added Family Pizza' },
        { text: '<strong>John</strong> is browsing Tokyo Sushi' },
        { text: '<strong>Raff</strong> confirmed payment via GCash' },
        { text: '<strong>John</strong> added Spicy Tuna Roll' },
        { text: '<strong>Maan</strong> changed to Maya payment' },
    ];
    let feedIdx = 0;

    function updateFeed(customText) {
        const text = customText || feedMessages[feedIdx % feedMessages.length].text;
        miniFeed.style.opacity = '0';
        miniFeed.style.transition = 'opacity 0.2s ease';
        setTimeout(() => {
            miniFeed.innerHTML = `
                <span class="pulse-dot"></span>
                <span>${text}</span>
            `;
            miniFeed.style.opacity = '1';
        }, 200);
        if (!customText) feedIdx++;
    }

    // Auto-feed every 5s
    setInterval(() => updateFeed(), 5000);

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

        checkoutBtn.textContent = 'Routing Riders...';
        checkoutBtn.style.opacity = '0.7';
        checkoutBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            checkoutBtn.textContent = 'Order Locked! 🚀';
            checkoutBtn.style.background = 'var(--turquoise)';
            checkoutBtn.style.opacity = '1';

            Swal.fire({
                html: `
                    <div style="text-align: center; font-family: 'Inter', sans-serif; padding-top: 8px;">
                        <div style="font-size: 2.5rem; margin-bottom: 8px;">🎉</div>
                        <h2 style="margin: 0 0 4px 0; font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 1.3rem; color: #1A1A2E;">Group Order Locked!</h2>
                        <p style="color: #6B7280; font-size: 0.85rem; margin: 0 0 16px 0;">The Hub is preparing your meals.</p>
                        
                        <div style="background: #FAF8F5; border-radius: 12px; padding: 12px; font-size: 0.82rem; text-align: left; margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: #6B7280;">Payment</span>
                                <span style="font-weight: 600; color: #1A1A2E;">${paymentNames[selectedPayment]}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: #6B7280;">Your Share</span>
                                <span style="font-weight: 700; color: #1DE1CE;">${yourShareEl.textContent}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: #6B7280;">Ally Drop</span>
                                <span style="font-weight: 600; color: #1DE1CE;">John's sushi 📍 300m</span>
                            </div>
                        </div>
                        
                        <div style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; color: #0fa294; font-weight: 600;">
                            <i class="fa-solid fa-truck-fast"></i> Estimated: 25-35 min
                        </div>
                    </div>
                `,
                confirmButtonText: 'Track Riders <i class="fa-solid fa-location-dot" style="margin-left: 4px;"></i>',
                confirmButtonColor: '#1DE1CE',
                customClass: { popup: 'modern-modal' }
            });

            setTimeout(() => {
                checkoutBtn.textContent = 'Lock Group Order';
                checkoutBtn.style.background = 'var(--turquoise)';
                checkoutBtn.style.pointerEvents = '';
            }, 3000);
        }, 1500);
    });

    // ===========================================
    //  INIT — Calculate initial split
    // ===========================================
    const initialTotal = groupItemsTotal + hubDeliveryFee + allyDropFee;
    updateSplitAmounts(initialTotal);
});