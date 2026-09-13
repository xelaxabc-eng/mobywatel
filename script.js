let rawPhotoDataBlob = "";
let activePinBuffer = "";
let clockRenderTimerId = null;

// Obsługa wgrywania zdjęcia
document.getElementById('f-img-load').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) { rawPhotoDataBlob = URL.createObjectURL(file); }
});

// Zapis i mapowanie konfiguratora na ekrany aplikacji
document.getElementById('f-action-save').addEventListener('click', function() {
    const name = document.getElementById('f-name').value;
    const surname = document.getElementById('f-surname').value;
    const date = document.getElementById('f-date').value;
    const pesel = document.getElementById('f-pesel').value;
    const doc = document.getElementById('f-doc').value;

    document.getElementById('hud-pulpit-title-name').innerText = name;
    document.getElementById('hud-pulpit-card-fullname').innerText = `${surname.toUpperCase()} ${name.toUpperCase()}`;
    document.getElementById('hud-pulpit-card-pesel').innerText = `PESEL: ${pesel}`;
    
    document.getElementById('md-name').innerText = name.toUpperCase();
    document.getElementById('md-surname').innerText = surname.toUpperCase();
    document.getElementById('md-date').innerText = date;
    document.getElementById('md-pesel').innerText = pesel;
    document.getElementById('md-doc').innerText = doc.toUpperCase();

    document.querySelectorAll('.tgt-user-photo').forEach(img => {
        img.src = rawPhotoDataBlob ? rawPhotoDataBlob : "https://placeholder.com";
    });

    const qrBox = document.getElementById('qr-canvas-holder');
    qrBox.innerHTML = "";
    new QRCode(qrBox, {
        text: `mObywatel2.0|${surname.toUpperCase()}|${name.toUpperCase()}|${pesel}`,
        width: 140,
        height: 140,
        colorDark: "#1f4294",
        colorLight: "#ffffff"
    });

    navHudTo('scr-auth');
});

// Klawiatura PIN - Każde 4 cyfry logują pomyślnie
function pressPinButton(digit) {
    if (activePinBuffer.length < 4) {
        activePinBuffer += digit;
        document.getElementById(`ad-${activePinBuffer.length}`).classList.add('active');
    }
    if (activePinBuffer.length === 4) {
        setTimeout(() => {
            document.getElementById('mo-global-hud-bar').style.display = 'flex';
            navHudTo('scr-pulpit');
            activateClockEngines();
        }, 180);
    }
}

function navHudTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    const nodes = document.querySelectorAll('.mo-hud-tab-node');
    nodes.forEach(n => n.classList.remove('active'));
    if (screenId === 'scr-pulpit') document.getElementById('node-pulpit').classList.add('active');
}

// Liczniki czasu rzeczywistego i odświeżanie kodu numerycznego
function activateClockEngines() {
    if (clockRenderTimerId) clearInterval(clockRenderTimerId);
    const clockDisplays = document.querySelectorAll('.internal-timer-lbl');
    const pBar = document.getElementById('mo-hud-progressbar');

    function runTick() {
        const time = new Date();
        const hrs = String(time.getHours()).padStart(2, '0');
        const mins = String(time.getMinutes()).padStart(2, '0');
        const secs = String(time.getSeconds()).padStart(2, '0');
        
        document.getElementById('ios-clock-render').innerText = `${hrs}:${mins}`;
        clockDisplays.forEach(el => el.innerText = `${hrs}:${mins}:${secs}`);

        if (time.getSeconds() % 4 === 0) {
            pBar.style.animation = 'none';
            pBar.offsetHeight; 
            pBar.style.animation = 'moTProgress 4s linear infinite';
            
            const randCode = Math.floor(100000 + Math.random() * 900000);
            const strCode = String(randCode);
            document.getElementById('qr-numerical-code').innerText = `${strCode.substring(0,3)} ${strCode.substring(3,6)}`;
        }
    }
    runTick();
    clockRenderTimerId = setInterval(runTick, 1000);
}