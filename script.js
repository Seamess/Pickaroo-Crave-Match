document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.querySelector('.add-btn');
    const avatarRow = document.querySelector('.avatar-row');

    // Set icon to share symbol
    addBtn.innerHTML = '<i class="fa-solid fa-share-nodes"></i>';

    const pastelColors = ['#FFD1DC', '#D1FFFB', '#FFE4D1', '#E4D1FF', '#E4FFD1', '#FFFACD', '#D1E8FF'];
    let huntersCount = 4;
    const progressFillInit = document.querySelector('.progress-fill');
    if (progressFillInit) {
        progressFillInit.style.width = Math.min(100, (huntersCount / 15) * 100) + '%';
    }

    addBtn.addEventListener('click', () => {
        if (huntersCount >= 15) {
            Swal.fire({
                title: 'Maximum Reached!',
                text: 'You have unlocked the 20% discount.',
                icon: 'success',
                customClass: { popup: 'modern-modal', title: '' },
                confirmButtonText: 'Awesome!'
            });
            return;
        }

        // Simulate the sharing flow
        Swal.fire({
            title: 'Group Link Copied!',
            text: 'Share this link to your messenger groups to invite friends to join your Pickaroo Hunt.',
            icon: 'success',
            timer: 2500,
            showConfirmButton: false,
            customClass: { popup: 'modern-modal', title: '' }
        });
        
        // Provide a visual cue that the button was clicked
        addBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        
        // Simulate a friend joining the group a few seconds after sharing the link
        setTimeout(() => {
            // Return to normal share button
            addBtn.innerHTML = '<i class="fa-solid fa-share-nodes"></i>';
            
            // Create new avatar
            const newAvatar = document.createElement('div');
            newAvatar.className = 'avatar';
            // Pick a random pastel color
            const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
            newAvatar.style.background = randomColor;

            // Add a pop-in animation effect inline
            newAvatar.style.transform = 'scale(0)';
            newAvatar.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

            // Insert before the add button
            avatarRow.insertBefore(newAvatar, addBtn);
            
            // Trigger animation
            requestAnimationFrame(() => {
                newAvatar.style.transform = 'scale(1)';
            });

            huntersCount++;
            
            // Update progress fill
            const progressFill = document.querySelector('.progress-fill');
            if (progressFill) {
                // Calculate percentage: 3 to 15 mapped to 0% to 100% roughly, or linearly
                const percentage = Math.min(100, (huntersCount / 15) * 100);
                progressFill.style.width = percentage + '%';
                progressFill.style.transition = 'width 0.4s ease-out';
            }
            
            // Highlight progress steps (simulation)
            if (huntersCount >= 7) {
                const steps = document.querySelectorAll('.progress-step');
                if (steps[1]) steps[1].classList.add('active'); // 7 Hunters step
                if (steps[1]) steps[1].querySelector('span:last-child').style.color = 'var(--cerise)';
            }
            if (huntersCount >= 10) {
                const steps = document.querySelectorAll('.progress-step');
                if (steps[2]) steps[2].classList.add('active'); // 10 Hunters step
                if (steps[2]) steps[2].querySelector('span:last-child').style.color = 'var(--cerise)';
            }
            
            // Simulate push notification that a friend joined via the shared link
            console.log(`A friend joined via your shared link! Total hunters: ${huntersCount}`);
            
        }, 1500); // 1.5 seconds later, a friend "joins"
    });

    // --- Settings Edit Simulation ---
    const editIcons = document.querySelectorAll('.setting-item .fa-pen');
    editIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const settingDiv = icon.closest('.setting-item');
            const label = settingDiv.querySelector('.setting-label').innerText;
            const valueEl = settingDiv.querySelector('.setting-value');
            
            Swal.fire({
                title: `Edit: ${label}`,
                input: 'text',
                inputValue: valueEl.innerText,
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel',
                customClass: { 
                    popup: 'modern-modal', 
                    title: '',
                    input: 'modern-input',
                    confirmButton: ''
                }
            }).then((result) => {
                if (result.isConfirmed && result.value.trim() !== '') {
                    valueEl.style.opacity = '0';
                    setTimeout(() => {
                        valueEl.innerText = result.value;
                        valueEl.style.opacity = '1';
                        valueEl.style.transition = 'opacity 0.3s';
                    }, 150);
                }
            });
        });
    });

    // --- Chat Simulation ---
    const openChatBtn = document.querySelector('.chat-box div:last-child');
    if (openChatBtn) {
        openChatBtn.style.cursor = 'pointer';
        openChatBtn.addEventListener('click', () => {
            Swal.fire({
                title: 'Group Chat',
                text: 'Opening Hunt Group Chat...',
                icon: 'info',
                customClass: { popup: 'modern-modal', title: '' },
                confirmButtonText: 'Enter'
            });
        });
    }

    const initiateBtn = document.querySelector('.btn-primary');
    initiateBtn.addEventListener('click', () => {
        const originalText = initiateBtn.innerHTML;
        initiateBtn.innerText = 'Locking Lobby...';
        initiateBtn.style.opacity = '0.7';

        setTimeout(() => {
            initiateBtn.innerText = 'To The Match! 🚀';
            initiateBtn.style.backgroundColor = 'var(--cerise)';
            initiateBtn.style.opacity = '1';
            
            setTimeout(() => {
                // Transition to Phase 2: Crave Match Voting
                window.location.href = 'crave_match.html';
            }, 1000);
        }, 1000); // Simulate network request
    });
});