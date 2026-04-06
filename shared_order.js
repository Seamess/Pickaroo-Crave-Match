document.addEventListener('DOMContentLoaded', () => {
    let cartItemCount = 0;
    let mySubtotal = 0;
    const baseItemsTotal = 780; // Updated to include Jhon's Sushi (560 + 220)
    const hubDeliveryFee = 49;
    const allyDropFee = 15; // The new radius fee

    const addMoreBtn = document.getElementById('add-more-btn');
    const selfOrderList = document.getElementById('self-order-list');
    const totalPriceEl = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('lock-order-btn');

    if (addMoreBtn) {
        addMoreBtn.addEventListener('click', () => {
            if (cartItemCount === 0) {
                selfOrderList.innerHTML = ''; // clear placeholder text
                selfOrderList.classList.remove('empty-state');
                selfOrderList.style.textAlign = 'left';
            }
            
            cartItemCount++;
            mySubtotal += 120; // Simulated item price
            const currentTotal = baseItemsTotal + mySubtotal + hubDeliveryFee + allyDropFee;

            const itemHTML = `
                <div class="order-item" style="margin-bottom: 12px; padding: 12px; border-radius: 12px;">
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <span style="font-weight: 600; font-size: 0.95rem; color: #111;">Spicy Chicken Wings</span>
                            <span style="font-weight: 700; color: var(--turquoise);">₱120.00</span>
                        </div>
                        <div style="font-size: 0.85rem; color: var(--gray-text);">Uptown Wing Spot</div>
                    </div>
                </div>
            `;
            selfOrderList.innerHTML += itemHTML;
            
            // Update UI total
            totalPriceEl.innerText = `₱${currentTotal.toFixed(2)}`;
            const subtotalEl = document.querySelector('.total-row:first-child span:last-child');
            if (subtotalEl) subtotalEl.innerText = `₱${(baseItemsTotal + mySubtotal).toFixed(2)}`;

            Swal.fire({
                title: 'Added to Hub Cart!',
                text: 'Spicy Chicken Wings added. No extra delivery fee!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                customClass: { popup: 'modern-modal', title: '' }
            });
        });
    }

    checkoutBtn.addEventListener('click', () => {
        if (cartItemCount === 0) {
            Swal.fire({
                title: 'Cart is empty',
                text: 'Add some items from the Hub before locking the order.',
                icon: 'warning',
                confirmButtonText: 'Got it',
                customClass: { popup: 'modern-modal', title: '' }
            });
            return;
        }

        const originalText = checkoutBtn.innerText;
        checkoutBtn.innerText = 'Routing Riders...';
        checkoutBtn.style.opacity = '0.7';

        setTimeout(() => {
            checkoutBtn.innerText = 'Order Locked! 🚀';
            checkoutBtn.style.backgroundColor = 'var(--cerise)';
            checkoutBtn.style.opacity = '1';
            
            Swal.fire({
                title: 'Group Order Locked!',
                text: 'The Hub is preparing meals, and checking the Ally Drop nearby. Hang tight!',
                icon: 'success',
                confirmButtonText: 'Track Riders',
                customClass: { popup: 'modern-modal', title: '' }
            });

            setTimeout(() => {
                checkoutBtn.innerText = originalText;
                checkoutBtn.style.backgroundColor = 'var(--turquoise)';
            }, 3000);
        }, 1500);
    });
});