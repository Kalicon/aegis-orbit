// Aegis-Orbit (GeoPulse AI) - Main Application Logic

// Global State
let currentSection = 'dashboard';
let currentMapMode = 'sar';
let activeSector = 'rio';
let currentSlide = 1;
const totalSlides = 7;
let activePurposeStep = 1;

// NASA API Key (loaded from localStorage or default DEMO_KEY)
let activeNasaApiKey = localStorage.getItem('nasa_api_key') || 'DEMO_KEY';

// SpaceX Countdown Timer
let spacexCountdownInterval = null;
let spacexLaunchDate = null;

// NEW HIGH-TECH UPGRADES STATE
let isTargetLocked = false;
let lockedCoords = { lat: 0, lon: 0, x: 0, y: 0 };
let currentKpIndex = 2;
let solarWindBase = 412;
let protonFluxBase = 1.2;
let isSolarStormActive = false;

// Voice recognition & ISS live tracker globals
let isIssTrackingActive = false;
let issLat = -23.5505;
let issLon = -46.6333;
let isOverBrazilLogTriggered = false;
let voiceRecognition = null;
let isVoiceUplinkActive = false;

// SETI globals
let setiFreq = 1000;
let setiWaterfallCanvas = null;
let setiWaterfallCtx = null;
let isSetiSignalLocked = false;
let isSetiSignalDecoded = false;
let setiAnimFrameId = null;

// ADB terminal globals
let adbHistory = [];
let adbHistoryIndex = -1;

// Bezier Curve points for satellite animation (Q-Curve: M 100,350 Q 300,100 700,50)
const P0 = { x: 100, y: 350 };
const P1 = { x: 300, y: 100 };
const P2 = { x: 700, y: 50 };
let satT = 0.0;
let satDirection = 1; 

// Mock Telemetry Database (Scientific Specs per Sector)
const sectorData = {
    rio: {
        name: "Setor Rio-A (Região Metropolitana)",
        activeSat: {
            sar: "SENTINEL-1A (SAR)",
            thermal: "LANDSAT-9 (TIRS)",
            optical: "SENTINEL-2B (MSI)",
            skywatch: "ORION-SETI (RADIO)"
        },
        sar: {
            lbl1: "12.4% (Critical Saturation)",
            lbl2: "+4.18 °C (Thermal Anomaly)",
            lbl3: "142.6 mm (24h Accumulated)",
            lbl4: "94.2% Landslide Hazard",
            bars: { b1: 35, b2: 94, b3: 72 }
        },
        thermal: {
            lbl1: "38.2 °C Surface Temp",
            lbl2: "12 High-Heat Targets",
            lbl3: "220 W/m² Radiance",
            lbl4: "85% Forest Fire Risk",
            bars: { b1: 45, b2: 60, b3: 90 }
        },
        optical: {
            lbl1: "0.22 NDVI (Degraded Canopy)",
            lbl2: "18.2% Forest Cover",
            lbl3: "4.1 t/ha CO2 Absorption",
            lbl4: "Critical Deforestation",
            bars: { b1: 20, b2: 40, b3: 25 }
        },
        skywatch: {
            lbl1: "14.2 keV (Ionic Flux)",
            lbl2: "1.420 GHz (HI Waveband)",
            lbl3: "120 particles/cm³",
            lbl4: "Classified as UAP-1",
            bars: { b1: 80, b2: 95, b3: 60 }
        }
    },
    amazon: {
        name: "Setor Norte-B (AM-Zone Forest)",
        activeSat: {
            sar: "SENTINEL-1B (SAR)",
            thermal: "LANDSAT-9 (TIRS)",
            optical: "SENTINEL-2A (MSI)",
            skywatch: "ORION-SETI (RADIO)"
        },
        sar: {
            lbl1: "48.2% (Normal Hydration)",
            lbl2: "+0.15 °C (Stable Thermal)",
            lbl3: "4.1 mm (24h Accumulated)",
            lbl4: "1.2% Landslide Hazard",
            bars: { b1: 85, b2: 12, b3: 15 }
        },
        thermal: {
            lbl1: "44.9 °C Surface Temp",
            lbl2: "82 High-Heat Targets",
            lbl3: "540 W/m² Radiance",
            lbl4: "98% Combustion Ignition",
            bars: { b1: 95, b2: 10, b3: 98 }
        },
        optical: {
            lbl1: "0.88 NDVI (Dense Canopy)",
            lbl2: "92.4% Forest Cover",
            lbl3: "82.4 t/ha CO2 Absorption",
            lbl4: "Carbon Sink Verified",
            bars: { b1: 94, b2: 88, b3: 95 }
        },
        skywatch: {
            lbl1: "2.1 keV (Ionic Flux)",
            lbl2: "No Cosmic Signal",
            lbl3: "12 particles/cm³",
            lbl4: "0 Anomalies Registered",
            bars: { b1: 15, b2: 5, b3: 10 }
        }
    }
};

// Console Log Queue (NASA/JPL Level with UAP/SETI additions)
const consoleTemplates = [
    "[INFO] Telemetry packet downlink verified from SENTINEL-1A (SAR Banda-C).",
    "[AI-CORE] Running differential interferometry analysis. No land displacements in Sector South.",
    "[GEOPRECIP] High precipitation anomaly detected at Sector Rio-A slope coordinates.",
    "[SYS-LINK] Android Satellite API Handshake: Low Earth Orbit (LEO) NTN network connection active.",
    "[AI-CORE] Multispectral vegetation index (NDVI) mapping complete for Brazilian Southeast.",
    "[ORBIT] Scheduled thruster adjustment complete. Altitude corrected. Orbit stable.",
    "[INFO] TIRS (Thermal Infrared Sensor) telemetry ingested from LANDSAT-9. Scanning forest canopy.",
    "[SKYWATCH] Scanning electromagnetic radio spectrum. SETI DSN receivers tuning to 1.42 GHz.",
    "[SKYWATCH] Deep space signal pulse locked at RA 14h 29m / Dec -62° (Proxima Centauri sector)."
];

// Document Ready
document.addEventListener('DOMContentLoaded', () => {
    initClocks();
    animateSatelliteAndHUD();
    startConsoleSimulation();
    startDataFluctuation();
    
    // Set initial values
    updatePresentationData();
    selectHotspot('rio');
    showPurposeStep(1);

    // Initializing new features
    initMapClickCapture();
    initSpaceWeather();
    initSetiWaterfall();
    initAdbTerminal();
    initPhoneStars();
    
    // Auto-initialize API diagnostics + Observatory on load
    initObservatory();
    
    // Auto-initialize full weather hub on load
    fetchAllWeather();
    
    // Restore saved API keys to input placeholders
    const savedNasaKey = localStorage.getItem('nasa_api_key');
    if (savedNasaKey) {
        const keyInput = document.getElementById('input-nasa-key');
        if (keyInput) keyInput.placeholder = 'Chave salva ✓';
    }
    const savedOWMKey = localStorage.getItem('owm_api_key');
    if (savedOWMKey) {
        const keyInput = document.getElementById('input-owm-key');
        if (keyInput) keyInput.placeholder = 'Chave salva ✓';
    }
    const savedWAPIKey = localStorage.getItem('wapi_api_key');
    if (savedWAPIKey) {
        const keyInput = document.getElementById('input-wapi-key');
        if (keyInput) keyInput.placeholder = 'Chave salva ✓';
    }
});

// Section Switcher
function switchSection(sectionId) {
    document.getElementById('section-dashboard').classList.add('hidden');
    document.getElementById('section-purpose').classList.add('hidden');
    document.getElementById('section-simulator').classList.add('hidden');
    document.getElementById('section-presentation').classList.add('hidden');
    document.getElementById('section-sdg').classList.add('hidden');
    document.getElementById('section-observatory').classList.add('hidden');
    const escapeSection = document.getElementById('section-escape');
    if (escapeSection) { escapeSection.classList.add('hidden'); escapeSection.style.display = ''; }
    
    document.getElementById('nav-dashboard').classList.remove('active');
    document.getElementById('nav-purpose').classList.remove('active');
    document.getElementById('nav-simulator').classList.remove('active');
    document.getElementById('nav-presentation').classList.remove('active');
    document.getElementById('nav-sdg').classList.remove('active');
    document.getElementById('nav-observatory').classList.remove('active');
    const navEscape = document.getElementById('nav-escape');
    if (navEscape) navEscape.classList.remove('active');
    
    document.getElementById(`section-${sectionId}`).classList.remove('hidden');
    document.getElementById(`nav-${sectionId}`).classList.add('active');
    
    const titleText = document.getElementById('page-title-text');
    const subtitleText = document.getElementById('page-subtitle-text');
    
    if (sectionId === 'dashboard') {
        titleText.innerText = "Painel de Operações Orbitais";
        subtitleText.innerText = "Monitoramento Climático por Satélite e Prevenção de Desastres Terrestres";
    } else if (sectionId === 'purpose') {
        titleText.innerText = "Missão Aegis-Orbit";
        subtitleText.innerText = "Conceito e Propósito Especial de Resiliência Urbana e Inclusão Social Verde";
    } else if (sectionId === 'simulator') {
        titleText.innerText = "Simulador do Aplicativo Android";
        subtitleText.innerText = "Interface Nativa Kotlin/Compose com Integração Satelital & Módulo SkyWatch";
    } else if (sectionId === 'presentation') {
        titleText.innerText = "Apresentação Global Solution";
        subtitleText.innerText = "Documentação acadêmica estruturada e pitch do projeto";
    } else if (sectionId === 'sdg') {
        titleText.innerText = "Alinhamento com os ODS da ONU";
        subtitleText.innerText = "Como a economia espacial e o Aegis-Orbit impactam o desenvolvimento sustentável";
    } else if (sectionId === 'observatory') {
        titleText.innerText = "Observatório Espacial";
        subtitleText.innerText = "Dados em Tempo Real da NASA • Asteroides Próximos • Rastreamento ISS • Anomalias";
        initObservatory();
    } else if (sectionId === 'escape') {
        titleText.innerText = "Sistema de Rotas de Fuga";
        subtitleText.innerText = "Mapa Interativo Real • Abrigos de Emergência SP • Geolocalização • Roteamento OSRM";
        // Needs explicit display:flex since CSS .hidden uses display:none !important
        const escSec = document.getElementById('section-escape');
        if (escSec) escSec.style.display = 'flex';
        initEscapeRoutes();
    }
    
    currentSection = sectionId;
}

// Update telemetry box texts according to the active satellite filter mode
function updateTelemetryLabelsAndValues() {
    if (isTargetLocked) {
        updateDynamicTelemetry(lockedCoords.lat, lockedCoords.lon);
        return;
    }
    const data = sectorData[activeSector][currentMapMode];
    const satName = sectorData[activeSector].activeSat[currentMapMode];
    
    document.getElementById('val-sat-active').innerText = `14 / ${satName}`;
    
    // Label References
    const lbl1 = document.getElementById('telemetry-label-1');
    const lbl2 = document.getElementById('telemetry-label-2');
    const lbl3 = document.getElementById('telemetry-label-3');
    const lbl4 = document.getElementById('telemetry-label-4');
    
    const val1 = document.getElementById('lbl-moisture');
    const val2 = document.getElementById('lbl-temp');
    const val3 = document.getElementById('lbl-rain');
    const val4 = document.getElementById('lbl-risk');
    
    // Bar Label References
    const bar1 = document.getElementById('bar-lbl-1');
    const bar2 = document.getElementById('bar-lbl-2');
    const bar3 = document.getElementById('bar-lbl-3');
    
    // Values assignment
    val1.innerText = data.lbl1;
    val2.innerText = data.lbl2;
    val3.innerText = data.lbl3;
    val4.innerText = data.lbl4;
    
    // Colors of indicator values
    if (currentMapMode === 'sar') {
        lbl1.innerText = "UMIDADE DE ENCOSTA (SAR)";
        lbl2.innerText = "ANOMALIA TÉRMICA (TIRS)";
        lbl3.innerText = "ÍNDICE DE PRECIPITAÇÃO";
        lbl4.innerText = "PROBABILIDADE DE DESASTRE";
        
        val1.style.color = activeSector === 'rio' ? 'var(--color-red)' : 'var(--color-emerald)';
        val2.style.color = activeSector === 'rio' ? 'var(--color-orange)' : 'white';
        val4.style.color = activeSector === 'rio' ? 'var(--color-red)' : 'var(--color-emerald)';
        
        bar1.innerText = "OPTICAL";
        bar2.innerText = "RADAR (SAR)";
        bar3.innerText = "THERMAL";
    } else if (currentMapMode === 'thermal') {
        lbl1.innerText = "TEMPERATURA DE SUPERFÍCIE";
        lbl2.innerText = "FOCOS TÉRMICOS ATIVOS";
        lbl3.innerText = "RADIANÇA ATOMOSFÉRICA";
        lbl4.innerText = "RISCO DE COMBUSTÃO";
        
        val1.style.color = activeSector === 'amazon' ? 'var(--color-red)' : 'var(--color-orange)';
        val2.style.color = activeSector === 'amazon' ? 'var(--color-red)' : 'var(--color-orange)';
        val4.style.color = activeSector === 'amazon' ? 'var(--color-red)' : 'var(--color-emerald)';
        
        bar1.innerText = "OPTICAL";
        bar2.innerText = "RADAR";
        bar3.innerText = "THERMAL";
    } else if (currentMapMode === 'optical') {
        lbl1.innerText = "ÍNDICE VEGETATIVO (NDVI)";
        lbl2.innerText = "COBERTURA DE CANOPIA";
        lbl3.innerText = "ABSORÇÃO ESTIMADA CO2";
        lbl4.innerText = "STATUS DE PRESERVAÇÃO";
        
        val1.style.color = activeSector === 'amazon' ? 'var(--color-emerald)' : 'var(--color-red)';
        val2.style.color = activeSector === 'amazon' ? 'var(--color-emerald)' : 'var(--color-orange)';
        val4.style.color = activeSector === 'amazon' ? 'var(--color-emerald)' : 'var(--color-red)';
        
        bar1.innerText = "NDVI INDEX";
        bar2.innerText = "CO2 ABSORP";
        bar3.innerText = "REF. AREA";
    } else if (currentMapMode === 'skywatch') {
        lbl1.innerText = "RADIAÇÃO IONOSFÉRICA";
        lbl2.innerText = "FREQUÊNCIA DE CADEIA SETI";
        lbl3.innerText = "DENSIDADE DE FLUXO DE PLASMA";
        lbl4.innerText = "AVALIAÇÃO DE ANOMALIA (UAP)";
        
        val1.style.color = activeSector === 'rio' ? 'var(--color-red)' : 'var(--color-emerald)';
        val2.style.color = activeSector === 'rio' ? 'var(--color-violet)' : 'var(--color-text-muted)';
        val4.style.color = activeSector === 'rio' ? 'var(--color-violet)' : 'var(--color-emerald)';
        
        bar1.innerText = "IONIC";
        bar2.innerText = "SETI WAVE";
        bar3.innerText = "PLASMA";
    }
    
    // Bar Heights
    document.getElementById('bar-optical').style.height = `${data.bars.b1}%`;
    document.getElementById('bar-radar').style.height = `${data.bars.b2}%`;
    document.getElementById('bar-thermal').style.height = `${data.bars.b3}%`;
}

// Satellite Map filter modes
function changeMapMode(mode) {
    document.getElementById('btn-map-sar').classList.remove('active');
    document.getElementById('btn-map-thermal').classList.remove('active');
    document.getElementById('btn-map-optical').classList.remove('active');
    document.getElementById('btn-map-skywatch').classList.remove('active');
    document.getElementById(`btn-map-${mode}`).classList.add('active');
    
    const mapContinent = document.getElementById('map-continents');
    const satNode = document.querySelector('#satellite-node circle');
    const scanCone = document.getElementById('scan-cone');
    const hudPass = document.getElementById('hud-pass');
    
    currentMapMode = mode;
    
    if (mode === 'sar') {
        mapContinent.style.fill = "rgba(6, 9, 19, 0.8)";
        mapContinent.style.stroke = "rgba(0, 229, 255, 0.25)";
        satNode.style.fill = "var(--color-cyan)";
        scanCone.style.fill = "rgba(0, 229, 255, 0.08)";
        hudPass.innerText = "PASS: SENTINEL-1A (SAR)";
        document.getElementById('sat-status').innerText = "LINK: ACTIVE (SENTINEL-1A)";
        addConsoleLog("[MODE] Filtro orbital alterado para Radar de Abertura Sintética (SAR) Banda-C - Varredura de Solo.");
    } else if (mode === 'thermal') {
        mapContinent.style.fill = "rgba(40, 10, 10, 0.5)";
        mapContinent.style.stroke = "rgba(255, 145, 0, 0.25)";
        satNode.style.fill = "var(--color-orange)";
        scanCone.style.fill = "rgba(255, 145, 0, 0.08)";
        hudPass.innerText = "PASS: LANDSAT-9 (TIRS)";
        document.getElementById('sat-status').innerText = "LINK: ACTIVE (LANDSAT-9)";
        addConsoleLog("[MODE] Filtro orbital alterado para Sensores Térmicos TIRS (Landsat) - Foco em Temperatura.");
    } else if (mode === 'optical') {
        mapContinent.style.fill = "rgba(10, 30, 15, 0.5)";
        mapContinent.style.stroke = "rgba(0, 255, 102, 0.25)";
        satNode.style.fill = "var(--color-emerald)";
        scanCone.style.fill = "rgba(0, 255, 102, 0.08)";
        hudPass.innerText = "PASS: SENTINEL-2B (MSI)";
        document.getElementById('sat-status').innerText = "LINK: ACTIVE (SENTINEL-2B)";
        addConsoleLog("[MODE] Filtro orbital alterado para Varredura Multiespectral Óptica - Foco em NDVI.");
    } else if (mode === 'skywatch') {
        mapContinent.style.fill = "rgba(25, 10, 40, 0.5)";
        mapContinent.style.stroke = "rgba(213, 0, 249, 0.25)";
        satNode.style.fill = "var(--color-violet)";
        scanCone.style.fill = "rgba(213, 0, 249, 0.08)";
        hudPass.innerText = "PASS: AEGIS-ORION (DSN)";
        document.getElementById('sat-status').innerText = "LINK: ACTIVE (AEGIS-ORION)";
        addConsoleLog("[MODE] Filtro orbital alterado para Aegis SkyWatch - Foco em Anomalias Atmosféricas (UAP) e Radio SETI.");
    }
    
    updateTelemetryLabelsAndValues();
}

// Global ViewBox Animation variable
let viewBoxAnimationId = null;

function animateSvgViewBox(targetX, targetY, targetW, targetH, durationMs = 800) {
    const svg = document.getElementById('ops-map');
    if (!svg) return;
    
    const viewBoxAttr = svg.getAttribute('viewBox');
    const startVal = viewBoxAttr ? viewBoxAttr.split(' ').map(Number) : [0, 0, 800, 400];
    const startX = startVal[0];
    const startY = startVal[1];
    const startW = startVal[2];
    const startH = startVal[3];
    
    const startTime = performance.now();
    
    if (viewBoxAnimationId) {
        cancelAnimationFrame(viewBoxAnimationId);
    }
    
    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        
        // Easing function (easeOutQuad)
        const ease = progress * (2 - progress);
        
        const curX = startX + (targetX - startX) * ease;
        const curY = startY + (targetY - startY) * ease;
        const curW = startW + (targetW - startW) * ease;
        const curH = startH + (targetH - startH) * ease;
        
        svg.setAttribute('viewBox', `${curX} ${curY} ${curW} ${curH}`);
        
        if (progress < 1) {
            viewBoxAnimationId = requestAnimationFrame(step);
        }
    }
    
    viewBoxAnimationId = requestAnimationFrame(step);
}

// Select map hotspot details
function selectHotspot(sectorId) {
    isTargetLocked = false;
    hideTargetCrosshair();
    activeSector = sectorId;
    updateTelemetryLabelsAndValues();
    
    const data = sectorData[sectorId];
    addConsoleLog(`[TELEMETRY] Hotspot selecionado: ${data.name}. Foco orbital estabelecido.`, true);
    
    // Update phone notification status
    const lockNotif = document.querySelector('.lockscreen-notification');
    const notifTitle = document.querySelector('.notification-title');
    const notifBody = document.querySelector('.notification-body');
    const phoneUapText = document.getElementById('phone-uap-status');
    
    if (sectorId === 'rio') {
        animateSvgViewBox(190, 140, 220, 120, 800);
        lockNotif.style.background = "rgba(255, 23, 68, 0.12)";
        lockNotif.style.borderColor = "rgba(255, 23, 68, 0.4)";
        notifTitle.innerText = "Alerta Vermelho: Inundação";
        notifTitle.style.color = "var(--color-red)";
        notifBody.innerText = "Risco de inundação/deslizamento iminente no Setor Rio-A. Rota de fuga offline calculada. Toque para evacuar.";
        if (phoneUapText) phoneUapText.innerText = "Anomalia eletromagnética detectada no Setor Rio-A. Assinatura: UAP-1 (Flutuante).";
    } else {
        animateSvgViewBox(140, 70, 220, 120, 800);
        lockNotif.style.background = "rgba(255, 145, 0, 0.12)";
        lockNotif.style.borderColor = "rgba(255, 145, 0, 0.4)";
        notifTitle.innerText = "Alerta Laranja: Foco Térmico";
        notifTitle.style.color = "var(--color-orange)";
        notifBody.innerText = "Foco de calor intenso no Setor Norte (Canopy Fire). Satlink ativo para coordenação local. Toque.";
        if (phoneUapText) phoneUapText.innerText = "Assinaturas estáveis na ionosfera sobre Setor Norte. 0 Anomalias registradas.";
    }
}

let alignmentInProgress = false;

function triggerAntennaAlignment() {
    if (alignmentInProgress) return;
    alignmentInProgress = true;
    
    const target = document.getElementById('align-target-node');
    const badge = document.getElementById('phone-tracker-badge');
    const title = document.getElementById('phone-tracker-title');
    const status = document.getElementById('phone-tracker-status');
    const btn = document.getElementById('btn-align-ant');
    
    btn.disabled = true;
    btn.innerText = "Alinhando Girus...";
    status.innerText = "Status: Calibrando giroscópio local...";
    
    let stepCount = 0;
    const interval = setInterval(() => {
        stepCount++;
        if (stepCount === 1) {
            status.innerText = "Status: Buscando sinal Aegis-LEO...";
            target.style.top = '40px';
            target.style.left = '50px';
        } else if (stepCount === 2) {
            status.innerText = "Status: Calibrando antena helicoidal...";
            target.style.top = '80px';
            target.style.left = '75px';
        } else if (stepCount === 3) {
            status.innerText = "Status: Handshake satelital pendente...";
            target.style.top = '68px';
            target.style.left = '62px';
        } else if (stepCount === 4) {
            clearInterval(interval);
            target.classList.add('locked');
            badge.style.background = 'rgba(0, 255, 102, 0.1)';
            badge.style.borderColor = 'rgba(0, 255, 102, 0.3)';
            badge.style.color = 'var(--color-emerald)';
            badge.innerHTML = '<i class="fa-solid fa-satellite"></i> LINK ATIVO';
            
            title.style.color = 'var(--color-emerald)';
            status.innerText = "Sinal: Conectado (AEGIS-4). Link orbital estável.";
            
            phoneToast("Alinhamento completo! Conexão satelital LEO ativa.");
            addConsoleLog("[SYS-LINK] Sincronização offline bem-sucedida via canal satelital direct-to-cell.");
            
            btn.innerText = "Antena Alinhada";
            alignmentInProgress = false;
        }
    }, 1200);
}

// Bezier Calculation
function getBezierPoint(t, p0, p1, p2) {
    const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
    const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
    return { x, y };
}

// Satellite SVG Animation & Lat/Long Calculation
function animateSatelliteAndHUD() {
    if (isIssTrackingActive) {
        // Skip Bezier path updates when ISS tracking is active.
        requestAnimationFrame(animateSatelliteAndHUD);
        return;
    }
    
    satT += 0.0012 * satDirection;
    if (satT >= 1.0) {
        satT = 1.0;
        satDirection = -1;
    } else if (satT <= 0.0) {
        satT = 0.0;
        satDirection = 1;
    }
    
    const pos = getBezierPoint(satT, P0, P1, P2);
    const satNode = document.getElementById('satellite-node');
    if (satNode) {
        satNode.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
    }
    
    const latDec = 10 - ((pos.y - 50) / 300) * 55;
    const latDirection = latDec >= 0 ? 'N' : 'S';
    const absLat = Math.abs(latDec);
    const latDeg = Math.floor(absLat);
    const latMin = Math.floor((absLat - latDeg) * 60);
    const latSec = Math.floor(((absLat - latDeg) * 60 - latMin) * 60);
    
    const lonDec = -85 + ((pos.x - 100) / 600) * 55;
    const absLon = Math.abs(lonDec);
    const lonDeg = Math.floor(absLon);
    const lonMin = Math.floor((absLon - lonDeg) * 60);
    const lonSec = Math.floor(((absLon - lonDeg) * 60 - lonMin) * 60);
    
    const hudLat = document.getElementById('hud-lat');
    const hudLon = document.getElementById('hud-lon');
    const hudAlt = document.getElementById('hud-alt');
    
    if (hudLat) hudLat.innerText = `LAT: ${latDeg}° ${latMin}' ${latSec}" ${latDirection}`;
    if (hudLon) hudLon.innerText = `LON: ${lonDeg}° ${lonMin}' ${lonSec}" W`;
    
    const alt = 524.3 + Math.sin(satT * Math.PI) * 12.4;
    if (hudAlt) hudAlt.innerText = `ALT: ${alt.toFixed(1)} KM`;
    
    requestAnimationFrame(animateSatelliteAndHUD);
}

