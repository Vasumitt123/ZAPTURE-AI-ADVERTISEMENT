/* ── MOCK POSTER GENERATOR (Canvas API) ── */
const PosterGenerator = {
  colorPalettes: {
    violet:  { bg: '#1E1B4B', accent: '#7C3AED', light: '#A78BFA', text: '#FFFFFF' },
    ocean:   { bg: '#0C1B33', accent: '#0EA5E9', light: '#38BDF8', text: '#FFFFFF' },
    sunset:  { bg: '#1C0A00', accent: '#EA580C', light: '#FB923C', text: '#FFFFFF' },
    forest:  { bg: '#052E16', accent: '#16A34A', light: '#4ADE80', text: '#FFFFFF' },
    rose:    { bg: '#1F0A10', accent: '#E11D48', light: '#FB7185', text: '#FFFFFF' },
    golden:  { bg: '#1A1100', accent: '#D97706', light: '#FCD34D', text: '#FFFFFF' },
  },

  generate(canvas, opts) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width = 800;
    const H = canvas.height = 800;
    const pal = this.colorPalettes[opts.palette] || this.colorPalettes.violet;

    ctx.clearRect(0, 0, W, H);

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, pal.bg);
    bgGrad.addColorStop(1, this._shadeHex(pal.bg, 30));
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Decorative blobs
    this._drawBlob(ctx, W * 0.8, H * 0.15, 260, pal.accent, 0.22);
    this._drawBlob(ctx, W * 0.1, H * 0.85, 220, pal.light, 0.18);
    this._drawBlob(ctx, W * 0.5, H * 0.5, 180, pal.light, 0.08);

    // Grid lines
    this._drawGrid(ctx, W, H, pal.accent);

    // Top accent bar
    ctx.fillStyle = pal.accent;
    ctx.fillRect(0, 0, W, 5);

    // Top badge
    this._drawPill(ctx, 60, 40, opts.brand || 'ZaPTUre AI', pal.accent, pal.light, 14);

    // Uploaded image (if any)
    if (opts.image) {
      this._drawImageFrame(ctx, W / 2 - 160, 120, 320, 220, opts.image, pal);
    }

    const imgOffset = opts.image ? 360 : 140;

    // Main headline
    const headline = opts.headline || opts.prompt?.split(' ').slice(0,6).join(' ') || 'Your Amazing Ad';
    ctx.save();
    ctx.fillStyle = pal.text;
    ctx.font = `bold 52px 'Outfit', sans-serif`;
    ctx.textAlign = 'center';
    this._wrapText(ctx, headline.toUpperCase(), W / 2, imgOffset, W - 120, 60);
    ctx.restore();

    // Sub text
    const sub = opts.prompt ? opts.prompt.substring(0, 90) + (opts.prompt.length > 90 ? '…' : '') : 'Powered by AI';
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.font = `400 22px 'Inter', sans-serif`;
    ctx.textAlign = 'center';
    this._wrapText(ctx, sub, W / 2, imgOffset + (headline.split(' ').length > 4 ? 170 : 130), W - 160, 32);
    ctx.restore();

    // CTA button
    const ctaY = H - 200;
    this._drawButton(ctx, W / 2 - 120, ctaY, 240, 60, 'Get Started Now →', pal.accent, '#fff');

    // Tagline
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = `400 16px 'Inter', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(opts.tagline || 'Create. Inspire. Convert.', W / 2, H - 80);

    // Bottom bar
    ctx.fillStyle = pal.accent;
    ctx.fillRect(0, H - 5, W, 5);

    // Style overlay
    if (opts.style === 'retro') this._applyRetroOverlay(ctx, W, H, pal);
    if (opts.style === 'minimal') this._applyMinimalStrip(ctx, W, H, pal);
  },

  _drawBlob(ctx, x, y, r, color, alpha) {
    const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, color + this._alphaHex(alpha));
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  },

  _drawGrid(ctx, W, H, color) {
    ctx.strokeStyle = color + '18';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  },

  _drawPill(ctx, x, y, text, bg, border, fontSize) {
    ctx.font = `600 ${fontSize}px 'Inter', sans-serif`;
    const tw = ctx.measureText(text).width;
    const pw = tw + 32; const ph = fontSize + 20;
    ctx.fillStyle = bg + '33';
    ctx.strokeStyle = border + '55';
    ctx.lineWidth = 1;
    this._roundRect(ctx, x, y, pw, ph, ph / 2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = border;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + 16, y + ph / 2);
    ctx.textBaseline = 'alphabetic';
  },

  _drawImageFrame(ctx, x, y, w, h, img, pal) {
    ctx.save();
    ctx.strokeStyle = pal.accent + '88';
    ctx.lineWidth = 3;
    this._roundRect(ctx, x, y, w, h, 16);
    ctx.clip();
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
    ctx.strokeStyle = pal.accent + '88';
    ctx.lineWidth = 3;
    this._roundRect(ctx, x, y, w, h, 16);
    ctx.stroke();
  },

  _drawButton(ctx, x, y, w, h, text, bg, textColor) {
    const grd = ctx.createLinearGradient(x, y, x + w, y);
    grd.addColorStop(0, bg);
    grd.addColorStop(1, this._shadeHex(bg, 40) );
    ctx.fillStyle = grd;
    this._roundRect(ctx, x, y, w, h, h / 2);
    ctx.fill();
    ctx.fillStyle = textColor;
    ctx.font = `bold 18px 'Outfit', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + w / 2, y + h / 2);
    ctx.textBaseline = 'alphabetic';
  },

  _wrapText(ctx, text, x, y, maxW, lineH) {
    const words = text.split(' ');
    let line = '';
    let curY = y;
    for (let w of words) {
      const test = line + w + ' ';
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line.trim(), x, curY);
        curY += lineH; line = w + ' ';
      } else { line = test; }
    }
    ctx.fillText(line.trim(), x, curY);
  },

  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  },

  _applyRetroOverlay(ctx, W, H) {
    for (let y = 0; y < H; y += 4) {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, y, W, 2);
    }
  },

  _applyMinimalStrip(ctx, W, H, pal) {
    ctx.fillStyle = pal.accent + '22';
    ctx.fillRect(60, H - 120, W - 120, 2);
  },

  _shadeHex(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0xff) + amount);
    const b = Math.min(255, (num & 0xff) + amount);
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  },

  _alphaHex(alpha) {
    return Math.round(alpha * 255).toString(16).padStart(2, '0');
  }
};

