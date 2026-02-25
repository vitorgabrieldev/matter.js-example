const {
  Engine,
  Render,
  Runner,
  Events,
  Constraint,
  Body,
  Composite,
  Bodies,
  Query
} = Matter;

const STORAGE_KEY = "matter_slingshot_levels_v1";
let suppressBeforeUnloadPrompt = false;
const LAUNCH_POWER_MULTIPLIER = 0.75;

const COLORS = {
  violet: "#BA4DE3",
  purple: "#8A05BE",
  deep: "#530082",
  black: "#191919",
  white: "#f1f1f1"
};

const LEVEL_THEMES = [
  {
    sceneBg: COLORS.violet,
    hudCardBg: COLORS.purple,
    hudCardBorder: COLORS.deep,
    hudCardText: COLORS.white,
    hudCardLabel: COLORS.white,
    ground: COLORS.deep,
    slingBase: COLORS.deep,
    slingPostA: COLORS.purple,
    slingPostB: COLORS.black,
    slingBand: COLORS.white,
    marker: COLORS.deep,
    platform: COLORS.purple,
    platformStroke: COLORS.black,
    targetFill: COLORS.purple,
    targetStroke: COLORS.black,
    projectileFill: COLORS.white,
    projectileStroke: COLORS.deep,
    projectileRadiusScale: 0.95,
    projectileStrokeWidth: 3,
    blockW: 26,
    blockH: 32,
    blockChamfer: 4,
    blockLineWidth: 2,
    platformThickness: 14,
    markerWidth: 44,
    markerHeight: 8,
    markerAngle: 0.02,
    trajectoryColor: COLORS.white,
    trajectoryDash: [8, 8],
    trajectoryWidth: 2.2,
    trajectoryDotRadius: 2.4,
    trajectoryAlpha: 0.9,
    launchPower: 0.22
  },
  {
    sceneBg: COLORS.purple,
    hudCardBg: COLORS.deep,
    hudCardBorder: COLORS.black,
    hudCardText: COLORS.white,
    hudCardLabel: COLORS.violet,
    ground: COLORS.black,
    slingBase: COLORS.deep,
    slingPostA: COLORS.violet,
    slingPostB: COLORS.black,
    slingBand: COLORS.violet,
    marker: COLORS.black,
    platform: COLORS.deep,
    platformStroke: COLORS.violet,
    targetFill: COLORS.violet,
    targetStroke: COLORS.black,
    projectileFill: COLORS.white,
    projectileStroke: COLORS.black,
    projectileRadiusScale: 1.02,
    projectileStrokeWidth: 3,
    blockW: 28,
    blockH: 34,
    blockChamfer: 6,
    blockLineWidth: 2,
    platformThickness: 16,
    markerWidth: 48,
    markerHeight: 10,
    markerAngle: 0.03,
    trajectoryColor: COLORS.white,
    trajectoryDash: [10, 7],
    trajectoryWidth: 2.5,
    trajectoryDotRadius: 2.8,
    trajectoryAlpha: 0.95,
    launchPower: 0.225
  },
  {
    sceneBg: COLORS.deep,
    hudCardBg: COLORS.black,
    hudCardBorder: COLORS.purple,
    hudCardText: COLORS.white,
    hudCardLabel: COLORS.violet,
    ground: COLORS.black,
    slingBase: COLORS.purple,
    slingPostA: COLORS.deep,
    slingPostB: COLORS.violet,
    slingBand: COLORS.white,
    marker: COLORS.purple,
    platform: COLORS.black,
    platformStroke: COLORS.violet,
    targetFill: COLORS.white,
    targetStroke: COLORS.black,
    projectileFill: COLORS.violet,
    projectileStroke: COLORS.white,
    projectileRadiusScale: 1.06,
    projectileStrokeWidth: 2,
    blockW: 30,
    blockH: 30,
    blockChamfer: 2,
    blockLineWidth: 2,
    platformThickness: 14,
    markerWidth: 52,
    markerHeight: 8,
    markerAngle: 0.025,
    trajectoryColor: COLORS.violet,
    trajectoryDash: [7, 7],
    trajectoryWidth: 2,
    trajectoryDotRadius: 2.4,
    trajectoryAlpha: 0.9,
    launchPower: 0.23
  },
  {
    sceneBg: COLORS.violet,
    hudCardBg: COLORS.deep,
    hudCardBorder: COLORS.black,
    hudCardText: COLORS.white,
    hudCardLabel: COLORS.white,
    ground: COLORS.black,
    slingBase: COLORS.black,
    slingPostA: COLORS.purple,
    slingPostB: COLORS.deep,
    slingBand: COLORS.purple,
    marker: COLORS.black,
    platform: COLORS.black,
    platformStroke: COLORS.purple,
    targetFill: COLORS.deep,
    targetStroke: COLORS.white,
    projectileFill: COLORS.white,
    projectileStroke: COLORS.purple,
    projectileRadiusScale: 0.92,
    projectileStrokeWidth: 4,
    blockW: 24,
    blockH: 38,
    blockChamfer: 8,
    blockLineWidth: 2,
    platformThickness: 18,
    markerWidth: 42,
    markerHeight: 9,
    markerAngle: 0.04,
    trajectoryColor: COLORS.black,
    trajectoryDash: [12, 6],
    trajectoryWidth: 2.6,
    trajectoryDotRadius: 2.6,
    trajectoryAlpha: 0.85,
    launchPower: 0.218
  },
  {
    sceneBg: COLORS.purple,
    hudCardBg: COLORS.black,
    hudCardBorder: COLORS.violet,
    hudCardText: COLORS.white,
    hudCardLabel: COLORS.violet,
    ground: COLORS.black,
    slingBase: COLORS.deep,
    slingPostA: COLORS.black,
    slingPostB: COLORS.violet,
    slingBand: COLORS.white,
    marker: COLORS.deep,
    platform: COLORS.deep,
    platformStroke: COLORS.white,
    targetFill: COLORS.violet,
    targetStroke: COLORS.white,
    projectileFill: COLORS.white,
    projectileStroke: COLORS.deep,
    projectileRadiusScale: 1.1,
    projectileStrokeWidth: 3,
    blockW: 30,
    blockH: 36,
    blockChamfer: 10,
    blockLineWidth: 2.5,
    platformThickness: 16,
    markerWidth: 56,
    markerHeight: 10,
    markerAngle: 0.02,
    trajectoryColor: COLORS.white,
    trajectoryDash: [9, 5],
    trajectoryWidth: 2.4,
    trajectoryDotRadius: 3,
    trajectoryAlpha: 0.95,
    launchPower: 0.232
  }
];

