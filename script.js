document.addEventListener('DOMContentLoaded', () => {
    // --- Live Activity Feed ---
    const activityList = document.getElementById('activity-list');
    const activityMessages = [
        { emoji: '🍔', text: '<strong>Raff</strong> craved Smash Burgers' },
        { emoji: '🟢', text: '<strong>John</strong> joined the match' },
        { emoji: '🍜', text: '<strong>Maan</strong> is eyeing Ramen' },
        { emoji: '✅', text: '<strong>Raff</strong> finished swiping' },
        { emoji: '🧋', text: '<strong>John</strong> added Boba to faves' },
        { emoji: '🍗', text: '<strong>Maan</strong> craved Fried Chicken' },
    ];
    let activityIndex = 0;

    function addActivityItem() {
        const msg = activityMessages[activityIndex % activityMessages.length];
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <span class="activity-emoji">${msg.emoji}</span>
            <span>${msg.text}</span>
            <span class="activity-time">just now</span>
        `;
        
        // Insert at top
        activityList.insertBefore(item, activityList.firstChild);
        
        // Limit visible items
        while (activityList.children.length > 3) {
            activityList.removeChild(activityList.lastChild);
        }
        
        activityIndex++;
    }

    // Auto-feed every 4 seconds
    setInterval(addActivityItem, 4000);

    // --- Share / Invite ---
    const shareBtn = document.getElementById('share-btn');
    const avatarRow = document.getElementById('avatar-row');
    const pastelColors = ['#E4D1FF', '#FFFACD', '#D1E8FF', '#E4FFD1', '#FFD1DC', '#D1FFFB'];
    let huntersCount = 3;

    shareBtn.addEventListener('click', () => {
        // Quick toast instead of full-screen alert
        const Toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 1800,
            timerProgressBar: true,
            customClass: { popup: 'modern-modal' },
            didOpen: (toast) => {
                toast.style.marginTop = '60px';
                toast.style.fontSize = '0.85rem';
            }
        });

        Toast.fire({
            icon: 'success',
            title: 'Invite link copied!'
        });

        // Change button to check
        shareBtn.innerHTML = '<i class="fa-solid fa-check"></i>';

        // Simulate friend joining
        setTimeout(() => {
            shareBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';

            if (huntersCount < 12) {
                const newAvatar = document.createElement('img');
                newAvatar.className = 'avatar';
                newAvatar.src = 'images/avatar_default.png';
                newAvatar.alt = 'Hunter';
                newAvatar.style.transform = 'scale(0)';
                newAvatar.style.transition = `transform 0.4s ${getComputedStyle(document.documentElement).getPropertyValue('--ease-bounce')}`;
                
                avatarRow.appendChild(newAvatar);
                
                requestAnimationFrame(() => {
                    newAvatar.style.transform = 'scale(1)';
                });

                huntersCount++;

                // Update discount tier
                updateDiscountTiers();

                // Add to activity feed
                const names = ['John', 'Maan', 'Sarah', 'Luis', 'Ava', 'Kim'];
                const name = names[Math.floor(Math.random() * names.length)];
                const msg = { emoji: '🟢', text: `<strong>${name}</strong> joined the match` };
                const item = document.createElement('div');
                item.className = 'activity-item';
                item.innerHTML = `
                    <span class="activity-emoji">${msg.emoji}</span>
                    <span>${msg.text}</span>
                    <span class="activity-time">just now</span>
                `;
                activityList.insertBefore(item, activityList.firstChild);
                while (activityList.children.length > 3) {
                    activityList.removeChild(activityList.lastChild);
                }
            }
        }, 1500);
    });

    function updateDiscountTiers() {
        const tierPills = document.querySelectorAll('.tier-pill');
        if (huntersCount >= 5 && tierPills[0]) {
            tierPills[0].classList.add('active');
        }
    }

    // --- Start Swiping CTA ---
    const startBtn = document.getElementById('start-swiping-btn');
    startBtn.addEventListener('click', () => {
        startBtn.classList.remove('pulse');
        startBtn.innerHTML = 'Locking Lobby...';
        startBtn.style.opacity = '0.8';
        startBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            startBtn.innerHTML = 'Let\'s Go! 🚀';
            startBtn.style.opacity = '1';

            setTimeout(() => {
                window.location.href = 'crave_match.html';
            }, 600);
        }, 800);
    });

    // --- Back Button ---
    const backBtn = document.getElementById('back-btn');
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // In a real app this would go back
        Swal.fire({
            title: 'Leave Match?',
            text: 'You can rejoin anytime with the link.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Leave',
            cancelButtonText: 'Stay',
            customClass: { popup: 'modern-modal' }
        });
    });
});