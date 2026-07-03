/* ── FREE TRIAL MANAGER ── */
const TRIAL_KEY = 'zapture_trial_used';

const Trial = {
  isUsed() {
    return localStorage.getItem(TRIAL_KEY) === 'true';
  },
  markUsed() {
    localStorage.setItem(TRIAL_KEY, 'true');
  },
  reset() {
    localStorage.removeItem(TRIAL_KEY);
  }
};

window.Trial = Trial;