const LEVELS = [
  {
    id: 1,
    name: "Fase 1",
    shots: 4,
    difficulty: "Treino",
    groups: [
      { distance: 0.22, rise: 26, platformWidth: 130, cols: 3, rows: 2, palette: 0 }
    ]
  },
  {
    id: 2,
    name: "Fase 2",
    shots: 4,
    difficulty: "Fácil",
    groups: [
      { distance: 0.2, rise: 26, platformWidth: 140, cols: 3, rows: 2, palette: 0 },
      { distance: 0.5, rise: 118, platformWidth: 130, cols: 2, rows: 3, palette: 1 }
    ]
  },
  {
    id: 3,
    name: "Fase 3",
    shots: 5,
    difficulty: "Média",
    groups: [
      { distance: 0.18, rise: 26, platformWidth: 160, cols: 4, rows: 2, palette: 0 },
      { distance: 0.5, rise: 132, platformWidth: 150, cols: 3, rows: 3, palette: 2 },
      { distance: 0.78, rise: 26, platformWidth: 135, cols: 3, rows: 2, palette: 1 }
    ]
  },
  {
    id: 4,
    name: "Fase 4",
    shots: 5,
    difficulty: "Difícil",
    groups: [
      { distance: 0.16, rise: 26, platformWidth: 170, cols: 4, rows: 3, palette: 0 },
      { distance: 0.48, rise: 150, platformWidth: 160, cols: 4, rows: 2, palette: 3 },
      { distance: 0.74, rise: 92, platformWidth: 150, cols: 3, rows: 3, palette: 2 }
    ]
  },
  {
    id: 5,
    name: "Fase 5",
    shots: 6,
    difficulty: "Final",
    groups: [
      { distance: 0.12, rise: 26, platformWidth: 170, cols: 4, rows: 3, palette: 0 },
      { distance: 0.38, rise: 170, platformWidth: 170, cols: 4, rows: 3, palette: 1 },
      { distance: 0.66, rise: 104, platformWidth: 180, cols: 5, rows: 2, palette: 2 },
      { distance: 0.9, rise: 210, platformWidth: 150, cols: 3, rows: 3, palette: 3 }
    ]
  }
].map((level) => ({
  ...level,
  totalBlocks: level.groups.reduce((sum, group) => sum + group.cols * group.rows, 0)
}));

const viewport = {
  width: window.innerWidth,
  height: window.innerHeight
};

const sceneEl = document.getElementById("scene");

const ui = {
  hudPhase: document.getElementById("hudPhase"),
  hudShots: document.getElementById("hudShots"),
  hudTargets: document.getElementById("hudTargets"),
  pauseBtn: document.getElementById("pauseBtn"),
  pauseOverlay: document.getElementById("pauseOverlay"),
  pauseResumeBtn: document.getElementById("pauseResumeBtn"),
  pauseSettingsBtn: document.getElementById("pauseSettingsBtn"),
  pauseRestartBtn: document.getElementById("pauseRestartBtn"),
  pauseLevelsBtn: document.getElementById("pauseLevelsBtn"),
  pauseActions: document.getElementById("pauseActions"),
  pauseSettingsPanel: document.getElementById("pauseSettingsPanel"),
  pauseSettingsBackBtn: document.getElementById("pauseSettingsBackBtn"),
  toggleTrajectoryBtn: document.getElementById("toggleTrajectoryBtn"),
  bgVolumeRange: document.getElementById("bgVolumeRange"),
  bgVolumeValue: document.getElementById("bgVolumeValue"),
  shotVolumeRange: document.getElementById("shotVolumeRange"),
  shotVolumeValue: document.getElementById("shotVolumeValue"),
  phaseMenu: document.getElementById("phaseMenu"),
  closeMenuBtn: document.getElementById("closeMenuBtn"),
  levelGrid: document.getElementById("levelGrid"),
  progressText: document.getElementById("progressText"),
  resetProgressBtn: document.getElementById("resetProgressBtn"),
  resultOverlay: document.getElementById("resultOverlay"),
  resultBadge: document.getElementById("resultBadge"),
  resultTitle: document.getElementById("resultTitle"),
  resultText: document.getElementById("resultText"),
  resultRetryBtn: document.getElementById("resultRetryBtn"),
  resultNextBtn: document.getElementById("resultNextBtn"),
  resultMenuBtn: document.getElementById("resultMenuBtn")
};

const engine = Engine.create();
const world = engine.world;
world.gravity.y = 1;