// Console Simulation
function startConsoleSimulation() {
    for(let i=0; i<4; i++) {
        addConsoleLog(consoleTemplates[i]);
    }
    setInterval(() => {
        const randIndex = Math.floor(Math.random() * consoleTemplates.length);
        addConsoleLog(consoleTemplates[randIndex]);
    }, 7000);
}

function addConsoleLog(text, isImportant = false) {
    const terminal = document.getElementById('console-terminal');
    if (!terminal) return;
    
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    
    const line = document.createElement('div');
    line.className = 'console-line';
    if (isImportant) {
        line.classList.add('console-alert');
    }
    line.innerHTML = `<span class="console-time">[${timeStr}]</span> ${text}`;
    
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
    
    while (terminal.childElementCount > 15) {
        terminal.removeChild(terminal.firstChild);
    }
}

// Periodic data fluctuation
function startDataFluctuation() {
    setInterval(() => {
        if (currentSection === 'dashboard') {
            const dataVal = sectorData[activeSector][currentMapMode];
            if (currentMapMode === 'sar') {
                const fluctuation = (Math.random() * 0.3 - 0.15).toFixed(2);
                const currentTemp = parseFloat(sectorData.rio.temp);
                if (!isNaN(currentTemp)) {
                    sectorData.rio.temp = `+${(currentTemp + parseFloat(fluctuation)).toFixed(2)} °C (Thermal Anomaly)`;
                    if (activeSector === 'rio') {
                        document.getElementById('lbl-temp').innerText = sectorData.rio.temp;
                    }
                }
            } else if (currentMapMode === 'skywatch') {
                const currentFlux = parseFloat(sectorData.rio.skywatch.lbl1);
                if (!isNaN(currentFlux)) {
                    const fluxFluct = (Math.random() * 0.4 - 0.2).toFixed(1);
                    sectorData.rio.skywatch.lbl1 = `${(currentFlux + parseFloat(fluxFluct)).toFixed(1)} keV (Ionic Flux)`;
                    if (activeSector === 'rio') {
                        document.getElementById('lbl-moisture').innerText = sectorData.rio.skywatch.lbl1;
                    }
                }
            }
            
            // Fluctuate chart heights slightly for active visualization
            const bar1 = document.getElementById('bar-optical');
            const bar2 = document.getElementById('bar-radar');
            const bar3 = document.getElementById('bar-thermal');
            
            if (bar1 && bar2 && bar3 && dataVal && dataVal.bars) {
                const b1 = Math.max(10, Math.min(100, dataVal.bars.b1 + (Math.random() * 8 - 4)));
                const b2 = Math.max(10, Math.min(100, dataVal.bars.b2 + (Math.random() * 8 - 4)));
                const b3 = Math.max(10, Math.min(100, dataVal.bars.b3 + (Math.random() * 8 - 4)));
                
                bar1.style.height = `${b1}%`;
                bar2.style.height = `${b2}%`;
                bar3.style.height = `${b3}%`;
            }
        }
    }, 4500);
}

// Clocks
function initClocks() {
    const DAYS_PT = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
    const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

    const update = () => {
        const now = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
        
        const utcHours = pad(now.getUTCHours());
        const utcMinutes = pad(now.getUTCMinutes());
        const utcSeconds = pad(now.getUTCSeconds());
        
        const missionClock = document.getElementById('mission-clock');
        if (missionClock) missionClock.innerText = `${utcHours}:${utcMinutes}:${utcSeconds} UTC`;
        
        const localTimeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
        const phoneTime = document.getElementById('phone-time');
        const lockClock = document.getElementById('lock-clock');
        const lockDate = document.getElementById('lock-date');
        
        if (phoneTime) phoneTime.innerText = localTimeStr;
        if (lockClock) lockClock.innerText = localTimeStr;
        if (lockDate) {
            const dayName = DAYS_PT[now.getDay()];
            const day = now.getDate();
            const month = MONTHS_PT[now.getMonth()];
            lockDate.innerText = `${dayName}, ${day} de ${month}`;
        }
    };
    update();
    setInterval(update, 1000);
}

// Mobile Simulator View Screen controller (Android layout)
function unlockToScreen(screenId) {
    document.getElementById('phone-screen-lock').classList.remove('active');
    document.getElementById('phone-screen-navigation').classList.remove('active');
    document.getElementById('phone-screen-report').classList.remove('active');
    document.getElementById('phone-screen-tracker').classList.remove('active');
    document.getElementById('phone-screen-skywatch').classList.remove('active');
    document.getElementById('phone-screen-eco').classList.remove('active');
    
    document.getElementById('p-nav-navigation').classList.remove('active');
    document.getElementById('p-nav-report').classList.remove('active');
    document.getElementById('p-nav-tracker').classList.remove('active');
    document.getElementById('p-nav-skywatch').classList.remove('active');
    document.getElementById('p-nav-eco').classList.remove('active');
    
    document.getElementById(`phone-screen-${screenId}`).classList.add('active');
    
    const btn = document.getElementById(`p-nav-${screenId}`);
    if (btn) btn.classList.add('active');
    
    const navBar = document.getElementById('phone-bottom-nav');
    if (screenId === 'lock') {
        navBar.style.display = 'none';
        document.getElementById('phone-sat-loader').style.display = 'none';
    } else {
        navBar.style.display = 'flex';
    }
}

// Select incident types in report mobile screen
function selectReport(type) {
    document.getElementById('opt-alagamento').classList.remove('selected');
    document.getElementById('opt-deslizamento').classList.remove('selected');
    document.getElementById('opt-obstrucao').classList.remove('selected');
    
    document.getElementById(`opt-${type}`).classList.add('selected');
}

// Satellite Upload Simulation inside Android device
function triggerSatelliteUpload() {
    const loader = document.getElementById('phone-sat-loader');
    const loaderText = document.getElementById('phone-sat-loader-text');
    const loaderSub = document.getElementById('phone-sat-loader-sub');
    
    loader.style.display = 'flex';
    loaderText.innerText = "Locking LEO Sat...";
    loaderSub.innerText = "Android Sat API: Scanning NTN channels...";
    
    setTimeout(() => {
        loaderText.innerText = "NTN Uplink Active";
        loaderSub.innerText = "Establishing direct-to-cell link with LEO-SAR-4. Range: 524km";
    }, 1500);
    
    setTimeout(() => {
        loaderText.innerText = "Transmitting Packet...";
        loaderSub.innerText = "Sending Room DB emergency telemetry to orbital receiver...";
    }, 3000);
    
    setTimeout(() => {
        loaderText.innerText = "UPLINK SUCCESSFUL";
        loaderSub.innerText = "Aegis Command handshake: #ACK-883921-OK";
    }, 4500);
    
    setTimeout(() => {
        loader.style.display = 'none';
        showToast("Relatório civil enviado com sucesso via Android Sat API!", "fa-circle-check");
        unlockToScreen('navigation');
    }, 5800);
}

// SkyWatch Android Scanner Simulation
function reportUAPAnomaly() {
    const loader = document.getElementById('phone-sat-loader');
    const loaderText = document.getElementById('phone-sat-loader-text');
    const loaderSub = document.getElementById('phone-sat-loader-sub');
    
    loader.style.display = 'flex';
    loaderText.innerText = "Acessando Câmera AR...";
    loaderSub.innerText = "Calibrando sensores espectroscópicos móveis...";
    
    setTimeout(() => {
        loaderText.innerText = "Varredura Espectral";
        loaderSub.innerText = "Capturando espectro de luz ultravioleta e infravermelho...";
    }, 1500);
    
    setTimeout(() => {
        loaderText.innerText = "Uplink de Verificação";
        loaderSub.innerText = "Enviando assinatura de UAP para IA orbital Aegis...";
    }, 3000);
    
    setTimeout(() => {
        loaderText.innerText = "ANÁLISE CONCLUÍDA";
        loaderSub.innerText = "Objeto verificado. Assinatura: UAP Desconhecido (Classificado em banco DSN).";
    }, 4500);
    
    setTimeout(() => {
        loader.style.display = 'none';
        showToast("Anomalia registrada no banco de dados NASA SETI!", "fa-circle-check");
        
        const phoneUapText = document.getElementById('phone-uap-status');
        if (phoneUapText) {
            phoneUapText.innerHTML = `<span style="color: var(--color-violet); font-weight:700;"><i class="fa-solid fa-check-double"></i> ANOMALIA CONFIRMADA PELA IA ORBITAL (#UAP-R1)</span>`;
        }
        
        addConsoleLog("[SKYWATCH] Anomalia aérea reportada por morador Android. IA orbital confirma perturbação ionosférica ativa.");
    }, 5800);
}

