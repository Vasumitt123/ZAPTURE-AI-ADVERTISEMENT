/* ── STUDIO MULTI-STEP WIZARD ── */

// ── State ──
const state = {
  step: 1,
  format: null,        // 'poster' | 'video'
  prompt: '',
  brand: '',
  tagline: '',
  headline: '',
  images: [],
  // poster options
  style: 'modern',
  palette: 'violet',
  ratio: 'square',
  // video options
  voice: 'female',
  tone: 'energetic',
  music: 'cinematic',
  duration: '30s',
  animation: 'dynamic',
};

// ── DOM refs ──
const steps      = document.querySelectorAll('.step-panel');
const circles    = document.querySelectorAll('.step-circle');
const connectors = document.querySelectorAll('.step-connector');
const labels     = document.querySelectorAll('.step-label');
const paywallOverlay = document.getElementById('paywallOverlay');
const checkoutForm   = document.getElementById('checkoutForm');

// ── Step navigation ──
function goTo(n) {
  state.step = n;
  steps.forEach((p, i) => p.classList.toggle('active', i + 1 === n));
  circles.forEach((c, i) => {
    c.classList.remove('active', 'done');
    if (i + 1 === n) c.classList.add('active');
    if (i + 1 < n)  c.classList.add('done');
  });
  connectors.forEach((c, i) => c.classList.toggle('done', i + 1 < n));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (n === 3) renderStep3();
  if (n === 4) renderSummary();
}

function nextStep() {
  if (!validateStep(state.step)) return;
  if (state.step < 4) goTo(state.step + 1);
}
function prevStep() { if (state.step > 1) goTo(state.step - 1); }

// ── Validation ──
function validateStep(n) {
  if (n === 1 && !state.format) { shake(document.querySelector('.format-grid')); return false; }
  if (n === 2 && !state.prompt.trim()) {
    const ta = document.getElementById('promptInput');
    ta.focus(); ta.style.borderColor = 'var(--danger)'; setTimeout(() => ta.style.borderColor = '', 2000);
    return false;
  }
  return true;
}
function shake(el) {
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => el.style.animation = '', 400);
}

// ── Step 1: Format selection ──
document.querySelectorAll('.format-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.format-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.format = card.dataset.format;
  });
});

// ── Step 2: Prompt & uploads ──
const promptInput = document.getElementById('promptInput');
const charCounter = document.getElementById('charCounter');
promptInput?.addEventListener('input', () => {
  state.prompt = promptInput.value;
  charCounter.textContent = promptInput.value.length + '/500';
});

document.getElementById('brandInput')?.addEventListener('input', e => state.brand = e.target.value);
document.getElementById('taglineInput')?.addEventListener('input', e => state.tagline = e.target.value);
document.getElementById('headlineInput')?.addEventListener('input', e => state.headline = e.target.value);

// Upload
const uploadZone = document.getElementById('uploadZone');
const fileInput  = document.getElementById('fileInput');
const previews   = document.getElementById('imagePreviews');

uploadZone?.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone?.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone?.addEventListener('drop', e => {
  e.preventDefault(); uploadZone.classList.remove('drag-over');
  handleFiles(e.dataTransfer.files);
});
fileInput?.addEventListener('change', () => handleFiles(fileInput.files));