const render = Render.create({
  element: sceneEl,
  engine,
  options: {
    width: viewport.width,
    height: viewport.height,
    wireframes: false,
    showAngleIndicator: false,
    background: "transparent",
    pixelRatio: window.devicePixelRatio || 1
  }
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

const loadedProgress = loadProgress();

const game = {
  metrics: computeSceneMetrics(),
  progress: loadedProgress,
  settings: normalizeSettings(loadedProgress.settings),
  currentLevelNumber: 1,
  currentLevel: LEVELS[0],
  currentTheme: LEVEL_THEMES[0],
  levelState: "idle",
  isPaused: false,
  phaseMenuSource: null,
  shotsLimit: 0,
  shotsRemaining: 0,
  targetsRemaining: 0,
  targetBlocks: [],
  worldBodies: [],
  currentProjectile: null,
  elastic: null,
  projectileState: "none",
  projectileReleasedAt: 0,
  dragging: false,
  dragPointerId: null,
  noShotSettleFrames: 0,
  lastStatusText: ""
};

const audioState = {
  background: null,
  shot: null,
  unlockedByGesture: false
};

setupAudio();
setupBeforeUnloadGuard();
setupUi();
setupPointerControls();
setupEngineLoop();
setupRenderOverlay();

const shouldOpenMenuInitially = game.progress.fresh;

const initialLevel = clamp(
  game.progress.lastSelectedLevel || 1,
  1,
  Math.max(1, Math.min(game.progress.unlockedLevel, LEVELS.length))
);
startLevel(initialLevel);
renderLevelGrid();
updateProgressText();

if (shouldOpenMenuInitially) {
  pauseGame();
  updateStatus("Selecione uma fase para começar.");
  openPhaseMenu("startup");
}

Render.lookAt(render, {
  min: { x: 0, y: 0 },
  max: { x: viewport.width, y: viewport.height }
});

window.addEventListener("resize", () => {
  clearTimeout(window.__matterResizeTimer);
  window.__matterResizeTimer = setTimeout(() => {
    suppressBeforeUnloadPrompt = true;
    window.location.reload();
  }, 150);
});

function setupBeforeUnloadGuard() {
  window.addEventListener("beforeunload", (event) => {
    if (suppressBeforeUnloadPrompt) {
      return;
    }

    event.preventDefault();
    event.returnValue = "";
  });
}

function setupAudio() {
  const background = new Audio("./sounds/background-sounds.mp3");
  background.loop = true;
  background.preload = "auto";

  const shot = new Audio("./sounds/disparo.wav");
  shot.preload = "auto";

  audioState.background = background;
  audioState.shot = shot;

  syncAudioSettings();
  tryStartBackgroundAudio();

  const unlockHandler = () => {
    audioState.unlockedByGesture = true;
    tryStartBackgroundAudio();
  };

  window.addEventListener("pointerdown", unlockHandler, { passive: true });
  window.addEventListener("keydown", unlockHandler);
}

function syncAudioSettings() {
  if (audioState.background) {
    audioState.background.volume = clamp(game?.settings?.bgMusicVolume ?? 0.45, 0, 1);
  }

  if (audioState.shot) {
    audioState.shot.volume = clamp(game?.settings?.shotVolume ?? 0.75, 0, 1);
  }
}

function tryStartBackgroundAudio() {
  if (!audioState.background) {
    return;
  }

  if (!audioState.background.paused) {
    return;
  }

  audioState.background.play().catch(() => {
    /* autoplay may be blocked until a user gesture */
  });
}

function playShotSound() {
  if (!audioState.shot) {
    return;
  }

  tryStartBackgroundAudio();

  const shot = audioState.shot.cloneNode();
  shot.volume = clamp(game.settings.shotVolume, 0, 1);
  shot.play().catch(() => {
    /* noop */
  });
}

function computeSceneMetrics() {
  const width = viewport.width;
  const height = viewport.height;
  const groundHeight = Math.max(58, Math.min(90, height * 0.1));
  const wallThickness = 120;
  const projectileRadius = Math.max(14, Math.min(24, Math.min(width, height) * 0.022));
  const anchor = {
    x: Math.max(120, Math.min(210, width * 0.14)),
    y: Math.max(210, height - groundHeight - 120)
  };

  return {
    width,
    height,
    groundHeight,
    wallThickness,
    floorY: height - groundHeight,
    anchor,
    projectileRadius,
    maxDrag: Math.max(110, Math.min(170, width * 0.16)),
    minLaunchDrag: 12,
    projectileMaxSpeed: 48
  };
}

function setupUi() {
  ui.pauseBtn.addEventListener("click", () => {
    openPauseMenu();
  });

  ui.pauseResumeBtn.addEventListener("click", () => {
    closePauseMenu({ resume: true });
  });

  ui.pauseSettingsBtn.addEventListener("click", () => {
    openPauseSettingsView();
  });

  ui.pauseSettingsBackBtn.addEventListener("click", () => {
    closePauseSettingsView();
  });

  ui.pauseRestartBtn.addEventListener("click", () => {
    hideResult();
    closePauseMenu({ resume: false });
    startLevel(game.currentLevelNumber);
  });

  ui.pauseLevelsBtn.addEventListener("click", () => {
    renderLevelGrid();
    hidePauseMenuOverlay();
    openPhaseMenu("pause");
  });

  ui.toggleTrajectoryBtn.addEventListener("click", () => {
    game.settings.showTrajectory = !game.settings.showTrajectory;
    updateSettingsUi();
    applySettings();
    saveProgress();
  });

  ui.bgVolumeRange.addEventListener("input", () => {
    game.settings.bgMusicVolume = clamp(Number(ui.bgVolumeRange.value) / 100, 0, 1);
    syncAudioSettings();
    tryStartBackgroundAudio();
    updateSettingsUi();
    saveProgress();
  });

  ui.shotVolumeRange.addEventListener("input", () => {
    game.settings.shotVolume = clamp(Number(ui.shotVolumeRange.value) / 100, 0, 1);
    syncAudioSettings();
    updateSettingsUi();
    saveProgress();
  });

  ui.closeMenuBtn.addEventListener("click", closePhaseMenu);

  ui.resetProgressBtn.addEventListener("click", () => {
    const confirmed = window.confirm("Resetar progresso e bloquear novamente as fases?");
    if (!confirmed) {
      return;
    }

    const preservedSettings = { ...game.settings };
    game.progress = createDefaultProgress();
    game.settings = normalizeSettings(preservedSettings);
    game.progress.settings = { ...game.settings };
    saveProgress();
    renderLevelGrid();
    updateProgressText();
    startLevel(1);
    openPhaseMenu(game.isPaused ? "pause" : "direct");
  });

  ui.resultRetryBtn.addEventListener("click", () => {
    hideResult();
    startLevel(game.currentLevelNumber);
  });

  ui.resultNextBtn.addEventListener("click", () => {
    const nextLevel = game.currentLevelNumber + 1;
    if (nextLevel <= Math.min(game.progress.unlockedLevel, LEVELS.length)) {
      hideResult();
      startLevel(nextLevel);
    }
  });

  ui.resultMenuBtn.addEventListener("click", () => {
    hideResult();
    renderLevelGrid();
    openPhaseMenu("result");
  });

  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || event.repeat) {
      return;
    }

    if (!ui.phaseMenu.classList.contains("hidden")) {
      event.preventDefault();
      closePhaseMenu();
      return;
    }

    if (!ui.pauseOverlay.classList.contains("hidden")) {
      event.preventDefault();
      closePauseMenu({ resume: true });
      return;
    }

    if (game.levelState === "playing" && !game.isPaused) {
      event.preventDefault();
      openPauseMenu();
    }
  });

  applySettings();
  updateSettingsUi();
  tryStartBackgroundAudio();
}

function setupPointerControls() {
  render.canvas.addEventListener("pointerdown", (event) => {
    if (
      game.levelState !== "playing" ||
      game.isPaused ||
      game.projectileState !== "armed" ||
      !game.currentProjectile
    ) {
      return;
    }

    const pointer = getPointerPosition(event);
    const distance = getDistance(pointer, game.currentProjectile.position);
    const projectileRadius = game.currentProjectile.circleRadius || game.metrics.projectileRadius;

    if (distance > projectileRadius + 18) {
      return;
    }

    game.dragging = true;
    game.dragPointerId = event.pointerId;
    Body.setStatic(game.currentProjectile, true);

    try {
      render.canvas.setPointerCapture(event.pointerId);
    } catch {
      /* noop */
    }

    updateStatus("Puxe e solte para disparar.");
    applyDragToProjectile(pointer);
  });

  window.addEventListener("pointermove", (event) => {
    if (!game.dragging || event.pointerId !== game.dragPointerId || !game.currentProjectile) {
      return;
    }

    applyDragToProjectile(getPointerPosition(event));
  });

  window.addEventListener("pointerup", (event) => {
    finishDrag(event);
  });

  window.addEventListener("pointercancel", (event) => {
    finishDrag(event);
  });
}

function setupEngineLoop() {
  Events.on(engine, "afterUpdate", () => {
    if (game.levelState !== "playing" || game.isPaused) {
      return;
    }

    updateProjectileLifecycle();
    updateTargetProgress();
    evaluateLoseCondition();
  });
}

function setupRenderOverlay() {
  Events.on(render, "afterRender", () => {
    drawTrajectoryGuide();
    drawProjectileVisual();
  });
}

function createDefaultProgress() {
  return {
    unlockedLevel: 1,
    lastSelectedLevel: 1,
    completed: {},
    settings: {
      showTrajectory: true,
      bgMusicVolume: 0.45,
      shotVolume: 0.75
    },
    fresh: true
  };
}

function normalizeSettings(settings) {
  const bgMusicVolume = normalizeVolumeSetting(settings?.bgMusicVolume, 0.45);
  const shotVolume = normalizeVolumeSetting(settings?.shotVolume, 0.75);

  return {
    showTrajectory: settings?.showTrajectory !== false,
    bgMusicVolume,
    shotVolume
  };
}

function loadProgress() {
  const fallback = createDefaultProgress();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    const unlockedLevel = clamp(Number(parsed.unlockedLevel) || 1, 1, LEVELS.length);
    const lastSelectedLevel = clamp(Number(parsed.lastSelectedLevel) || 1, 1, unlockedLevel);
    const completed = typeof parsed.completed === "object" && parsed.completed ? parsed.completed : {};
    const settings = normalizeSettings(parsed.settings);

    return {
      unlockedLevel,
      lastSelectedLevel,
      completed,
      settings,
      fresh: false
    };
  } catch {
    return fallback;
  }
}

function saveProgress() {
  const payload = {
    unlockedLevel: game.progress.unlockedLevel,
    lastSelectedLevel: game.progress.lastSelectedLevel,
    completed: game.progress.completed,
    settings: game.settings
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* noop */
  }
}