// Interactive Infographic: Aegis-Orbit Steps
function showPurposeStep(stepNum) {
    activePurposeStep = stepNum;
    
    const stepCards = document.querySelectorAll('.info-step-card');
    stepCards.forEach((card, idx) => {
        if (idx === stepNum - 1) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
    
    const canvas = document.getElementById('info-viz-canvas');
    const title = document.getElementById('info-viz-title');
    const desc = document.getElementById('info-viz-desc');
    
    let svgContent = '';
    
    if (stepNum === 1) {
        title.innerText = "Etapa 01: Interferometria InSAR";
        desc.innerText = "Satélites Sentinel-1 em órbita emitem pulsos de radar ativos Banda-C. O sinal rebate no relevo das encostas urbanas e retorna ao receptor espacial. Ao comparar duas órbitas subsequentes, a IA calcula deformações milimétricas na estrutura do terreno.";
        
        svgContent = `
        <svg viewBox="0 0 280 200" width="100%" height="100%">
            <line x1="0" y1="160" x2="280" y2="160" stroke="rgba(0, 229, 255, 0.15)" stroke-dasharray="3"/>
            <path d="M 30,160 Q 110,60 210,160" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
            <g transform="translate(140, 30)">
                <rect x="-16" y="-8" width="32" height="16" fill="#0b3d91" stroke="var(--color-cyan)" stroke-width="1.5"/>
                <rect x="-36" y="-3" width="20" height="6" fill="rgba(0,229,255,0.4)" stroke="var(--color-cyan)"/>
                <rect x="16" y="-3" width="20" height="6" fill="rgba(0,229,255,0.4)" stroke="var(--color-cyan)"/>
                <circle cx="0" cy="12" r="3" fill="var(--color-cyan)"/>
                <path d="M -10,25 Q 0,45 10,25" fill="none" stroke="var(--color-cyan)" stroke-width="1.5" opacity="0.6">
                    <animate attributeName="d" values="M -10,20 Q 0,35 10,20; M -25,120 Q 0,150 25,120" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite"/>
                </path>
            </g>
            <circle cx="110" cy="100" r="4" fill="var(--color-red)"/>
            <path d="M 110,100 L 140,42" stroke="var(--color-red)" stroke-width="1" stroke-dasharray="2" opacity="0.7"/>
            <text x="120" y="95" fill="var(--color-red)" font-size="8" font-family="monospace">ANOMALIA SAR DE DETECTADA</text>
        </svg>
        `;
    } else if (stepNum === 2) {
        title.innerText = "Etapa 02: Modelagem IA Predictiva";
        desc.innerText = "Os algoritmos de rede neural do Aegis-Orbit combinam os dados estruturais do solo com modelos de hidratação (SAR) e dados de temperatura (Landsat Térmico). O sistema cruza os índices pluviométricos para prever o risco de deslizamento com antecedência de 24h a 48h.";
        
        svgContent = `
        <svg viewBox="0 0 280 200" width="100%" height="100%">
            <g transform="translate(40, 100)">
                <circle r="6" fill="var(--color-cyan)"/>
                <text x="-25" y="18" fill="var(--color-text-muted)" font-size="7" font-family="monospace">SAR DATA</text>
            </g>
            <g transform="translate(40, 50)">
                <circle r="6" fill="var(--color-orange)"/>
                <text x="-25" y="18" fill="var(--color-text-muted)" font-size="7" font-family="monospace">THERMAL</text>
            </g>
            <g transform="translate(40, 150)">
                <circle r="6" fill="white"/>
                <text x="-25" y="18" fill="var(--color-text-muted)" font-size="7" font-family="monospace">IoT RAIN</text>
            </g>
            
            <g transform="translate(140, 60)">
                <circle r="5" fill="rgba(213,0,249,0.5)" stroke="var(--color-violet)"/>
            </g>
            <g transform="translate(140, 100)">
                <circle r="5" fill="rgba(213,0,249,0.5)" stroke="var(--color-violet)"/>
            </g>
            <g transform="translate(140, 140)">
                <circle r="5" fill="rgba(213,0,249,0.5)" stroke="var(--color-violet)"/>
            </g>
            
            <g transform="translate(240, 100)">
                <circle r="8" fill="var(--color-red)"/>
                <text x="-20" y="22" fill="var(--color-red)" font-size="8" font-family="monospace" font-weight="700">RISK: 94.2%</text>
            </g>
            
            <path d="M 40,50 L 140,60 M 40,50 L 140,100 M 40,100 L 140,60 M 40,100 L 140,100 M 40,100 L 140,140 M 40,150 L 140,100 M 40,150 L 140,140" stroke="rgba(0,229,255,0.2)" stroke-width="1"/>
            <path d="M 140,60 L 240,100 M 140,100 L 240,100 M 140,140 L 240,100" stroke="rgba(213,0,249,0.3)" stroke-width="1"/>
        </svg>
        `;
    } else if (stepNum === 3) {
        title.innerText = "Etapa 03: Uplink LEO em Emergências";
        desc.innerText = "Se a tempestade destruir as torres de telefonia móvel locais (como comumente ocorre), os dados são compactados em protocolos ultra-leves e transmitidos diretamente via rádio-frequência integrada para satélites de órbita LEO ativos de passagem, bypassando a rede celular.";
        
        svgContent = `
        <svg viewBox="0 0 280 200" width="100%" height="100%">
            <g transform="translate(70, 140)">
                <line x1="0" y1="20" x2="-10" y2="-20" stroke="var(--color-text-muted)" stroke-width="2"/>
                <line x1="0" y1="20" x2="15" y2="-10" stroke="var(--color-text-muted)" stroke-width="1.5"/>
                <circle cx="-10" cy="-20" r="3" fill="var(--color-text-muted)"/>
                <text x="5" y="-15" fill="var(--color-red)" font-size="7" font-family="monospace">CELL NETWORK DOWN</text>
            </g>
            <g transform="translate(190, 40)">
                <rect x="-12" y="-6" width="24" height="12" fill="#0b3d91" stroke="var(--color-cyan)"/>
                <circle cx="0" cy="0" r="2" fill="white"/>
                <path d="M -8,12 L 0,6 L 8,12" stroke="var(--color-cyan)" stroke-width="1" fill="none"/>
            </g>
            <g transform="translate(80, 150)">
                <rect x="-8" y="-14" width="16" height="28" rx="2" fill="#1e2238" stroke="var(--color-cyan)"/>
                <line x1="-5" y1="-8" x2="5" y2="-8" stroke="var(--color-cyan)" stroke-width="1.5"/>
                <circle cx="0" cy="10" r="1.5" fill="var(--color-cyan)"/>
                
                <path d="M 12,-15 L 110,-100" stroke="var(--color-cyan)" stroke-width="2" stroke-dasharray="4,4">
                    <animate attributeName="stroke-dashoffset" values="20;0" dur="1s" repeatCount="indefinite"/>
                </path>
                <text x="20" y="-30" fill="var(--color-cyan)" font-size="7" font-family="monospace">DIRECT LEO UPLINK</text>
            </g>
        </svg>
        `;
    } else if (stepNum === 4) {
        title.innerText = "Etapa 04: Rota de Fuga Topográfica";
        desc.innerText = "Os moradores abrem o app e visualizam as rotas de fuga offline. Diferente de aplicativos GPS comuns que apenas procuram caminhos curtos, nossa IA de rotas utiliza dados do satélite ALOS-2 (Lidar/DEM) para direcionar as pessoas por áreas planas e geologicamente seguras.";
        
        svgContent = `
        <svg viewBox="0 0 280 200" width="100%" height="100%">
            <path d="M 10,60 Q 50,40 100,50 T 260,30" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
            <path d="M 10,100 Q 60,70 120,90 T 260,70" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
            <path d="M 10,140 Q 70,110 140,120 T 260,110" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
            
            <path d="M 60,80 C 80,60 110,60 120,80 C 130,100 110,130 90,120 Z" fill="rgba(255,23,68,0.12)" stroke="var(--color-red)" stroke-width="1"/>
            <text x="65" y="95" fill="var(--color-red)" font-size="6" font-family="monospace">DECLIVE INSTÁVEL</text>
            
            <g transform="translate(30, 130)">
                <rect x="-6" y="-6" width="12" height="12" fill="none" stroke="white"/>
                <polygon points="0,-12 -8,-6 8,-6" fill="none" stroke="white"/>
            </g>
            
            <g transform="translate(220, 80)">
                <circle r="12" fill="rgba(0,255,102,0.15)" stroke="var(--color-emerald)"/>
                <text x="-8" y="3" fill="var(--color-emerald)" font-size="8" font-family="monospace" font-weight="700">SAFE</text>
            </g>
            
            <path d="M 30,120 L 40,75 L 130,45 L 180,65 L 208,80" fill="none" stroke="var(--color-cyan)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <animate attributeName="stroke-dasharray" values="100;0;100" dur="4s" repeatCount="indefinite"/>
            </path>
            <text x="60" y="38" fill="var(--color-cyan)" font-size="7" font-family="monospace">ROTA OFFLINE CALCULADA</text>
        </svg>
        `;
    } else if (stepNum === 5) {
        title.innerText = "Etapa 05: Auditoria Espectral";
        desc.innerText = "Na fase pós-desastre, incentivamos o plantio comunitário de árvores para consolidar encostas. Para evitar fraudes, o Sentinel-2 varre a região ciclicamente analisando o índice de vegetação multiespectral (NDVI). A IA audita a área e gera eco-créditos de renda para os moradores.";
        
        svgContent = `
        <svg viewBox="0 0 280 200" width="100%" height="100%">
            <path d="M 60,150 C 90,130 140,120 180,140 C 220,160 190,180 120,170 Z" fill="rgba(0,255,102,0.12)" stroke="var(--color-emerald)" stroke-width="1.5"/>
            <line x1="80" y1="120" x2="80" y2="180" stroke="var(--color-emerald)" stroke-width="1" stroke-dasharray="2,2"/>
            <line x1="120" y1="120" x2="120" y2="180" stroke="var(--color-emerald)" stroke-width="1" stroke-dasharray="2,2"/>
            <line x1="160" y1="120" x2="160" y2="180" stroke="var(--color-emerald)" stroke-width="1" stroke-dasharray="2,2"/>
            
            <g transform="translate(100, 145)">
                <line x1="0" y1="0" x2="0" y2="-12" stroke="white" stroke-width="1.5"/>
                <circle cx="0" cy="-12" r="6" fill="var(--color-emerald)"/>
            </g>
            <g transform="translate(150, 150)">
                <line x1="0" y1="0" x2="0" y2="-12" stroke="white" stroke-width="1.5"/>
                <circle cx="0" cy="-12" r="5" fill="var(--color-emerald)"/>
            </g>
            
            <g transform="translate(140, 30)">
                <rect x="-14" y="-8" width="28" height="16" fill="#0b3d91" stroke="var(--color-emerald)"/>
                <polygon points="0,8 -50,110 50,110" fill="rgba(0, 255, 102, 0.04)" stroke="rgba(0, 255, 102, 0.1)"/>
            </g>
            
            <text x="15" y="100" fill="var(--color-emerald)" font-size="8" font-family="monospace">NDVI VERIFIED: +0.68</text>
            <text x="15" y="112" fill="var(--color-cyan)" font-size="8" font-family="monospace">ECO-CREDITS DISTRIBUTED</text>
        </svg>
        `;
    }
    
    canvas.innerHTML = svgContent;
}

// Slide control logic
function changeSlide(direction) {
    const currentSlideEl = document.getElementById(`slide-${currentSlide}`);
    let targetSlide = currentSlide + direction;
    
    if (targetSlide < 1 || targetSlide > totalSlides) return;
    
    currentSlideEl.classList.remove('active');
    
    const targetSlideEl = document.getElementById(`slide-${targetSlide}`);
    targetSlideEl.classList.add('active');
    
    currentSlide = targetSlide;
    
    document.getElementById('btn-slide-prev').disabled = currentSlide === 1;
    document.getElementById('btn-slide-next').disabled = currentSlide === totalSlides;
    document.getElementById('slide-num-label').innerText = `Slide ${currentSlide} de ${totalSlides}`;
}

// Sync presentation data
function updatePresentationData() {
    const name1 = document.getElementById('input-name-1').value || "Kalicon Amorim da Cruz Souza";
    const rm1 = document.getElementById('input-rm-1').value || "563172";
    const youtubeUrl = document.getElementById('input-youtube').value;
    
    document.getElementById('slide-name-1').innerText = name1;
    document.getElementById('slide-rm-1').innerText = rm1;
    
    const videoLabel = document.getElementById('video-link-label');
    const videoUrlDisplay = document.getElementById('video-url-display');
    const videoWrapper = document.getElementById('pitch-video-wrapper');
    
    if (youtubeUrl) {
        videoUrlDisplay.innerText = `URL do Vídeo: ${youtubeUrl}`;
        videoLabel.innerText = "Clique para assistir no YouTube";
        videoWrapper.onclick = () => window.open(youtubeUrl, '_blank');
    } else {
        videoUrlDisplay.innerText = "URL do Vídeo: Indefinida. Insira o link do YouTube ao lado.";
        videoLabel.innerText = "Link de Vídeo não configurado.";
        videoWrapper.onclick = () => showToast("Insira a URL do YouTube nas configurações ao lado.", "fa-triangle-exclamation");
    }
}

function openPitchVideo() {
    const youtubeUrl = document.getElementById('input-youtube').value;
    if (youtubeUrl) {
        window.open(youtubeUrl, '_blank');
    }
}

// Copy Academic Markdown text to clipboard (Solo project - Kalicon)
function copyMarkdownText() {
    const name1 = document.getElementById('input-name-1').value || "Kalicon Amorim da Cruz Souza";
    const rm1 = document.getElementById('input-rm-1').value || "563172";
    const youtubeUrl = document.getElementById('input-youtube').value || "Link do Pitch não configurado";

    const markdownText = `# PROPOSTA DE GLOBAL SOLUTION: MISSION AEGIS-ORBIT
    
## DADOS DO ALUNO
- **Aluno:** ${name1} (RM: ${rm1})
- **Projeto Individual** — Entrega Completa por um único desenvolvedor
- Link do Vídeo Pitch no YouTube: ${youtubeUrl}

---

## 1. NOME DO APLICATIVO
**Aegis-Orbit (Aplicativo Nativo Android - Edição Especial de Resiliência Urbana & Observatório Espacial)**

---

## 2. O PROBLEMA CLIMÁTICO, HUMANITÁRIO E CIENTÍFICO
O avanço drástico de catástrofes climáticas e a falta de sensoriamento aeroespacial avançado trazem três grandes falhas a resolver:
1. **Zonas Cegas de Monitoramento de Solo**: Sensores terrestres falham em detectar micro-deformações em encostas antes do colapso.
2. **Apagão Tecnológico durante Catástrofes**: Tempestades e enchentes inutilizam as torres de telefonia 4G/5G, isolando comunidades vulneráveis.
3. **Crowdsourcing de Anomalias Aeroespaciais (UAPs)**: Ausência de uma rede científica que filtre falsos positivos (como Starlink) e catalogue perturbações ionosféricas genuínas.

---

## 3. DESCRIÇÃO DA SOLUÇÃO (APLICATIVO ANDROID AEGIS-ORBIT)
A **Aegis-Orbit** propõe um aplicativo nativo em Kotlin e Jetpack Compose com os seguintes módulos:
1. **Varredura Ativa SAR (Sentinel-1)**: Previsão de deslizamento via dados interferométricos espaciais Banda-C.
2. **Android Satellite API Integration (NTN)**: Comunicação de SOS e relatórios direto para satélites LEO (órbita baixa) sem sinal 4G/5G.
3. **Room Database Local (Offline Cache)**: Topografia e caminhos de fuga salvos localmente em tabelas SQLite locais.
4. **Ferramenta de Alinhamento Satelital**: Bússola 3D que orienta o usuário para apontar o celular diretamente para a órbita do satélite Aegis LEO ativo.
5. **Módulo Aegis SkyWatch**: Crowdsourcing de UAPs/UFOs integrando realidade aumentada com descarte automático de satélites conhecidos e logs de rádio SETI.
6. **Observatório Espacial com Dados Reais da NASA**: Integração com NASA APOD (Foto Astronômica do Dia), NEO Web Service (Asteroides Próximos da Terra), e rastreamento da ISS em tempo real.

---

## 4. PROJETO DE ARQUITETURA DO BANCO DE DADOS ROOM
O banco de dados do app local (\`aegis_orbit_db\` - Versão 2) possui três entidades com o seguinte mapeamento lógico:

\`\`\`
  +-----------------------------------+
  |          elevation_points         |
  +-----------------------------------+
  | PK: id (Int, AutoIncrement)       |
  | latitude (Double)                 |
  | longitude (Double)                |
  | altitudeMeters (Double)           |
  | slopeDegree (Double)              |
  | sectorName (String)               |
  +-----------------------------------+
                   |
                   v
  +-----------------------------------+
  |           civil_reports           |
  +-----------------------------------+
  | PK: id (Int, AutoIncrement)       |
  | type (String)                     |
  | description (String)              |
  | latitude (Double)                 |
  | longitude (Double)                |
  | timestamp (Long)                  |
  | isSynced (Boolean)                |
  +-----------------------------------+
                   |
                   v
  +-----------------------------------+
  |           uap_sightings           |
  +-----------------------------------+
  | PK: id (Int, AutoIncrement)       |
  | ionicFlux (Double)                |
  | frequencyGhz (Double)             |
  | description (String)              |
  | timestamp (Long)                  |
  | isVerified (Boolean)              |
  +-----------------------------------+
\`\`\`

---

## 5. PROTÓTIPO E FLUXO DO APLICATIVO (Telas do App Android)
1. **Tela de Bloqueio**: Exibição de alertas de emergência push.
2. **Tela de Rotas**: Mapa topográfico que plota caminhos seguros offline usando Room.
3. **Tela de Ocorrência**: Formulário de SOS transmitido via satélite (Android Sat API).
4. **Tela LEO Tracker**: Alinhador de antena com interface de bússola virtual para conexão LEO direta.
5. **Tela SkyWatch**: Radar orbital de UAPs com escaner de câmera AR integrado ao DSN.
6. **Tela Eco-Crédito**: Painel verde com score de reflorestamento comunitário auditado por Sentinel-2.
7. **Observatório Espacial (Web Dashboard)**: Painel integrado à api.nasa.gov com APOD, asteroides NEO e posição ISS em tempo real.

---

## 6. INTEGRAÇÃO COM APIs REAIS DA NASA
- **NASA APOD API** (\`api.nasa.gov/planetary/apod\`): Imagem astronômica do dia com explicação científica.
- **NASA NEO Web Service** (\`api.nasa.gov/neo/rest/v1/feed\`): Rastreamento de asteroides próximos da Terra com distância, diâmetro estimado e velocidade relativa.
- **Where The ISS At API** (\`api.wheretheiss.at/v1/satellites/25544\`): Posição orbital da ISS atualizada a cada 10 segundos.

---

## 7. ALINHAMENTO COM OS ODS DA ONU
- **ODS 9 (Indústria, Inovação e Infraestrutura)**: Satélites LEO como canal público resiliente.
- **ODS 11 (Cidades e Comunidades Sustentáveis)**: Salvaguarda de encostas e rotas de fuga contra enchentes e desabamentos.
- **ODS 13 (Ação Climática)**: Adaptação ágil a eventos climáticos severos.
- **ODS 2 & ODS 8**: Renda e economia verde via créditos de carbono auditados do espaço.`;

    navigator.clipboard.writeText(markdownText).then(() => {
        showToast("Markdown acadêmico copiado com sucesso!", "fa-circle-check");
    }).catch(err => {
        showToast("Falha ao copiar conteúdo.", "fa-triangle-exclamation");
        console.error('Copy error:', err);
    });
}
// Global System Toast
function showToast(text, iconClass = "fa-circle-check") {
    const toast = document.getElementById('system-toast');
    const toastText = document.getElementById('toast-text');
    const toastIcon = document.getElementById('toast-icon');
    
    toastText.innerText = text.toUpperCase();
    toastIcon.className = `fa-solid ${iconClass} toast-icon`;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function phoneToast(text) {
    showToast(`[ANDROID APP] ${text}`, "fa-android");
}

// Android Code Viewer Logic
let activeSimTab = 'features';
let activeCodeFile = 'main';

function switchSimTab(tabId) {
    activeSimTab = tabId;
    
    // Toggles buttons
    document.getElementById('btn-sim-features').classList.remove('active');
    document.getElementById('btn-sim-code').classList.remove('active');
    document.getElementById('btn-sim-terminal').classList.remove('active');
    document.getElementById(`btn-sim-${tabId}`).classList.add('active');
    
    // Toggles panels
    document.getElementById('sim-tab-features').classList.add('hidden');
    document.getElementById('sim-tab-code').classList.add('hidden');
    document.getElementById('sim-tab-terminal').classList.add('hidden');
    
    if (tabId === 'features') {
        document.getElementById('sim-tab-features').classList.remove('hidden');
    } else if (tabId === 'code') {
        document.getElementById('sim-tab-code').classList.remove('hidden');
        loadAndroidCode(activeCodeFile);
    } else if (tabId === 'terminal') {
        document.getElementById('sim-tab-terminal').classList.remove('hidden');
        setTimeout(() => {
            const termInput = document.getElementById('adb-terminal-input');
            if (termInput) termInput.focus();
        }, 100);
    }
}

function loadAndroidCode(fileId) {
    activeCodeFile = fileId;
    
    // Reset file button active states
    const fileIds = ['main', 'map', 'tracker', 'sky', 'db', 'report', 'uap', 'starry', 'api', 'gradle'];
    fileIds.forEach(id => {
        const btn = document.getElementById(`btn-file-${id}`);
        if (btn) btn.classList.remove('active');
    });
    
    const activeBtn = document.getElementById(`btn-file-${fileId}`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Render code in pre block
    const codeDisplay = document.getElementById('android-code-display');
    if (codeDisplay) {
        codeDisplay.innerText = androidSourceCodes[fileId];
    }
}

const androidSourceCodes = {
    main: `package br.com.fiap.aegisorbit

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import br.com.fiap.aegisorbit.ui.screens.EcoScreen
import br.com.fiap.aegisorbit.ui.screens.MapScreen
import br.com.fiap.aegisorbit.ui.screens.ReportScreen
import br.com.fiap.aegisorbit.ui.screens.SkyWatchScreen
import br.com.fiap.aegisorbit.ui.screens.TrackerScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AegisTheme {
                val navController = rememberNavController()
                val items = listOf("rotas", "reportar", "tracker", "skywatch", "eco")
                
                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        NavigationBar(
                            containerColor = Color(0xFF090C15),
                            contentColor = Color(0xFF90CAF9)
                        ) {
                            val navBackStackEntry by navController.currentBackStackEntryAsState()
                            val currentRoute = navBackStackEntry?.destination?.route
                            
                            items.forEach { screen ->
                                val selected = currentRoute == screen
                                NavigationBarItem(
                                    selected = selected,
                                    onClick = {
                                        navController.navigate(screen) {
                                            popUpTo(navController.graph.findStartDestination().id) {
                                                saveState = true
                                            }
                                            launchSingleTop = true
                                            restoreState = true
                                        }
                                    },
                                    icon = {
                                        when (screen) {
                                            "rotas" -> Text(if (selected) "🧭" else "🧭")
                                            "reportar" -> Text(if (selected) "📢" else "📢")
                                            "tracker" -> Text(if (selected) "🛰️" else "🛰️")
                                            "skywatch" -> Text(if (selected) "🧑‍🚀" else "🧑‍🚀")
                                            "eco" -> Text(if (selected) "🌿" else "🌿")
                                        }
                                    },
                                    label = {
                                        Text(
                                            text = screen.replaceFirstChar { it.uppercase() },
                                            color = if (selected) Color(0xFF00E5FF) else Color(0x99FFFFFF)
                                        )
                                    },
                                    colors = NavigationBarItemDefaults.colors(
                                        indicatorColor = Color(0x1F00E5FF)
                                    )
                                )
                            }
                        }
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = "rotas",
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable("rotas") { MapScreen() }
                        composable("reportar") { ReportScreen() }
                        composable("tracker") { TrackerScreen() }
                        composable("skywatch") { SkyWatchScreen() }
                        composable("eco") { EcoScreen() }
                    }
                }
            }
        }
    }
}

@Composable
fun AegisTheme(content: @Composable () -> Unit) {
    val darkColorScheme = darkColorScheme(
        primary = Color(0xFF00E5FF),
        secondary = Color(0xFFD500F9),
        background = Color(0xFF020409),
        surface = Color(0xFF0C1224)
    )
    MaterialTheme(
        colorScheme = darkColorScheme,
        content = content
    )
}`,
    starry: `package br.com.fiap.aegisorbit.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import kotlin.random.Random

@Composable
fun StarryBackground(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    val stars = remember {
        List(40) {
            Triple(Random.nextFloat(), Random.nextFloat(), Random.nextInt(1200, 3200))
        }
    }

    Box(modifier = modifier.fillMaxSize()) {
        stars.forEach { star ->
            val infiniteTransition = rememberInfiniteTransition(label = "StarTwinkle")
            val alpha by infiniteTransition.animateFloat(
                initialValue = 0.1f,
                targetValue = 0.95f,
                animationSpec = infiniteRepeatable(
                    animation = tween(star.third, easing = LinearEasing),
                    repeatMode = RepeatMode.Reverse
                ),
                label = "StarAlpha"
            )

            Canvas(modifier = Modifier.fillMaxSize()) {
                val x = star.first * size.width
                val y = star.second * size.height
                
                drawCircle(color = Color(0xFF00E5FF).copy(alpha = alpha), radius = 2.5f, center = Offset(x, y))
                drawCircle(color = Color(0xFF00E5FF).copy(alpha = alpha * 0.25f), radius = 6.5f, center = Offset(x, y))
            }
        }
        content()
    }
}`,
    map: `package br.com.fiap.aegisorbit.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import br.com.fiap.aegisorbit.ui.components.StarryBackground

@Composable
fun MapScreen() {
    var isNavigating by remember { mutableStateOf(false) }

    StarryBackground {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Rotas de Fuga Segura",
                color = Color.White,
                fontSize = 18.sp,
                style = MaterialTheme.typography.titleMedium,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .background(Color(0xFF070913), RoundedCornerShape(12.dp))
            ) {
                Canvas(modifier = Modifier.fillMaxSize()) {
                    for (i in 0..size.width.toInt() step 60) {
                        drawLine(color = Color(0x0F00E5FF), start = Offset(i.toFloat(), 0f), end = Offset(i.toFloat(), size.height), strokeWidth = 1f)
                    }

                    drawCircle(color = Color(0x22FF1744), center = Offset(size.width * 0.4f, size.height * 0.6f), radius = 90f)
                    drawCircle(color = Color(0xFFFF1744), center = Offset(size.width * 0.4f, size.height * 0.6f), radius = 15f)
                    drawCircle(color = Color(0xFF00E5FF), center = Offset(size.width * 0.2f, size.height * 0.3f), radius = 12f)
                    drawCircle(color = Color(0xFF00FF66), center = Offset(size.width * 0.8f, size.height * 0.4f), radius = 18f)

                    if (isNavigating) {
                        val pathEffect = PathEffect.dashPathEffect(floatArrayOf(15f, 10f), 0f)
                        drawLine(color = Color(0xFF00E5FF), start = Offset(size.width * 0.2f, size.height * 0.3f), end = Offset(size.width * 0.5f, size.height * 0.2f), strokeWidth = 6f, pathEffect = pathEffect)
                        drawLine(color = Color(0xFF00E5FF), start = Offset(size.width * 0.5f, size.height * 0.2f), end = Offset(size.width * 0.8f, size.height * 0.4f), strokeWidth = 6f, pathEffect = pathEffect)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0C1224)),
                shape = RoundedCornerShape(8.dp)
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Text(text = "ROTA DE EVASÃO ORBITAL", color = Color(0xFF00E5FF), fontSize = 12.sp, style = MaterialTheme.typography.labelSmall)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(text = "Distância: 820m | Elevação Média: +12m (Área Segura)", color = Color.White, fontSize = 13.sp)
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(text = "A rota evita encostas de alto declive conforme leitura de satélite InSAR.", color = Color(0xFF00FF66), fontSize = 11.sp)
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            Button(
                onClick = { isNavigating = !isNavigating },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0b3d91)),
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(text = if (isNavigating) "Parar Orientação" else "Iniciar Orientação Offline", color = Color.White)
            }
        }
    }
}`,
    tracker: `package br.com.fiap.aegisorbit.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import br.com.fiap.aegisorbit.api.AegisApiService
import br.com.fiap.aegisorbit.data.AppDatabase
import br.com.fiap.aegisorbit.ui.components.StarryBackground
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun TrackerScreen() {
    var signalStrength by remember { mutableFloatStateOf(0f) }
    var alignStatus by remember { mutableStateOf("Buscando Sinal") }
    var isAligning by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    val db = remember { AppDatabase.getDatabase(context) }

    val infiniteTransition = rememberInfiniteTransition(label = "RadarBlink")
    val beaconPulse by infiniteTransition.animateFloat(
        initialValue = 4f,
        targetValue = 24f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "PulseRadius"
    )

    StarryBackground {
        Column(
            modifier = Modifier.fillMaxSize().padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "Rastreamento LEO", color = Color.White, fontSize = 18.sp)
                Card(
                    colors = CardDefaults.cardColors(containerColor = if (signalStrength > 0.8f) Color(0x1F00FF66) else Color(0x1FFF1744)),
                    shape = RoundedCornerShape(4.dp)
                ) {
                    Text(
                        text = if (signalStrength > 0.8f) "LINK ATIVO" else "SEM SINAL",
                        color = if (signalStrength > 0.8f) Color(0xFF00FF66) else Color(0xFFFF1744),
                        fontSize = 10.sp,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }

            Text(
                text = "Aponte o receptor na direção do satélite Aegis-LEO para efetuar sincronização offline de dados climáticos.",
                color = Color(0xFF90CAF9), fontSize = 11.sp, lineHeight = 14.sp, modifier = Modifier.padding(vertical = 8.dp)
            )

            Spacer(modifier = Modifier.height(12.dp))

            Box(
                modifier = Modifier.size(160.dp).background(Color(0xFF070913), RoundedCornerShape(12.dp)).padding(8.dp),
                contentAlignment = Alignment.Center
            ) {
                Canvas(modifier = Modifier.fillMaxSize()) {
                    val radius = size.minDimension / 2
                    val center = Offset(size.width / 2, size.height / 2)

                    drawCircle(color = Color(0x1A00E5FF), radius = radius, center = center, style = Stroke(2f))
                    drawCircle(color = Color(0x3300E5FF), radius = radius * 0.7f, center = center, style = Stroke(1.5f))
                    drawCircle(color = Color(0x4D00E5FF), radius = radius * 0.4f, center = center, style = Stroke(1f))

                    drawLine(color = Color(0x1A00E5FF), start = Offset(0f, center.y), end = Offset(size.width, center.y))
                    drawLine(color = Color(0x1A00E5FF), start = Offset(center.x, 0f), end = Offset(center.x, size.height))

                    val targetOffset = if (signalStrength > 0.8f) center else Offset(center.x + radius * 0.5f, center.y - radius * 0.3f)
                    drawCircle(color = if (signalStrength > 0.8f) Color(0xFF00FF66) else Color(0xFF00E5FF), radius = 8f, center = targetOffset)
                    drawCircle(color = if (signalStrength > 0.8f) Color(0x3300FF66) else Color(0x3300E5FF), radius = beaconPulse, center = targetOffset, style = Stroke(1.5f))

                    if (isAligning && signalStrength <= 0.8f) {
                        drawLine(color = Color(0xFFFF9100), start = center, end = targetOffset, strokeWidth = 2f)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0C1224)),
                shape = RoundedCornerShape(8.dp)
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Text(text = "ESTATÍSTICAS DA CONEXÃO", color = Color(0xFF00E5FF), fontSize = 11.sp)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(text = "Status: $alignStatus", color = Color.White, fontSize = 12.sp)
                    Text(text = "Qualidade do Sinal: ${(signalStrength * 100).toInt()}%", color = if (signalStrength > 0.8f) Color(0xFF00FF66) else Color(0xFF90CAF9), fontSize = 12.sp)
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            Button(
                onClick = {
                    scope.launch {
                        isAligning = true
                        alignStatus = "Calibrando Giroscópio..."
                        delay(1000)
                        alignStatus = "Apontando para satélite AEGIS-4..."
                        signalStrength = 0.3f
                        delay(1000)
                        alignStatus = "Sincronizando frequências..."
                        signalStrength = 0.6f
                        delay(1000)
                        alignStatus = "Verificando base local offline..."
                        val unsynced = db.elevationDao().getAllCivilReports().filter { !it.isSynced }
                        delay(1000)
                        if (unsynced.isNotEmpty()) {
                            alignStatus = "Enviando ${unsynced.size} relatórios pendentes..."
                            unsynced.forEach { report ->
                                val success = AegisApiService.uploadCivilReport(report)
                                if (success) {
                                    db.elevationDao().insertCivilReport(report.copy(isSynced = true))
                                }
                            }
                            delay(1200)
                        }
                        alignStatus = "Sincronização completa!"
                        signalStrength = 0.95f
                        isAligning = false
                    }
                },
                enabled = !isAligning,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00E5FF)),
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(text = if (isAligning) "Alinhando..." else "Alinhar Antena Satelital", color = Color(0xFF020409))
            }
        }
    }
}`,
    sky: `package br.com.fiap.aegisorbit.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import br.com.fiap.aegisorbit.api.AegisApiService
import br.com.fiap.aegisorbit.data.AppDatabase
import br.com.fiap.aegisorbit.data.UapSighting
import br.com.fiap.aegisorbit.ui.components.StarryBackground
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun SkyWatchScreen() {
    var uapStatus by remember { mutableStateOf("Anomalia ionosférica ativa detectada sobre Setor Rio-A. Assinatura: UAP-1.") }
    var isScanning by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    val db = remember { AppDatabase.getDatabase(context) }

    val infiniteTransition = rememberInfiniteTransition(label = "RadarSweep")
    val angle by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(4000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "RadarSweepAngle"
    )

    StarryBackground {
        Box(modifier = Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier.fillMaxSize().padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = "Aegis SkyWatch", color = Color.White, fontSize = 18.sp)
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color(0x1FBD00F9)),
                        shape = RoundedCornerShape(4.dp)
                    ) {
                        Text(text = "SETI ACTIVE", color = Color(0xFFD500F9), fontSize = 10.sp, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                    }
                }

                Text(
                    text = "Varredura de anomalias aéreas e radiação ionosférica sincronizado com a base NASA SETI.",
                    color = Color(0xFF90CAF9), fontSize = 11.sp, lineHeight = 14.sp, modifier = Modifier.padding(vertical = 8.dp)
                )

                Box(
                    modifier = Modifier.size(150.dp).padding(8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Canvas(modifier = Modifier.fillMaxSize()) {
                        val radius = size.minDimension / 2
                        val center = Offset(size.width / 2, size.height / 2)

                        drawCircle(color = Color(0x3300E5FF), radius = radius, center = center, style = Stroke(2f))
                        drawCircle(color = Color(0x1a00E5FF), radius = radius * 0.6f, center = center, style = Stroke(1.5f))
                        drawCircle(color = Color(0x0d00E5FF), radius = radius * 0.2f, center = center, style = Stroke(1f))

                        drawLine(color = Color(0x1A00E5FF), start = Offset(0f, center.y), end = Offset(size.width, center.y))
                        drawLine(color = Color(0x1A00E5FF), start = Offset(center.x, 0f), end = Offset(center.x, size.height))

                        val rad = Math.toRadians(angle.toDouble())
                        val endX = center.x + radius * Math.cos(rad).toFloat()
                        val endY = center.y + radius * Math.sin(rad).toFloat()
                        drawLine(color = Color(0xaa00E5FF), start = center, end = Offset(endX, endY), strokeWidth = 3f)

                        drawCircle(color = Color(0xFFD500F9), radius = 6f, center = Offset(center.x + radius * 0.5f, center.y - radius * 0.4f))
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF0C1224)),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(text = "DETECÇÃO ATIVA", color = Color(0xFFD500F9), fontSize = 11.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(text = uapStatus, color = Color.White, fontSize = 12.sp, lineHeight = 16.sp)
                    }
                }

                Spacer(modifier = Modifier.weight(1f))

                Button(
                    onClick = {
                        scope.launch {
                            isScanning = true
                            delay(1800)

                            val sighting = UapSighting(
                                ionicFlux = 14.2,
                                frequencyGhz = 1.420,
                                description = "Anomalia UAP luminosa flutuante travada na faixa 1.42GHz",
                                isVerified = true
                            )
                            db.elevationDao().insertUapSighting(sighting)
                            AegisApiService.uploadUapSighting(sighting)

                            uapStatus = "UAP CONFIRMADO (#UAP-R1). Anomalia eletromagnética registrada na Room DB e enviada para a central NASA SETI."
                            isScanning = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD500F9)),
                    shape = RoundedCornerShape(24.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(text = "Escanear Sky com Câmera AR", color = Color.White)
                }
            }

            if (isScanning) {
                Box(
                    modifier = Modifier.fillMaxSize().background(Color(0xE6020409)),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        CircularProgressIndicator(color = Color(0xFFD500F9))
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(text = "Alinhando Câmera AR...", color = Color(0xFFD500F9), fontSize = 16.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(text = "Gravando avistamento na base local Room...", color = Color.Gray, fontSize = 12.sp)
                    }
                }
            }
        }
    }
}`,
    db: `package br.com.fiap.aegisorbit.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(
    entities = [ElevationPoint::class, CivilReport::class, UapSighting::class],
    version = 2,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun elevationDao(): ElevationDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "aegis_orbit_db"
                ).fallbackToDestructiveMigration().build()
                INSTANCE = instance
                instance
            }
        }
    }
}`,
    report: `package br.com.fiap.aegisorbit.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "civil_reports")
data class CivilReport(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val type: String,
    val description: String,
    val latitude: Double,
    val longitude: Double,
    val timestamp: Long = System.currentTimeMillis(),
    val isSynced: Boolean = false
)`,
    uap: `package br.com.fiap.aegisorbit.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "uap_sightings")
data class UapSighting(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val ionicFlux: Double,
    val frequencyGhz: Double,
    val description: String,
    val timestamp: Long = System.currentTimeMillis(),
    val isVerified: Boolean = false
)`,
    api: `package br.com.fiap.aegisorbit.api

import br.com.fiap.aegisorbit.data.CivilReport
import br.com.fiap.aegisorbit.data.UapSighting
import kotlinx.coroutines.delay

object AegisApiService {
    /**
     * Simulates uploading a civil warning report via satellite network to NASA EOS Partner server.
     */
    suspend fun uploadCivilReport(report: CivilReport): Boolean {
        delay(1000) // Simulates LEO satellite latency
        return true
    }

    /**
     * Simulates uploading a UAP anomalous event to SETI command center.
     */
    suspend fun uploadUapSighting(sighting: UapSighting): Boolean {
        delay(1200) // Simulates satellite latency
        return true
    }
}`,
    gradle: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.kapt")
}

android {
    namespace = "br.com.fiap.aegisorbit"
    compileSdk = 34

    defaultConfig {
        applicationId = "br.com.fiap.aegisorbit"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    buildFeatures { compose = true }
    composeOptions { kotlinCompilerExtensionVersion = "1.5.3" }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.6.2")
    implementation("androidx.activity:activity-compose:1.8.1")
    implementation(platform("androidx.compose:compose-bom:2023.10.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.navigation:navigation-compose:2.7.5")
    
    val roomVersion = "2.6.0"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    kapt("androidx.room:room-compiler:$roomVersion")
}`
};

// ==========================================================================
// SECTION: OBSERVATÓRIO ESPACIAL — NASA API INTEGRATION (REAL DATA)
// ==========================================================================

let observatoryInitialized = false;
let issInterval = null;

function initObservatory() {
    // Reset so it can re-initialize on repeated visits to the section
    if (observatoryInitialized) return;
    observatoryInitialized = true;
    fetchAPOD();
    fetchNEO();
    fetchISS();
    fetchSpaceXLaunch();
    fetchNOAASpaceWeather();
    drawMoonPhase();
    // Auto-refresh ISS position every 10 seconds
    if (issInterval) clearInterval(issInterval);
    issInterval = setInterval(fetchISS, 10000);
    // Auto-refresh NOAA space weather every 3 minutes
    setInterval(fetchNOAASpaceWeather, 180000);
}

async function fetchSpaceXLaunch() {
    const missionNameEl = document.getElementById('spacex-mission-name');
    const rocketNameEl = document.getElementById('spacex-rocket-name');
    const detailsEl = document.getElementById('spacex-details');
    const patchContainer = document.getElementById('spacex-patch-container');
    const statusBadge = document.getElementById('spacex-status');

    const showMock = () => {
        const mockMs = Date.now() + 4 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000;
        if (missionNameEl) missionNameEl.innerText = 'Aegis Sentinel-5B Deployment';
        if (rocketNameEl) rocketNameEl.innerText = 'FOGUETE: AEGIS HEAVY BLOCK V';
        if (detailsEl) detailsEl.innerText = '[SIMULAÇÃO] Satélite meteorológico Aegis Sentinel-5B. SSO a 512km. Monitoramento multiespectral de cobertura terrestre.';
        if (patchContainer) patchContainer.innerHTML = `<i class="fa-solid fa-rocket" style="color: var(--color-cyan); font-size: 1.1rem;"></i>`;
        if (statusBadge) { statusBadge.innerText = 'SIMULAÇÃO'; statusBadge.className = 'badge-lock warning'; }
        startSpacexCountdown(mockMs);
        updateApiDiag('spacex', false, 0, 'All SpaceX sources offline');
    };

    const applyLaunchData = (name, rocket, details, patchUrl, dateMs, elapsed) => {
        if (missionNameEl) missionNameEl.innerText = name;
        if (rocketNameEl) rocketNameEl.innerText = `FOGUETE: ${rocket.toUpperCase()}`;
        if (detailsEl) detailsEl.innerText = details;
        if (patchContainer) {
            patchContainer.innerHTML = patchUrl
                ? `<img src="${patchUrl}" style="width:34px;height:34px;object-fit:contain;border-radius:50%;">`
                : `<i class="fa-solid fa-shuttle-space" style="color:var(--color-cyan);font-size:1.1rem;"></i>`;
        }
        if (statusBadge) { statusBadge.innerText = 'AGENDADO ✓'; statusBadge.className = 'badge-lock success'; }
        startSpacexCountdown(dateMs);
        updateApiDiag('spacex', true, elapsed);
        addConsoleLog('[SPACEX] Telemetria de lançamento recebida com sucesso.');
    };

    const startTime = performance.now();

    // Strategy 1: SpaceX v5
    try {
        const res = await fetch('https://api.spacexdata.com/v5/launches/upcoming?limit=1');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arr = await res.json();
        const d = Array.isArray(arr) ? arr[0] : arr;
        if (!d) throw new Error('empty');

        let rocketName = 'Falcon 9';
        if (d.rocket) {
            try {
                const rr = await fetch(`https://api.spacexdata.com/v4/rockets/${d.rocket}`);
                if (rr.ok) rocketName = (await rr.json()).name || rocketName;
            } catch(_) {}
        }
        const desc = d.details
            ? d.details.substring(0, 180) + (d.details.length > 180 ? '...' : '')
            : 'Lançamento orbital. Nova carga de satélites para LEO. Vídeo ao vivo no T-15 minutos.';
        const launchMs = d.date_unix ? d.date_unix * 1000 : Date.now() + 5 * 24 * 3600 * 1000;
        applyLaunchData(d.name || 'Missão SpaceX', rocketName, desc, d.links?.patch?.small, launchMs, performance.now() - startTime);
        return;
    } catch(e1) {
        console.warn('[SpaceX v5] failed:', e1.message);
    }

    // Strategy 2: SpaceX v4
    try {
        const res = await fetch('https://api.spacexdata.com/v4/launches/next');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const d = await res.json();
        if (!d) throw new Error('empty');

        let rocketName = 'Falcon 9';
        if (d.rocket) {
            try {
                const rr = await fetch(`https://api.spacexdata.com/v4/rockets/${d.rocket}`);
                if (rr.ok) rocketName = (await rr.json()).name || rocketName;
            } catch(_) {}
        }
        const desc = d.details ? d.details.substring(0, 180) + '...' : 'Lançamento orbital comercial SpaceX.';
        const launchMs = d.date_unix ? d.date_unix * 1000 : Date.now() + 5 * 24 * 3600 * 1000;
        applyLaunchData(d.name || 'Missão SpaceX', rocketName, desc, d.links?.patch?.small, launchMs, performance.now() - startTime);
        return;
    } catch(e2) {
        console.warn('[SpaceX v4] failed:', e2.message);
    }

    // Strategy 3: Launch Library 2 (any provider)
    try {
        const res = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1&format=json');
        if (!res.ok) throw new Error(`LL2 HTTP ${res.status}`);
        const data = await res.json();
        const launch = data.results?.[0];
        if (!launch) throw new Error('no launch');

        const rocket = launch.rocket?.configuration?.full_name || launch.rocket?.configuration?.name || 'N/A';
        const desc = launch.mission?.description?.substring(0, 180) + '...' || 'Lançamento orbital confirmado.';
        const launchMs = launch.net ? new Date(launch.net).getTime() : Date.now() + 5 * 24 * 3600 * 1000;
        applyLaunchData(launch.name || 'Próxima Missão', rocket, desc, launch.image, launchMs, performance.now() - startTime);
        return;
    } catch(e3) {
        console.warn('[LL2] failed:', e3.message);
    }

    // Fallback: simulation
    showMock();
}

function startSpacexCountdown(targetMs) {
    spacexLaunchDate = targetMs;
    if (spacexCountdownInterval) clearInterval(spacexCountdownInterval);
    
    const countdownEl = document.getElementById('spacex-countdown');
    
    function updateTimer() {
        const diff = spacexLaunchDate - Date.now();
        if (!countdownEl) return;
        if (diff <= 0) {
            countdownEl.innerText = '🚀 DECOLANDO!';
            clearInterval(spacexCountdownInterval);
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        
        const dStr = days.toString().padStart(2, '0');
        const hStr = hours.toString().padStart(2, '0');
        const mStr = mins.toString().padStart(2, '0');
        const sStr = secs.toString().padStart(2, '0');
        
        countdownEl.innerText = `${dStr}d ${hStr}h ${mStr}m ${sStr}s`;
    }
    
    updateTimer();
    spacexCountdownInterval = setInterval(updateTimer, 1000);
}

// ==========================================================================
// NOAA SPACE WEATHER — REAL-TIME DATA (Vento Solar, Kp, Flares)
// ==========================================================================

async function fetchNOAASpaceWeather() {
    const startTime = performance.now();
    try {
        // Fetch solar wind data and Kp index in parallel
        const [windRes, kpRes, flareRes] = await Promise.allSettled([
            fetch('https://services.swpc.noaa.gov/json/rtsw/rtsw_wind_1m.json'),
            fetch('https://services.swpc.noaa.gov/json/planetary_k_index_1m.json'),
            fetch('https://services.swpc.noaa.gov/json/goes/primary/xray-flares-7-day.json')
        ]);

        let updated = false;

        // ---- Solar Wind ----
        if (windRes.status === 'fulfilled' && windRes.value.ok) {
            const windData = await windRes.value.json();
            // Data is an array sorted by time, take the most recent non-null
            const recent = windData.filter(d => d.proton_speed !== null).slice(-1)[0];
            if (recent) {
                const speed = parseFloat(recent.proton_speed);
                const solarWindEl = document.getElementById('val-solar-wind');
                if (solarWindEl && !isNaN(speed)) {
                    solarWindEl.innerText = `${Math.round(speed)} km/s`;
                    solarWindEl.style.color = speed > 600 ? 'var(--color-red)' : speed > 450 ? 'var(--color-orange)' : 'var(--color-cyan)';
                }
                
                // Proton density as "flux"
                if (recent.proton_density !== null) {
                    const density = parseFloat(recent.proton_density);
                    const protonEl = document.getElementById('val-proton-flux');
                    if (protonEl && !isNaN(density)) {
                        protonEl.innerText = `${density.toFixed(1)} p/cm³`;
                        protonFluxBase = density;
                    }
                }
                solarWindBase = speed;
                updated = true;
            }
        }

        // ---- Kp Index ----
        if (kpRes.status === 'fulfilled' && kpRes.value.ok) {
            const kpData = await kpRes.value.json();
            const recentKp = kpData.filter(d => d.kp_index !== null).slice(-1)[0];
            if (recentKp) {
                const kp = parseFloat(recentKp.kp_index);
                const kpEl = document.getElementById('val-kp-index');
                const slider = document.getElementById('kp-range-slider');
                if (kpEl && !isNaN(kp)) {
                    kpEl.innerText = `Kp ${kp.toFixed(1)} (REAL)`;
                    kpEl.style.color = kp >= 7 ? 'var(--color-red)' : kp >= 5 ? 'var(--color-orange)' : 'var(--color-cyan)';
                }
                // Sync slider to real Kp without triggering the storm effects
                if (slider) {
                    const kpInt = Math.round(Math.min(9, Math.max(1, kp)));
                    slider.value = kpInt;
                    currentKpIndex = kpInt;
                    const lbl = document.getElementById('lbl-kp-slider');
                    if (lbl) lbl.innerText = `Kp ${kpInt} (Dados NOAA Reais)`;
                }
                updated = true;
            }
        }

        // ---- X-Ray Flares ----
        if (flareRes.status === 'fulfilled' && flareRes.value.ok) {
            const flareData = await flareRes.value.json();
            if (flareData && flareData.length > 0) {
                // Get the most recent flare
                const latestFlare = flareData[flareData.length - 1];
                const flareClass = latestFlare.max_class || latestFlare.class || 'B-CLASS';
                const flareEl = document.getElementById('val-solar-flare');
                if (flareEl) {
                    flareEl.innerText = `${flareClass} (NOAA)`;
                    const classLetter = flareClass.charAt(0).toUpperCase();
                    if (classLetter === 'X') {
                        flareEl.style.color = 'var(--color-red)';
                    } else if (classLetter === 'M') {
                        flareEl.style.color = 'var(--color-orange)';
                    } else {
                        flareEl.style.color = 'var(--color-emerald)';
                    }
                }
                updated = true;
            }
        }

        if (updated) {
            addConsoleLog('[NOAA] Dados reais de clima espacial atualizados: SWPC/RTSW wind + Kp + Flares.');
            // Flash visual update indicators
            ['val-solar-wind', 'val-kp-index', 'val-solar-flare', 'val-proton-flux'].forEach(id => {
                const el = document.getElementById(id);
                if (el) flashDataUpdate(el);
            });
        }
        const elapsed = performance.now() - startTime;
        addConsoleLog(`[NOAA] Uplink SWPC OK — ${elapsed.toFixed(0)}ms latência.`);

    } catch (err) {
        console.warn('[NOAA] Space weather fetch failed:', err);
        addConsoleLog('[NOAA] Falha ao conectar SWPC. Usando dados simulados do simulador local.');
    }
}

// ==========================================================================
// LAUNCH LIBRARY 2 — SpaceX / any provider fallback
// ==========================================================================
// (Primary: api.spacexdata.com; Fallback: ll.thespacedevs.com)
async function fetchNextLaunchLL2() {
    const startTime = performance.now();
    try {
        const response = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1&format=json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const launch = data.results[0];
        if (!launch) throw new Error('No launch data');

        const missionNameEl = document.getElementById('spacex-mission-name');
        const rocketNameEl = document.getElementById('spacex-rocket-name');
        const countdownEl = document.getElementById('spacex-countdown');
        const detailsEl = document.getElementById('spacex-details');
        const statusBadge = document.getElementById('spacex-status');
        const patchContainer = document.getElementById('spacex-patch-container');

        if (missionNameEl) missionNameEl.innerText = launch.name || 'Próxima Missão';
        if (rocketNameEl) rocketNameEl.innerText = `FOGUETE: ${(launch.rocket?.configuration?.name || 'N/A').toUpperCase()}`;
        if (detailsEl) detailsEl.innerText = launch.mission?.description
            ? launch.mission.description.substring(0, 180) + '...'
            : 'Lançamento comercial de satélite para órbita baixa (LEO).';
        if (statusBadge) {
            statusBadge.innerText = launch.status?.name || 'AGENDADO';
            statusBadge.className = 'badge-lock success';
        }
        if (launch.image && patchContainer) {
            patchContainer.innerHTML = `<img src="${launch.image}" style="width:36px;height:36px;object-fit:contain;border-radius:50%;">`;
        }
        if (launch.net) {
            startSpacexCountdown(new Date(launch.net).getTime());
        }
        updateApiDiag('spacex', true, performance.now() - startTime);
    } catch(err) {
        console.warn('[LL2] Launch Library fallback failed:', err);
        updateApiDiag('spacex', false, 0, err.message);
    }
}

function drawMoonPhase() {
    const canvas = document.getElementById('moon-phase-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Space background
    ctx.fillStyle = '#020409';
    ctx.fillRect(0, 0, width, height);
    
    // Tiny stars inside moon square
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 12; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.fillRect(x, y, 1, 1);
    }
    
    const refNewMoon = new Date(2000, 0, 6).getTime();
    const now = Date.now();
    const cycle = 29.530588853 * 24 * 60 * 60 * 1000;
    const phaseRatio = ((now - refNewMoon) % cycle) / cycle;
    const phasePercent = (phaseRatio * 100).toFixed(1);
    
    const r = Math.min(width, height) * 0.38;
    const cx = width / 2;
    const cy = height / 2;
    
    // Moon Dark Base
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f1422';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Moon Glow Light Base
    ctx.fillStyle = '#e0f7fa';
    
    if (phaseRatio <= 0.5) {
        // Waxing (illuminate from right)
        ctx.beginPath();
        ctx.arc(cx, cy, r, -Math.PI/2, Math.PI/2);
        ctx.fill();
        
        const k = (0.25 - phaseRatio) / 0.25;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(k) * r, r, 0, -Math.PI/2, Math.PI/2);
        ctx.fillStyle = k >= 0 ? '#0f1422' : '#e0f7fa';
        ctx.fill();
    } else {
        // Waning (illuminate from left)
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI/2, 3*Math.PI/2);
        ctx.fill();
        
        const k = (phaseRatio - 0.75) / 0.25;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(k) * r, r, 0, -Math.PI/2, Math.PI/2);
        ctx.fillStyle = k >= 0 ? '#0f1422' : '#e0f7fa';
        ctx.fill();
    }
    
    // Simulated crater details
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.beginPath();
    ctx.arc(cx - r*0.3, cy - r*0.2, r*0.12, 0, 2*Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + r*0.2, cy + r*0.4, r*0.1, 0, 2*Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - r*0.1, cy + r*0.3, r*0.15, 0, 2*Math.PI);
    ctx.fill();
    
    let phaseName = "";
    if (phaseRatio < 0.03 || phaseRatio > 0.97) phaseName = "Nova";
    else if (phaseRatio < 0.22) phaseName = "Cresc. Côncava";
    else if (phaseRatio < 0.28) phaseName = "Quarto Cresc.";
    else if (phaseRatio < 0.47) phaseName = "Cresc. Convexa";
    else if (phaseRatio < 0.53) phaseName = "Cheia";
    else if (phaseRatio < 0.72) phaseName = "Ming. Convexa";
    else if (phaseRatio < 0.78) phaseName = "Quarto Ming.";
    else phaseName = "Ming. Côncava";
    
    document.getElementById('moon-phase-name').innerText = `${phaseName.toUpperCase()} (${phasePercent}%)`;
}

