const ship = document.querySelector('.ship');
const rectangle = document.querySelector('.rectangle');
const trashImages = {
    plastic: ['plastic.png', 'plastic2.png','plastic3.png','plastic4.png', 'plastic5.png', 'plastic6.png'],
    can: ['can.png', 'can2.png', 'can3.png', 'can4.png', 'can5.png', 'can6.png', 'can7.png']
};

const plasticValue = 1.2;
const canValue = 2.0;

let plasticCount = 0;
let canCount = 0;
let totalMoneyEarned = 0;

let isPaused = false;

const rectLeft = rectangle.getBoundingClientRect().left;
const rectWidth = rectangle.offsetWidth;
const shipWidth = ship.offsetWidth;
const maxLeft = rectWidth - shipWidth;

function updateShipPosition(newLeft) {
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    ship.style.left = newLeft + 'px';
}

rectangle.addEventListener('mousemove', (event) => {
    if (!isPaused) {
        const mouseX = event.clientX;
        const newLeft = mouseX - rectLeft - shipWidth / 2;
        updateShipPosition(newLeft);
    }
});

function updateTotalMoneyCounter() {
    const counterElement = document.querySelector('.total-money-counter');
    counterElement.textContent = 'Total Money Raised: $' + totalMoneyEarned.toFixed(2);
}

function createTrash(trashType) {
    const trashImagesForType = trashImages[trashType];
    if (!trashImagesForType) return;

    const trashImage = trashImagesForType[Math.floor(Math.random() * trashImagesForType.length)];

    const trash = document.createElement('img');
    trash.src = trashImage;
    trash.className = 'trash';

    // Calculate the maximum left position to prevent trash from spawning outside the rectangle
    const maxTrashLeft = rectWidth - 50;

    // Calculate a random left position within the valid range
    const randomLeft = Math.random() * maxTrashLeft;

    trash.style.left = randomLeft + '10px';
    trash.style.top = '40px';
    document.body.appendChild(trash);

    const fallSpeed = Math.random() * 3 + 1;
    const interval = setInterval(() => {
        if (!isPaused) {
            const topPos = parseFloat(trash.style.top) || 0;
            trash.style.top = topPos + fallSpeed + 'px';

            const shipRect = ship.getBoundingClientRect();
            const trashRect = trash.getBoundingClientRect();

            if (
                trashRect.bottom >= shipRect.top &&
                trashRect.top <= shipRect.bottom &&
                trashRect.right >= shipRect.left &&
                trashRect.left <= shipRect.right
            ) {
                clearInterval(interval);
                document.body.removeChild(trash);

                if (trashType === 'plastic') {
                    totalMoneyEarned += plasticValue;
                    plasticCount++;
                } else if (trashType === 'can') {
                    totalMoneyEarned += canValue;
                    canCount++;
                }

                updatePlasticCounter();
                updateCanCounter();
                updateTotalTrashCounter();
                updateTotalMoneyCounter();
            }

            if (topPos > window.innerHeight) {
                clearInterval(interval);
                document.body.removeChild(trash);
            }
        }
    }, 30);
}

function spawnTrash() {
    const randomInterval = Math.random() * 2000; // Random interval between 1 to 4 seconds
    setTimeout(() => {
        if (!isPaused) {
            const trashType = Math.random() < 0.5 ? 'plastic' : 'can';
            createTrash(trashType);
        }
        spawnTrash();
    }, randomInterval);
}

spawnTrash();

function updatePlasticCounter() {
    const counterElement = document.querySelector('.plastic-counter');
    counterElement.textContent = 'Plastic Trash Collected: ' + plasticCount;
}

function updateCanCounter() {
    const counterElement = document.querySelector('.can-counter');
    counterElement.textContent = 'Cans Collected: ' + canCount;
}

function updateTotalTrashCounter() {
    const counterElement = document.querySelector('.total-trash-counter');
    counterElement.textContent = 'Total Trash Collected: ' + (plasticCount + canCount);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'p') {
        togglePause();
    }
});

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        ship.style.transition = 'none';
    } else {
        ship.style.transition = '';
    }
}

updateTotalMoneyCounter();