function renderLevelGrid() {
  ui.levelGrid.innerHTML = "";

  LEVELS.forEach((level) => {
    const unlocked = level.id <= game.progress.unlockedLevel;
    const completed = Boolean(game.progress.completed[level.id]);
    const isCurrent = level.id === game.currentLevelNumber;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "level-card";

    if (completed) {
      button.classList.add("completed");
    }
    if (isCurrent) {
      button.classList.add("current");
    }
    if (!unlocked) {
      button.disabled = true;
    }

    const tag = completed ? "Concluída" : unlocked ? "Desbloqueada" : "Bloqueada";
    button.innerHTML = `
      <span class="num">${level.id}</span>
      <span class="meta">${level.totalBlocks} blocos • ${level.shots} bolas</span>
      <span class="meta">${level.difficulty}</span>
      <span class="tag">${tag}</span>
    `;

    button.addEventListener("click", () => {
      if (!unlocked) {
        return;
      }

      hideResult();
      startLevel(level.id);
      closePhaseMenu();
    });

    ui.levelGrid.appendChild(button);
  });
}

function updateProgressText() {
  const completedCount = LEVELS.reduce((sum, level) => sum + (game.progress.completed[level.id] ? 1 : 0), 0);
  ui.progressText.textContent =
    `Desbloqueadas: ${game.progress.unlockedLevel}/${LEVELS.length} • Concluídas: ${completedCount}/${LEVELS.length}`;
}

function openPhaseMenu(source = "direct") {
  game.phaseMenuSource = source;
  hidePauseMenuOverlay();
  render.canvas.style.cursor = "default";
  ui.phaseMenu.classList.remove("hidden");
}

function closePhaseMenu() {
  ui.phaseMenu.classList.add("hidden");
  const source = game.phaseMenuSource;
  game.phaseMenuSource = null;

  if (source === "pause" && game.isPaused && game.levelState === "playing") {
    showPauseMenuOverlay();
  } else if (source === "startup" && game.isPaused && game.levelState === "playing") {
    resumeGame();
  } else if (!game.isPaused) {
    applySettings();
  }
}

function showPauseMenuOverlay() {
  render.canvas.style.cursor = "default";
  closePauseSettingsView();
  ui.pauseOverlay.classList.remove("hidden");
}

function hidePauseMenuOverlay() {
  ui.pauseOverlay.classList.add("hidden");
  closePauseSettingsView();
  applySettings();
}

function openPauseMenu() {
  if (game.levelState !== "playing" || game.isPaused) {
    return;
  }

  hideResult();
  closePhaseMenu();
  pauseGame();
  showPauseMenuOverlay();
  updateSettingsUi();
}

function closePauseMenu({ resume } = { resume: true }) {
  hidePauseMenuOverlay();

  if (resume) {
    resumeGame();
  }
}

function openPauseSettingsView() {
  ui.pauseActions.classList.add("hidden");
  ui.pauseSettingsPanel.classList.remove("hidden");
}

function closePauseSettingsView() {
  ui.pauseSettingsPanel.classList.add("hidden");
  ui.pauseActions.classList.remove("hidden");
}

function pauseGame() {
  if (game.levelState !== "playing" || game.isPaused) {
    return;
  }

  game.isPaused = true;
  engine.timing.timeScale = 0;
  runner.enabled = false;
  game.dragging = false;
  game.dragPointerId = null;
  updateStatus("Jogo pausado.");
  applySettings();
  tryStartBackgroundAudio();
  updateHud();
}

function resumeGame() {
  if (!game.isPaused) {
    return;
  }

  game.isPaused = false;
  engine.timing.timeScale = 1;
  runner.enabled = true;

  if (game.levelState === "playing") {
    if (game.projectileState === "armed") {
      updateStatus("Arraste a bala no estilingue e solte para disparar.");
    } else if (game.projectileState === "launched") {
      updateStatus("Disparo em andamento...");
    }
  }

  applySettings();
  updateHud();
}

function updateSettingsUi() {
  ui.toggleTrajectoryBtn.textContent = game.settings.showTrajectory ? "Ligado" : "Desligado";
  ui.toggleTrajectoryBtn.className = `btn ${game.settings.showTrajectory ? "secondary" : "outline"}`;

  const bgPercent = Math.round(clamp(game.settings.bgMusicVolume, 0, 1) * 100);
  const shotPercent = Math.round(clamp(game.settings.shotVolume, 0, 1) * 100);

  ui.bgVolumeRange.value = String(bgPercent);
  ui.shotVolumeRange.value = String(shotPercent);
  ui.bgVolumeValue.textContent = `${bgPercent}%`;
  ui.shotVolumeValue.textContent = `${shotPercent}%`;
}

function applySettings() {
  render.canvas.style.cursor = game.isPaused || game.levelState !== "playing" ? "default" : "crosshair";
  syncAudioSettings();
}

function getThemeForLevel(levelNumber) {
  return LEVEL_THEMES[(levelNumber - 1) % LEVEL_THEMES.length];
}

function applyPhaseTheme(theme) {
  if (!theme) {
    return;
  }

  render.options.background = "transparent";

  // Keep the stage background dark while preserving each phase hue in the gradient.
  document.documentElement.style.setProperty("--scene-grad-1", darkenHex(theme.sceneBg, 0.62));
  document.documentElement.style.setProperty("--scene-grad-2", darkenHex(theme.hudCardBg, 0.48));
  document.documentElement.style.setProperty("--scene-grad-3", COLORS.black);

  document.documentElement.style.setProperty("--hud-card-bg", theme.hudCardBg);
  document.documentElement.style.setProperty("--hud-card-border", theme.hudCardBorder);
  document.documentElement.style.setProperty("--hud-card-text", theme.hudCardText);
  document.documentElement.style.setProperty("--hud-card-label", theme.hudCardLabel);
}

function showResult(isWin) {
  const hasNext = game.currentLevelNumber < LEVELS.length && game.progress.unlockedLevel >= game.currentLevelNumber + 1;

  hidePauseMenuOverlay();
  ui.phaseMenu.classList.add("hidden");
  game.phaseMenuSource = null;
  ui.resultBadge.className = `result-badge ${isWin ? "win" : "lose"}`;
  ui.resultBadge.textContent = isWin ? "Fase concluída" : "Fim dos disparos";
  ui.resultTitle.textContent = isWin ? `Você passou da ${ordinalLevel(game.currentLevelNumber)} fase` : "Tente outra estratégia";

  if (isWin) {
    const nextText =
      game.currentLevelNumber < LEVELS.length
        ? `A próxima fase foi desbloqueada.`
        : "Você concluiu todas as fases disponíveis.";
    ui.resultText.textContent = `Todos os blocos foram derrubados com ${game.shotsRemaining} disparo(s) restante(s). ${nextText}`;
  } else {
    ui.resultText.textContent =
      "Você ficou sem disparos antes de derrubar todos os blocos. Reinicie a fase ou escolha outra fase desbloqueada.";
  }

  ui.resultNextBtn.disabled = !hasNext || !isWin;
  ui.resultOverlay.classList.remove("hidden");
}

function hideResult() {
  ui.resultOverlay.classList.add("hidden");
}

