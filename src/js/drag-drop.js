/**
 * Drag and Drop Handlers
 * Handles all drag and drop functionality for desktop and mobile
 */

import {
    isDragging,
    autoScrollInterval,
    touchDragData,
    touchGhostElement,
    touchStartElement,
    touchLongPressTimer,
    touchStartX,
    touchStartY,
    LONG_PRESS_DURATION,
    TOUCH_MOVE_THRESHOLD,
    setIsDragging,
    setAutoScrollInterval,
    setTouchDragData,
    setTouchGhostElement,
    setTouchStartElement,
    setTouchLongPressTimer,
    setTouchStartPosition
} from './game-state.js';
import { vibrate } from './utils.js';

// ==================== DESKTOP DRAG HANDLERS ====================

/**
 * Handle drag start for team items
 */
export function handleDragStart(event) {
    setIsDragging(true);
    event.target.classList.add('dragging');

    const teamLogo = event.target.querySelector('img');
    const teamName = teamLogo.alt;
    const logoSrc = teamLogo.src;
    
    const dragData = {
        name: teamName,
        logo: logoSrc
    };
    event.dataTransfer.setData('application/json', JSON.stringify(dragData));
}

/**
 * Handle drag end for team items
 */
export function handleDragEnd(event) {
    setIsDragging(false);
    event.target.classList.remove('dragging');
    
    clearInterval(autoScrollInterval);
    document.querySelectorAll('.scroll-indicator').forEach(indicator => {
        indicator.classList.remove('visible');
    });
    
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
    });
    
    const teamList = document.getElementById('teamList');
    if (teamList) {
        teamList.classList.remove('drag-over-remove');
    }
}

/**
 * Handle drag start for already placed teams
 */
export function handlePlacedTeamDragStart(event) {
    setIsDragging(true);
    event.target.classList.add('dragging');
    
    const teamName = event.target.dataset.teamName;
    const teamLogo = event.target.querySelector('img');
    const logoSrc = teamLogo.src;
    
    const dragData = {
        name: teamName,
        logo: logoSrc,
        isPlacedTeam: true
    };
    event.dataTransfer.setData('application/json', JSON.stringify(dragData));
    
    window.draggedPlacedTeam = event.target;
    event.target.style.visibility = 'hidden';
}

/**
 * Handle drag end for placed teams
 */
export function handlePlacedTeamDragEnd(event) {
    setIsDragging(false);
    event.target.classList.remove('dragging');
    
    clearInterval(autoScrollInterval);
    document.querySelectorAll('.scroll-indicator').forEach(indicator => {
        indicator.classList.remove('visible');
    });
    
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
    });
    
    const teamList = document.getElementById('teamList');
    if (teamList) {
        teamList.classList.remove('drag-over-remove');
    }
    
    if (event.target.style.visibility === 'hidden') {
        event.target.style.visibility = 'visible';
        window.draggedPlacedTeam = null;
    }
}

/**
 * Handle drag over drop zones
 */
export function handleDragOver(event) {
    event.preventDefault();
    const dropZone = event.target.closest('.drop-zone');
    if (dropZone) {
        dropZone.classList.add('drag-over');
    }
}

/**
 * Handle drag leave from drop zones
 */
export function handleDragLeave(event) {
    const dropZone = event.target.closest('.drop-zone');
    if (dropZone && !dropZone.contains(event.relatedTarget)) {
        dropZone.classList.remove('drag-over');
    }
}

/**
 * Handle drop in normal mode
 */