function selectTelescopeView(type) {
    const loadingEl = document.getElementById('apod-loading');
    const imageEl = document.getElementById('apod-image');
    const videoEl = document.getElementById('apod-video');
    const titleEl = document.getElementById('apod-title');
    const dateEl = document.getElementById('apod-date');
    const explanationEl = document.getElementById('apod-explanation');
    const copyrightEl = document.getElementById('apod-copyright');
    
    if (loadingEl) loadingEl.style.display = 'none';
    if (videoEl) videoEl.style.display = 'none';
    imageEl.style.display = 'block';
    
    // Reset active buttons in gallery selector
    const buttons = document.querySelectorAll('.btn-lens-select');
    buttons.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-lens-${type}`);
    if (activeBtn) activeBtn.classList.add('active');

    const today = new Date().toISOString().split('T')[0];

    if (type === 'nebula') {
        imageEl.src = 'assets/telescope_obs.png';
        titleEl.innerText = '✨ Varredura de Anomalia Espectral NGC 6781 (DEEP SPACE DISCOVERY)';
        dateEl.innerText = `📅 ${formatNasaDate(today)}`;
        explanationEl.innerText = `[DETECÇÃO DE ANOMALIA - LENTE OPTICA] Esta imagem de alta resolução capturada pelo radiotelescópio orbital revela a Nebulosa Planetária NGC 6781 com uma assinatura anômala de fluxo iônico na coordenada orbital [73.4, -12.1]. A detecção foi feita utilizando filtros ópticos nas faixas H-Alpha e OIII (500nm - 600nm), revelando filamentos gasosos de plasma e poeira estelar em expansão cósmica.`;
        copyrightEl.innerText = '© Deep Space Network / Aegis Observatory';
        showToast('Telescópio: Lente Espectral Carregada.', 'fa-satellite');
    } else if (type === 'blackhole') {
        imageEl.src = 'assets/black_hole_obs.png';
        titleEl.innerText = '🕳️ Horizonte de Eventos M87* - Disco de Acreção Gravitacional';
        dateEl.innerText = `📅 ${formatNasaDate(today)}`;
        explanationEl.innerText = `[DETECÇÃO DE ANOMALIA - ANÁLISE ESPECTRAL Fe Ka] Captura de rádio interferométrica de abertura de síntese (VLBI) simulando o disco de acreção superaquecido do núcleo ativo da galáxia M87*. É possível notar o efeito de lenteamento gravitacional distorcendo a órbita de fótons ao redor do horizonte de eventos, com densidade de fluxo de 0.6 mJy.`;
        copyrightEl.innerText = '© Event Horizon / Aegis Gravitational Suite';
        showToast('Telescópio: Lente Gravitacional Carregada.', 'fa-circle');
    } else if (type === 'solar') {
        imageEl.src = 'assets/solar_flare_obs.png';
        titleEl.innerText = '☀️ Ejeção de Massa Coronal Solar (CME) - Região Ativa 12887';
        dateEl.innerText = `📅 ${formatNasaDate(today)}`;
        explanationEl.innerText = `[ALERTA DE CLIMA ESPACIAL - HELIOFÍSICA] Fotografia solar em ultravioleta extremo (composite 304A/171A) capturada pela sonda SDO, revelando uma erupção solar severa de Classe X8.9. As alças magnéticas de plasma estão sendo ejetadas a uma velocidade média de ~1450 km/s, com impactos potenciais no campo geomagnético da Terra nas próximas 24h.`;
        copyrightEl.innerText = '© SDO Heliophysics / Space Weather Joint Hub';
        showToast('Telescópio: Canal Heliofísico Carregado.', 'fa-sun');
    } else if (type === 'live') {
        fetchAPOD();
    }
}

// ---- NASA APOD (Astronomy Picture of the Day) ----
async function fetchAPOD() {
    const loadingEl = document.getElementById('apod-loading');
    const imageEl = document.getElementById('apod-image');
    const videoEl = document.getElementById('apod-video');
    const titleEl = document.getElementById('apod-title');
    const dateEl = document.getElementById('apod-date');
    const explanationEl = document.getElementById('apod-explanation');
    const copyrightEl = document.getElementById('apod-copyright');
    
    if (loadingEl) loadingEl.style.display = 'flex';
    if (imageEl) imageEl.style.display = 'none';
    if (videoEl) videoEl.style.display = 'none';
    if (titleEl) titleEl.innerText = 'Conectando com NASA APOD...';
    if (dateEl) dateEl.innerText = '';
    if (explanationEl) explanationEl.innerText = '';
    if (copyrightEl) copyrightEl.innerText = '';
    
    const startTime = performance.now();

    const applyApodData = (data, source) => {
        if (loadingEl) loadingEl.style.display = 'none';
        if (data.media_type === 'image') {
            if (imageEl) { imageEl.src = data.url || data.hdurl; imageEl.style.display = 'block'; }
        } else if (data.media_type === 'video') {
            if (videoEl) { videoEl.innerHTML = `<iframe src="${data.url}" allowfullscreen></iframe>`; videoEl.style.display = 'block'; }
        }
        if (titleEl) titleEl.innerText = data.title || 'Sem Título';
        if (dateEl) dateEl.innerText = `📅 ${formatNasaDate(data.date)}`;
        if (explanationEl) explanationEl.innerText = data.explanation || '';
        if (copyrightEl) copyrightEl.innerText = data.copyright ? `© ${data.copyright}` : 'Crédito: NASA / Domínio Público';
        showToast(`APOD carregada — ${source}`, 'fa-circle-check');
        updateApiDiag('nasa-apod', true, performance.now() - startTime);
        addConsoleLog(`[NASA APOD] Imagem astronômica recebida (${source}): "${data.title}"`);
    };

    // Strategy 1: Personal NASA API key (if provided)
    if (activeNasaApiKey !== 'DEMO_KEY') {
        try {
            const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${activeNasaApiKey}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (data.url || data.hdurl) { applyApodData(data, 'NASA API Key'); return; }
        } catch(e1) {
            console.warn('[APOD] Custom key failed:', e1.message);
        }
    }

    // Strategy 2: DEMO_KEY (NASA official, rate-limited)
    try {
        const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY`);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        const data = await res.json();
        if (data.url || data.hdurl) { applyApodData(data, 'NASA DEMO_KEY'); return; }
    } catch(e2) {
        console.warn('[APOD] DEMO_KEY failed:', e2.message);
    }

    // Strategy 3: Community APOD mirror (no key required)
    try {
        const res = await fetch('https://apod.ellanan.com/api');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.url || data.hdurl) { applyApodData(data, 'Espelho Keyless'); return; }
    } catch(e3) {
        console.warn('[APOD] Community mirror failed:', e3.message);
    }

    // Strategy 4: Offline telescope fallback
    if (loadingEl) loadingEl.style.display = 'none';
    const buttons = document.querySelectorAll('.btn-lens-select');
    buttons.forEach(b => b.classList.remove('active'));
    const nebulaBtn = document.getElementById('btn-lens-nebula');
    if (nebulaBtn) nebulaBtn.classList.add('active');

    if (imageEl) { imageEl.src = 'assets/telescope_obs.png'; imageEl.style.display = 'block'; }
    const today = new Date().toISOString().split('T')[0];
    if (titleEl) titleEl.innerText = '✨ Varredura Espectral NGC 6781 — DEEP SPACE ANOMALY';
    if (dateEl) dateEl.innerText = `📅 ${formatNasaDate(today)}`;
    if (explanationEl) explanationEl.innerText = '[CACHE AEGIS] Nebulosa Planetária NGC 6781. Assinatura anômala de fluxo iônico detectada em coordenada orbital [73.4, -12.1]. Filtros H-Alpha e OIII revelam filamentos gasosos em expansão cósmica a ~2.500 anos-luz.';
    if (copyrightEl) copyrightEl.innerText = '© Deep Space Network / Aegis Observatory / FIAP';
    showToast('NASA APOD offline. Imagem de fallback carregada.', 'fa-satellite');
    updateApiDiag('nasa-apod', false, 0, 'All APOD sources offline');
}

async function fetchNEO() {
    const container = document.getElementById('neo-container');
    container.innerHTML = `<div class="apod-loading"><div class="sat-loader-spinner"></div><span style="font-family:var(--font-mono);font-size:0.8rem;color:var(--color-cyan);">Rastreando objetos próximos...</span></div>`;
    
    const startTime = performance.now();
    try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${activeNasaApiKey}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        // Get all NEOs for today
        const neos = data.near_earth_objects[today] || [];
        
        if (neos.length === 0) {
            container.innerHTML = `<div class="apod-loading"><span style="font-family:var(--font-mono);font-size:0.8rem;color:var(--color-text-muted);">Nenhum asteroide próximo detectado para hoje.</span></div>`;
            updateApiDiag('nasa-neo', true, performance.now() - startTime);
            return;
        }
        
        // Sort by miss distance (closest first)
        neos.sort((a, b) => {
            const distA = parseFloat(a.close_approach_data[0]?.miss_distance?.kilometers || 999999999);
            const distB = parseFloat(b.close_approach_data[0]?.miss_distance?.kilometers || 999999999);
            return distA - distB;
        });
        
        container.innerHTML = '';
        
        neos.slice(0, 12).forEach((neo, i) => {
            const approach = neo.close_approach_data[0] || {};
            const distKm = parseFloat(approach.miss_distance?.kilometers || 0);
            const distLunar = parseFloat(approach.miss_distance?.lunar || 0);
            const velocity = parseFloat(approach.relative_velocity?.kilometers_per_hour || 0);
            const diamMin = parseFloat(neo.estimated_diameter?.meters?.estimated_diameter_min || 0);
            const diamMax = parseFloat(neo.estimated_diameter?.meters?.estimated_diameter_max || 0);
            const hazardous = neo.is_potentially_hazardous_asteroid;
            
            const item = document.createElement('div');
            item.className = `neo-item${hazardous ? ' hazardous' : ''}`;
            item.innerHTML = `
                <div class="neo-icon">
                    <i class="fa-solid ${hazardous ? 'fa-radiation' : 'fa-meteor'}"></i>
                </div>
                <div>
                    <div class="neo-name">${neo.name.replace(/[()]/g, '')}</div>
                    <div class="neo-meta">
                        ⌀ ${diamMin.toFixed(0)}–${diamMax.toFixed(0)}m &nbsp;·&nbsp; ${formatVelocity(velocity)} km/h
                        ${hazardous ? ' &nbsp;·&nbsp; <span style="color:var(--color-red);">POTENCIALMENTE PERIGOSO</span>' : ''}
                    </div>
                </div>
                <div class="neo-distance">
                    <div class="neo-distance-value">${formatDistance(distKm)}</div>
                    <div class="neo-distance-label">${distLunar.toFixed(1)} dist. lunares</div>
                </div>
            `;
            container.appendChild(item);
        });
        
        showToast(`${neos.length} asteroides rastreados pela NASA JPL!`, 'fa-circle-check');
        updateApiDiag('nasa-neo', true, performance.now() - startTime);
    } catch (err) {
        console.warn('NEO Error, loading offline cache data:', err);
        showToast('NEO offline. Carregando dados locais cache.', 'fa-triangle-exclamation');
        
        // Mock Near Earth Objects database
        const fallbackNeos = [
            {
                name: "99942 Apophis (2004 MN4)",
                diameterMin: 370,
                diameterMax: 370,
                velocity: 45200,
                distKm: 31800,
                distLunar: 0.08,
                hazardous: true
            },
            {
                name: "101955 Bennu (1999 RQ36)",
                diameterMin: 490,
                diameterMax: 510,
                velocity: 101000,
                distKm: 6200000,
                distLunar: 16.1,
                hazardous: true
            },
            {
                name: "2026 Aegis-FIAP (GS2026)",
                diameterMin: 120,
                diameterMax: 270,
                velocity: 68400,
                distKm: 1450000,
                distLunar: 3.8,
                hazardous: false
            },
            {
                name: "433 Eros (1898 DQ)",
                diameterMin: 16800,
                diameterMax: 16800,
                velocity: 84000,
                distKm: 22000000,
                distLunar: 57.2,
                hazardous: false
            }
        ];
        
        container.innerHTML = '';
        fallbackNeos.forEach(neo => {
            const item = document.createElement('div');
            item.className = `neo-item${neo.hazardous ? ' hazardous' : ''}`;
            item.innerHTML = `
                <div class="neo-icon">
                    <i class="fa-solid ${neo.hazardous ? 'fa-radiation' : 'fa-meteor'}"></i>
                </div>
                <div>
                    <div class="neo-name">${neo.name} <span style="font-size:0.6rem; color:var(--color-orange);">[CACHE]</span></div>
                    <div class="neo-meta">
                        ⌀ ${neo.diameterMin}–${neo.diameterMax}m &nbsp;·&nbsp; ${formatVelocity(neo.velocity)} km/h
                        ${neo.hazardous ? ' &nbsp;·&nbsp; <span style="color:var(--color-red);">POTENCIALMENTE PERIGOSO</span>' : ''}
                    </div>
                </div>
                <div class="neo-distance">
                    <div class="neo-distance-value">${formatDistance(neo.distKm)}</div>
                    <div class="neo-distance-label">${neo.distLunar.toFixed(1)} dist. lunares</div>
                </div>
            `;
            container.appendChild(item);
        });
        updateApiDiag('nasa-neo', false, 0, err.message);
    }
}