function startLevel(levelNumber) {
  const level = LEVELS[levelNumber - 1];
  if (!level) {
    return;
  }

  if (levelNumber > game.progress.unlockedLevel) {
    return;
  }

  resetScene();
  game.phaseMenuSource = null;
  ui.phaseMenu.classList.add("hidden");
  hidePauseMenuOverlay();
  hideResult();
  game.isPaused = false;
  engine.timing.timeScale = 1;
  runner.enabled = true;

  game.currentLevelNumber = levelNumber;
  game.currentLevel = level;
  game.currentTheme = getThemeForLevel(levelNumber);
  // Prevent a race where the engine loop runs before targets are built and marks an instant win.
  game.levelState = "loading";
  game.shotsLimit = level.shots;
  game.shotsRemaining = level.shots;
  game.projectileState = "none";
  game.dragging = false;
  game.dragPointerId = null;
  game.noShotSettleFrames = 0;
  game.progress.lastSelectedLevel = levelNumber;
  game.progress.fresh = false;
  saveProgress();

  applyPhaseTheme(game.currentTheme);
  applySettings();
  tryStartBackgroundAudio();
  buildLevelScene(level);
  game.targetsRemaining = countRemainingTargets();
  game.levelState = "playing";
  spawnProjectile();
  updateStatus("Arraste a bala no estilingue e solte para disparar.");
  updateHud();
  renderLevelGrid();
  updateProgressText();
}

function resetScene() {
  game.dragging = false;
  game.dragPointerId = null;
  game.currentProjectile = null;
  game.elastic = null;
  game.targetBlocks = [];
  game.worldBodies = [];
  game.projectileState = "none";
  game.noShotSettleFrames = 0;
  game.phaseMenuSource = null;

  Composite.clear(world, false, true);
  Engine.clear(engine);
}

function buildLevelScene(level) {
  const m = game.metrics;
  const theme = game.currentTheme;
  const bodies = [];
  const groundGradient = createVerticalGradient(
    m.floorY - m.groundHeight / 2,
    m.floorY + m.groundHeight / 2,
    lightenOrDarkenHex(theme.ground, 0.12),
    darkenHex(theme.ground, 0.12)
  );

  const ground = Bodies.rectangle(m.width / 2, m.height - m.groundHeight / 2, m.width, m.groundHeight, {
    isStatic: true,
    render: {
      fillStyle: groundGradient,
      strokeStyle: darkenHex(theme.ground, 0.2),
      lineWidth: 2
    }
  });

  const leftWall = Bodies.rectangle(-m.wallThickness / 2, m.height / 2, m.wallThickness, m.height * 2, {
    isStatic: true,
    render: { visible: false }
  });

  const rightWall = Bodies.rectangle(m.width + m.wallThickness / 2, m.height / 2, m.wallThickness, m.height * 2, {
    isStatic: true,
    render: { visible: false }
  });

  const ceiling = Bodies.rectangle(m.width / 2, -m.wallThickness / 2, m.width * 2, m.wallThickness, {
    isStatic: true,
    render: { visible: false }
  });

  const launchPad = Bodies.rectangle(m.anchor.x, m.anchor.y + 44, 120, 16, {
    isStatic: true,
    collisionFilter: { mask: 0 },
    angle: -0.25,
    render: { visible: false }
  });

  const slingPost = Bodies.rectangle(m.anchor.x - 24, m.anchor.y + 12, 14, 72, {
    isStatic: true,
    collisionFilter: { mask: 0 },
    angle: -0.08,
    render: { visible: false }
  });

  const slingPost2 = Bodies.rectangle(m.anchor.x + 14, m.anchor.y + 18, 14, 62, {
    isStatic: true,
    collisionFilter: { mask: 0 },
    angle: 0.14,
    render: { visible: false }
  });

  const markerBodies = createDistanceMarkers(level);

  bodies.push(ground, leftWall, rightWall, ceiling, launchPad, slingPost, slingPost2, ...markerBodies);

  const { targetBodies, targetMeta } = createLevelTargets(level);
  game.targetBlocks = targetMeta;
  bodies.push(...targetBodies);

  Composite.add(world, bodies);

  const elastic = Constraint.create({
    pointA: { x: m.anchor.x, y: m.anchor.y },
    pointB: { x: 0, y: 0 },
    length: 0.01,
    stiffness: 0.055,
    damping: 0.015,
    render: {
      visible: true,
      lineWidth: 2,
      strokeStyle: COLORS.white
    }
  });

  Composite.add(world, elastic);

  game.worldBodies = bodies;
  game.elastic = elastic;
}

function createDistanceMarkers(level) {
  const m = game.metrics;
  const theme = game.currentTheme;
  const nearX = Math.max(m.anchor.x + 210, m.width * 0.42);
  const farX = m.width - 96;
  const range = Math.max(80, farX - nearX);

  return level.groups.map((group, index) => {
    const x = clamp(nearX + range * group.distance, nearX, farX);
    return Bodies.rectangle(x, m.floorY + theme.markerHeight / 2 + 4, theme.markerWidth, theme.markerHeight, {
      isStatic: true,
      angle: (index % 2 ? 1 : -1) * theme.markerAngle,
      render: { fillStyle: theme.marker }
    });
  });
}

function createLevelTargets(level) {
  const m = game.metrics;
  const theme = game.currentTheme;
  const nearX = Math.max(m.anchor.x + 210, m.width * 0.42);
  const farX = m.width - 96;
  const range = Math.max(80, farX - nearX);

  const targetBodies = [];
  const targetMeta = [];

  level.groups.forEach((group) => {
    const x = clamp(nearX + range * group.distance, nearX, farX);
    const platformY = clamp(m.floorY - group.rise, 120, m.floorY - 18);
    const platformThickness = theme.platformThickness;

    const platform = Bodies.rectangle(x, platformY, group.platformWidth, platformThickness, {
      isStatic: true,
      chamfer: { radius: Math.min(10, Math.max(3, theme.blockChamfer)) },
      render: {
        fillStyle: createVerticalGradient(
          platformY - platformThickness / 2,
          platformY + platformThickness / 2,
          lightenOrDarkenHex(theme.platform, 0.09),
          darkenHex(theme.platform, 0.1)
        ),
        strokeStyle: theme.platformStroke,
        lineWidth: 2
      }
    });
    targetBodies.push(platform);

    const blockW = theme.blockW;
    const blockH = theme.blockH;
    const gapX = 2;
    const gapY = 2;
    const totalWidth = group.cols * blockW + (group.cols - 1) * gapX;
    const leftX = x - totalWidth / 2 + blockW / 2;
    const baseY = platformY - platformThickness / 2 - 4 - blockH / 2;

    for (let row = 0; row < group.rows; row += 1) {
      for (let col = 0; col < group.cols; col += 1) {
        const blockX = leftX + col * (blockW + gapX);
        const blockY = baseY - row * (blockH + gapY);
        const block = makeTargetBlock(blockX, blockY, blockW, blockH);

        targetBodies.push(block);
        targetMeta.push({
          body: block,
          x: blockX,
          y: blockY,
          w: blockW,
          h: blockH,
          cleared: false
        });
      }
    }
  });

  return { targetBodies, targetMeta };
}

