// ---------- DOM references ----------
const searchForm   = document.getElementById('searchForm');
const cityInput    = document.getElementById('cityInput');
const locateBtn    = document.getElementById('locateBtn');
const statusEl     = document.getElementById('status');
const nowEl        = document.getElementById('now');
const hourlyEl     = document.getElementById('hourly');
const dailyEl      = document.getElementById('daily');

const placeEl      = document.getElementById('place');
const datetimeEl   = document.getElementById('datetime');
const tempEl       = document.getElementById('temp');
const iconWrapEl   = document.getElementById('iconWrap');
const conditionEl  = document.getElementById('condition');
const feelsLikeEl  = document.getElementById('feelsLike');
const windEl       = document.getElementById('wind');
const humidityEl   = document.getElementById('humidity');
const uvEl         = document.getElementById('uv');
const hourlyScroll = document.getElementById('hourlyScroll');
const dailyList    = document.getElementById('dailyList');

const skyEl        = document.getElementById('sky');
const sunMoonEl    = document.getElementById('sunMoon');
const cloudsEl     = document.getElementById('clouds');
const rainEl       = document.getElementById('rain');


const WMO = {
  0:  ['Clear sky',            'sun'],
  1:  ['Mostly clear',         'sun-cloud'],
  2:  ['Partly cloudy',        'sun-cloud'],
  3:  ['Overcast',             'cloud'],
  45: ['Fog',                  'fog'],
  48: ['Rime fog',             'fog'],
  51: ['Light drizzle',        'rain'],
  53: ['Drizzle',              'rain'],
  55: ['Dense drizzle',        'rain'],
  56: ['Freezing drizzle',     'rain'],
  57: ['Freezing drizzle',     'rain'],
  61: ['Light rain',           'rain'],
  63: ['Rain',                 'rain'],
  65: ['Heavy rain',           'rain'],
  66: ['Freezing rain',        'rain'],
  67: ['Freezing rain',        'rain'],
  71: ['Light snow',           'snow'],
  73: ['Snow',                 'snow'],
  75: ['Heavy snow',           'snow'],
  77: ['Snow grains',          'snow'],
  80: ['Light showers',        'rain'],
  81: ['Showers',              'rain'],
  82: ['Heavy showers',        'rain'],
  85: ['Snow showers',         'snow'],
  86: ['Snow showers',         'snow'],
  95: ['Thunderstorm',         'storm'],
  96: ['Thunderstorm, hail',   'storm'],
  99: ['Thunderstorm, hail',   'storm'],
};

function weatherInfo(code) {
  return WMO[code] || ['Unknown', 'cloud'];
}

function iconSVG(key, size = 48) {
  const stroke = '#f4f7fb';
  const sun = `<circle cx="24" cy="24" r="10" fill="#ffd27a"/>
    <g stroke="#ffd27a" stroke-width="3" stroke-linecap="round">
      <line x1="24" y1="2" x2="24" y2="9"/><line x1="24" y1="39" x2="24" y2="46"/>
      <line x1="2" y1="24" x2="9" y2="24"/><line x1="39" y1="24" x2="46" y2="24"/>
      <line x1="8" y1="8" x2="13" y2="13"/><line x1="35" y1="35" x2="40" y2="40"/>
      <line x1="40" y1="8" x2="35" y2="13"/><line x1="13" y1="35" x2="8" y2="40"/>
    </g>`;
  const cloud = `<path d="M13 34a9 9 0 1 1 2-17.8A11 11 0 0 1 36 20a7 7 0 0 1-1 14H13z" fill="#e7edf5"/>`;
  const sunCloud = `<circle cx="18" cy="16" r="8" fill="#ffd27a"/>
    <path d="M15 34a9 9 0 1 1 2-17.8 11 11 0 0 1 20.8 5.3A7 7 0 0 1 37 34H15z" fill="#e7edf5"/>`;
  const rainDrops = `<g stroke="#8fc4ee" stroke-width="2.4" stroke-linecap="round">
      <line x1="16" y1="38" x2="13" y2="45"/><line x1="24" y1="38" x2="21" y2="45"/><line x1="32" y1="38" x2="29" y2="45"/>
    </g>`;
  const rain = `${cloud}${rainDrops}`;
  const snowFlakes = `<g stroke="#dfeaf7" stroke-width="2.2" stroke-linecap="round">
      <line x1="16" y1="37" x2="16" y2="46"/><line x1="12" y1="41.5" x2="20" y2="41.5"/>
      <line x1="32" y1="37" x2="32" y2="46"/><line x1="28" y1="41.5" x2="36" y2="41.5"/>
    </g>`;
  const snow = `${cloud}${snowFlakes}`;
  const storm = `${cloud}<polygon points="23,36 17,45 22,45 19,52 29,40 24,40 27,36" fill="#ffd27a"/>`;
  const fog = `<g stroke="#c9d6e5" stroke-width="3" stroke-linecap="round">
      <line x1="8" y1="18" x2="40" y2="18"/><line x1="4" y1="26" x2="44" y2="26"/><line x1="8" y1="34" x2="40" y2="34"/>
    </g>`;

  const bodies = { sun, cloud, 'sun-cloud': sunCloud, rain, snow, storm, fog };
  return `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">${bodies[key] || cloud}</svg>`;
}