// ---- ISS Real-Time Position ----
async function fetchISS() {
    const startTime = performance.now();

    const applyISSData = (lat, lon, velocity, altitude) => {
        issLat = lat;
        issLon = lon;

        const latEl = document.getElementById('iss-lat');
        const lonEl = document.getElementById('iss-lon');
        const timeEl = document.getElementById('iss-update-time');
        const velEl = document.getElementById('iss-velocity-real');
        const altEl = document.getElementById('iss-altitude-real');

        if (latEl) latEl.innerText = `${lat.toFixed(4)}°`;
        if (lonEl) lonEl.innerText = `${lon.toFixed(4)}°`;
        if (timeEl) {
            const now = new Date();
            timeEl.innerText = `Atualizado: ${now.toUTCString().slice(17, 25)} UTC`;
        }
        if (velEl && velocity) velEl.innerText = `${Math.round(velocity).toLocaleString('pt-BR')} km/h`;
        if (altEl && altitude) altEl.innerText = `~${altitude.toFixed(1)} km`;

        updateIssMapping();
    };

    // Strategy 1: Direct call (wheretheiss.at)
    try {
        const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        applyISSData(
            parseFloat(data.latitude),
            parseFloat(data.longitude),
            parseFloat(data.velocity),      // km/h
            parseFloat(data.altitude)        // km
        );
        updateApiDiag('iss', true, performance.now() - startTime);
        return;
    } catch (err1) {
        console.warn('[ISS] Direct call failed, trying proxy:', err1.message);
    }

    // Strategy 2: Open-Notify (simpler, but lat/lon only)
    try {
        const res = await fetch('https://api.open-notify.org/iss-now.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.iss_position) {
            applyISSData(
                parseFloat(data.iss_position.latitude),
                parseFloat(data.iss_position.longitude),
                27600, // known avg speed
                408    // known avg altitude
            );
            updateApiDiag('iss', true, performance.now() - startTime);
            return;
        }
    } catch (err2) {
        console.warn('[ISS] Open-Notify also failed:', err2.message);
    }

    // Fallback: simulate movement
    issLat += (Math.random() - 0.5) * 3;
    if (issLat < -51.6 || issLat > 51.6) issLat = issLat > 0 ? 51 : -51;
    issLon += (Math.random() - 0.5) * 8;
    if (issLon < -180) issLon += 360;
    if (issLon > 180) issLon -= 360;

    applyISSData(issLat, issLon, 27600, 408);
    const timeEl = document.getElementById('iss-update-time');
    if (timeEl) timeEl.innerText = 'Simulando posição (API indisponível)';
    updateApiDiag('iss', false, 0, 'All ISS APIs failed');
}