function makeTargetBlock(x, y, w, h) {
  const theme = game.currentTheme;
  const fillVariant = varyColorSoft(theme.targetFill, x, y, 0.09);
  const strokeVariant = varyColorSoft(theme.targetStroke, x + 17, y - 11, 0.05);

  return Bodies.rectangle(x, y, w, h, {
    chamfer: { radius: theme.blockChamfer },
    friction: 0.7,
    restitution: 0.06,
    density: 0.0023,
    render: {
      fillStyle: fillVariant,
      strokeStyle: strokeVariant,
      lineWidth: theme.blockLineWidth
    }
  });
}

function spawnProjectile() {
  if (game.levelState !== "playing" || game.shotsRemaining <= 0 || game.isPaused) {
    return;
  }

  const m = game.metrics;
  const theme = game.currentTheme;
  const projectileRadius = Math.max(12, Math.round(m.projectileRadius * theme.projectileRadiusScale));
  const projectile = Bodies.polygon(m.anchor.x, m.anchor.y, 8, projectileRadius, {
    density: 0.004,
    restitution: 0.75,
    friction: 0.006,
    frictionAir: 0.002,
    render: {
      visible: false,
      fillStyle: "#9a9a9a",
      strokeStyle: "#e6e6e6",
      lineWidth: 2
    }
  });

  Composite.add(world, projectile);
  Body.setStatic(projectile, true);
  game.currentProjectile = projectile;
  game.projectileState = "armed";
  game.elastic.pointB = { x: 0, y: 0 };
  game.elastic.bodyB = projectile;
  updateHud();
}

function applyDragToProjectile(pointer) {
  if (!game.currentProjectile || game.projectileState !== "armed") {
    return;
  }

  const anchor = game.metrics.anchor;
  const dx = pointer.x - anchor.x;
  const dy = pointer.y - anchor.y;
  const distance = Math.hypot(dx, dy);
  const maxDrag = game.metrics.maxDrag;
  const scale = distance > maxDrag ? maxDrag / distance : 1;

  const clampedPosition = {
    x: anchor.x + dx * scale,
    y: anchor.y + dy * scale
  };

  Body.setPosition(game.currentProjectile, clampedPosition);
  Body.setVelocity(game.currentProjectile, { x: 0, y: 0 });
  Body.setAngularVelocity(game.currentProjectile, 0);
  Body.setAngle(game.currentProjectile, 0);
}

function computeLaunchVelocityForPosition(position) {
  const anchor = game.metrics.anchor;
  const power = (game.currentTheme?.launchPower || 0.22) * LAUNCH_POWER_MULTIPLIER;
  const velocity = {
    x: (anchor.x - position.x) * power,
    y: (anchor.y - position.y) * power
  };

  return clampVectorMagnitude(velocity, game.metrics.projectileMaxSpeed);
}

function finishDrag(event) {
  if (!game.dragging || event.pointerId !== game.dragPointerId) {
    return;
  }

  const projectile = game.currentProjectile;
  game.dragging = false;

  try {
    render.canvas.releasePointerCapture(event.pointerId);
  } catch {
    /* noop */
  }

  game.dragPointerId = null;

  if (!projectile || game.projectileState !== "armed") {
    return;
  }

  const stretch = getDistance(projectile.position, game.metrics.anchor);

  if (stretch < game.metrics.minLaunchDrag) {
    Body.setPosition(projectile, { ...game.metrics.anchor });
    Body.setVelocity(projectile, { x: 0, y: 0 });
    Body.setAngularVelocity(projectile, 0);
    Body.setAngle(projectile, 0);
    Body.setStatic(projectile, true);
    updateStatus("Puxe um pouco mais para disparar.");
    return;
  }

  Body.setStatic(projectile, false);
  if (game.elastic) {
    game.elastic.bodyB = null;
  }
  Body.setVelocity(projectile, computeLaunchVelocityForPosition(projectile.position));
  Body.setAngularVelocity(projectile, (projectile.velocity.x || 0) * 0.01);
  game.projectileState = "launched";
  game.projectileReleasedAt = performance.now();
  playShotSound();
  game.shotsRemaining = Math.max(0, game.shotsRemaining - 1);
  game.noShotSettleFrames = 0;

  updateStatus(
    game.shotsRemaining > 0
      ? `Disparo realizado. Restam ${game.shotsRemaining} disparo(s).`
      : "Último disparo lançado. Aguardando resultado..."
  );
  updateHud();
}