const fmtTemp = (t) => `${Math.round(t)}°`;
const dayName = (iso, index) => {
  if (index === 0) return 'Today';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short' });
};
const hourLabel = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: 'numeric' });
};


function applySkyTheme({ isDay, iconKey }) {
  const root = document.documentElement.style;
  let top, bottom;

  if (isDay) {
    if (iconKey === 'sun') { top = '#3f7fd1'; bottom = '#bfe0f4'; }
    else if (iconKey === 'sun-cloud') { top = '#5a86b8'; bottom = '#c7d7e6'; }
    else if (iconKey === 'storm') { top = '#2a3550'; bottom = '#5a6584'; }
    else if (iconKey === 'rain') { top = '#3b4a63'; bottom = '#7c8ca3'; }
    else if (iconKey === 'snow') { top = '#7c93ad'; bottom = '#dbe6ef'; }
    else { top = '#5c6f88'; bottom = '#a9b8c8'; } // cloud / fog
  } else {
    if (iconKey === 'storm') { top = '#0a0f1e'; bottom = '#232c44'; }
    else if (iconKey === 'rain') { top = '#0b1120'; bottom = '#1f2a40'; }
    else { top = '#0b1120'; bottom = '#1b2a4a'; } // clear / cloudy night
  }

  root.setProperty('--sky-top', top);
  root.setProperty('--sky-bottom', bottom);

  sunMoonEl.classList.toggle('is-moon', !isDay);
  sunMoonEl.style.opacity = (iconKey === 'storm' || iconKey === 'fog') ? '0.15' : (isDay ? '1' : '0.9');

  const showClouds = ['cloud', 'sun-cloud', 'rain', 'snow', 'storm', 'fog'].includes(iconKey);
  cloudsEl.classList.toggle('is-visible', showClouds);
  buildClouds(iconKey === 'storm' ? 5 : 3);

  const showRain = iconKey === 'rain' || iconKey === 'storm';
  rainEl.classList.toggle('is-visible', showRain);
  buildRain(showRain ? (iconKey === 'storm' ? 60 : 35) : 0);
}

function buildClouds(count) {
  cloudsEl.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'cloud';
    const w = 120 + Math.random() * 140;
    const h = w * 0.4;
    c.style.width = `${w}px`;
    c.style.height = `${h}px`;
    c.style.top = `${5 + Math.random() * 30}%`;
    c.style.left = `${-30}%`;
    c.style.animationDuration = `${50 + Math.random() * 40}s`;
    c.style.animationDelay = `-${Math.random() * 40}s`;
    c.style.opacity = String(0.35 + Math.random() * 0.35);
    cloudsEl.appendChild(c);
  }
}

function buildRain(count) {
  rainEl.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const d = document.createElement('div');
    d.className = 'drop';
    d.style.left = `${Math.random() * 100}%`;
    d.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
    d.style.animationDelay = `-${Math.random() * 1}s`;
    d.style.opacity = String(0.3 + Math.random() * 0.5);
    rainEl.appendChild(d);
  }
}


