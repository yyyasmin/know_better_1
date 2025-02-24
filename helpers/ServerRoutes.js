const PROXY_URL = "http://localhost:5000";
const RENDER_PROXY_URL = "https://mg-young-kids-production.up.railway.app"; // mg-young_kids DEPLOY

// Choose the appropriate proxy URL
const CHOSEN_PROXY_URL = PROXY_URL; // Change to RENDER_PROXY_URL for production

module.exports = {
  PROXY_URL,
  RENDER_PROXY_URL,
  CHOSEN_PROXY_URL
};