export function handleDrop(event) {
    event.preventDefault();
    const dropZone = event.target.closest('.drop-zone');
    
    if (!dropZone) return;
    
    dropZone.classList.remove('drag-over');
    
    try {
        const dragData = JSON.parse(event.dataTransfer.getData('application/json'));
        
        if (dragData.isPlacedTeam && window.draggedPlacedTeam) {
            const existingTeam = dropZone.querySelector('.placed-team');
            
            if (existingTeam) {
                // Swap teams
                const draggedTeam = window.draggedPlacedTeam;
                const originalDropZone = draggedTeam.closest('.drop-zone');
                
                // Clear validation classes on both zones when swapping
                dropZone.classList.remove('correct', 'incorrect', 'misplaced');
                originalDropZone.classList.remove('correct', 'incorrect', 'misplaced');
                
                dropZone.appendChild(draggedTeam);
                draggedTeam.style.visibility = 'visible';
                draggedTeam.style.opacity = '1';
                draggedTeam.classList.remove('dragging');
                
                originalDropZone.appendChild(existingTeam);
                
                dropZone.classList.add('filled');
                originalDropZone.classList.add('filled');
            } else {
                // Move to empty zone
                const draggedTeam = window.draggedPlacedTeam;
                const originalDropZone = draggedTeam.closest('.drop-zone');
                
                // Clear validation classes on both zones
                dropZone.classList.remove('correct', 'incorrect', 'misplaced');
                originalDropZone.classList.remove('correct', 'incorrect', 'misplaced');
                
                dropZone.appendChild(draggedTeam);
                draggedTeam.style.visibility = 'visible';
                draggedTeam.style.opacity = '1';
                draggedTeam.classList.remove('dragging');
                
                dropZone.classList.add('filled');
                originalDropZone.classList.remove('filled');
            }
            
            window.draggedPlacedTeam = null;
        } else {
            // New team from team list
            const existingTeam = dropZone.querySelector('.placed-team');
            if (existingTeam) {
                existingTeam.remove();
            }
            
            // Clear validation classes when adding new team
            dropZone.classList.remove('correct', 'incorrect', 'misplaced');
            
            const teamDiv = document.createElement('div');
            teamDiv.className = 'placed-team';
            teamDiv.dataset.teamName = dragData.name;
            teamDiv.draggable = true;
            
            const teamLogo = document.createElement('img');
            teamLogo.src = dragData.logo;
            teamLogo.alt = dragData.name;
            teamLogo.className = 'team-logo';
            
            teamDiv.addEventListener('dragstart', handlePlacedTeamDragStart);
            teamDiv.addEventListener('dragend', handlePlacedTeamDragEnd);
            teamDiv.addEventListener('touchstart', handlePlacedTeamTouchStart, { passive: false });
            
            teamDiv.appendChild(teamLogo);
            dropZone.appendChild(teamDiv);
            
            dropZone.classList.add('filled');
        }
    } catch (error) {
        console.error('Error handling drop:', error);
    }
}

/**
 * Handle drop in hard mode
 */
export function handleDropHardMode(event) {
    event.preventDefault();
    const dropZone = event.target.closest('.drop-zone');
    
    if (!dropZone) return;
    
    dropZone.classList.remove('drag-over');
    
    try {
        const dragData = JSON.parse(event.dataTransfer.getData('application/json'));
        
        if (dragData.isPlacedTeam && window.draggedPlacedTeam) {
            const draggedTeam = window.draggedPlacedTeam;
            const originalDropZone = draggedTeam.closest('.drop-zone');
            
            draggedTeam.classList.remove('correct-team', 'incorrect-team', 'misplaced-team');
            
            // Clear validation classes on both zones
            dropZone.classList.remove('correct', 'incorrect', 'misplaced');
            if (originalDropZone) {
                originalDropZone.classList.remove('correct', 'incorrect', 'misplaced');
            }
            
            dropZone.appendChild(draggedTeam);
            draggedTeam.style.visibility = 'visible';
            draggedTeam.style.opacity = '1';
            draggedTeam.classList.remove('dragging');
            
            if (dropZone.querySelectorAll('.placed-team').length > 0) {
                dropZone.classList.add('filled');
            }
            if (originalDropZone && originalDropZone.querySelectorAll('.placed-team').length === 0) {
                originalDropZone.classList.remove('filled');
            }
            
            window.draggedPlacedTeam = null;
        } else {
            // New team from team list
            const teamDiv = document.createElement('div');
            teamDiv.className = 'placed-team';
            teamDiv.dataset.teamName = dragData.name;
            teamDiv.draggable = true;
            
            const teamLogo = document.createElement('img');
            teamLogo.src = dragData.logo;
            teamLogo.alt = dragData.name;
            teamLogo.className = 'team-logo';
            
            teamDiv.addEventListener('dragstart', handlePlacedTeamDragStart);
            teamDiv.addEventListener('dragend', handlePlacedTeamDragEnd);
            teamDiv.addEventListener('touchstart', handlePlacedTeamTouchStart, { passive: false });
            
            teamDiv.appendChild(teamLogo);
            dropZone.appendChild(teamDiv);
            
            dropZone.classList.add('filled');
        }
        
        dropZone.classList.remove('correct', 'incorrect', 'misplaced');
    } catch (error) {
        console.error('Error handling drop:', error);
    }
}

/**
 * Handle drag over team list (for removal)
 */
export function handleTeamListDragOver(event) {
    event.preventDefault();
    const teamList = document.getElementById('teamList');
    teamList.classList.add('drag-over-remove');
}

/**
 * Handle drag leave from team list
 */