function handleFiles(files) {
  [...files].slice(0, 3 - state.images.length).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => { state.images.push(img); renderPreviews(); };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function renderPreviews() {
  if (!previews) return;
  previews.innerHTML = '';
  state.images.forEach((img, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'image-thumb-wrap';
    const el = document.createElement('img');
    el.src = img.src; el.className = 'image-thumb';
    const rm = document.createElement('button');
    rm.className = 'remove-img'; rm.textContent = '✕';
    rm.onclick = () => { state.images.splice(idx, 1); renderPreviews(); };
    wrap.appendChild(el); wrap.appendChild(rm);
    previews.appendChild(wrap);
  });
}

// ── Step 3: Style options ──
function renderStep3() {
  const container = document.getElementById('step3Options');
  if (!container) return;

  if (state.format === 'poster') {
    container.innerHTML = `
      <div class="options-section">
        <h3>🎨 Ad Style</h3>
        <div class="option-chips" id="styleChips">
          ${['Modern','Minimal','Bold','Retro'].map(s =>
            `<button class="option-chip ${state.style===s.toLowerCase()?'selected':''}" data-val="${s.toLowerCase()}" data-group="style">${s}</button>`
          ).join('')}
        </div>
      </div>
      <div class="options-section">
        <h3>🖌️ Color Palette</h3>
        <div class="option-chips" id="paletteChips">
          ${[
            {id:'violet',color:'#7C3AED'},
            {id:'ocean',color:'#0EA5E9'},
            {id:'sunset',color:'#EA580C'},
            {id:'forest',color:'#16A34A'},
            {id:'rose',color:'#E11D48'},
            {id:'golden',color:'#D97706'},
          ].map(p =>
            `<div class="color-chip ${state.palette===p.id?'selected':''}" data-val="${p.id}" data-group="palette" style="background:${p.color}" title="${p.id}"></div>`
          ).join('')}
        </div>
      </div>
      <div class="options-section">
        <h3>📐 Aspect Ratio</h3>
        <div class="option-chips" id="ratioChips">
          ${[['square','1:1 Square'],['portrait','4:5 Portrait'],['landscape','16:9 Landscape']].map(([id,label]) =>
            `<button class="option-chip ${state.ratio===id?'selected':''}" data-val="${id}" data-group="ratio">${label}</button>`
          ).join('')}
        </div>
      </div>`;
  } else {
    container.innerHTML = `
      <div class="options-section">
        <h3>🎤 Voice Style</h3>
        <div class="option-chips">
          ${[['female','👩 Female'],['male','👨 Male'],['neutral','🤖 Neutral']].map(([id,label]) =>
            `<button class="option-chip ${state.voice===id?'selected':''}" data-val="${id}" data-group="voice">${label}</button>`
          ).join('')}
        </div>
      </div>
      <div class="options-section">
        <h3>✨ Tone & Energy</h3>
        <div class="option-chips">
          ${[['energetic','⚡ Energetic'],['calm','🌊 Calm'],['professional','💼 Professional'],['playful','🎉 Playful']].map(([id,label]) =>
            `<button class="option-chip ${state.tone===id?'selected':''}" data-val="${id}" data-group="tone">${label}</button>`
          ).join('')}
        </div>
      </div>
      <div class="options-section">
        <h3>🎵 Background Music</h3>
        <div class="option-chips">
          ${[['cinematic','🎬 Cinematic'],['upbeat','🎸 Upbeat'],['corporate','🏢 Corporate'],['ambient','🌙 Ambient'],['none','🔇 None']].map(([id,label]) =>
            `<button class="option-chip ${state.music===id?'selected':''}" data-val="${id}" data-group="music">${label}</button>`
          ).join('')}
        </div>
      </div>
      <div class="options-section">
        <h3>⏱️ Duration</h3>
        <div class="option-chips">
          ${[['15s','15 Seconds'],['30s','30 Seconds']].map(([id,label]) =>
            `<button class="option-chip ${state.duration===id?'selected':''}" data-val="${id}" data-group="duration">${label}</button>`
          ).join('')}
        </div>
      </div>
      <div class="options-section">
        <h3>🎞️ Animation Style</h3>
        <div class="option-chips">
          ${[['dynamic','💥 Dynamic'],['smooth','🌊 Smooth'],['minimal','◽ Minimal']].map(([id,label]) =>
            `<button class="option-chip ${state.animation===id?'selected':''}" data-val="${id}" data-group="animation">${label}</button>`
          ).join('')}
        </div>
      </div>`;
  }

  // Bind option clicks
  container.querySelectorAll('.option-chip, .color-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const group = chip.dataset.group;
      const val   = chip.dataset.val;
      state[group] = val;
      container.querySelectorAll(`[data-group="${group}"]`).forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });
}

// ── Step 4: Summary ──
function renderSummary() {
  const el = document.getElementById('summaryContent');
  if (!el) return;
  const rows = [
    ['Format',  state.format === 'poster' ? '🖼️ Poster' : '🎬 30s Video'],
    ['Prompt',  state.prompt.substring(0, 80) + (state.prompt.length > 80 ? '…' : '')],
    ['Brand',   state.brand || '—'],
    ['Headline', state.headline || 'Auto-generated'],
    ...(state.format === 'poster' ? [
      ['Style',   state.style],
      ['Palette', state.palette],
      ['Ratio',   state.ratio],
    ] : [
      ['Voice',     state.voice],
      ['Tone',      state.tone],
      ['Music',     state.music],
      ['Duration',  state.duration],
      ['Animation', state.animation],
    ]),
    ['Images',  state.images.length ? `${state.images.length} uploaded` : 'None'],
  ];
  el.innerHTML = rows.map(([k, v]) =>
    `<div class="summary-item"><span class="summary-key">${k}</span><span class="summary-val">${v}</span></div>`
  ).join('');
}