// ---- Helper Functions for Observatory ----
function formatNasaDate(dateStr) {
    const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDistance(km) {
    if (km >= 1000000) {
        return (km / 1000000).toFixed(1) + 'M km';
    } else if (km >= 1000) {
        return (km / 1000).toFixed(0) + 'K km';
    }
    return km.toFixed(0) + ' km';
}

function formatVelocity(kmh) {
    if (!kmh) return "";
    const num = parseFloat(kmh);
    return `${Math.floor(num).toLocaleString('pt-BR')} km/h`;
}

// ==========================================================================
// UPGRADE FUNCTIONS IMPLEMENTATION
// ==========================================================================

// 1. Earth Map click vector target lock
function initMapClickCapture() {
    const overlay = document.getElementById('map-click-overlay');
    if (!overlay) return;
    
    overlay.addEventListener('click', (e) => {
        const svg = document.getElementById('ops-map');
        const rect = svg.getBoundingClientRect();
        // Calculate the relative coordinate inside the SVG (viewBox is 800 x 400)
        const x = ((e.clientX - rect.left) / rect.width) * 800;
        const y = ((e.clientY - rect.top) / rect.height) * 400;
        
        // Snapping check: Rio is at (290, 240) and Amazon is at (250, 170)
        const dRio = Math.hypot(x - 290, y - 240);
        const dAmazon = Math.hypot(x - 250, y - 170);
        
        if (dRio < 15) {
            selectHotspot('rio');
            hideTargetCrosshair();
        } else if (dAmazon < 15) {
            selectHotspot('amazon');
            hideTargetCrosshair();
        } else {
            // Manual Vector Lock
            lockTargetAt(x, y);
        }
    });
}

function lockTargetAt(x, y) {
    isTargetLocked = true;
    lockedCoords.x = x;
    lockedCoords.y = y;
    
    // Map viewBox to pseudo lat/lon for Brazil / South America
    // x = 0 is 80W, x = 800 is 0W
    // y = 0 is 10N, y = 400 is 50S
    const lon = -80 + (x / 800) * 80;
    const lat = 10 - (y / 400) * 60;
    
    lockedCoords.lat = lat;
    lockedCoords.lon = lon;
    
    // Show and position crosshair
    const crosshair = document.getElementById('map-target-crosshair');
    if (crosshair) {
        crosshair.style.display = 'block';
        crosshair.setAttribute('transform', `translate(${x}, ${y})`);
        document.getElementById('crosshair-x').setAttribute('x1', -x);
        document.getElementById('crosshair-x').setAttribute('x2', 800 - x);
        document.getElementById('crosshair-y').setAttribute('y1', -y);
        document.getElementById('crosshair-y').setAttribute('y2', 400 - y);
    }
    
    // Update Lat/Lon Display
    const formatLat = Math.abs(lat).toFixed(4) + "° " + (lat < 0 ? "S" : "N");
    const formatLon = Math.abs(lon).toFixed(4) + "° " + (lon < 0 ? "W" : "E");
    document.getElementById('hud-lat').innerText = `LAT: ${formatLat}`;
    document.getElementById('hud-lon').innerText = `LON: ${formatLon}`;
    document.getElementById('hud-alt').innerText = `ALT: ${(518 + Math.random()*15).toFixed(1)} KM`;
    document.getElementById('hud-pass').innerText = `LOCK: TARGET-VECT`;
    
    // Calculate telemetry dynamically
    updateDynamicTelemetry(lat, lon);
    
    // Update active sector name
    document.getElementById('active-sector-name').innerText = `LOCK MANUAL: Coord [${formatLat}, ${formatLon}]`;
    
    addConsoleLog(`[ORBIT] Target lock established: vectoring orbit sensor suite.`, true);
    showToast("Vetor de Varredura Travado!", "fa-crosshairs");
}

function hideTargetCrosshair() {
    isTargetLocked = false;
    const crosshair = document.getElementById('map-target-crosshair');
    if (crosshair) crosshair.style.display = 'none';
}

function updateDynamicTelemetry(lat, lon) {
    // Generate organic values using math formulas
    const baseVal = Math.sin(lat * 0.3) * Math.cos(lon * 0.2);
    
    let moisture = Math.abs(baseVal * 60) + 10; // 10% to 70%
    let tempDiff = baseVal * 5 + 1; // -4 to +6
    let precipitation = Math.abs(Math.sin(lon * 0.5) * 150); // 0 to 150 mm
    let risk = Math.min(Math.max(Math.floor(Math.abs(baseVal * 100)), 5), 98); // 5% to 98%
    
    let activeSat = "SENTINEL-1A (SAR)";
    let lbl1 = "UMIDADE DE ENCOSTA (SAR)";
    let lbl2 = "ANOMALIA TÉRMICA (TIRS)";
    let lbl3 = "ÍNDICE DE PRECIPITAÇÃO";
    let lbl4 = "PROBABILIDADE DE DESASTRE";
    
    let val1 = `${moisture.toFixed(1)}%`;
    let val2 = `${tempDiff > 0 ? '+' : ''}${tempDiff.toFixed(2)} °C`;
    let val3 = `${precipitation.toFixed(0)} mm (24h)`;
    let val4 = `${risk}% `;
    
    if (risk > 75) {
        val4 += "Risco Crítico";
    } else if (risk > 40) {
        val4 += "Risco Moderado";
    } else {
        val4 += "Estável";
    }
    
    let b1 = Math.floor(moisture);
    let b2 = Math.floor(Math.abs(tempDiff) * 15);
    let b3 = Math.floor((precipitation / 150) * 100);
    
    if (currentMapMode === 'thermal') {
        activeSat = "LANDSAT-9 (TIRS)";
        lbl1 = "TEMPERATURA SUPERFÍCIE";
        val1 = `${(22 + moisture * 0.4).toFixed(1)} °C`;
        lbl2 = "FOCOS TÉRMICOS ATIVOS";
        val2 = `${Math.floor(Math.abs(tempDiff) * 10)} detectados`;
        lbl3 = "RADIANÇA ATOMOSFÉRICA";
        val3 = `${(100 + precipitation * 3).toFixed(0)} W/m²`;
        lbl4 = "RISCO DE COMBUSTÃO";
        val4 = `${risk}% Risco Incêndio`;
        
        b1 = Math.floor(22 + moisture * 0.4);
        b2 = Math.floor(risk);
        b3 = Math.floor(moisture);
    } else if (currentMapMode === 'optical') {
        activeSat = "SENTINEL-2B (MSI)";
        lbl1 = "ÍNDICE VEGETATIVO (NDVI)";
        val1 = `${(0.1 + (moisture/70) * 0.8).toFixed(2)}`;
        lbl2 = "COBERTURA DE CANOPIA";
        val2 = `${(15 + (moisture/70) * 80).toFixed(1)}%`;
        lbl3 = "ABSORÇÃO ESTIMADA CO2";
        val3 = `${(moisture * 1.2).toFixed(1)} t/ha`;
        lbl4 = "STATUS ECOLÓGICO";
        val4 = risk > 60 ? "Deflorestação Crítica" : "Bioma Preservado";
        
        b1 = Math.floor((0.1 + (moisture/70) * 0.8) * 100);
        b2 = Math.floor(15 + (moisture/70) * 80);
        b3 = Math.floor(moisture * 1.2);
    } else if (currentMapMode === 'skywatch') {
        activeSat = "ORION-SETI (RADIO)";
        lbl1 = "RADIAÇÃO IONOSFÉRICA";
        val1 = `${(1.2 + Math.abs(tempDiff)*2.5).toFixed(1)} keV`;
        lbl2 = "FREQUÊNCIA DE CADEIA SETI";
        val2 = `1.420 GHz (HI line)`;
        lbl3 = "DENSIDADE DE FLUXO PLASMA";
        val3 = `${(10 + moisture * 2).toFixed(0)} part/cm³`;
        lbl4 = "AVALIAÇÃO DE ANOMALIA (UAP)";
        val4 = risk > 70 ? "UAP-CLASS 2 Detectada" : "Céu Limpo";
        
        b1 = Math.floor(risk);
        b2 = Math.floor(moisture);
        b3 = Math.floor(precipitation / 2);
    }
    
    document.getElementById('lbl-moisture').innerText = val1;
    document.getElementById('lbl-temp').innerText = val2;
    document.getElementById('lbl-rain').innerText = val3;
    document.getElementById('lbl-risk').innerText = val4;
    
    document.getElementById('telemetry-label-1').innerText = lbl1;
    document.getElementById('telemetry-label-2').innerText = lbl2;
    document.getElementById('telemetry-label-3').innerText = lbl3;
    document.getElementById('telemetry-label-4').innerText = lbl4;
    
    document.getElementById('lbl-moisture').style.color = (moisture > 60 && currentMapMode === 'sar') ? 'var(--color-red)' : 'var(--color-cyan)';
    document.getElementById('lbl-temp').style.color = (tempDiff > 3 && currentMapMode === 'sar') ? 'var(--color-orange)' : 'white';
    document.getElementById('lbl-risk').style.color = risk > 70 ? 'var(--color-red)' : 'var(--color-emerald)';
    
    document.getElementById('bar-optical').style.height = `${Math.max(Math.min(b1, 98), 5)}%`;
    document.getElementById('bar-radar').style.height = `${Math.max(Math.min(b2, 98), 5)}%`;
    document.getElementById('bar-thermal').style.height = `${Math.max(Math.min(b3, 98), 5)}%`;
    
    document.getElementById('sat-status').innerText = `LINK: ACTIVE (${activeSat})`;
    document.getElementById('val-sat-active').innerText = `14 / ${activeSat}`;
}

// 2. Space Weather Hub logic
function initSpaceWeather() {
    const overlay = document.createElement('div');
    overlay.className = 'solar-storm-screen-overlay';
    document.body.appendChild(overlay);
    
    setInterval(() => {
        if (isSolarStormActive) {
            solarWindBase = 650 + Math.random() * 150;
            protonFluxBase = 12 + Math.random() * 8;
        } else {
            solarWindBase = 380 + Math.random() * 50;
            protonFluxBase = 0.8 + Math.random() * 0.8;
        }
        
        const solarWindEl = document.getElementById('val-solar-wind');
        const protonEl = document.getElementById('val-proton-flux');
        
        if (solarWindEl) solarWindEl.innerText = `${solarWindBase.toFixed(0)} km/s`;
        if (protonEl) protonEl.innerText = `${protonFluxBase.toFixed(1)} MeV`;
    }, 3000);
}

function updateSpaceWeather(value) {
    currentKpIndex = parseInt(value);
    
    const sliderLabel = document.getElementById('lbl-kp-slider');
    const kpValEl = document.getElementById('val-kp-index');
    const solarStatusEl = document.getElementById('solar-status-badge');
    const flareEl = document.getElementById('val-solar-flare');
    const satStatusEl = document.getElementById('sat-status');
    
    let kpDesc = `Kp ${value}`;
    let solarStatus = "SHIELD: ACTIVE";
    let flareClass = "B-CLASS";
    
    const weatherStats = document.querySelectorAll('.weather-stat');
    weatherStats.forEach(el => el.classList.remove('critical'));
    
    if (currentKpIndex <= 3) {
        kpDesc += " (Estável)";
        kpValEl.style.color = "var(--color-cyan)";
        solarStatusEl.style.color = "var(--color-emerald)";
        solarStatusEl.innerText = "SHIELD: ACTIVE";
        flareEl.style.color = "var(--color-emerald)";
        flareEl.innerText = "B-CLASS (NORMAL)";
        
        if (isSolarStormActive) {
            isSolarStormActive = false;
            document.body.classList.remove('solar-storm-active');
            addConsoleLog("[CLIMA] Campo geomagnético restabelecido para níveis normais.");
            showToast("Campo Geomagnético Estabilizado!", "fa-shield-halved");
        }
        satStatusEl.innerText = isTargetLocked ? `LINK: ACTIVE (${currentMapMode === 'sar' ? 'SENTINEL-1A' : currentMapMode === 'thermal' ? 'LANDSAT-9' : currentMapMode === 'optical' ? 'SENTINEL-2B' : 'AEGIS-ORION'})` : `LINK: ACTIVE (${sectorData[activeSector].activeSat[currentMapMode]})`;
    } else if (currentKpIndex <= 6) {
        kpDesc += " (Ativo)";
        kpValEl.style.color = "var(--color-orange)";
        solarStatusEl.style.color = "var(--color-orange)";
        solarStatusEl.innerText = "SHIELD: WARN";
        flareEl.style.color = "var(--color-orange)";
        flareEl.innerText = "M-CLASS (MODERADO)";
        
        if (isSolarStormActive) {
            isSolarStormActive = false;
            document.body.classList.remove('solar-storm-active');
            addConsoleLog("[CLIMA] Tempestade solar severa dissipada. Ruído residual ativo.");
        }
        satStatusEl.innerText = `LINK: DEGRADED (ATTENUATED)`;
        addConsoleLog("[WARNING] Níveis de atividade solar elevados. Sinal NTN atenuado em 3dB.");
    } else {
        kpDesc += " (TEMPESTADE SEVERA)";
        kpValEl.style.color = "var(--color-red)";
        solarStatusEl.style.color = "var(--color-red)";
        solarStatusEl.innerText = "SHIELD: CRITICAL";
        flareEl.style.color = "var(--color-red)";
        flareEl.innerText = "X-CLASS (EXTREMO)";
        
        weatherStats.forEach(el => el.classList.add('critical'));
        
        if (!isSolarStormActive) {
            isSolarStormActive = true;
            document.body.classList.add('solar-storm-active');
            addConsoleLog("[CRITICAL] Tempestade Geomagnética nível G4 (Extremo) detectada!", true);
            addConsoleLog("[WARNING] Bloqueio de rádio ionosférico. Uplink satelital Aegis com flutuações eletromagnéticas severas.", true);
            showToast("ALERTA: Tempestade Solar Crítica!", "fa-circle-radiation");
        }
        satStatusEl.innerText = "WARNING: IONOSPHERIC INTERFERENCE";
    }
    
    sliderLabel.innerText = kpDesc;
}

function triggerSolarFlare() {
    const slider = document.getElementById('kp-range-slider');
    if (slider) {
        slider.value = 9;
        updateSpaceWeather(9);
        
        const xClassLevel = (1 + Math.random()*8).toFixed(1);
        addConsoleLog(`[ALERT] X-CLASS SOLAR FLARE DETECTED (Magnitude X${xClassLevel})! Proton flux spiking.`, true);
        
        const flareEl = document.getElementById('val-solar-flare');
        if (flareEl) flareEl.innerText = `X-CLASS (X${xClassLevel} FLARE)`;
        
        document.body.classList.add('solar-storm-active');
        setTimeout(() => {
            if (currentKpIndex < 7) {
                document.body.classList.remove('solar-storm-active');
            }
        }, 1200);
    }
}

// 3. SETI Radio Decrypter and Spectrogram waterfall
function initSetiWaterfall() {
    setiWaterfallCanvas = document.getElementById('seti-waterfall-canvas');
    if (!setiWaterfallCanvas) return;
    
    const rect = setiWaterfallCanvas.parentNode.getBoundingClientRect();
    setiWaterfallCanvas.width = rect.width || 320;
    setiWaterfallCanvas.height = 110;
    
    setiWaterfallCtx = setiWaterfallCanvas.getContext('2d');
    setiWaterfallCtx.fillStyle = '#010205';
    setiWaterfallCtx.fillRect(0, 0, setiWaterfallCanvas.width, setiWaterfallCanvas.height);
    
    drawSetiWaterfall();
}

function drawSetiWaterfall() {
    if (!setiWaterfallCanvas || !setiWaterfallCtx) return;
    
    const width = setiWaterfallCanvas.width;
    const height = setiWaterfallCanvas.height;
    const ctx = setiWaterfallCtx;
    
    ctx.drawImage(setiWaterfallCanvas, 0, 0, width, height - 2, 0, 2, width, height - 2);
    
    const distance = Math.abs(setiFreq - 1420);
    
    for (let x = 0; x < width; x++) {
        let val = Math.random() * 50;
        
        if (distance < 60) {
            const center = width * 0.42;
            const widthFactor = 4;
            const proximity = 1 - (distance / 60);
            const peak = 200 * proximity * Math.exp(-Math.pow(x - center, 2) / (2 * widthFactor * widthFactor));
            val += peak;
        }
        
        let hue = 240 - (val * 0.5);
        let sat = 90;
        let light = Math.min(val * 0.4, 95);
        
        ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`;
        ctx.fillRect(x, 0, 1, 2);
    }
    
    setiAnimFrameId = requestAnimationFrame(drawSetiWaterfall);
}

function updateSetiFrequency(value) {
    setiFreq = parseInt(value);
    const freqString = (setiFreq / 1000).toFixed(3) + " GHz";
    document.getElementById('val-seti-freq').innerText = freqString;
    
    const badge = document.getElementById('seti-lock-badge');
    const tuningLine = document.getElementById('seti-tuning-line');
    const decryptDisplay = document.getElementById('seti-decrypt-display');
    const decryptBtn = document.getElementById('btn-seti-decrypt');
    
    const distance = Math.abs(setiFreq - 1420);
    
    if (distance === 0) {
        isSetiSignalLocked = true;
        badge.innerText = "RF LOCK DETECTED!";
        badge.className = "badge-lock active";
        if (tuningLine) tuningLine.style.display = 'block';
        
        if (!isSetiSignalDecoded) {
            decryptDisplay.innerText = "SINAL TRAVADO EM 1.420 GHZ (LINHA DE HIDROGÊNIO). ASSINATURA EMISSIVA ESTÁVEL DETECTADA. PRONTO PARA DECODIFICAÇÃO DE PACOTES.";
            decryptDisplay.classList.add('lock-detected');
            decryptBtn.style.display = 'block';
        }
        
        showToast("Sinal Travado em 1.420 GHz!", "fa-satellite-dish");
        addConsoleLog("[SKYWATCH] Receptor DSN travado na linha de Hidrogênio (1.420 GHz). Handshake espacial ativo.");
    } else {
        isSetiSignalLocked = false;
        if (tuningLine) tuningLine.style.display = 'none';
        
        if (!isSetiSignalDecoded) {
            badge.innerText = "Aguardando Sinal";
            badge.className = "badge-lock";
            decryptDisplay.innerText = "STATUS: RUÍDO CÓSMICO DE FUNDO... AJUSTE A FREQUÊNCIA PARA A LINHA DE HIDROGÊNIO (1.420 GHZ) PARA ENTRAR EM HANDSHAKE DE RECEPÇÃO.";
            decryptDisplay.classList.remove('lock-detected');
            decryptBtn.style.display = 'none';
        } else {
            badge.innerText = "SINAL DECODIFICADO";
            badge.className = "badge-lock success";
        }
    }
}

function decryptSetiSignal() {
    if (!isSetiSignalLocked || isSetiSignalDecoded) return;
    
    isSetiSignalDecoded = true;
    const decryptDisplay = document.getElementById('seti-decrypt-display');
    const decryptBtn = document.getElementById('btn-seti-decrypt');
    const badge = document.getElementById('seti-lock-badge');
    
    decryptBtn.style.display = 'none';
    decryptDisplay.classList.remove('lock-detected');
    decryptDisplay.classList.add('decoded');
    
    const decryptedMessage = "TRANSMISSÃO DEEP SPACE INCOMING [SINAL: KEPLER-186F] >> 'AEGIS ORBITAL CORRELATION ACTIVE. DATA HARMONIZED. WE ARE WATCHING THE SHIELD. KEEP SECURING THE PLANET.' // CORRELAÇÃO DE INTEGRIDADE: 99.98%";
    let i = 0;
    
    addConsoleLog("[SKYWATCH] Iniciando decodificação de criptografia de ruído cósmico...");
    showToast("Decodificando Sinal Cósmico...", "fa-key");
    
    const interval = setInterval(() => {
        if (i < decryptedMessage.length) {
            let randChar = String.fromCharCode(33 + Math.floor(Math.random() * 50));
            decryptDisplay.innerText = decryptedMessage.substring(0, i) + randChar;
            i += 2;
        } else {
            clearInterval(interval);
            decryptDisplay.innerText = decryptedMessage;
            badge.innerText = "SINAL DECODIFICADO";
            badge.className = "badge-lock success";
            addConsoleLog("[SKYWATCH] Sinal descriptografado com sucesso da constelação Cygnus (Kepler-186f)!", true);
            showToast("Mensagem Decodificada com Sucesso!", "fa-envelope-open-text");
            
            const sightingFeed = document.querySelector('.sighting-feed');
            if (sightingFeed) {
                const newSighting = document.createElement('div');
                newSighting.className = 'sighting-item';
                newSighting.style.border = '1px solid var(--color-emerald)';
                newSighting.style.background = 'rgba(0, 255, 102, 0.03)';
                newSighting.innerHTML = `
                    <div class="sighting-icon" style="color:var(--color-emerald);"><i class="fa-solid fa-satellite-dish"></i></div>
                    <div>
                        <div class="sighting-title">Sinal Decodificado DSN — Kepler-186f</div>
                        <div class="sighting-meta">Agora mesmo · Confirmado via Orion-SETI · <span style="color:var(--color-emerald);">EXTRATERRESTRE</span></div>
                    </div>
                `;
                sightingFeed.insertBefore(newSighting, sightingFeed.firstChild);
            }
        }
    }, 20);
}

// 4. ADB Terminal commands processing
function initAdbTerminal() {
    const output = document.getElementById('adb-terminal-output');
    if (!output) return;
    
    output.innerHTML = `
        <div class="terminal-log-info">* Daemon system started successfully *</div>
        <div class="terminal-log-info">ADB Connect established: Aegis_Pixel_8_Pro_LEO (API 35)</div>
        <div class="terminal-log-info">Digite <span class="terminal-log-cmd">help</span> para listar os comandos.</div>
        <div>&nbsp;</div>
    `;
}

function handleAdbInput(e) {
    if (e.key === 'Enter') {
        const input = document.getElementById('adb-terminal-input');
        if (!input) return;
        
        const cmd = input.value.trim();
        if (cmd !== '') {
            runAdbCommand(cmd);
            adbHistory.push(cmd);
            adbHistoryIndex = adbHistory.length;
            input.value = '';
        }
    } else if (e.key === 'ArrowUp') {
        if (adbHistory.length > 0 && adbHistoryIndex > 0) {
            adbHistoryIndex--;
            document.getElementById('adb-terminal-input').value = adbHistory[adbHistoryIndex];
        }
        e.preventDefault();
    } else if (e.key === 'ArrowDown') {
        if (adbHistory.length > 0 && adbHistoryIndex < adbHistory.length - 1) {
            adbHistoryIndex++;
            document.getElementById('adb-terminal-input').value = adbHistory[adbHistoryIndex];
        } else {
            adbHistoryIndex = adbHistory.length;
            document.getElementById('adb-terminal-input').value = '';
        }
        e.preventDefault();
    }
}

function runAdbCommand(cmd) {
    const output = document.getElementById('adb-terminal-output');
    if (!output) return;
    
    const cmdLine = document.createElement('div');
    cmdLine.innerHTML = `<span style="color: var(--color-emerald);">$ adb shell</span> <span class="terminal-log-cmd">${escapeHtml(cmd)}</span>`;
    output.appendChild(cmdLine);
    
    const responseLine = document.createElement('div');
    responseLine.style.marginTop = '4px';
    responseLine.style.marginBottom = '8px';
    
    const normalizedCmd = cmd.toLowerCase().trim();
    
    if (normalizedCmd === 'help') {
        responseLine.innerHTML = `
            <div class="terminal-log-info">Comandos disponíveis:</div>
            <div style="padding-left: 10px;">
                <span class="terminal-log-cmd">help</span>                      - Mostra esta lista de ajuda.<br>
                <span class="terminal-log-cmd">adb devices</span>               - Lista os dispositivos virtuais conectados.<br>
                <span class="terminal-log-cmd">aegis ntn --status</span>        - Status de uplink satelital Direct-to-Cell.<br>
                <span class="terminal-log-cmd">aegis telemetry</span>            - Puxa dados da base local Room DB do Android.<br>
                <span class="terminal-log-cmd">aegis uap --scan</span>          - Varredura de anomalias (câmera AR do telefone).<br>
                <span class="terminal-log-cmd">aegis eco --claim</span>         - Resgata Eco-Créditos de carbono.<br>
                <span class="terminal-log-cmd">clear</span>                     - Limpa a tela do console.
            </div>
        `;
    } else if (normalizedCmd === 'adb devices') {
        responseLine.innerHTML = `
            <div class="terminal-log-info">List of devices attached</div>
            <div class="terminal-log-success">Aegis_Pixel_8_Pro_LEO&nbsp;&nbsp;&nbsp;&nbsp;device (Android 15, API 35)</div>
        `;
    } else if (normalizedCmd === 'aegis ntn --status') {
        const satName = isSolarStormActive ? "INOPERANTE" : "Aegis-LEO-3";
        const satColor = isSolarStormActive ? "var(--color-red)" : "var(--color-cyan)";
        const signalDbm = isSolarStormActive ? "-130dBm (No Signal)" : "-98dBm (Excellent)";
        const statusText = isSolarStormActive ? "WARNING: INTERFERENCE ACTIVE" : "ACTIVE (LEO Direct-to-Cell)";
        const statusColor = isSolarStormActive ? "var(--color-red)" : "var(--color-emerald)";
        
        responseLine.innerHTML = `
            <div class="terminal-log-info">[INFO] Conectando ao receptor NTN Android...</div>
            <div>Link Status: <strong style="color: ${statusColor};">${statusText}</strong></div>
            <div>Satelite LEO: <strong style="color: ${satColor};">${satName}</strong></div>
            <div>Intensidade de Sinal: <strong>${signalDbm}</strong></div>
            <div>Fila de Transmissão Offline: <strong>2 relatórios pendentes</strong></div>
        `;
    } else if (normalizedCmd === 'aegis telemetry' || normalizedCmd === 'aegis telemetry --fetch') {
        if (isTargetLocked) {
            const formatLat = Math.abs(lockedCoords.lat).toFixed(4) + "° " + (lockedCoords.lat < 0 ? "S" : "N");
            const formatLon = Math.abs(lockedCoords.lon).toFixed(4) + "° " + (lockedCoords.lon < 0 ? "W" : "E");
            responseLine.innerHTML = `
                <div class="terminal-log-info">[DATABASE] room_db::aegis_local_db::fetch_latest()</div>
                <div>[DATA] active_sector: <strong style="color: var(--color-cyan);">MANUAL VECTOR LOCK</strong></div>
                <div>[DATA] lat_lon: [${formatLat}, ${formatLon}]</div>
                <div>[DATA] moisture_sar: ${document.getElementById('lbl-moisture').innerText}</div>
                <div>[DATA] thermal_tirs: ${document.getElementById('lbl-temp').innerText}</div>
                <div>[DATA] precipitation: ${document.getElementById('lbl-rain').innerText}</div>
                <div>[DATA] hazard_risk: ${document.getElementById('lbl-risk').innerText}</div>
                <div class="terminal-log-success">[SUCCESS] Leituras extraídas do cache SQLite local com sucesso.</div>
            `;
        } else {
            const sectorName = sectorData[activeSector].name;
            const teleData = sectorData[activeSector][currentMapMode];
            responseLine.innerHTML = `
                <div class="terminal-log-info">[DATABASE] room_db::aegis_local_db::fetch_latest()</div>
                <div>[DATA] active_sector: <strong style="color: var(--color-cyan);">${sectorName}</strong></div>
                <div>[DATA] sensor_mode: ${currentMapMode.toUpperCase()}</div>
                <div>[DATA] param_1: ${teleData.lbl1}</div>
                <div>[DATA] param_2: ${teleData.lbl2}</div>
                <div>[DATA] param_3: ${teleData.lbl3}</div>
                <div>[DATA] param_4: ${teleData.lbl4}</div>
                <div class="terminal-log-success">[SUCCESS] Leituras extraídas da base Room DB com sucesso.</div>
            `;
        }
    } else if (normalizedCmd === 'aegis uap --scan') {
        const uapType = ["Spherical Orb", "Cylindrical Anomaly", "Tic-Tac Shape", "Ionospheric Flash"][Math.floor(Math.random()*4)];
        responseLine.innerHTML = `
            <div class="terminal-log-info">[SCANNER] Iniciando varredura espectral SkyWatch...</div>
            <div>[SCANNER] Eliminando Starlink constelação (1,480+ satélites filtrados)...</div>
            <div>[SCANNER] Calibrando sensores eletromagnéticos com receptor LEO...</div>
            <div class="terminal-log-warning">[UAP-DETECTION] Anomalia detectada na ionosfera!</div>
            <div>Assinatura: <strong style="color: var(--color-violet);">${uapType}</strong></div>
            <div>Coordenadas: Azimuth ${(Math.random()*360).toFixed(1)}°, Elevação ${(10 + Math.random()*70).toFixed(1)}°</div>
            <div class="terminal-log-success">[DATABASE] Room: Sighting inserido na tabela 'UapSighting' com sucesso.</div>
        `;
    } else if (normalizedCmd === 'aegis eco --claim') {
        responseLine.innerHTML = `
            <div class="terminal-log-info">[FINANCE] Solicitando validação de reflorestamento óptico via Sentinel-2...</div>
            <div>[FINANCE] Cobertura florestal regenerada validada: +8.4 Hectares (NDVI &gt; 0.72)</div>
            <div>Eco-Créditos calculados: <strong style="color: var(--color-emerald);">480 ECO Credits</strong></div>
            <div class="terminal-log-success">[SUCCESS] 480 ECO transferidos para Kalicon Amorim RM 563172. Saldo atualizado.</div>
        `;
    } else if (normalizedCmd === 'clear') {
        output.innerHTML = '';
        return;
    } else {
        responseLine.innerHTML = `
            <div class="terminal-log-error">Erro: Comando '${escapeHtml(cmd)}' não reconhecido.</div>
            <div>Digite <span class="terminal-log-cmd">help</span> para obter a lista de comandos válidos.</div>
        `;
    }
    
    output.appendChild(responseLine);
    output.scrollTop = output.scrollHeight;
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function initPhoneStars() {
    const screen = document.querySelector('.phone-screen');
    if (!screen) return;
    
    // Generate 40 twinkling stars
    for (let i = 0; i < 40; i++) {
        const star = document.createElement('div');
        star.className = 'phone-star';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        
        // Random speed between 1200ms and 3200ms
        const speed = Math.floor(Math.random() * 2000) + 1200;
        // Random delay
        const delay = Math.floor(Math.random() * 2000);
        
        star.style.animation = `phone-star-twinkle ${speed}ms infinite ease-in-out alternate`;
        star.style.animationDelay = `${delay}ms`;
        
        screen.appendChild(star);
    }
}

function updateApiDiag(apiId, success, elapsedMs = 0, errMsg = '') {
    const pingEl = document.getElementById(`ping-${apiId}`);
    const statusEl = document.getElementById(`status-${apiId}`);
    if (!pingEl || !statusEl) return;
    
    if (success) {
        pingEl.innerText = `${elapsedMs.toFixed(0)}ms`;
        pingEl.style.color = 'var(--color-emerald)';
        statusEl.innerText = 'ONLINE';
        statusEl.style.background = 'rgba(0, 255, 102, 0.1)';
        statusEl.style.color = 'var(--color-emerald)';
        statusEl.style.borderColor = 'rgba(0, 255, 102, 0.3)';
    } else {
        pingEl.innerText = '—';
        pingEl.style.color = 'var(--color-orange)';
        if (errMsg && (errMsg.includes('429') || errMsg.includes('Too Many Requests') || errMsg.includes('limit') || errMsg.includes('HTTP 429'))) {
            statusEl.innerText = 'RATE LIMIT';
            statusEl.style.background = 'rgba(255, 145, 0, 0.1)';
            statusEl.style.color = 'var(--color-orange)';
            statusEl.style.borderColor = 'rgba(255, 145, 0, 0.3)';
        } else {
            statusEl.innerText = 'OFFLINE';
            statusEl.style.background = 'rgba(255, 23, 68, 0.1)';
            statusEl.style.color = 'var(--color-red)';
            statusEl.style.borderColor = 'rgba(255, 23, 68, 0.3)';
        }
    }
    
    updateOverallApiDiag();
}

function updateOverallApiDiag() {
    const overallEl = document.getElementById('api-diagnostics-overall');
    if (!overallEl) return;
    
    const apis = ['nasa-apod', 'nasa-neo', 'spacex', 'iss', 'inmet-alerts'];
    let onlineCount = 0;
    
    apis.forEach(id => {
        const el = document.getElementById(`status-${id}`);
        if (el && el.innerText === 'ONLINE') {
            onlineCount++;
        }
    });
    
    if (onlineCount === apis.length) {
        overallEl.innerText = 'ALL LINKS ONLINE';
        overallEl.style.color = 'var(--color-emerald)';
    } else if (onlineCount > 0) {
        overallEl.innerText = `LINK DEGRADED (${onlineCount}/5)`;
        overallEl.style.color = 'var(--color-orange)';
    } else {
        overallEl.innerText = 'ALL LINKS OFFLINE';
        overallEl.style.color = 'var(--color-red)';
    }
}

// Helper: flash a DOM element with the "data received" animation
function flashDataUpdate(el) {
    if (!el) return;
    el.classList.remove('data-updated');
    void el.offsetWidth; // trigger reflow
    el.classList.add('data-updated');
    setTimeout(() => el.classList.remove('data-updated'), 1200);
}

function saveNasaKey() {
    const input = document.getElementById('input-nasa-key');
    if (!input) return;
    const key = input.value.trim();
    if (key) {
        localStorage.setItem('nasa_api_key', key);
        activeNasaApiKey = key;
        showToast('Chave API NASA salva! Reconectando ao observatório...', 'fa-key');
        addConsoleLog(`[NASA] Chave de API atualizada. Re-fetchando dados.`);
    } else {
        localStorage.removeItem('nasa_api_key');
        activeNasaApiKey = 'DEMO_KEY';
        showToast('Restaurada DEMO_KEY padrão da NASA.', 'fa-key');
    }
    // Reset observatory so it re-fetches with the new key
    observatoryInitialized = false;
    if (issInterval) { clearInterval(issInterval); issInterval = null; }
    if (spacexCountdownInterval) { clearInterval(spacexCountdownInterval); spacexCountdownInterval = null; }
    // Re-fetch immediately
    fetchAPOD();
    fetchNEO();
    fetchSpaceXLaunch();
    fetchNOAASpaceWeather();
}


// ============================================================
// WEATHER HUB — MULTI-API (Open-Meteo + OWM + WeatherAPI)
// ============================================================

// Keys stored in localStorage
let activeOWMKey  = localStorage.getItem('owm_api_key')  || '';
let activeWAPIKey = localStorage.getItem('wapi_api_key') || '';

// WMO weather code → human label
function wmoLabel(code) {
    const map = {0:'Céu Limpo',1:'Principalmente Limpo',2:'Parcialmente Nublado',3:'Nublado',
        45:'Neblina',48:'Neblina Gelada',51:'Chuvisco Leve',53:'Chuvisco Moderado',55:'Chuvisco Denso',
        61:'Chuva Leve',63:'Chuva Moderada',65:'Chuva Forte',71:'Neve Leve',73:'Neve Moderada',75:'Neve Forte',
        80:'Pancadas Leves',81:'Pancadas Moderadas',82:'Pancadas Fortes',
        95:'Tempestade',96:'Tempestade c/ Granizo',99:'Tempestade Severa'};
    return map[code] || `Cód WMO ${code}`;
}

// Wind direction degrees → compass label
function windDir(deg) {
    const dirs = ['N','NE','L','SE','S','SO','O','NO'];
    return dirs[Math.round(deg / 45) % 8];
}

// UV index → risk level
function uvLevel(uv) {
    if (uv <= 2) return {label:'Baixo', color:'var(--color-emerald)'};
    if (uv <= 5) return {label:'Moderado', color:'var(--color-cyan)'};
    if (uv <= 7) return {label:'Alto', color:'var(--color-orange)'};
    if (uv <= 10) return {label:'Muito Alto', color:'var(--color-red)'};
    return {label:'Extremo', color:'#ff00ff'};
}

// PM2.5 → AQI label
function aqiLabel(pm25) {
    if (pm25 <= 12)  return {label:'Boa',        color:'var(--color-emerald)', badge:'rgba(0,255,102,0.1)', border:'rgba(0,255,102,0.3)'};
    if (pm25 <= 35)  return {label:'Moderada',   color:'var(--color-orange)',  badge:'rgba(255,145,0,0.1)', border:'rgba(255,145,0,0.3)'};
    if (pm25 <= 55)  return {label:'Insalubre',  color:'var(--color-red)',     badge:'rgba(255,23,68,0.1)', border:'rgba(255,23,68,0.3)'};
    if (pm25 <= 150) return {label:'Muito Ruim', color:'#ff00ff',              badge:'rgba(213,0,249,0.1)', border:'rgba(213,0,249,0.3)'};
    return {label:'Perigoso', color:'var(--color-red)', badge:'rgba(255,23,68,0.15)', border:'rgba(255,23,68,0.5)'};
}

// Render forecast strip (7 days)
function renderForecastStrip(dates, maxTemps, minTemps, codes, uvMaxes) {
    const strip = document.getElementById('wx-forecast-strip');
    if (!strip) return;
    const dayNames = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    strip.innerHTML = dates.map((date, i) => {
        const d = new Date(date + 'T12:00:00');
        const dayName = i === 0 ? 'Hoje' : dayNames[d.getDay()];
        const uv = uvLevel(uvMaxes[i] || 0);
        const code = codes[i];
        // Pick icon based on WMO code
        let icon = 'fa-sun';
        if (code >= 95) icon = 'fa-cloud-bolt';
        else if (code >= 80) icon = 'fa-cloud-showers-heavy';
        else if (code >= 61) icon = 'fa-cloud-rain';
        else if (code >= 51) icon = 'fa-cloud-drizzle';
        else if (code >= 45) icon = 'fa-smog';
        else if (code >= 3)  icon = 'fa-cloud';
        else if (code >= 1)  icon = 'fa-cloud-sun';
        return `<div style="flex-shrink:0;width:56px;background:rgba(0,229,255,0.03);border:1px solid rgba(0,229,255,0.1);padding:5px 3px;text-align:center;border-radius:2px;">
            <div style="font-family:var(--font-mono);font-size:0.48rem;color:var(--color-text-muted);margin-bottom:3px;">${dayName}</div>
            <i class="fa-solid ${icon}" style="font-size:0.9rem;color:var(--color-cyan);margin-bottom:3px;display:block;"></i>
            <div style="font-family:var(--font-mono);font-size:0.62rem;font-weight:700;color:white;">${Math.round(maxTemps[i])}°</div>
            <div style="font-family:var(--font-mono);font-size:0.55rem;color:var(--color-text-muted);">${Math.round(minTemps[i])}°</div>
            <div style="font-size:0.42rem;color:${uv.color};margin-top:2px;">UV ${Math.round(uvMaxes[i] || 0)}</div>
        </div>`;
    }).join('');
}

// Main hub entry point — tries best available source
async function fetchAllWeather() {
    const statusEl = document.getElementById('weather-hub-status');
    if (statusEl) { statusEl.innerText = 'SINCRONIZANDO...'; statusEl.style.color = 'var(--color-cyan)'; }

    // Always fetch Open-Meteo (no key, always available)
    await Promise.all([
        fetchOpenMeteoWeather(),
        fetchOpenMeteoAirQuality()
    ]);

    // Try premium APIs if keys available
    if (activeWAPIKey) await fetchWeatherAPI();
    else if (activeOWMKey) await fetchOpenWeatherMap();

    if (statusEl) { statusEl.innerText = 'ATUALIZADO'; statusEl.style.color = 'var(--color-emerald)'; }
}

// ── 1. OPEN-METEO WEATHER (sem chave) ─────────────────────────
async function fetchOpenMeteoWeather() {
    const startTime = performance.now();
    try {
        const url = 'https://api.open-meteo.com/v1/forecast?' +
            'latitude=-23.5505&longitude=-46.6333&timezone=America%2FSao_Paulo' +
            '&current=temperature_2m,apparent_temperature,relative_humidity_2m,' +
            'precipitation,wind_speed_10m,wind_direction_10m,uv_index,weather_code,' +
            'surface_pressure,visibility' +
            '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,uv_index_max' +
            '&forecast_days=7';
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const d = await res.json();
        const c = d.current;

        // Main stats
        const temp    = c.temperature_2m;
        const feels   = c.apparent_temperature;
        const hum     = c.relative_humidity_2m;
        const wind    = c.wind_speed_10m;
        const windDeg = c.wind_direction_10m;
        const uv      = c.uv_index;
        const rain    = c.precipitation;
        const code    = c.weather_code;
        const pressure= c.surface_pressure;
        const vis     = c.visibility ? (c.visibility / 1000).toFixed(1) : '—';

        // Populate main grid
        const set = (id, val, color) => {
            const el = document.getElementById(id);
            if (el) { el.innerText = val; if (color) el.style.color = color; }
        };

        set('wx-temp',       `${temp.toFixed(1)}°C`);
        set('wx-condition',  wmoLabel(code));
        set('wx-feels',      `${feels.toFixed(1)}°C`);
        set('wx-humidity',   `Hum: ${hum}%`);
        set('wx-wind',       `${wind.toFixed(1)} km/h`);
        set('wx-wind-dir',   `Dir: ${windDir(windDeg)} (${Math.round(windDeg)}°)`);
        set('wx-rain',       rain.toFixed(1));
        set('wx-visibility', vis);
        set('wx-pressure',   pressure ? `${Math.round(pressure)}` : '—');

        const uvInfo = uvLevel(uv);
        set('wx-uv',       uv.toFixed(1), uvInfo.color);
        set('wx-uv-level', uvInfo.label, uvInfo.color);

        // Legacy Defesa Civil fields
        set('sp-station-temp', `${temp.toFixed(1)} °C`);
        set('sp-station-rain', `${rain.toFixed(1)} mm`);

        // Defesa Civil alert logic
        let riskText = 'BAIXO', riskColor = 'var(--color-emerald)';
        let badgeText = 'ESTÁVEL', badgeClass = 'badge-lock success';
        let descText = 'Sem riscos de alagamento ou deslizamentos previstos para as próximas 6 horas.';
        if (rain > 10 || code >= 95) {
            riskText = 'SEVERO'; riskColor = 'var(--color-red)';
            badgeText = 'ALERTA MÁXIMO'; badgeClass = 'badge-lock danger';
            descText = '[ALERTA] Tempestade severa registrada. Risco iminente de alagamentos e transbordamentos.';
            showToast('⚠ Tempestade severa detectada em São Paulo!', 'fa-cloud-showers-heavy');
        } else if (rain > 2 || code >= 51) {
            riskText = 'MEDIANO'; riskColor = 'var(--color-orange)';
            badgeText = 'ATENÇÃO'; badgeClass = 'badge-lock warning';
            descText = '[AVISO CGE] Chuva moderada ativa. Atenção para pontos críticos e áreas de encosta.';
        }
        set('sp-disaster-risk', `${riskText} (${rain.toFixed(1)}mm)`, riskColor);
        const badge = document.getElementById('sp-alert-badge');
        if (badge) { badge.innerText = badgeText; badge.className = badgeClass; }
        set('sp-alert-desc', descText);

        // Source label
        set('weather-source-label', 'Open-Meteo (sem chave)');

        // Forecast 7-day strip
        if (d.daily) {
            renderForecastStrip(
                d.daily.time,
                d.daily.temperature_2m_max,
                d.daily.temperature_2m_min,
                d.daily.weather_code,
                d.daily.uv_index_max || new Array(7).fill(0)
            );
        }

        const elapsed = performance.now() - startTime;
        updateApiDiag('inmet-alerts', true, elapsed);
        flashDataUpdate(document.getElementById('weather-hub-panel'));
        addConsoleLog(`[OPEN-METEO] Clima SP: ${temp.toFixed(1)}°C, ${wmoLabel(code)}, UV ${uv.toFixed(1)}, Vento ${wind.toFixed(1)} km/h`, false);

    } catch (err) {
        console.error('Open-Meteo weather error:', err);
        updateApiDiag('inmet-alerts', false, 0, err.message);
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
        set('wx-temp', 'Offline'); set('wx-condition', 'Sem dados');
    }
}

// ── 2. OPEN-METEO AIR QUALITY (sem chave) ─────────────────────
async function fetchOpenMeteoAirQuality() {
    const startTime = performance.now();
    try {
        const url = 'https://air-quality-api.open-meteo.com/v1/air-quality?' +
            'latitude=-23.5505&longitude=-46.6333&timezone=America%2FSao_Paulo' +
            '&current=pm2_5,pm10,ozone,nitrogen_dioxide,uv_index';
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const d = await res.json();
        const c = d.current;

        const pm25 = c.pm2_5 ?? 0;
        const pm10 = c.pm10 ?? 0;
        const no2  = c.nitrogen_dioxide ?? 0;
        const oz   = c.ozone ?? 0;

        const set = (id, val, color) => {
            const el = document.getElementById(id);
            if (el) { el.innerText = val; if (color) el.style.color = color; }
        };

        const aqi = aqiLabel(pm25);
        set('wx-pm25',  pm25.toFixed(1), aqi.color);
        set('wx-pm10',  pm10.toFixed(1));
        set('wx-no2',   no2.toFixed(1));
        set('wx-ozone', oz.toFixed(1));

        const badge = document.getElementById('wx-aqi-badge');
        if (badge) {
            badge.innerText = aqi.label;
            badge.style.color = aqi.color;
            badge.style.background = aqi.badge;
            badge.style.borderColor = aqi.border;
        }

        const elapsed = performance.now() - startTime;
        updateApiDiag('openmeteo-aq', true, elapsed);
        addConsoleLog(`[OPEN-METEO AQ] PM2.5: ${pm25.toFixed(1)} µg/m³ — Qualidade: ${aqi.label}`, false);

    } catch (err) {
        console.error('Open-Meteo AQ error:', err);
        updateApiDiag('openmeteo-aq', false, 0, err.message);
    }
}

// ── 3. OPENWEATHERMAP (requer chave) ──────────────────────────
async function fetchOpenWeatherMap() {
    if (!activeOWMKey) return;
    const startTime = performance.now();
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=-23.5505&lon=-46.6333&appid=${activeOWMKey}&units=metric&lang=pt_br`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const d = await res.json();

        const set = (id, val, color) => {
            const el = document.getElementById(id);
            if (el) { el.innerText = val; if (color) el.style.color = color; }
        };

        set('wx-temp',      `${d.main.temp.toFixed(1)}°C`);
        set('wx-condition', d.weather[0]?.description || '—');
        set('wx-feels',     `${d.main.feels_like.toFixed(1)}°C`);
        set('wx-humidity',  `Hum: ${d.main.humidity}%`);
        set('wx-wind',      `${(d.wind.speed * 3.6).toFixed(1)} km/h`);
        set('wx-wind-dir',  `Dir: ${windDir(d.wind.deg || 0)} (${d.wind.deg || 0}°)`);
        set('wx-rain',      (d.rain?.['1h'] || 0).toFixed(1));
        set('wx-pressure',  String(d.main.pressure));
        set('wx-visibility',d.visibility ? (d.visibility / 1000).toFixed(1) : '—');
        set('weather-source-label', 'OpenWeatherMap');
        set('sp-station-temp', `${d.main.temp.toFixed(1)} °C`);
        set('sp-station-rain', `${(d.rain?.['1h'] || 0).toFixed(1)} mm`);

        const elapsed = performance.now() - startTime;
        updateApiDiag('owm', true, elapsed);
        addConsoleLog(`[OWM] ${d.name}: ${d.main.temp.toFixed(1)}°C, ${d.weather[0]?.description}`, false);

    } catch (err) {
        console.error('OpenWeatherMap error:', err);
        updateApiDiag('owm', false, 0, err.message);
        if (err.message.includes('401')) showToast('Chave OpenWeatherMap inválida!', 'fa-triangle-exclamation');
    }
}

// ── 4. WEATHERAPI.COM (requer chave — UV + Lua + Alertas) ─────
async function fetchWeatherAPI() {
    if (!activeWAPIKey) return;
    const startTime = performance.now();
    try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${activeWAPIKey}&q=-23.5505,-46.6333&days=7&aqi=yes&alerts=yes&lang=pt`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const d = await res.json();

        const c   = d.current;
        const f   = d.forecast?.forecastday?.[0];
        const day = f?.day;
        const ast = f?.astro;

        const set = (id, val, color) => {
            const el = document.getElementById(id);
            if (el) { el.innerText = val; if (color) el.style.color = color; }
        };

        set('wx-temp',       `${c.temp_c.toFixed(1)}°C`);
        set('wx-condition',  c.condition?.text || '—');
        set('wx-feels',      `${c.feelslike_c.toFixed(1)}°C`);
        set('wx-humidity',   `Hum: ${c.humidity}%`);
        set('wx-wind',       `${c.wind_kph.toFixed(1)} km/h`);
        set('wx-wind-dir',   `Dir: ${c.wind_dir} (${c.wind_degree}°)`);
        set('wx-rain',       (c.precip_mm || 0).toFixed(1));
        set('wx-pressure',   String(c.pressure_mb));
        set('wx-visibility', c.vis_km?.toFixed(1) || '—');

        const uvInfo = uvLevel(c.uv);
        set('wx-uv',       c.uv.toFixed(1), uvInfo.color);
        set('wx-uv-level', uvInfo.label, uvInfo.color);

        set('weather-source-label', 'WeatherAPI.com ★');
        set('sp-station-temp', `${c.temp_c.toFixed(1)} °C`);
        set('sp-station-rain', `${(day?.totalprecip_mm || 0).toFixed(1)} mm`);

        // Air quality from WeatherAPI
        if (c.air_quality) {
            const pm25 = c.air_quality.pm2_5 || 0;
            const aqi  = aqiLabel(pm25);
            set('wx-pm25',  pm25.toFixed(1), aqi.color);
            set('wx-pm10',  (c.air_quality.pm10 || 0).toFixed(1));
            set('wx-no2',   (c.air_quality.no2 || 0).toFixed(1));
            set('wx-ozone', (c.air_quality.o3 || 0).toFixed(1));
            const badge = document.getElementById('wx-aqi-badge');
            if (badge) { badge.innerText = aqi.label; badge.style.color = aqi.color; }
        }

        // Moon phase + sunrise/sunset
        const extras = document.getElementById('wapi-extras');
        if (extras) extras.style.display = 'block';
        if (ast) {
            set('wapi-moon',    ast.moon_phase || '—');
            set('wapi-sunrise', ast.sunrise || '—');
            set('wapi-sunset',  ast.sunset  || '—');
        }

        // Forecast strip from WeatherAPI
        if (d.forecast?.forecastday) {
            const days = d.forecast.forecastday;
            renderForecastStrip(
                days.map(x => x.date),
                days.map(x => x.day.maxtemp_c),
                days.map(x => x.day.mintemp_c),
                days.map(x => x.day.condition?.code || 0),
                days.map(x => x.day.uv || 0)
            );
        }

        // Alerts
        const alerts = d.alerts?.alert || [];
        const alertsBox = document.getElementById('wapi-alerts-box');
        const alertsText = document.getElementById('wapi-alerts-text');
        if (alerts.length > 0 && alertsBox && alertsText) {
            alertsBox.style.display = 'block';
            alertsText.innerText = alerts.map(a => `• ${a.headline}`).join('\n');
            showToast(`⚠ ${alerts.length} alerta(s) meteorológico(s) ativo(s)!`, 'fa-triangle-exclamation');
        }

        const elapsed = performance.now() - startTime;
        updateApiDiag('wapi', true, elapsed);
        flashDataUpdate(document.getElementById('weather-hub-panel'));
        addConsoleLog(`[WEATHERAPI] ${d.location?.name}: ${c.temp_c.toFixed(1)}°C, UV ${c.uv}, Lua: ${ast?.moon_phase || '—'}`, false);

    } catch (err) {
        console.error('WeatherAPI error:', err);
        updateApiDiag('wapi', false, 0, err.message);
        if (err.message.includes('401') || err.message.includes('403')) {
            showToast('Chave WeatherAPI inválida!', 'fa-triangle-exclamation');
        }
    }
}

// ── 5. SAVE WEATHER KEYS ──────────────────────────────────────
function saveWeatherKey(provider) {
    if (provider === 'owm') {
        const key = document.getElementById('input-owm-key')?.value?.trim();
        if (!key) { showToast('Digite a chave OpenWeatherMap!', 'fa-triangle-exclamation'); return; }
        activeOWMKey = key;
        localStorage.setItem('owm_api_key', key);
        document.getElementById('input-owm-key').value = '';
        updateApiDiag('owm', null, 0, null, 'CHAVE SALVA');
        showToast('✅ Chave OpenWeatherMap salva! Atualizando...', 'fa-circle-check');
        fetchOpenWeatherMap();
    } else if (provider === 'wapi') {
        const key = document.getElementById('input-wapi-key')?.value?.trim();
        if (!key) { showToast('Digite a chave WeatherAPI!', 'fa-triangle-exclamation'); return; }
        activeWAPIKey = key;
        localStorage.setItem('wapi_api_key', key);
        document.getElementById('input-wapi-key').value = '';
        updateApiDiag('wapi', null, 0, null, 'CHAVE SALVA');
        showToast('✅ Chave WeatherAPI salva! Atualizando...', 'fa-circle-check');
        fetchWeatherAPI();
    }
}

// ── 6. LEGACY ALIAS (compatibilidade com botões antigos) ──────
async function fetchSpWeatherAlerts() {
    await fetchAllWeather();
}

function triggerEmergencyAlertSP() {
    const modal = document.getElementById('defesa-civil-modal');
    if (!modal) return;
    
    modal.style.display = 'flex';
    showToast('Simulador de Tempestade da Defesa Civil Iniciado.', 'fa-triangle-exclamation');
    
    // Set default sliders for a critical simulation when triggered manually
    document.getElementById('sim-slider-rain').value = 95;
    document.getElementById('sim-slider-moisture').value = 85;
    document.getElementById('sim-slider-slope').value = 35;
    document.getElementById('sim-slider-urban').value = 75;
    
    updatePredictiveRisk();
}

function closeEmergencyAlertSP() {
    const modal = document.getElementById('defesa-civil-modal');
    if (modal) modal.style.display = 'none';
}

function triggerSirensSP() {
    closeEmergencyAlertSP();
    
    // Print to logs terminal
    addConsoleLog('[DEFESA CIVIL] ALERTA DE EVACUAÇÃO EMITIDO. Modulando rádio DSN e ativando sirenes civis na frequência 142.5 MHz no setor periférico.', true);
    addConsoleLog('[TELEMETRIA] Sirenes ativadas em 12 subestações comunitárias. Envio de equipes de resgate preventivo terrestres iniciado.', true);
    
    showToast('Sirenes preventivas acionadas em São Paulo!', 'fa-bullhorn');
    speakText("Defesa Civil acionada. Sirenes ativadas em doze subestações comunitárias e equipes terrestres enviadas.");
}

// ==========================================================================
// PREDICTIVE RISK ENGINE, SPEECH API & ISS MAPPING IMPLEMENTATION
// ==========================================================================

function updatePredictiveRisk() {
    const rain = parseInt(document.getElementById('sim-slider-rain').value);
    const moisture = parseInt(document.getElementById('sim-slider-moisture').value);
    const slope = parseInt(document.getElementById('sim-slider-slope').value);
    const urban = parseInt(document.getElementById('sim-slider-urban').value);
    
    document.getElementById('val-sim-slider-rain').innerText = `${rain} mm`;
    document.getElementById('val-sim-slider-moisture').innerText = `${moisture}%`;
    document.getElementById('val-sim-slider-slope').innerText = `${slope}°`;
    document.getElementById('val-sim-slider-urban').innerText = `${urban}%`;
    
    const rainFactor = (rain / 150) * 100 * 0.35;
    const moistureFactor = moisture * 0.35;
    const slopeFactor = (slope / 60) * 100 * 0.20;
    const urbanFactor = urban * 0.10;
    
    let risk = Math.min(100, Math.max(0, Math.round(rainFactor + moistureFactor + slopeFactor + urbanFactor)));
    
    const percentEl = document.getElementById('sim-risk-percent');
    const badgeEl = document.getElementById('sim-risk-badge');
    const levelLabelEl = document.getElementById('sim-risk-level-label');
    const descEl = document.getElementById('emergency-modal-desc');
    const statusDC = document.getElementById('defesa-civil-status');
    const spDisasterRisk = document.getElementById('sp-disaster-risk');
    const spAlertBadge = document.getElementById('sp-alert-badge');
    const spAlertDesc = document.getElementById('sp-alert-desc');
    
    if (percentEl) {
        percentEl.innerText = `${risk}%`;
        if (risk < 30) percentEl.style.color = 'var(--color-emerald)';
        else if (risk < 60) percentEl.style.color = 'var(--color-cyan)';
        else if (risk < 80) percentEl.style.color = 'var(--color-orange)';
        else percentEl.style.color = 'var(--color-red)';
    }
    
    let label = 'GRAU: BAIXO (NÍVEL 0)';
    let badgeText = 'ESTÁVEL';
    let badgeClass = 'badge-lock success';
    let desc = '[SIMULAÇÃO] Condições climáticas e geográficas normais. Nenhum risco de desastre detectado no momento.';
    
    if (risk >= 80) {
        label = 'GRAU: EM EMERGÊNCIA / CRÍTICO (NÍVEL 3)';
        badgeText = 'EMERGÊNCIA MÁXIMA';
        badgeClass = 'badge-lock danger';
        if (slope >= 20) {
            desc = `[SIMULAÇÃO CRÍTICA] Alto acúmulo de chuvas (${rain}mm) em encosta íngreme (${slope}°). Risco de DESLIZAMENTO DE TERRA crítico e iminente no setor periférico de encostas! Recomenda-se evacuação imediata.`;
        } else {
            desc = `[SIMULAÇÃO CRÍTICA] Chuva extrema (${rain}mm) associada a solo altamente impermeabilizado (${urban}%). Risco crítico de INUNDAÇÃO URBANA E ENXURRADA rápida! Prepare sistemas de drenagem e rotas de fuga.`;
        }
    } else if (risk >= 60) {
        label = 'GRAU: SEVERO (NÍVEL 2)';
        badgeText = 'ALERTA MÁXIMO';
        badgeClass = 'badge-lock danger';
        desc = `[SIMULAÇÃO SEVERA] Parâmetros de risco elevados (${risk}%). Risco substancial de ${slope >= 20 ? 'deslizamento de terra em encostas de risco' : 'alagamentos em áreas de baixada'}. Defesa Civil em estado de prontidão.`;
    } else if (risk >= 30) {
        label = 'GRAU: ATENÇÃO (NÍVEL 1)';
        badgeText = 'RISCO ATENÇÃO';
        badgeClass = 'badge-lock warning';
        desc = `[SIMULAÇÃO OPERACIONAL] Solo úmido (${moisture}%) com chuva persistente. Vias públicas podem sofrer acúmulos pontuais de água. Recomenda-se atenção ao trafegar em áreas baixas.`;
    }
    
    if (badgeEl) {
        badgeEl.innerText = badgeText;
        badgeEl.className = badgeClass;
    }
    if (levelLabelEl) levelLabelEl.innerText = label;
    if (descEl) descEl.innerText = desc;
    
    // Also sync values with the mini dashboard widget in real-time
    if (spDisasterRisk) {
        spDisasterRisk.innerText = `${risk}% (Simulando)`;
        spDisasterRisk.style.color = (risk >= 60) ? 'var(--color-red)' : (risk >= 30) ? 'var(--color-orange)' : 'var(--color-emerald)';
    }
    if (spAlertBadge) {
        spAlertBadge.innerText = badgeText;
        spAlertBadge.className = badgeClass;
    }
    if (spAlertDesc) {
        spAlertDesc.innerText = desc;
    }
    if (statusDC) {
        statusDC.innerText = (risk >= 60) ? 'ALERTA CRÍTICO' : (risk >= 30) ? 'ESTADO ATENÇÃO' : 'SISTEMA ESTÁVEL';
        statusDC.style.color = (risk >= 60) ? 'var(--color-red)' : (risk >= 30) ? 'var(--color-orange)' : 'var(--color-emerald)';
    }

    // Trigger sirens display update
    const sirensBtn = document.getElementById('btn-sim-sirens');
    if (sirensBtn) {
        sirensBtn.style.display = (risk >= 60) ? 'block' : 'none';
    }
    
    drawPredictiveChart(risk);
}

function drawPredictiveChart(risk) {
    const canvas = document.getElementById('sim-risk-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw background grid lines
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < width; i += width / 6) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
    }
    for (let j = 0; j < height; j += height / 4) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
    }
    
    // Generate data points
    const points = [];
    const steps = 6;
    for (let i = 0; i <= steps; i++) {
        let hourVal = risk + Math.sin(i * 0.8) * 15 + (i * 2);
        hourVal = Math.min(100, Math.max(5, hourVal));
        points.push({
            x: (i / steps) * width,
            y: height - (hourVal / 100) * (height - 15) - 5
        });
    }
    
    // Draw curve
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        const xc = (points[i-1].x + points[i].x) / 2;
        const yc = (points[i-1].y + points[i].y) / 2;
        ctx.quadraticCurveTo(points[i-1].x, points[i-1].y, xc, yc);
    }
    ctx.lineTo(points[points.length-1].x, points[points.length-1].y);
    
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, 'var(--color-cyan)');
    grad.addColorStop(0.5, 'var(--color-orange)');
    grad.addColorStop(1, 'var(--color-red)');
    
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    
    // Fill area below the curve
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        const xc = (points[i-1].x + points[i].x) / 2;
        const yc = (points[i-1].y + points[i].y) / 2;
        ctx.quadraticCurveTo(points[i-1].x, points[i-1].y, xc, yc);
    }
    ctx.lineTo(points[points.length-1].x, points[points.length-1].y);
    ctx.lineTo(width, height);
    ctx.closePath();
    
    const fillGrad = ctx.createLinearGradient(0, 0, 0, height);
    fillGrad.addColorStop(0, risk >= 60 ? 'rgba(255, 23, 68, 0.15)' : 'rgba(0, 229, 255, 0.12)');
    fillGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = fillGrad;
    ctx.fill();
    
    // Draw nodes
    ctx.fillStyle = 'white';
    points.forEach((p, idx) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, idx === 0 ? 4 : 2, 0, 2 * Math.PI);
        ctx.fill();
        
        if (idx === 0) {
            ctx.fillStyle = 'var(--color-cyan)';
            ctx.font = '7px Share Tech Mono, monospace';
            ctx.fillText('AGORA', p.x + 6, p.y - 2);
        }
    });
}

// Speech Synthesis TTS Helper
function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}

// Toggle Voice Uplink
function toggleVoiceUplink() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        showToast('API de Voz não suportada.', 'fa-circle-exclamation');
        return;
    }
    
    const micBtn = document.getElementById('btn-voice-uplink');
    
    if (isVoiceUplinkActive) {
        isVoiceUplinkActive = false;
        if (voiceRecognition) {
            voiceRecognition.stop();
        }
        if (micBtn) micBtn.classList.remove('mic-active');
        showToast('Uplink de voz encerrado.', 'fa-microphone-slash');
        addConsoleLog('[VOICE] Reconhecimento de voz desativado.');
        return;
    }
    
    isVoiceUplinkActive = true;
    if (micBtn) micBtn.classList.add('mic-active');
    
    if (!voiceRecognition) {
        voiceRecognition = new SpeechRecognition();
        voiceRecognition.continuous = true;
        voiceRecognition.interimResults = false;
        voiceRecognition.lang = 'pt-BR';
        
        voiceRecognition.onstart = () => {
            addConsoleLog('[VOICE] Uplink ativo. Diga um comando operacional...');
            showToast('Uplink de Voz Ativo. Aguardando comandos...', 'fa-microphone');
            speakText("Uplink de voz estabelecido. Diga um comando.");
        };
        
        voiceRecognition.onend = () => {
            if (isVoiceUplinkActive) {
                try {
                    voiceRecognition.start();
                } catch(e) {}
            } else {
                if (micBtn) micBtn.classList.remove('mic-active');
            }
        };
        
        voiceRecognition.onerror = (e) => {
            console.error('Speech Recognition Error:', e);
            if (e.error === 'not-allowed') {
                showToast('Permissão de microfone negada.', 'fa-microphone-slash');
                isVoiceUplinkActive = false;
                if (micBtn) micBtn.classList.remove('mic-active');
            }
        };
        
        voiceRecognition.onresult = (event) => {
            const resultIndex = event.resultIndex;
            const transcript = event.results[resultIndex][0].transcript.trim().toLowerCase();
            
            addConsoleLog(`[VOICE INPUT] "${transcript}"`);
            processVoiceCommand(transcript);
        };
    }
    
    try {
        voiceRecognition.start();
    } catch (err) {
        console.warn('Voice recognition start err:', err);
    }
}

function processVoiceCommand(cmd) {
    if (cmd.includes('radar') || cmd.includes('chuva') || cmd.includes('alagamento')) {
        changeMapMode('sar');
        speakText("Alterando filtro para Radar de Abertura Sintética.");
    } else if (cmd.includes('térmica') || cmd.includes('calor') || cmd.includes('incêndio') || cmd.includes('térmico')) {
        changeMapMode('thermal');
        speakText("Filtro térmico ativado. Monitorando focos de calor.");
    } else if (cmd.includes('óptica') || cmd.includes('visual') || cmd.includes('floresta') || cmd.includes('óptico')) {
        changeMapMode('optical');
        speakText("Varredura multiespectral óptica estabelecida.");
    } else if (cmd.includes('seti') || cmd.includes('skywatch') || cmd.includes('espacial') || cmd.includes('sinal')) {
        changeMapMode('skywatch');
        speakText("Canal SkyWatch ativo. Receptor de rádio online.");
    }
    
    else if (cmd.includes('simular alerta') || cmd.includes('simular tempestade') || cmd.includes('defesa civil') || cmd.includes('simulação')) {
        triggerEmergencyAlertSP();
        speakText("Iniciando simulador climático da Defesa Civil. Risco crítico projetado.");
    }
    
    else if (cmd.includes('sintonizar sinal') || cmd.includes('sintonizar frequência') || cmd.includes('um quatro dois zero') || cmd.includes('hidrogênio') || cmd.includes('sintonizar')) {
        changeMapMode('skywatch');
        const slider = document.getElementById('seti-freq-slider');
        if (slider) {
            slider.value = 1420;
            updateSetiFrequency(1420);
            speakText("Frequência de hidrogênio sintonizada. Decodificando sinal espacial.");
            setTimeout(() => {
                decryptSetiSignal();
            }, 1000);
        }
    }
    
    else if (cmd.includes('status da rede') || cmd.includes('diagnóstico') || cmd.includes('conexão') || cmd.includes('status')) {
        const statuses = ['nasa-apod', 'nasa-neo', 'spacex', 'iss', 'inmet-alerts'];
        let onlineCount = 0;
        statuses.forEach(id => {
            const statusText = document.getElementById(`status-${id}`)?.innerText;
            if (statusText && statusText.includes('ONLINE')) onlineCount++;
        });
        
        const report = `Diagnóstico: ${onlineCount} de 5 links estão ativos no painel.`;
        speakText(report);
        addConsoleLog(`[VOICE SYSTEM] ${report}`);
    } else {
        showToast(`Comando não reconhecido: "${cmd}"`, 'fa-microphone-lines');
    }
}

// Toggle ISS Live tracking
function toggleIssTracking() {
    isIssTrackingActive = !isIssTrackingActive;
    
    const btn = document.getElementById('btn-toggle-iss');
    const icon = document.getElementById('iss-toggle-icon');
    const hudStatus = document.getElementById('hud-iss-status');
    const satNode = document.getElementById('satellite-node');
    
    if (isIssTrackingActive) {
        btn.classList.add('iss-active');
        btn.querySelector('span').innerText = "RASTREAMENTO REAL ATIVO";
        addConsoleLog('[ORBIT] Modo de rastreamento real ativo. Capturando vetor orbital da ISS.');
        showToast('Rastreamento ISS ativo!', 'fa-satellite');
        speakText("Rastreamento real da Estação Espacial ativado.");
        
        fetchISS();
    } else {
        btn.classList.remove('iss-active');
        btn.querySelector('span').innerText = "RASTREAR ISS REAL";
        if (hudStatus) hudStatus.style.display = 'none';
        if (satNode) {
            satNode.style.display = 'block';
        }
        addConsoleLog('[ORBIT] Retornando ao modo de órbita simulada.');
        showToast('Retornando à órbita padrão.', 'fa-satellite-dish');
        speakText("Retornando ao simulador de órbita padrão.");
        
        isOverBrazilLogTriggered = false;
    }
}

function updateIssMapping() {
    if (!isIssTrackingActive) return;
    
    const hudStatus = document.getElementById('hud-iss-status');
    const satNode = document.getElementById('satellite-node');
    const hudPass = document.getElementById('hud-pass');
    
    const inLatRange = (issLat >= -50 && issLat <= 10);
    const inLonRange = (issLon >= -80 && issLon <= 0);
    
    const formattedLat = Math.abs(issLat).toFixed(4) + "° " + (issLat < 0 ? "S" : "N");
    const formattedLon = Math.abs(issLon).toFixed(4) + "° " + (issLon < 0 ? "W" : "E");
    
    document.getElementById('hud-lat').innerText = `LAT: ${formattedLat}`;
    document.getElementById('hud-lon').innerText = `LON: ${formattedLon}`;
    document.getElementById('hud-alt').innerText = `ALT: 418.6 KM`;
    
    if (inLatRange && inLonRange) {
        if (hudStatus) hudStatus.style.display = 'none';
        hudPass.innerText = "REAL-TIME PASS: ISS";
        
        const x = (issLon + 80) * 10;
        const y = (10 - issLat) * 6.6667;
        
        if (satNode) {
            satNode.style.display = 'block';
            satNode.setAttribute('transform', `translate(${x}, ${y})`);
        }
        
        if (issLat >= -33 && issLat <= 5 && issLon >= -74 && issLon <= -35) {
            if (!isOverBrazilLogTriggered) {
                isOverBrazilLogTriggered = true;
                addConsoleLog("[UPLINK] ISS cruzando território brasileiro. Estabelecendo canal de varredura direta.", true);
                showToast("ISS cruzando o espaço aéreo brasileiro!", "fa-satellite");
                speakText("Estação Espacial Internacional cruzando o território brasileiro. Canal de varredura direta ativo.");
            }
        } else {
            isOverBrazilLogTriggered = false;
        }
    } else {
        hudPass.innerText = "LINK: RELAY (ISS OFF-RANGE)";
        if (hudStatus) {
            hudStatus.style.display = 'block';
            hudStatus.innerHTML = `<i class="fa-solid fa-satellite-dish" style="animation: pulse-slow 1s infinite alternate;"></i> ISS FORA DE ALCANCE [Lat: ${formattedLat}, Lon: ${formattedLon}]`;
        }
        if (satNode) {
            satNode.style.display = 'none';
        }
        isOverBrazilLogTriggered = false;
    }
}

// ===========================================================
// AEGIS-ORBIT — MÓDULO DE ROTAS DE FUGA
// Leaflet.js + OpenStreetMap + OSRM Routing + Geolocation
// ===========================================================

let escapeMap = null;
let escapeMapInitialized = false;
let userMarker = null;
let userLatLng = null;
let routeLayer = null;
let riskZonesLayer = null;
let shelterMarkers = [];
let riskZonesVisible = true;
let currentDisasterType = 'flood';
let destinationShelter = null;
let escapeGeoWatchId = null;

// São Paulo Emergency Shelters Database
const SP_SHELTERS = [
    {
        id: 'hmlmb',
        name: 'Hospital Maternidade Leonor Mendes de Barros',
        short: 'HMLMB',
        lat: -23.5177, lng: -46.6061,
        type: 'hospital',
        capacity: 850,
        phone: '(11) 2089-7600',
        address: 'R. da Penha, 1297 - Vila Guilherme, SP'
    },
    {
        id: 'hc',
        name: 'Hospital das Clínicas — USP',
        short: 'Hospital das Clínicas',
        lat: -23.5567, lng: -46.6696,
        type: 'hospital',
        capacity: 2500,
        phone: '(11) 2661-0000',
        address: 'Av. Dr. Enéas Carvalho de Aguiar, 255 - Cerqueira César, SP'
    },
    {
        id: 'santacasa',
        name: 'Santa Casa de Misericórdia de São Paulo',
        short: 'Santa Casa SP',
        lat: -23.5401, lng: -46.6410,
        type: 'hospital',
        capacity: 1100,
        phone: '(11) 2176-7000',
        address: 'R. Dr. Cesário Mota Júnior, 112 - Santa Cecília, SP'
    },
    {
        id: 'unifesp',
        name: 'Hospital São Paulo — UNIFESP',
        short: 'Hospital São Paulo',
        lat: -23.5971, lng: -46.6406,
        type: 'hospital',
        capacity: 780,
        phone: '(11) 5576-4000',
        address: 'R. Napoleão de Barros, 715 - Vila Clementino, SP'
    },
    {
        id: 'ibirapuera',
        name: 'Parque Ibirapuera — Ponto de Encontro',
        short: 'Parque Ibirapuera',
        lat: -23.5874, lng: -46.6576,
        type: 'shelter',
        capacity: 50000,
        phone: '199 (Defesa Civil)',
        address: 'Av. Pedro Álvares Cabral, s/n - Vila Mariana, SP'
    },
    {
        id: 'expo',
        name: 'Expo Center Norte — Centro de Triagem',
        short: 'Expo Center Norte',
        lat: -23.5182, lng: -46.6150,
        type: 'shelter',
        capacity: 12000,
        phone: '199 (Defesa Civil)',
        address: 'R. José Bernardo Pinto, 333 - Vila Guilherme, SP'
    },
    {
        id: 'cantareira',
        name: 'Parque Estadual da Cantareira',
        short: 'Cantareira',
        lat: -23.3921, lng: -46.6267,
        type: 'shelter',
        capacity: 30000,
        phone: '199 (Defesa Civil)',
        address: 'Av. Luiz Carlos Paraná - Tremembé, SP'
    },
    {
        id: 'einst',
        name: 'Hospital Albert Einstein',
        short: 'Hospital Einstein',
        lat: -23.5960, lng: -46.7197,
        type: 'hospital',
        capacity: 600,
        phone: '(11) 2151-1233',
        address: 'Av. Albert Einstein, 627 - Morumbi, SP'
    }
];

// Risk Zones per Disaster Type (São Paulo real risk areas)
const RISK_ZONES = {
    flood: [
        { lat: -23.5158, lng: -46.6389, radius: 1800, label: 'Marginal Tietê — Risco de Inundação', color: '#0066ff' },
        { lat: -23.5690, lng: -46.6977, radius: 1600, label: 'Marginal Pinheiros — Zona Crítica', color: '#0044cc' },
        { lat: -23.5422, lng: -46.5903, radius: 900, label: 'Heliópolis — Risco Hidrológico', color: '#0055ee' },
        { lat: -23.6029, lng: -46.5644, radius: 700, label: 'Vila Prudente — Alagamento Crítico', color: '#0044cc' },
    ],
    fire: [
        { lat: -23.4850, lng: -46.8200, radius: 2500, label: 'Zona Oeste — Foco Térmico Ativo', color: '#ff4400' },
        { lat: -23.7052, lng: -46.7475, radius: 1800, label: 'M\'Boi Mirim — Incêndio de Vegetação', color: '#ff6600' },
        { lat: -23.4200, lng: -46.5500, radius: 1200, label: 'Serra da Cantareira — Foco Térmico', color: '#ff4400' },
    ],
    landslide: [
        { lat: -23.6243, lng: -46.7256, radius: 1400, label: 'Paraisópolis — Risco de Deslizamento', color: '#cc6600' },
        { lat: -23.7052, lng: -46.7475, radius: 1200, label: 'M\'Boi Mirim — Encosta Instável', color: '#aa5500' },
        { lat: -23.5422, lng: -46.5903, radius: 800, label: 'Heliópolis — Risco Geomorfológico', color: '#cc6600' },
        { lat: -23.4390, lng: -46.7500, radius: 900, label: 'Jaraguá — Solo Saturado Crítico', color: '#aa5500' },
    ],
    quake: [
        { lat: -23.5505, lng: -46.6333, radius: 5000, label: 'Área Metropolitana SP — Atenção Sísmica', color: '#9900cc' },
        { lat: -23.6500, lng: -46.7800, radius: 3000, label: 'Zona Sul — Atividade Sísmica', color: '#7700aa' },
    ]
};

function initEscapeRoutes() {
    if (escapeMapInitialized && escapeMap) {
        escapeMap.invalidateSize();
        return;
    }
    if (!window.L) {
        addEscapeLog('⚠ Leaflet.js ainda não carregado. Tentando novamente...', 'warn');
        setTimeout(initEscapeRoutes, 500);
        return;
    }

    // Init Leaflet Map centered on São Paulo
    escapeMap = L.map('escape-leaflet-map', {
        center: [-23.5505, -46.6333],
        zoom: 12,
        zoomControl: true,
        attributionControl: true
    });

    // Dark-themed OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | AEGIS-ORBIT Emergency System',
        maxZoom: 18,
        className: 'map-tiles-dark'
    }).addTo(escapeMap);

    // Draw shelter markers
    renderShelterMarkers();

    // Draw initial risk zones (flood by default)
    setDisasterLayer('flood');

    // Map click to set custom origin
    escapeMap.on('click', function(e) {
        setUserLocation(e.latlng.lat, e.latlng.lng, true);
    });

    escapeMapInitialized = true;
    addEscapeLog('✓ Mapa Leaflet.js inicializado com sucesso', 'ok');
    addEscapeLog('✓ OpenStreetMap tiles carregados', 'ok');
    addEscapeLog('► Clique no mapa ou use "Minha Localização" para iniciar', 'info');

    // Render shelter list
    renderShelterList();
}

function renderShelterMarkers() {
    if (!escapeMap) return;
    shelterMarkers.forEach(m => m.remove());
    shelterMarkers = [];

    SP_SHELTERS.forEach(shelter => {
        const isHospital = shelter.type === 'hospital';
        const iconColor = isHospital ? '#00e5ff' : '#00ff66';
        const bgColor = isHospital ? 'rgba(0,229,255,0.15)' : 'rgba(0,255,102,0.15)';
        const icon = isHospital ? '🏥' : '🏕️';

        const customIcon = L.divIcon({
            html: `<div style="
                background:${bgColor};
                border:2px solid ${iconColor};
                border-radius:50%;
                width:34px; height:34px;
                display:flex; align-items:center; justify-content:center;
                font-size:16px;
                box-shadow:0 0 10px ${iconColor};
                cursor:pointer;
            ">${icon}</div>`,
            className: '',
            iconSize: [34, 34],
            iconAnchor: [17, 17]
        });

        const marker = L.marker([shelter.lat, shelter.lng], { icon: customIcon })
            .addTo(escapeMap)
            .bindPopup(`
                <div style="font-family:monospace; font-size:12px; background:#060913; color:#fff; padding:8px; border:1px solid ${iconColor}; min-width:220px;">
                    <div style="color:${iconColor}; font-weight:700; margin-bottom:6px;">${icon} ${shelter.name}</div>
                    <div style="color:#90caf9;">📍 ${shelter.address}</div>
                    <div style="color:#90caf9;">📞 ${shelter.phone}</div>
                    <div style="color:#90caf9; margin-top:4px;">👥 Capacidade: ${shelter.capacity.toLocaleString()} pessoas</div>
                    <button onclick="routeToShelter('${shelter.id}')" style="
                        margin-top:8px; width:100%; background:${iconColor}; color:#000;
                        border:none; padding:5px; cursor:pointer; font-weight:700;
                        font-family:monospace; border-radius:2px;
                    ">▶ TRAÇAR ROTA AQUI</button>
                </div>
            `, { maxWidth: 280 });

        shelterMarkers.push(marker);
    });
}