function drawTrajectoryGuide() {
  if (
    !game.settings.showTrajectory ||
    game.isPaused ||
    game.levelState !== "playing" ||
    game.projectileState !== "armed" ||
    !game.currentProjectile ||
    !game.dragging
  ) {
    return;
  }

  const trajectory = simulateTrajectory();
  if (trajectory.length < 2) {
    return;
  }

  const ctx = render.context;
  const theme = game.currentTheme;

  ctx.save();
  ctx.globalAlpha = theme.trajectoryAlpha;
  ctx.strokeStyle = theme.trajectoryColor;
  ctx.lineWidth = theme.trajectoryWidth;
  ctx.setLineDash(theme.trajectoryDash);
  ctx.beginPath();
  ctx.moveTo(game.currentProjectile.position.x, game.currentProjectile.position.y);

  for (const point of trajectory) {
    ctx.lineTo(point.x, point.y);
  }

  ctx.stroke();
  ctx.setLineDash([]);

  const dotRadius = theme.trajectoryDotRadius;
  for (let i = 2; i < trajectory.length; i += 3) {
    const point = trajectory[i];
    const alphaStep = Math.max(0.2, 1 - i / (trajectory.length + 6));
    ctx.globalAlpha = theme.trajectoryAlpha * alphaStep;
    ctx.beginPath();
    ctx.arc(point.x, point.y, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = theme.projectileFill;
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = theme.projectileStroke;
    ctx.stroke();
  }

  ctx.restore();
}

function drawSlingshotVisual() {
  const ctx = render.context;
  const m = game.metrics;
  const theme = game.currentTheme;

  if (!ctx || !m || !theme) {
    return;
  }

  const baseCenter = { x: m.anchor.x, y: m.anchor.y + 44 };
  const leftPost = { x: m.anchor.x - 24, y: m.anchor.y + 12, w: 14, h: 72, angle: -0.08 };
  const rightPost = { x: m.anchor.x + 14, y: m.anchor.y + 18, w: 14, h: 62, angle: 0.14 };
  const base = { x: baseCenter.x, y: baseCenter.y, w: 120, h: 16, angle: -0.25 };

  ctx.save();

  drawGradientRoundedRect(ctx, leftPost, {
    top: lightenOrDarkenHex(theme.slingPostA, 0.08),
    bottom: darkenHex(theme.slingPostA, 0.12),
    stroke: lightenOrDarkenHex(theme.slingBand, -0.15),
    radius: 4
  });

  drawGradientRoundedRect(ctx, rightPost, {
    top: lightenOrDarkenHex(theme.slingPostB, 0.08),
    bottom: darkenHex(theme.slingPostB, 0.12),
    stroke: lightenOrDarkenHex(theme.slingBand, -0.2),
    radius: 4
  });

  drawGradientRoundedRect(ctx, base, {
    top: lightenOrDarkenHex(theme.slingBase, 0.14),
    bottom: darkenHex(theme.slingBase, 0.14),
    stroke: lightenOrDarkenHex(theme.slingBand, -0.25),
    radius: 6
  });

  const leftFork = { x: m.anchor.x - 12, y: m.anchor.y - 12 };
  const rightFork = { x: m.anchor.x + 10, y: m.anchor.y - 10 };
  const hasPouch = game.projectileState === "armed" && Boolean(game.currentProjectile);
  const pouch = hasPouch ? game.currentProjectile.position : { x: m.anchor.x - 1, y: m.anchor.y - 10 };

  // The custom slingshot is drawn after Matter bodies, so redraw the armed projectile here
  // to avoid it being hidden behind the posts/base.
  if (hasPouch && game.currentProjectile.circleRadius) {
    const projectile = game.currentProjectile;
    const pr = projectile.circleRadius;
    const fill = projectile.render?.fillStyle || theme.projectileFill;
    const stroke = projectile.render?.strokeStyle || theme.projectileStroke;
    const lineWidth = projectile.render?.lineWidth || 2;

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(projectile.position.x, projectile.position.y, pr, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.globalAlpha = 0.18;
    ctx.fillStyle = COLORS.white;
    ctx.beginPath();
    ctx.arc(projectile.position.x - pr * 0.25, projectile.position.y - pr * 0.25, pr * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.lineCap = "round";
  ctx.strokeStyle = theme.slingBand;
  ctx.lineWidth = 4;
  ctx.globalAlpha = hasPouch ? 1 : 0.75;
  ctx.beginPath();
  ctx.moveTo(leftFork.x, leftFork.y);
  ctx.lineTo(pouch.x, pouch.y);
  ctx.moveTo(rightFork.x, rightFork.y);
  ctx.lineTo(pouch.x, pouch.y);
  ctx.stroke();

  ctx.fillStyle = theme.slingBand;
  ctx.beginPath();
  ctx.arc(leftFork.x, leftFork.y, 2.5, 0, Math.PI * 2);
  ctx.arc(rightFork.x, rightFork.y, 2.5, 0, Math.PI * 2);
  ctx.fill();

  if (hasPouch) {
    ctx.fillStyle = darkenHex(theme.slingBand, 0.22);
    ctx.beginPath();
    ctx.arc(pouch.x, pouch.y, 3.3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawProjectileVisual() {
  const body = game.currentProjectile;
  const ctx = render.context;

  if (!body || !ctx) {
    return;
  }

  const fill = body.render?.fillStyle || "#9a9a9a";
  const stroke = body.render?.strokeStyle || "#e6e6e6";
  const lineWidth = body.render?.lineWidth || 2;

  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;

  if (body.vertices && body.vertices.length > 1) {
    ctx.beginPath();
    ctx.moveTo(body.vertices[0].x, body.vertices[0].y);
    for (let i = 1; i < body.vertices.length; i += 1) {
      ctx.lineTo(body.vertices[i].x, body.vertices[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (body.circleRadius) {
    ctx.beginPath();
    ctx.arc(body.position.x, body.position.y, body.circleRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function drawGradientRoundedRect(ctx, rect, colors) {
  ctx.save();
  ctx.translate(rect.x, rect.y);
  ctx.rotate(rect.angle || 0);

  const gradient = ctx.createLinearGradient(0, -rect.h / 2, 0, rect.h / 2);
  gradient.addColorStop(0, colors.top);
  gradient.addColorStop(1, colors.bottom);

  ctx.fillStyle = gradient;
  roundedRectPath(ctx, -rect.w / 2, -rect.h / 2, rect.w, rect.h, colors.radius || 4);
  ctx.fill();

  ctx.lineWidth = 2;
  ctx.strokeStyle = colors.stroke;
  roundedRectPath(ctx, -rect.w / 2, -rect.h / 2, rect.w, rect.h, colors.radius || 4);
  ctx.stroke();

  ctx.restore();
}

function roundedRectPath(ctx, x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

function simulateTrajectory() {
  const projectile = game.currentProjectile;
  if (!projectile) {
    return [];
  }

  const start = { x: projectile.position.x, y: projectile.position.y };
  if (getDistance(start, game.metrics.anchor) < game.metrics.minLaunchDrag) {
    return [];
  }

  const radius = projectile.circleRadius || game.metrics.projectileRadius;
  const launch = computeLaunchVelocityForPosition(start);
  const points = [];
  const metrics = game.metrics;
  const collisionBodies = getTrajectoryCollisionBodies();

  let x = start.x;
  let y = start.y;
  let vx = launch.x;
  let vy = launch.y;

  const gravityPerStep = engine.world.gravity.y || 1;
  const airFactor = Math.max(0.985, 1 - (projectile.frictionAir || 0.002) * 1.5);
  let previousPoint = { x, y };

  for (let i = 0; i < 75; i += 1) {
    x += vx;
    y += vy;
    vy += gravityPerStep;
    vx *= airFactor;
    vy *= airFactor;

    const nextPoint = { x, y };
    const rayHits = Query.ray(collisionBodies, previousPoint, nextPoint, Math.max(2, radius * 0.7));

    if (rayHits.length > 0) {
      points.push(getClosestRayHitPoint(rayHits, previousPoint, nextPoint));
      break;
    }

    points.push(nextPoint);
    previousPoint = nextPoint;

    if (x < -120 || x > metrics.width + 120 || y > metrics.height + 140 || y < -120) {
      break;
    }

    if (i > 18 && Math.abs(vx) + Math.abs(vy) < 0.45) {
      break;
    }
  }

  return points;
}

function getTrajectoryCollisionBodies() {
  return Composite.allBodies(world).filter((body) => {
    if (!body || body === game.currentProjectile) {
      return false;
    }

    if (body.isSensor) {
      return false;
    }

    if (body.collisionFilter && body.collisionFilter.mask === 0) {
      return false;
    }

    return true;
  });
}

function getClosestRayHitPoint(rayHits, fromPoint, fallbackPoint) {
  let bestPoint = fallbackPoint;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const hit of rayHits) {
    const supportPoints = hit?.supports?.length ? hit.supports : [fallbackPoint];
    for (const point of supportPoints) {
      if (!point || typeof point.x !== "number" || typeof point.y !== "number") {
        continue;
      }

      const distance = getDistance(fromPoint, point);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestPoint = { x: point.x, y: point.y };
      }
    }
  }

  return bestPoint;
}

function updateProjectileLifecycle() {
  const projectile = game.currentProjectile;
  if (!projectile || game.projectileState !== "launched") {
    return;
  }

  if (Body.getSpeed(projectile) > game.metrics.projectileMaxSpeed) {
    Body.setSpeed(projectile, game.metrics.projectileMaxSpeed);
  }

  const now = performance.now();
  const anchor = game.metrics.anchor;
  const distanceFromAnchor = getDistance(projectile.position, anchor);

  if (
    game.elastic &&
    game.elastic.bodyB === projectile &&
    now - game.projectileReleasedAt > 90 &&
    distanceFromAnchor > game.metrics.projectileRadius * 4
  ) {
    game.elastic.bodyB = null;
  }

  if (shouldRetireProjectile(projectile, now)) {
    retireProjectile();
  }
}

function shouldRetireProjectile(projectile, now) {
  const p = projectile.position;
  const outOfBounds =
    p.x < -220 ||
    p.x > game.metrics.width + 220 ||
    p.y > game.metrics.height + 240 ||
    p.y < -220;

  if (outOfBounds) {
    return true;
  }

  const elapsed = now - game.projectileReleasedAt;
  const speed = Body.getSpeed(projectile);
  const anchorDistance = getDistance(p, game.metrics.anchor);

  if (elapsed > 1800 && anchorDistance > 120 && speed < 0.35) {
    return true;
  }

  if (elapsed > 3200 && speed < 1) {
    return true;
  }

  return false;
}

function retireProjectile() {
  if (!game.currentProjectile) {
    return;
  }

  if (game.elastic && game.elastic.bodyB === game.currentProjectile) {
    game.elastic.bodyB = null;
  }

  Composite.remove(world, game.currentProjectile);
  game.currentProjectile = null;
  game.projectileState = "none";
  game.dragging = false;
  game.dragPointerId = null;

  if (game.levelState !== "playing") {
    return;
  }

  if (game.targetsRemaining <= 0) {
    return;
  }

  if (game.shotsRemaining > 0) {
    spawnProjectile();
    updateStatus("Novo disparo pronto no estilingue.");
  } else {
    updateStatus("Sem disparos restantes. Aguardando blocos pararem...");
  }
}

function updateTargetProgress() {
  let changed = false;
  let remaining = 0;

  for (const target of game.targetBlocks) {
    if (!target.cleared && isTargetCleared(target)) {
      target.cleared = true;
      target.body.render.opacity = 0.5;
      target.body.render.strokeStyle = game.currentTheme.platformStroke;
      changed = true;
    }

    if (!target.cleared) {
      remaining += 1;
    }
  }

  if (remaining !== game.targetsRemaining) {
    game.targetsRemaining = remaining;
    changed = true;
  }

  if (changed) {
    updateHud();
  }

  if (game.targetsRemaining === 0) {
    endLevel(true);
  }
}

function isTargetCleared(target) {
  const body = target.body;
  const dx = Math.abs(body.position.x - target.x);
  const dy = body.position.y - target.y;
  const angle = Math.abs(normalizeAngle(body.angle));
  const reachedGround = body.position.y > game.metrics.floorY - target.h * 0.35;

  return dy > target.h * 0.6 || dx > target.w * 1.15 || angle > 0.9 || reachedGround;
}

function evaluateLoseCondition() {
  if (game.levelState !== "playing" || game.targetsRemaining === 0) {
    return;
  }

  if (game.shotsRemaining > 0 || game.currentProjectile) {
    game.noShotSettleFrames = 0;
    return;
  }

  const movingBlocks = game.targetBlocks.some(
    (target) => !target.cleared && (Body.getSpeed(target.body) > 0.25 || Math.abs(target.body.angularVelocity) > 0.03)
  );

  if (movingBlocks) {
    game.noShotSettleFrames = 0;
    return;
  }

  game.noShotSettleFrames += 1;

  if (game.noShotSettleFrames > 35) {
    endLevel(false);
  }
}

function endLevel(isWin) {
  if (game.levelState !== "playing") {
    return;
  }

  game.levelState = isWin ? "won" : "lost";
  game.isPaused = false;
  engine.timing.timeScale = 1;
  runner.enabled = true;
  game.dragging = false;
  game.dragPointerId = null;

  if (game.elastic) {
    game.elastic.bodyB = null;
  }

  if (isWin) {
    game.progress.completed[game.currentLevelNumber] = true;

    if (game.currentLevelNumber < LEVELS.length) {
      game.progress.unlockedLevel = Math.max(game.progress.unlockedLevel, game.currentLevelNumber + 1);
    }

    saveProgress();
    renderLevelGrid();
    updateProgressText();
    updateStatus("Vitória! Todos os blocos foram derrubados.");
  } else {
    updateStatus("Derrota: acabaram os disparos.");
  }

  applySettings();
  updateHud();
  showResult(isWin);
}

function updateHud() {
  ui.hudPhase.textContent = `${game.currentLevelNumber} / ${LEVELS.length}`;
  ui.hudShots.textContent = `${game.shotsRemaining} / ${game.shotsLimit}`;
  ui.hudTargets.textContent = `${game.targetsRemaining}`;
  ui.pauseBtn.disabled = game.levelState !== "playing";
  ui.pauseBtn.textContent = game.isPaused ? "Pausado" : "Pausar";
}

function updateStatus(text) {
  game.lastStatusText = text;
  if (ui.hudStatus) {
    ui.hudStatus.textContent = text;
  }
}

function countRemainingTargets() {
  return game.targetBlocks.reduce((sum, target) => sum + (target.cleared ? 0 : 1), 0);
}

function getPointerPosition(event) {
  const rect = render.canvas.getBoundingClientRect();
  const scaleX = render.options.width / rect.width;
  const scaleY = render.options.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

function getDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function normalizeAngle(angle) {
  let normalized = angle % (Math.PI * 2);
  if (normalized > Math.PI) {
    normalized -= Math.PI * 2;
  } else if (normalized < -Math.PI) {
    normalized += Math.PI * 2;
  }
  return normalized;
}

function createVerticalGradient(y1, y2, colorTop, colorBottom) {
  if (!render?.context) {
    return colorTop;
  }

  const gradient = render.context.createLinearGradient(0, y1, 0, y2);
  gradient.addColorStop(0, colorTop);
  gradient.addColorStop(1, colorBottom);
  return gradient;
}

function varyColorSoft(baseColor, xSeed, ySeed, strength = 0.08) {
  const seed = pseudoRandom01(xSeed * 0.73 + ySeed * 1.17);
  const signed = seed * 2 - 1;

  if (signed >= 0) {
    return mixHexColors(baseColor, COLORS.white, signed * strength);
  }

  return mixHexColors(baseColor, COLORS.black, Math.abs(signed) * strength);
}

function pseudoRandom01(seed) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function lightenOrDarkenHex(hex, amount) {
  if (amount >= 0) {
    return mixHexColors(hex, COLORS.white, amount);
  }

  return mixHexColors(hex, COLORS.black, Math.abs(amount));
}

function darkenHex(hex, amount) {
  return mixHexColors(hex, COLORS.black, amount);
}

function mixHexColors(hexA, hexB, t) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const mix = clamp(t, 0, 1);

  const r = Math.round(a.r + (b.r - a.r) * mix);
  const g = Math.round(a.g + (b.g - a.g) * mix);
  const bChannel = Math.round(a.b + (b.b - a.b) * mix);

  return rgbToHex(r, g, bChannel);
}

function hexToRgb(hex) {
  const normalized = String(hex || "").replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((ch) => ch + ch).join("")
    : normalized;

  return {
    r: Number.parseInt(value.slice(0, 2), 16) || 0,
    g: Number.parseInt(value.slice(2, 4), 16) || 0,
    b: Number.parseInt(value.slice(4, 6), 16) || 0
  };
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeVolumeSetting(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  if (parsed > 1 && parsed <= 100) {
    return clamp(parsed / 100, 0, 1);
  }

  return clamp(parsed, 0, 1);
}

function clampVectorMagnitude(vector, maxMagnitude) {
  const magnitude = Math.hypot(vector.x, vector.y);
  if (magnitude <= maxMagnitude || magnitude === 0) {
    return vector;
  }

  const scale = maxMagnitude / magnitude;
  return {
    x: vector.x * scale,
    y: vector.y * scale
  };
}

function ordinalLevel(levelNumber) {
  return `${levelNumber}ª`;
}