/* ── MOCK VIDEO THUMBNAIL GENERATOR ── */
const VideoGenerator = {
  generate(canvas, opts) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width = 960;
    const H = canvas.height = 540;

    const themes = {
      energetic: { bg: '#0F0524', a1: '#7C3AED', a2: '#C084FC', text: '#fff' },
      calm:      { bg: '#0A1628', a1: '#0EA5E9', a2: '#38BDF8', text: '#fff' },
      professional: { bg: '#111827', a1: '#6B7280', a2: '#D1D5DB', text: '#fff' },
      playful:   { bg: '#1A0010', a1: '#EC4899', a2: '#F9A8D4', text: '#fff' },
    };
    const pal = themes[opts.tone] || themes.energetic;
    const bgGrd = ctx.createLinearGradient(0, 0, W, H);
    bgGrd.addColorStop(0, pal.bg);
    bgGrd.addColorStop(1, pal.a1 + '44');
    ctx.fillStyle = bgGrd;
    ctx.fillRect(0, 0, W, H);

    // Circles
    for (let i = 0; i < 6; i++) {
      const grd = ctx.createRadialGradient(
        Math.random() * W, Math.random() * H, 0,
        Math.random() * W, Math.random() * H, 200
      );
      grd.addColorStop(0, pal.a1 + '33');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    }

    // Uploaded image
    if (opts.image) {
      ctx.globalAlpha = 0.25;
      ctx.drawImage(opts.image, 0, 0, W, H);
      ctx.globalAlpha = 1;
    }

    // Centre text
    const title = opts.headline || opts.prompt?.split(' ').slice(0, 6).join(' ') || 'Your Video Ad';
    ctx.fillStyle = '#fff';
    ctx.font = `bold 62px 'Outfit', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = pal.a1;
    ctx.shadowBlur = 40;
    ctx.fillText(title.toUpperCase(), W / 2, H / 2 - 30);
    ctx.shadowBlur = 0;

    ctx.font = `400 24px 'Inter', sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.fillText(opts.brand || 'ZaPTUre AI Generated', W / 2, H / 2 + 40);

    // Duration badge
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath(); ctx.arc(W - 60, H - 40, 30, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '600 13px Inter'; ctx.textBaseline = 'middle';
    ctx.fillText(opts.duration || '30s', W - 60, H - 40);

    // Bottom info bar
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, H - 56, W, 56);
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = pal.a2;
    ctx.font = '600 14px Outfit';
    ctx.fillText(`🎵 ${opts.music || 'Cinematic'} · 🎤 ${opts.voice || 'Female'} Voice · ✨ ${opts.animation || 'Dynamic'}`, 24, H - 28);
    ctx.textBaseline = 'alphabetic';
  }
};

window.PosterGenerator = PosterGenerator;
window.VideoGenerator = VideoGenerator;