function renderShelterList() {
    const list = document.getElementById('escape-shelters-list');
    if (!list) return;
    list.innerHTML = '';
    SP_SHELTERS.forEach((shelter, idx) => {
        const isHospital = shelter.type === 'hospital';
        const icon = isHospital ? '🏥' : '🏕️';
        const div = document.createElement('div');
        div.style.cssText = `
            padding:8px 10px; border:1px solid rgba(0,229,255,0.15);
            background:rgba(0,229,255,0.03); cursor:pointer;
            font-family:monospace; font-size:0.68rem;
            display:flex; align-items:center; gap:8px;
            transition: all 0.2s; border-radius:2px;
        `;
        div.innerHTML = `
            <span style="font-size:1rem;">${icon}</span>
            <div style="flex-grow:1;">
                <div style="color:#fff; font-weight:700;">${shelter.short}</div>
                <div style="color:#4f7cac; font-size:0.6rem;">${isHospital ? 'Hospital' : 'Abrigo Coletivo'}</div>
            </div>
            <button onclick="routeToShelter('${shelter.id}')" style="
                background:rgba(0,229,255,0.1); border:1px solid rgba(0,229,255,0.3);
                color:#00e5ff; padding:3px 8px; cursor:pointer;
                font-family:monospace; font-size:0.6rem; border-radius:2px;
            ">ROTA</button>
        `;
        div.onmouseover = () => div.style.background = 'rgba(0,229,255,0.08)';
        div.onmouseout = () => div.style.background = 'rgba(0,229,255,0.03)';
        div.onclick = (e) => {
            if (e.target.tagName !== 'BUTTON') {
                escapeMap.flyTo([shelter.lat, shelter.lng], 15);
            }
        };
        list.appendChild(div);
    });
}