// ── Generate ──
document.getElementById('generateBtn')?.addEventListener('click', () => {
  if (Trial.isUsed()) { showPaywall(); return; }
  runGeneration();
});

function runGeneration() {
  document.getElementById('step4Content').style.display = 'none';
  const loading = document.getElementById('loadingOverlay');
  loading.classList.add('active');

  const messages = [
    'Analysing your prompt…',
    'Crafting layout & visuals…',
    'Applying AI magic…',
    'Finalising your ad…',
  ];
  let mi = 0;
  const msgEl = document.getElementById('loadingMsg');
  const interval = setInterval(() => {
    if (mi < messages.length) { msgEl.textContent = messages[mi++]; }
  }, 900);

  setTimeout(() => {
    clearInterval(interval);
    loading.classList.remove('active');
    showResult();
    Trial.markUsed();
  }, 4000);
}

function showResult() {
  const resultArea = document.getElementById('resultArea');
  resultArea.classList.add('active');

  document.getElementById('resultTypeBadge').textContent =
    state.format === 'poster' ? '🖼️ Poster' : '🎬 Video';

  const canvas = document.getElementById('resultCanvas');
  const videoWrap = document.getElementById('videoResultWrap');

  if (state.format === 'poster') {
    canvas.style.display = 'block';
    videoWrap.style.display = 'none';
    PosterGenerator.generate(canvas, {
      prompt:   state.prompt,
      brand:    state.brand,
      tagline:  state.tagline,
      headline: state.headline,
      style:    state.style,
      palette:  state.palette,
      image:    state.images[0] || null,
    });
  } else {
    canvas.style.display = 'none';
    videoWrap.style.display = 'block';
    const vidCanvas = document.getElementById('videoThumbCanvas');
    VideoGenerator.generate(vidCanvas, {
      prompt:    state.prompt,
      brand:     state.brand,
      headline:  state.headline,
      voice:     state.voice,
      tone:      state.tone,
      music:     state.music,
      duration:  state.duration,
      animation: state.animation,
      image:     state.images[0] || null,
    });
  }
  resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Download ──
document.getElementById('downloadBtn')?.addEventListener('click', () => {
  const canvas = state.format === 'poster'
    ? document.getElementById('resultCanvas')
    : document.getElementById('videoThumbCanvas');
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = `zapture-${state.format}-${Date.now()}.png`;
  a.click();
});

// ── Create another ──
document.getElementById('createAnotherBtn')?.addEventListener('click', () => {
  if (Trial.isUsed()) { showPaywall(); return; }
  document.getElementById('resultArea').classList.remove('active');
  document.getElementById('step4Content').style.display = 'block';
  goTo(1);
  // reset
  state.format = null; state.prompt = ''; state.brand = ''; state.images = [];
  document.querySelectorAll('.format-card').forEach(c => c.classList.remove('selected'));
  if (promptInput) promptInput.value = '';
  renderPreviews();
});

// ── Paywall ──
function showPaywall() {
  paywallOverlay.classList.add('active');
}
document.getElementById('closePaywall')?.addEventListener('click', () => {
  paywallOverlay.classList.remove('active');
});
paywallOverlay?.addEventListener('click', e => {
  if (e.target === paywallOverlay) paywallOverlay.classList.remove('active');
});

document.getElementById('upgradeBtn')?.addEventListener('click', () => {
  checkoutForm.classList.add('active');
  document.getElementById('upgradeBtn').style.display = 'none';
});

document.getElementById('checkoutSubmit')?.addEventListener('click', () => {
  const btn = document.getElementById('checkoutSubmit');
  btn.textContent = '✓ Payment Successful! (Demo)';
  btn.style.background = 'var(--success)';
  btn.disabled = true;
  setTimeout(() => {
    paywallOverlay.classList.remove('active');
    Trial.reset();
    runGeneration();
  }, 1800);
});

// ── Init ──
goTo(1);

// Add shake keyframe via JS
const style = document.createElement('style');
style.textContent = `@keyframes shake {
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-8px)}
  40%{transform:translateX(8px)}
  60%{transform:translateX(-6px)}
  80%{transform:translateX(6px)}
}`;
document.head.appendChild(style);