export function handleTeamListDragLeave(event) {
    const teamList = document.getElementById('teamList');
    if (!teamList.contains(event.relatedTarget)) {
        teamList.classList.remove('drag-over-remove');
    }
}

/**
 * Handle drop on team list (remove team)
 */
export function handleTeamListDrop(event) {
    event.preventDefault();
    const teamList = document.getElementById('teamList');
    teamList.classList.remove('drag-over-remove');
    
    try {
        const dragData = JSON.parse(event.dataTransfer.getData('application/json'));
        
        if (dragData.isPlacedTeam && window.draggedPlacedTeam) {
            const draggedTeam = window.draggedPlacedTeam;
            const originalDropZone = draggedTeam.closest('.drop-zone');
            
            draggedTeam.remove();
            
            if (originalDropZone) {
                // Clear validation classes when team is removed
                originalDropZone.classList.remove('correct', 'incorrect', 'misplaced');
                
                if (originalDropZone.classList.contains('hard-mode-zone')) {
                    if (originalDropZone.querySelectorAll('.placed-team').length === 0) {
                        originalDropZone.classList.remove('filled');
                    }
                } else {
                    originalDropZone.classList.remove('filled');
                }
            }
            
            window.draggedPlacedTeam = null;
        }
    } catch (error) {
        console.error('Error handling team list drop:', error);
    }
}

// ==================== TOUCH EVENT HANDLERS ====================

/**
 * Handle touch start on team items
 */
export function handleTouchStart(event) {
    const teamItem = event.target.closest('.team-item');
    if (!teamItem) return;
    
    const touch = event.touches[0];
    setTouchStartPosition(touch.clientX, touch.clientY);
    setTouchStartElement(teamItem);
    
    const teamLogo = teamItem.querySelector('img');
    if (!teamLogo) return;
    
    setTouchDragData({
        name: teamLogo.alt,
        logo: teamLogo.src,
        isPlacedTeam: false
    });
    
    const timer = setTimeout(() => {
        teamItem.classList.add('touch-dragging');
        createTouchGhost(teamLogo.src, { clientX: touchStartX, clientY: touchStartY });
        setIsDragging(true);
        vibrate();
    }, LONG_PRESS_DURATION);
    
    setTouchLongPressTimer(timer);
}

/**
 * Handle touch start on placed teams
 */
export function handlePlacedTeamTouchStart(event) {
    const placedTeam = event.target.closest('.placed-team');
    if (!placedTeam) return;
    
    event.preventDefault();
    
    const teamLogo = placedTeam.querySelector('img');
    setTouchDragData({
        name: placedTeam.dataset.teamName,
        logo: teamLogo.src,
        isPlacedTeam: true
    });
    setTouchStartElement(placedTeam);
    
    placedTeam.style.opacity = '0.3';
    
    createTouchGhost(teamLogo.src, event.touches[0]);
    
    setIsDragging(true);
}

/**
 * Create ghost element for touch dragging
 */
function createTouchGhost(logoSrc, touch) {
    const ghost = document.createElement('div');
    ghost.className = 'touch-ghost';
    
    const img = document.createElement('img');
    img.src = logoSrc;
    img.className = 'team-logo';
    
    ghost.appendChild(img);
    document.body.appendChild(ghost);
    
    setTouchGhostElement(ghost);
    updateTouchGhostPosition(touch);
}

/**
 * Update position of touch ghost element
 */
function updateTouchGhostPosition(touch) {
    if (!touchGhostElement) return;
    
    touchGhostElement.style.left = (touch.clientX - 25) + 'px';
    touchGhostElement.style.top = (touch.clientY - 25) + 'px';
}

/**
 * Handle touch move
 */
export function handleTouchMove(event) {
    const touch = event.touches[0];
    
    // Check if we should cancel the long press (user is scrolling)
    if (touchLongPressTimer && !isDragging) {
        const deltaX = Math.abs(touch.clientX - touchStartX);
        const deltaY = Math.abs(touch.clientY - touchStartY);
        
        if (deltaX > TOUCH_MOVE_THRESHOLD || deltaY > TOUCH_MOVE_THRESHOLD) {
            clearTimeout(touchLongPressTimer);
            setTouchLongPressTimer(null);
            setTouchDragData(null);
            setTouchStartElement(null);
            return;
        }
    }
    
    if (!isDragging || !touchGhostElement) return;
    
    event.preventDefault();
    
    updateTouchGhostPosition(touch);
    highlightDropZoneUnderTouch(touch);
    
    // Auto-scroll when near edges
    const scrollThreshold = 100;
    if (touch.clientY < scrollThreshold) {
        window.scrollBy(0, -10);
    } else if (touch.clientY > window.innerHeight - scrollThreshold) {
        window.scrollBy(0, 10);
    }
}