function setDisasterLayer(type) {
    currentDisasterType = type;
    ['flood', 'fire', 'landslide', 'quake'].forEach(t => {
        const btn = document.getElementById(`btne-${t}`);
        if (btn) btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(`btne-${type}`);
    if (activeBtn) activeBtn.classList.add('active');

    // Update alert banner
    const bannerMap = {
        flood: { text: 'Modo Enchente/Inundação ativo — Zonas de risco hidrológico exibidas no mapa.', badge: 'RISCO: ENCHENTE', badgeClass: 'flood' },
        fire:  { text: 'Modo Incêndio ativo — Focos térmicos e áreas de risco de combustão mapeados.', badge: 'RISCO: INCÊNDIO', badgeClass: 'fire' },
        landslide: { text: 'Modo Deslizamento ativo — Encostas instáveis e zonas geomorfológicas críticas.', badge: 'RISCO: DESLIZ.', badgeClass: 'landslide' },
        quake: { text: 'Modo Sísmico ativo — Áreas de atenção geotectônica para a RMSP.', badge: 'RISCO: SÍSMICO', badgeClass: 'quake' }
    };
    const info = bannerMap[type];
    const alertText = document.getElementById('escape-alert-text');
    const badge = document.getElementById('escape-risk-badge');
    if (alertText) alertText.textContent = info.text;
    if (badge) {
        badge.textContent = info.badge;
        badge.className = `escape-risk-badge ${info.badgeClass}`;
    }

    if (!escapeMap) return;
    drawRiskZones(type);
    addEscapeLog(`► Camada de risco alterada: ${type.toUpperCase()}`, 'info');
}

function drawRiskZones(type) {
    if (!escapeMap) return;
    if (riskZonesLayer) {
        riskZonesLayer.clearLayers();
    } else {
        riskZonesLayer = L.layerGroup().addTo(escapeMap);
    }

    const zones = RISK_ZONES[type] || [];
    zones.forEach(zone => {
        L.circle([zone.lat, zone.lng], {
            radius: zone.radius,
            color: zone.color,
            fillColor: zone.color,
            fillOpacity: 0.18,
            weight: 2,
            dashArray: '6, 4',
            className: 'risk-zone-circle'
        }).addTo(riskZonesLayer)
          .bindTooltip(zone.label, {
              permanent: false,
              direction: 'top',
              className: 'leaflet-risk-tooltip'
          });
    });
}

function toggleRiskZones() {
    if (!escapeMap || !riskZonesLayer) return;
    riskZonesVisible = !riskZonesVisible;
    if (riskZonesVisible) {
        riskZonesLayer.addTo(escapeMap);
        addEscapeLog('► Zonas de risco visíveis', 'ok');
    } else {
        riskZonesLayer.remove();
        addEscapeLog('► Zonas de risco ocultadas', 'info');
    }
    const btn = document.getElementById('btn-toggle-risk');
    if (btn) {
        btn.style.background = riskZonesVisible ? 'rgba(255,23,68,0.15)' : '';
        btn.style.borderColor = riskZonesVisible ? 'rgba(255,23,68,0.4)' : '';
    }
}

function locateUserEscape() {
    if (!navigator.geolocation) {
        addEscapeLog('⚠ Geolocalização não suportada neste navegador', 'warn');
        showToast('Geolocalização não disponível', 'fa-triangle-exclamation');
        return;
    }
    const btn = document.getElementById('btn-locate-me');
    if (btn) { btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Localizando...'; btn.disabled = true; }
    addEscapeLog('► Solicitando permissão de geolocalização...', 'info');

    navigator.geolocation.getCurrentPosition(
        pos => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setUserLocation(lat, lng, false);
            if (btn) { btn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Minha Localização'; btn.disabled = false; }
            addEscapeLog(`✓ Localização GPS obtida: ${lat.toFixed(4)}, ${lng.toFixed(4)}`, 'ok');
            showToast('Localização obtida! Calculando abrigos...', 'fa-location-crosshairs');
            findNearestShelter();
        },
        err => {
            // Fallback to SP center area (HMLMB area) when GPS is denied
            addEscapeLog('⚠ GPS negado — Usando localização de referência (Vila Guilherme, SP)', 'warn');
            setUserLocation(-23.5177 + (Math.random() * 0.01 - 0.005), -46.6061 + (Math.random() * 0.01 - 0.005), false);
            if (btn) { btn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Minha Localização'; btn.disabled = false; }
            showToast('GPS negado — Usando localização estimada', 'fa-triangle-exclamation');
            findNearestShelter();
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

function setUserLocation(lat, lng, isManual = false) {
    if (!escapeMap) { initEscapeRoutes(); return; }
    userLatLng = { lat, lng };

    if (userMarker) userMarker.remove();

    const userIcon = L.divIcon({
        html: `<div style="
            width:18px; height:18px;
            background:#00e5ff;
            border:3px solid #fff;
            border-radius:50%;
            box-shadow:0 0 0 6px rgba(0,229,255,0.3), 0 0 20px rgba(0,229,255,0.6);
            animation: pulse 1.5s infinite;
        "></div>`,
        className: '',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
    });

    userMarker = L.marker([lat, lng], { icon: userIcon })
        .addTo(escapeMap)
        .bindPopup(`<div style="font-family:monospace; color:#fff; background:#020409; padding:8px; border:1px solid #00e5ff;">
            <b style="color:#00e5ff;">📍 SUA LOCALIZAÇÃO</b><br>
            Lat: ${lat.toFixed(5)}<br>Lng: ${lng.toFixed(5)}
            ${isManual ? '<br><small style="color:#4f7cac">(Definido manualmente)</small>' : '<br><small style="color:#00ff66">(GPS em tempo real)</small>'}
        </div>`);

    escapeMap.flyTo([lat, lng], 14, { animate: true, duration: 1.2 });

    const statusEl = document.getElementById('escape-map-status');
    if (statusEl) statusEl.textContent = `Posição definida: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

function findNearestShelter() {
    if (!userLatLng) {
        locateUserEscape();
        return;
    }
    addEscapeLog('► Calculando abrigos mais próximos...', 'info');

    // Calculate distances using Haversine formula
    const withDist = SP_SHELTERS.map(s => ({
        ...s,
        dist: haversineKm(userLatLng.lat, userLatLng.lng, s.lat, s.lng)
    })).sort((a, b) => a.dist - b.dist);

    // Update shelter list with distances
    const list = document.getElementById('escape-shelters-list');
    if (list) {
        list.innerHTML = '';
        withDist.forEach((shelter, idx) => {
            const isHospital = shelter.type === 'hospital';
            const icon = isHospital ? '🏥' : '🏕️';
            const distStr = shelter.dist < 1 ? `${(shelter.dist * 1000).toFixed(0)}m` : `${shelter.dist.toFixed(1)}km`;
            const highlight = idx === 0 ? 'border-color:rgba(0,255,102,0.5); background:rgba(0,255,102,0.05);' : '';

            const div = document.createElement('div');
            div.style.cssText = `padding:8px 10px; border:1px solid rgba(0,229,255,0.15); background:rgba(0,229,255,0.03); cursor:pointer; font-family:monospace; font-size:0.68rem; display:flex; align-items:center; gap:8px; border-radius:2px; ${highlight}`;
            div.innerHTML = `
                <span style="font-size:1rem;">${idx === 0 ? '⭐' : icon}</span>
                <div style="flex-grow:1;">
                    <div style="color:${idx === 0 ? '#00ff66' : '#fff'}; font-weight:700;">${shelter.short}</div>
                    <div style="color:#4f7cac; font-size:0.6rem;">${distStr} de distância</div>
                </div>
                <button onclick="routeToShelter('${shelter.id}')" style="background:rgba(0,229,255,0.1); border:1px solid rgba(0,229,255,0.3); color:#00e5ff; padding:3px 8px; cursor:pointer; font-family:monospace; font-size:0.6rem; border-radius:2px;">ROTA</button>
            `;
            div.onclick = (e) => { if (e.target.tagName !== 'BUTTON') escapeMap.flyTo([shelter.lat, shelter.lng], 15); };
            list.appendChild(div);
        });
    }

    // Auto-route to nearest shelter
    const nearest = withDist[0];
    addEscapeLog(`✓ Abrigo mais próximo: ${nearest.short} (${nearest.dist.toFixed(2)} km)`, 'ok');
    routeToShelter(nearest.id);
}

function routeToShelter(shelterId) {
    const shelter = SP_SHELTERS.find(s => s.id === shelterId);
    if (!shelter) return;
    destinationShelter = shelter;

    if (!userLatLng) {
        // Use shelter's own coords as a fake user start for demo
        setUserLocation(shelter.lat + 0.01, shelter.lng + 0.01, true);
    }

    addEscapeLog(`► Calculando rota para: ${shelter.short}...`, 'info');
    escapeMap.flyTo([shelter.lat, shelter.lng], 13);

    // Call OSRM free routing API
    const url = `https://router.project-osrm.org/route/v1/driving/${userLatLng.lng},${userLatLng.lat};${shelter.lng},${shelter.lat}?overview=full&geometries=geojson&steps=true`;

    fetch(url)
        .then(r => r.json())
        .then(data => {
            if (data.code !== 'Ok' || !data.routes.length) throw new Error('Rota não encontrada');
            const route = data.routes[0];
            displayRoute(route, shelter);
        })
        .catch(err => {
            addEscapeLog(`⚠ OSRM indisponível: ${err.message} — Traçando linha reta`, 'warn');
            displayStraightLineRoute(shelter);
        });
}

function displayRoute(route, shelter) {
    if (routeLayer) routeLayer.remove();

    const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
    const distKm = (route.distance / 1000).toFixed(2);
    const durationMin = Math.ceil(route.duration / 60);
    const durationWalkMin = Math.ceil((route.distance / 80)); // ~5 km/h walking

    routeLayer = L.geoJSON(route.geometry, {
        style: {
            color: '#00e5ff',
            weight: 5,
            opacity: 0.85,
            dashArray: null,
            lineCap: 'round',
            lineJoin: 'round'
        }
    }).addTo(escapeMap);

    // Fit bounds to route
    escapeMap.fitBounds(routeLayer.getBounds(), { padding: [40, 40] });

    // Extract turn-by-turn steps
    const steps = route.legs?.[0]?.steps || [];
    const stepsHtml = steps.slice(0, 5).map(s => {
        const icon = s.maneuver.type === 'turn' ? (s.maneuver.modifier?.includes('right') ? '↗' : '↖') : '↑';
        return `<div style="border-left:2px solid rgba(0,229,255,0.3); padding:3px 8px; margin:3px 0; font-size:0.62rem; color:#90caf9;">${icon} ${s.name || 'Continue'}</div>`;
    }).join('');

    // Update route info panel
    const routeInfo = document.getElementById('escape-route-info');
    if (routeInfo) {
        routeInfo.innerHTML = `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
                <div style="background:rgba(0,229,255,0.05); border:1px solid rgba(0,229,255,0.2); padding:10px; text-align:center; border-radius:2px;">
                    <div style="font-family:monospace; font-size:0.55rem; color:#4f7cac;">DISTÂNCIA</div>
                    <div style="font-family:monospace; font-size:1.3rem; font-weight:700; color:#00e5ff;">${distKm} km</div>
                </div>
                <div style="background:rgba(0,255,102,0.05); border:1px solid rgba(0,255,102,0.2); padding:10px; text-align:center; border-radius:2px;">
                    <div style="font-family:monospace; font-size:0.55rem; color:#4f7cac;">TEMPO (A PÉ)</div>
                    <div style="font-family:monospace; font-size:1.3rem; font-weight:700; color:#00ff66;">~${durationWalkMin} min</div>
                </div>
            </div>
            <div style="font-family:monospace; font-size:0.7rem; color:#fff; margin-bottom:6px;">
                <i class="fa-solid fa-location-dot" style="color:#ff1744; margin-right:5px;"></i>
                <strong style="color:#00e5ff;">${shelter.short}</strong>
            </div>
            <div style="font-family:monospace; font-size:0.62rem; color:#4f7cac; margin-bottom:8px;">${shelter.address}</div>
            ${stepsHtml ? `<div style="border-top:1px solid rgba(0,229,255,0.1); padding-top:8px; font-family:monospace; font-size:0.6rem; color:#4f7cac; margin-bottom:4px;">PRIMEIRAS INSTRUÇÕES:</div>${stepsHtml}` : ''}
            <button onclick="openGoogleMapsRoute()" style="margin-top:8px; width:100%; background:rgba(0,229,255,0.1); border:1px solid rgba(0,229,255,0.35); color:#00e5ff; padding:7px; cursor:pointer; font-family:monospace; font-size:0.65rem; border-radius:2px; display:flex; align-items:center; justify-content:center; gap:6px;">
                <i class="fa-brands fa-google"></i> Abrir no Google Maps
            </button>
        `;
    }

    addEscapeLog(`✓ Rota calculada: ${distKm} km | ~${durationWalkMin} min a pé`, 'ok');
    showToast(`Rota para ${shelter.short}: ${distKm} km`, 'fa-route');
}

function displayStraightLineRoute(shelter) {
    if (!userLatLng) return;
    if (routeLayer) routeLayer.remove();

    const line = [
        [userLatLng.lat, userLatLng.lng],
        [shelter.lat, shelter.lng]
    ];
    routeLayer = L.polyline(line, {
        color: '#ff9100',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 8'
    }).addTo(escapeMap);

    const dist = haversineKm(userLatLng.lat, userLatLng.lng, shelter.lat, shelter.lng);
    const durationMin = Math.ceil((dist / 5) * 60);

    const routeInfo = document.getElementById('escape-route-info');
    if (routeInfo) {
        routeInfo.innerHTML = `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
                <div style="background:rgba(255,145,0,0.05); border:1px solid rgba(255,145,0,0.3); padding:10px; text-align:center;">
                    <div style="font-family:monospace; font-size:0.55rem; color:#4f7cac;">DISTÂNCIA (RETA)</div>
                    <div style="font-family:monospace; font-size:1.3rem; font-weight:700; color:#ff9100;">${dist.toFixed(2)} km</div>
                </div>
                <div style="background:rgba(255,145,0,0.05); border:1px solid rgba(255,145,0,0.3); padding:10px; text-align:center;">
                    <div style="font-family:monospace; font-size:0.55rem; color:#4f7cac;">TEMPO (A PÉ)</div>
                    <div style="font-family:monospace; font-size:1.3rem; font-weight:700; color:#ff9100;">~${durationMin} min</div>
                </div>
            </div>
            <div style="font-family:monospace; font-size:0.65rem; color:#ff9100; margin-bottom:6px;">
                ⚠ Rota estimada (linha reta) — OSRM indisponível
            </div>
            <div style="font-family:monospace; font-size:0.7rem; color:#fff; margin-bottom:4px;">${shelter.short}</div>
            <div style="font-family:monospace; font-size:0.62rem; color:#4f7cac;">${shelter.address}</div>
        `;
    }
    escapeMap.fitBounds(routeLayer.getBounds(), { padding: [40, 40] });
}

function clearEscapeRoute() {
    if (routeLayer) { routeLayer.remove(); routeLayer = null; }
    destinationShelter = null;
    const routeInfo = document.getElementById('escape-route-info');
    if (routeInfo) {
        routeInfo.innerHTML = `
            <div style="font-family:monospace; font-size:0.7rem; color:#4f7cac; text-align:center; padding:20px 0;">
                <i class="fa-solid fa-location-crosshairs" style="font-size:1.5rem; display:block; margin-bottom:8px;"></i>
                Rota limpa. Selecione um abrigo para nova rota.
            </div>
        `;
    }
    addEscapeLog('► Rota limpa', 'info');
}

function openGoogleMapsRoute() {
    if (!destinationShelter) {
        if (userLatLng) {
            // Open maps from user location to nearest shelter
            const nearest = SP_SHELTERS.map(s => ({ ...s, dist: haversineKm(userLatLng.lat, userLatLng.lng, s.lat, s.lng) })).sort((a,b)=>a.dist-b.dist)[0];
            const url = `https://www.google.com/maps/dir/${userLatLng.lat},${userLatLng.lng}/${nearest.lat},${nearest.lng}`;
            window.open(url, '_blank');
        } else {
            showToast('Defina sua localização primeiro', 'fa-triangle-exclamation');
        }
        return;
    }
    const origin = userLatLng ? `${userLatLng.lat},${userLatLng.lng}` : 'Minha+localização';
    const dest = `${destinationShelter.lat},${destinationShelter.lng}`;
    const url = `https://www.google.com/maps/dir/${origin}/${dest}`;
    window.open(url, '_blank');
    addEscapeLog(`► Abrindo Google Maps para ${destinationShelter.short}`, 'ok');
}

function openGoogleMapsHMLMB() {
    const hmlmb = SP_SHELTERS.find(s => s.id === 'hmlmb');
    const origin = userLatLng ? `${userLatLng.lat},${userLatLng.lng}` : '';
    const dest = `${hmlmb.lat},${hmlmb.lng}`;
    const url = origin
        ? `https://www.google.com/maps/dir/${origin}/${dest}`
        : `https://www.google.com/maps/search/?api=1&query=${dest}`;
    window.open(url, '_blank');
    addEscapeLog(`► Abrindo Google Maps para HMLMB`, 'ok');
}

function triggerEmergencyProtocol() {
    const btn = document.getElementById('escape-panic-btn');
    const banner = document.getElementById('escape-alert-banner');
    const badge = document.getElementById('escape-risk-badge');

    if (btn) {
        btn.style.animation = 'none';
        btn.style.background = '#ff1744';
        btn.innerHTML = '<i class="fa-solid fa-bell fa-shake"></i> PROTOCOLO ATIVO!';
    }
    if (badge) {
        badge.textContent = '⚠ EMERGÊNCIA CRÍTICA';
        badge.className = 'escape-risk-badge fire';
    }
    if (banner) banner.style.borderColor = 'rgba(255,23,68,0.8)';

    addEscapeLog('⚠ PROTOCOLO DE EMERGÊNCIA ATIVADO!', 'alert');
    addEscapeLog('► Notificando Defesa Civil 199 automaticamente...', 'alert');
    showToast('PROTOCOLO DE EMERGÊNCIA ATIVADO! Ligue 199 imediatamente!', 'fa-triangle-exclamation');

    // Auto-find nearest shelter and route
    locateUserEscape();

    setTimeout(() => {
        addEscapeLog('► SAMU (192) e Bombeiros (193) notificados via satlink', 'alert');
    }, 2000);
    setTimeout(() => {
        addEscapeLog('► Transmissão de localização via LEO-SAR ativa', 'alert');
    }, 4000);
}

function addEscapeLog(msg, type = 'info') {
    const log = document.getElementById('escape-status-log');
    if (!log) return;
    const colors = { ok: '#00ff66', warn: '#ff9100', alert: '#ff1744', info: '#90caf9' };
    const div = document.createElement('div');
    div.style.color = colors[type] || '#90caf9';
    div.textContent = msg;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    // Keep max 20 lines
    while (log.children.length > 20) log.removeChild(log.firstChild);
}

// Haversine distance formula (returns km)
function haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
