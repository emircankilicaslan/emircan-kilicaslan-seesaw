const plank = document.getElementById('plank');
const leftTotalEl = document.getElementById('left-total');
const rightTotalEl = document.getElementById('right-total');

let isPaused = false;
let objects = []; 

window.addEventListener('load', () => {
    const savedData = localStorage.getItem('seesawData');
    if (savedData) {
        objects = JSON.parse(savedData);
        objects.forEach(obj => createVisualElement(obj));
        calculateBalance();
    }
});

plank.addEventListener('click', function(event) {
    if (isPaused) return;
    
    const rect = plank.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const plankWidth = rect.width;
    const center = plankWidth / 2;
    let distanceFromCenter = clickX - center; 
    
    const randomWeight = Math.floor(Math.random() * 10) + 1;

    const newObject = {
        id: Date.now(), 
        weight: randomWeight,
        position: distanceFromCenter, 
        cssLeft: clickX 
    };

    objects.push(newObject);
    saveToStorage();
    createVisualElement(newObject);
    calculateBalance();
});

function createVisualElement(obj) {
    const box = document.createElement('div');
    box.className = 'object-box';
    box.innerText = obj.weight;
    
    box.style.left = obj.cssLeft + 'px';
    
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    box.style.backgroundColor = randomColor;

    plank.appendChild(box);
}

function calculateBalance() {
    let leftTorque = 0;
    let rightTorque = 0;
    let leftWeight = 0;
    let rightWeight = 0;

    objects.forEach(obj => {
        if (obj.position < 0) {
            leftTorque += obj.weight * Math.abs(obj.position);
            leftWeight += obj.weight;
        } else {
            rightTorque += obj.weight * obj.position;
            rightWeight += obj.weight;
        }
    });

    leftTotalEl.innerText = leftWeight;
    rightTotalEl.innerText = rightWeight;

    const torqueDiff = rightTorque - leftTorque;
    let angle = torqueDiff / 100;

    if (angle > 30) angle = 30;
    if (angle < -30) angle = -30;

    plank.style.transform = `rotate(${angle}deg)`;
}

function saveToStorage() {
    localStorage.setItem('seesawData', JSON.stringify(objects));
}


function resetSimulation() {
    objects = [];
    

    const boxes = document.querySelectorAll('.object-box');
    boxes.forEach(box => box.remove());
    
    localStorage.removeItem('seesawData'); 
    plank.style.transform = 'rotate(0deg)'; 
    leftTotalEl.innerText = '0';
    rightTotalEl.innerText = '0';
}
// -----------------------------------

function togglePause() {
    isPaused = !isPaused; 
    
    const btn = document.getElementById('pause-btn');
    const container = document.querySelector('.simulation-container');

    if (isPaused) {
        btn.innerText = "Resume";
        btn.style.borderColor = "#2ecc71"; 
        btn.style.color = "#2ecc71";
        container.classList.add('paused-mode'); 
    } else {
        btn.innerText = "Pause";
        btn.style.borderColor = "#f1c40f"; 
        btn.style.color = "#f1c40f";
        container.classList.remove('paused-mode');
    }
}