function renderWeather(place, data) {
  const cur = data.current;
  const [label, iconKey] = weatherInfo(cur.weather_code);
  const isDay = cur.is_day === 1;

  placeEl.textContent = place;
  datetimeEl.textContent = new Date(cur.time).toLocaleString(undefined, {
    weekday: 'long', hour: 'numeric', minute: '2-digit'
  });
  tempEl.textContent = fmtTemp(cur.temperature_2m);
  iconWrapEl.innerHTML = iconSVG(iconKey, 92);
  conditionEl.textContent = label;
  feelsLikeEl.textContent = `Feels like ${fmtTemp(cur.apparent_temperature)}`;
  windEl.textContent = `${Math.round(cur.wind_speed_10m)} km/h`;
  humidityEl.textContent = `${cur.relative_humidity_2m}%`;
  uvEl.textContent = data.daily.uv_index_max ? data.daily.uv_index_max[0].toFixed(1) : '—';

  applySkyTheme({ isDay, iconKey });


  const nowIso = cur.time.slice(0, 13);
  let startIdx = data.hourly.time.findIndex((t) => t.slice(0, 13) === nowIso);
  if (startIdx === -1) startIdx = 0;

  hourlyScroll.innerHTML = '';
  for (let i = startIdx; i < startIdx + 12 && i < data.hourly.time.length; i++) {
    const [, hKey] = weatherInfo(data.hourly.weather_code[i]);
    const card = document.createElement('div');
    card.className = 'hour-card';
    card.innerHTML = `
      <span class="h-time">${i === startIdx ? 'Now' : hourLabel(data.hourly.time[i])}</span>
      ${iconSVG(hKey, 28)}
      <span class="h-temp">${fmtTemp(data.hourly.temperature_2m[i])}</span>
    `;
    hourlyScroll.appendChild(card);
  }

 
  const allLows = data.daily.temperature_2m_min;
  const allHighs = data.daily.temperature_2m_max;
  const globalMin = Math.min(...allLows);
  const globalMax = Math.max(...allHighs);
  const span = globalMax - globalMin || 1;

  dailyList.innerHTML = '';
  data.daily.time.forEach((iso, i) => {
    const [, dKey] = weatherInfo(data.daily.weather_code[i]);
    const lo = allLows[i], hi = allHighs[i];
    const leftPct = ((lo - globalMin) / span) * 100;
    const widthPct = ((hi - lo) / span) * 100;

    const row = document.createElement('div');
    row.className = 'day-row';
    row.innerHTML = `
      <span class="d-name">${dayName(iso, i)}</span>
      ${iconSVG(dKey, 26)}
      <div class="d-bar"><span style="left:${leftPct}%; width:${Math.max(widthPct, 6)}%"></span></div>
      <span class="d-range"><span class="lo">${fmtTemp(lo)}</span> ${fmtTemp(hi)}</span>
    `;
    dailyList.appendChild(row);
  });

  showSections();
}

function showSections() {
  statusEl.hidden = true;
  nowEl.hidden = false;
  hourlyEl.hidden = false;
  dailyEl.hidden = false;
}

function showStatus(message, isError = false) {
  statusEl.hidden = false;
  statusEl.textContent = message;
  statusEl.classList.toggle('is-error', isError);
  nowEl.hidden = true;
  hourlyEl.hidden = true;
  dailyEl.hidden = true;
}


async function fetchForecast(lat, lon) {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day');
  url.searchParams.set('hourly', 'temperature_2m,weather_code');
  url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,uv_index_max');
  url.searchParams.set('timezone', 'auto');

  const res = await fetch(url);
  if (!res.ok) throw new Error('Forecast request failed');
  return res.json();
}

async function geocodeCity(name) {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', name);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'en');

  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding request failed');
  const data = await res.json();
  if (!data.results || !data.results.length) throw new Error('City not found');
  const r = data.results[0];
  const parts = [r.name, r.admin1, r.country].filter(Boolean);
  return { lat: r.latitude, lon: r.longitude, label: parts.join(', ') };
}

async function reverseGeocode(lat, lon) {
  try {
    const url = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client');
    url.searchParams.set('latitude', lat);
    url.searchParams.set('longitude', lon);
    url.searchParams.set('localityLanguage', 'en');
    const res = await fetch(url);
    if (!res.ok) throw new Error();
    const data = await res.json();
    const parts = [data.city || data.locality, data.principalSubdivision, data.countryName].filter(Boolean);
    return parts.join(', ') || 'Your location';
  } catch {
    return 'Your location';
  }
}

async function loadByCity(name) {
  showStatus(`Looking up ${name}…`);
  try {
    const { lat, lon, label } = await geocodeCity(name);
    const data = await fetchForecast(lat, lon);
    renderWeather(label, data);
  } catch (err) {
    showStatus(err.message === 'City not found' ? `Couldn't find "${name}". Try another spelling.` : 'Something went wrong fetching that forecast.', true);
  }
}

async function loadByCoords(lat, lon) {
  showStatus('Fetching your local forecast…');
  try {
    const [label, data] = await Promise.all([reverseGeocode(lat, lon), fetchForecast(lat, lon)]);
    renderWeather(label, data);
  } catch {
    showStatus('Something went wrong fetching that forecast.', true);
  }
}


searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = cityInput.value.trim();
  if (name) loadByCity(name);
});

locateBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    showStatus('Geolocation is not supported in this browser.', true);
    return;
  }
  showStatus('Finding your location…');
  navigator.geolocation.getCurrentPosition(
    (pos) => loadByCoords(pos.coords.latitude, pos.coords.longitude),
    () => showStatus('Location access was denied. Try searching a city instead.', true)
  );
});


loadByCity('Lucknow');