/**
 * Highlight drop zone under touch point
 */
function highlightDropZoneUnderTouch(touch) {
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
    });
    document.getElementById('teamList').classList.remove('drag-over-remove');
    
    const elementsUnderTouch = document.elementsFromPoint(touch.clientX, touch.clientY);
    
    for (const elem of elementsUnderTouch) {
        const dropZone = elem.closest('.drop-zone');
        if (dropZone) {
            dropZone.classList.add('drag-over');
            return;
        }
        
        const teamList = elem.closest('.team-list');
        if (teamList && touchDragData && touchDragData.isPlacedTeam) {
            teamList.classList.add('drag-over-remove');
            return;
        }
    }
}

/**
 * Handle touch end
 */
export function handleTouchEnd(event) {
    if (touchLongPressTimer) {
        clearTimeout(touchLongPressTimer);
        setTouchLongPressTimer(null);
    }
    
    if (!isDragging || !touchDragData || !touchGhostElement) {
        cleanupTouchDrag();
        return;
    }
    
    event.preventDefault();
    
    const touch = event.changedTouches[0];
    const elementsUnderTouch = document.elementsFromPoint(touch.clientX, touch.clientY);
    
    let handled = false;
    
    for (const elem of elementsUnderTouch) {
        const dropZone = elem.closest('.drop-zone');
        if (dropZone) {
            if (dropZone.classList.contains('hard-mode-zone')) {
                handleTouchDropHardMode(dropZone);
            } else {
                handleTouchDrop(dropZone);
            }
            handled = true;
            break;
        }
        
        const teamList = elem.closest('.team-list');
        if (teamList && touchDragData && touchDragData.isPlacedTeam) {
            handleTouchDropToTeamList();
            handled = true;
            break;
        }
    }
    
    cleanupTouchDrag();
}

/**
 * Handle touch drop in normal mode
 */
function handleTouchDrop(dropZone) {
    dropZone.classList.remove('drag-over');
    
    if (touchDragData.isPlacedTeam && touchStartElement) {
        const existingTeam = dropZone.querySelector('.placed-team');
        
        if (existingTeam) {
            // Swap teams
            const originalDropZone = touchStartElement.closest('.drop-zone');
            
            // Clear validation classes on both zones when swapping
            dropZone.classList.remove('correct', 'incorrect', 'misplaced');
            originalDropZone.classList.remove('correct', 'incorrect', 'misplaced');
            
            dropZone.appendChild(touchStartElement);
            touchStartElement.style.opacity = '1';
            originalDropZone.appendChild(existingTeam);
            dropZone.classList.add('filled');
            originalDropZone.classList.add('filled');
        } else {
            // Move to empty zone
            const originalDropZone = touchStartElement.closest('.drop-zone');
            
            // Clear validation classes on both zones
            dropZone.classList.remove('correct', 'incorrect', 'misplaced');
            if (originalDropZone) {
                originalDropZone.classList.remove('correct', 'incorrect', 'misplaced');
            }
            
            dropZone.appendChild(touchStartElement);
            touchStartElement.style.opacity = '1';
            dropZone.classList.add('filled');
            if (originalDropZone) {
                originalDropZone.classList.remove('filled');
            }
        }
    } else {
        // New team from team list
        const existingTeam = dropZone.querySelector('.placed-team');
        if (existingTeam) {
            existingTeam.remove();
        }
        
        // Clear validation classes when adding new team
        dropZone.classList.remove('correct', 'incorrect', 'misplaced');
        
        const teamDiv = document.createElement('div');
        teamDiv.className = 'placed-team';
        teamDiv.dataset.teamName = touchDragData.name;
        teamDiv.draggable = true;
        
        const teamLogo = document.createElement('img');
        teamLogo.src = touchDragData.logo;
        teamLogo.alt = touchDragData.name;
        teamLogo.className = 'team-logo';
        
        teamDiv.addEventListener('dragstart', handlePlacedTeamDragStart);
        teamDiv.addEventListener('dragend', handlePlacedTeamDragEnd);
        teamDiv.addEventListener('touchstart', handlePlacedTeamTouchStart, { passive: false });
        
        teamDiv.appendChild(teamLogo);
        dropZone.appendChild(teamDiv);
        dropZone.classList.add('filled');
    }
}

/**
 * Handle touch drop in hard mode
 */
