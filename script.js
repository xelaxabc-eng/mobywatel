let rawPhotoDataBlob = "";
let activePinBuffer = "";
let clockRenderTimerId = null;

// Bezpieczne wczytywanie zdjęcia użytkownika z dysku/telefonu
const fileLoaderNode = document.getElementById('f-img-load');
if (fileLoaderNode) {
    fileLoaderNode.addEventListener('change', function(e) {
        const file = e.target.files;
        if (file && file[0]) { 
            rawPhotoDataBlob = URL.createObjectURL(file[0]); 
        }
    });
}

// Funkcja odpowiedzialna za przełączanie widoków (Nawigacja SPA)
function navHudTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    
    const nodes = document.querySelectorAll('.mo-hud-tab-node');
    nodes.forEach(n => n.classList.remove('active'));
    if (screenId === 'scr-pulpit') {
        const nodePulpit = document.getElementById('node-pulpit');
        if (nodePulpit) nodePulpit.classList.add('active');
    }
}

// Obsługa klawiatury PIN - Akceptuje dowolne 4 cyfry
function pressPinButton(digit) {
    if (activePinBuffer.length < 4) {
        activePinBuffer += digit;
        const currentDot = document.getElementById(`ad-${activePinBuffer.length}`);
        if (currentDot) currentDot.classList.add('active');
    }
    if (activePinBuffer.length === 4) {
        setTimeout(() => {
            const globalBar = document.getElementById('mo-global-hud-bar');
            if (globalBar) globalBar.style.display = 'flex';
            navHudTo('scr-pulpit');
            activateClockEngines();
        }, 180);
    }
}

// Obsługa tykania czasu, animacji paska i losowania 6 cyfr pod QR
function activateClockEngines() {
    if (clockRenderTimerId) clearInterval(clockRenderTimerId);
    const clockDisplays = document.querySelectorAll('.internal-timer-lbl');
    const pBar = document.getElementById('mo-hud-progressbar');

    function runTick() {
        const time = new Date();
        const hrs = String(time.getHours()).padStart(2, '0');
        const mins = String(time.getMinutes()).padStart(2, '0');
        const secs = String(time.getSeconds()).padStart(2, '0');
        
        const iosClock = document.getElementById('ios-clock-render');
        if (iosClock) iosClock.innerText = `${hrs}:${mins}`;
        
        clockDisplays.forEach(el => el.innerText = `${hrs}:${mins}:${secs}`);

        if (time.getSeconds() % 4 === 0 && pBar) {
            pBar.style.animation = 'none';
            pBar.offsetHeight; 
            pBar.style.animation = 'moTProgress 4s linear infinite';
            
            const randCode = Math.floor(100000 + Math.random() * 900000);
            const strCode = String(randCode);
            const qrTextNode = document.getElementById('qr-numerical-code');
            if (qrTextNode) {
                qrTextNode.innerText = `${strCode.substring(0,3)} ${strCode.substring(3,6)}`;
            }
        }
    }
    runTick();
    clockRenderTimerId = setInterval(runTick, 1000);
}