function handleTouchDropHardMode(dropZone) {
    dropZone.classList.remove('drag-over');
    
    if (touchDragData.isPlacedTeam && touchStartElement) {
        const originalDropZone = touchStartElement.closest('.drop-zone');
        
        touchStartElement.classList.remove('correct-team', 'incorrect-team', 'misplaced-team');
        
        // Clear validation classes on both zones
        dropZone.classList.remove('correct', 'incorrect', 'misplaced');
        if (originalDropZone) {
            originalDropZone.classList.remove('correct', 'incorrect', 'misplaced');
        }
        
        dropZone.appendChild(touchStartElement);
        touchStartElement.style.opacity = '1';
        
        if (dropZone.querySelectorAll('.placed-team').length > 0) {
            dropZone.classList.add('filled');
        }
        if (originalDropZone && originalDropZone.querySelectorAll('.placed-team').length === 0) {
            originalDropZone.classList.remove('filled');
        }
    } else {
        // New team from team list
        const teamDiv = document.createElement('div');
        teamDiv.className = 'placed-team';
        teamDiv.dataset.teamName = touchDragData.name;
        teamDiv.draggable = true;
        
        const teamLogo = document.createElement('img');
        teamLogo.src = touchDragData.logo;
        teamLogo.alt = touchDragData.name;
        teamLogo.className = 'team-logo';
        
        teamDiv.addEventListener('dragstart', handlePlacedTeamDragStart);
        teamDiv.addEventListener('dragend', handlePlacedTeamDragEnd);
        teamDiv.addEventListener('touchstart', handlePlacedTeamTouchStart, { passive: false });
        
        teamDiv.appendChild(teamLogo);
        dropZone.appendChild(teamDiv);
        dropZone.classList.add('filled');
    }
    
    dropZone.classList.remove('correct', 'incorrect', 'misplaced');
}

/**
 * Handle touch drop to team list (remove team)
 */
function handleTouchDropToTeamList() {
    document.getElementById('teamList').classList.remove('drag-over-remove');
    
    if (touchStartElement && touchDragData.isPlacedTeam) {
        const originalDropZone = touchStartElement.closest('.drop-zone');
        touchStartElement.remove();
        
        if (originalDropZone) {
            // Clear validation classes when team is removed
            originalDropZone.classList.remove('correct', 'incorrect', 'misplaced');
            
            if (originalDropZone.classList.contains('hard-mode-zone')) {
                if (originalDropZone.querySelectorAll('.placed-team').length === 0) {
                    originalDropZone.classList.remove('filled');
                }
            } else {
                originalDropZone.classList.remove('filled');
            }
        }
    }
}

/**
 * Handle touch cancel
 */
export function handleTouchCancel(event) {
    cleanupTouchDrag();
}

/**
 * Clean up touch drag state
 */
function cleanupTouchDrag() {
    if (touchLongPressTimer) {
        clearTimeout(touchLongPressTimer);
        setTouchLongPressTimer(null);
    }
    
    setIsDragging(false);
    
    if (touchStartElement) {
        touchStartElement.style.opacity = '1';
        touchStartElement.classList.remove('touch-dragging');
    }
    
    setTouchDragData(null);
    
    document.querySelectorAll('.team-item.touch-dragging').forEach(item => {
        item.classList.remove('touch-dragging');
    });
    
    document.querySelectorAll('.placed-team').forEach(team => {
        team.style.opacity = '1';
    });
    
    setTouchStartElement(null);
    
    if (touchGhostElement) {
        touchGhostElement.remove();
        setTouchGhostElement(null);
    }
    
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
    });
    
    const teamList = document.getElementById('teamList');
    if (teamList) {
        teamList.classList.remove('drag-over-remove');
    }
}

/**
 * Setup auto-scroll handling during drag
 */
export function setupScrollHandling() {
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!isDragging) return;

        const mouseY = e.clientY;
        const windowHeight = window.innerHeight;
        const scrollSpeed = 15;
        const scrollThreshold = 150;

        clearInterval(autoScrollInterval);

        if (mouseY < scrollThreshold) {
            const interval = setInterval(() => {
                window.scrollBy(0, -scrollSpeed);
            }, 20);
            setAutoScrollInterval(interval);
            document.querySelector('.scroll-indicator.top')?.classList.add('visible');
        } else if (mouseY > windowHeight - scrollThreshold) {
            const interval = setInterval(() => {
                window.scrollBy(0, scrollSpeed);
            }, 20);
            setAutoScrollInterval(interval);
            document.querySelector('.scroll-indicator.bottom')?.classList.add('visible');
        } else {
            document.querySelectorAll('.scroll-indicator').forEach(indicator => {
                indicator.classList.remove('visible');
            });
        }
    });
}
