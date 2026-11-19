/* Wanderlist – app logic. Data in js/data.js. State persists in localStorage. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k, f) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? f; } catch { return f; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { toast('Storage is unavailable – changes won\'t be kept.'); } }
};
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url = (id, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
const byId = id => DESTINATIONS.find(d => d.id === id);

let saved = store.get('wl_saved', []);   // [{id, visited}]
let trips = store.get('wl_trips', []);   // [{id,title,dest,start,end,budget,notes}]
const filters = { q: '', cat: 'All', region: 'all', tab: 'all' };
const isSaved = id => saved.find(s => s.id === id);
const persist = () => { store.set('wl_saved', saved); store.set('wl_trips', trips); };

/* ---------- toast ---------- */
let toastEl, toastInst;
function toast(msg) {
  toastEl = toastEl || $('#toast'); toastInst = toastInst || bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2600 });
  $('#toastMsg').textContent = msg; toastInst.show();
}

/* ---------- images with graceful fallback ---------- */
document.addEventListener('error', e => {
  const img = e.target;
  if (img.tagName !== 'IMG') return;
  img.style.display = 'none';
  img.parentElement.classList.add('noimg');
}, true);
function hydrateImgs(root = document) { $$('img[data-src]', root).forEach(i => { i.src = url(i.dataset.src, 700); i.removeAttribute('data-src'); }); }

/* ---------- card templates ---------- */
function card(d, mode) {
  const s = isSaved(d.id), visited = s && s.visited;
  let actions;
  if (mode === 'bucket') {
    actions = `<button class="btn btn-sm ${visited ? 'btn-saved' : 'btn-line'}" data-visit="${d.id}" aria-pressed="${!!visited}">${visited ? 'Visited ✓' : 'Mark as visited'}</button>
      <button class="btn btn-sm btn-danger-line" data-remove="${d.id}" aria-label="Remove ${esc(d.name)} from bucket list">Remove</button>`;
  } else {
    actions = `<button class="btn btn-sm ${s ? 'btn-saved' : 'btn-line'}" data-save="${d.id}" aria-pressed="${!!s}">${s ? 'Saved ✓' : 'Save to list'}</button>`;
  }
  return `<div class="col-sm-6 col-lg-4"><article class="dest">
    <div class="ph"><img src="${url(d.img)}" alt="${esc(d.name)}, ${esc(d.country)}" loading="lazy"><span class="fallback">${esc(d.name)}</span>
      <span class="tag">${esc(d.category)}</span>
      ${visited ? `<div class="stamp" aria-hidden="true"><span>VISITED</span><b>${esc(d.country.slice(0, 3).toUpperCase())}</b></div>` : ''}</div>
    <div class="body"><h3>${esc(d.name)}</h3><p class="where">${esc(d.country)} · Best: ${esc(d.season)}</p>
      <p class="desc">${esc(d.desc)}</p>
      <div class="actions">${actions}<button class="btn btn-sm btn-line" data-info="${d.id}" aria-label="More about ${esc(d.name)}">Details</button></div></div>
  </article></div>`;
}

/* ---------- renderers ---------- */
function renderHome() {
  $('#featuredGrid').innerHTML = DESTINATIONS.filter(d => d.featured).map(d => card(d)).join('');
  $('#statSaved').textContent = saved.length;
  $('#statVisited').textContent = saved.filter(s => s.visited).length;
  $('#statTrips').textContent = trips.length;
}
function renderChips() {
  const cats = ['All', ...new Set(DESTINATIONS.map(d => d.category))];
  $('#chips').innerHTML = cats.map(c => `<button type="button" class="chip" data-cat="${c}" aria-pressed="${filters.cat === c}">${c}</button>`).join('');
}
function renderDiscover() {
  const q = filters.q.trim().toLowerCase();
  const list = DESTINATIONS.filter(d =>
    (filters.cat === 'All' || d.category === filters.cat) &&
    (filters.region === 'all' || d.region === filters.region) &&
    (!q || [d.name, d.country, d.category, d.desc].join(' ').toLowerCase().includes(q)));
  $('#discoverGrid').innerHTML = list.map(d => card(d)).join('');
  $('#discoverEmpty').classList.toggle('d-none', list.length > 0);
  $('#resultCount').textContent = `${list.length} destination${list.length === 1 ? '' : 's'} found`;
  renderChips();
}
function renderBucket() {
  const total = saved.length, done = saved.filter(s => s.visited).length, pct = total ? Math.round(done / total * 100) : 0;
  $('#progressText').textContent = `${done} of ${total} visited`;
  $('#progressPct').textContent = pct + '%';
  $('#progressBar').style.width = pct + '%';
  $('.progress').setAttribute('aria-valuenow', pct);
  const items = saved.filter(s => filters.tab === 'all' || (filters.tab === 'done') === s.visited).map(s => byId(s.id)).filter(Boolean);
  $('#bucketGrid').innerHTML = items.map(d => card(d, 'bucket')).join('');
  const empty = items.length === 0;
  $('#bucketEmpty').classList.toggle('d-none', !empty);
  if (empty) {
    $('#bucketEmptyTitle').textContent = total ? (filters.tab === 'done' ? 'No stamps yet' : 'Nothing left to visit') : 'Your list is empty';
    $('#bucketEmptyText').textContent = total ? 'Switch tabs to see your other destinations.' : 'Save destinations from Discover and they\'ll show up here.';
  }
}
const fmt = d => new Date(d + 'T00:00:00').toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
function duration(start, end) {
  if (!start || !end) return null;
  const days = Math.round((new Date(end + 'T00:00:00') - new Date(start + 'T00:00:00')) / 864e5) + 1;
  return days < 1 ? null : { days, nights: days - 1 };
}
function tripStatus(t) {
  const today = new Date().toISOString().slice(0, 10);
  if (t.end < today) return ['Completed', 'past'];
  if (t.start <= today) return ['Happening now', ''];
  const n = Math.ceil((new Date(t.start + 'T00:00:00') - new Date(today + 'T00:00:00')) / 864e5);
  return [`In ${n} day${n === 1 ? '' : 's'}`, ''];
}
function renderTrips() {
  const sorted = [...trips].sort((a, b) => a.start.localeCompare(b.start));
  $('#tripList').innerHTML = sorted.map(t => {
    const d = byId(t.dest), du = duration(t.start, t.end), [st, cls] = tripStatus(t);
    return `<article class="trip"><div><h3>${esc(t.title)}</h3>
      <p class="meta">${esc(d ? d.name : 'Unknown')} · ${fmt(t.start)} – ${fmt(t.end)}</p>
      <p class="meta mb-1">${du.days} days / ${du.nights} night${du.nights === 1 ? '' : 's'}${t.budget ? ' · ₱' + Number(t.budget).toLocaleString('en-PH') : ''}</p>
      ${t.notes ? `<p class="meta fst-italic mb-1">${esc(t.notes)}</p>` : ''}<span class="status ${cls}">${st}</span></div>
      <div class="trip-actions"><button class="btn btn-sm btn-line" data-edit="${t.id}" aria-label="Edit ${esc(t.title)}">Edit</button>
      <button class="btn btn-sm btn-danger-line" data-del="${t.id}" aria-label="Delete ${esc(t.title)}">Delete</button></div></article>`;
  }).join('');
  $('#tripEmpty').classList.toggle('d-none', trips.length > 0);
}
function renderAll() {
  renderHome(); renderDiscover(); renderBucket(); renderTrips();
  $('#navCount').textContent = saved.length;
  $('#navCount').setAttribute('aria-label', saved.length + ' saved');
}

/* ---------- actions ---------- */
function toggleSave(id) {
  const d = byId(id);
  if (isSaved(id)) { saved = saved.filter(s => s.id !== id); toast(`Removed ${d.name} from your list`); }
  else { saved.push({ id, visited: false }); toast(`Saved ${d.name} to your bucket list`); }
  persist(); renderAll(); syncModal();
}
function toggleVisited(id) {
  const s = isSaved(id); if (!s) return;
  s.visited = !s.visited; persist(); renderAll();
  toast(s.visited ? `Stamped ${byId(id).name} as visited` : `Moved ${byId(id).name} back to To visit`);
}
let modal, modalId;
function openInfo(id) {
  const d = byId(id); modalId = id;
  $('#infoImg').style.display = ''; $('#infoImg').src = url(d.img, 1100); $('#infoImg').alt = `${d.name}, ${d.country}`;
  $('#infoTitle').textContent = d.name; $('#infoMeta').textContent = `${d.country} · ${d.category}`;
  $('#infoDesc').textContent = d.desc; $('#infoSeason').textContent = d.season;
  syncModal(); modal = modal || new bootstrap.Modal($('#infoModal')); modal.show();
}
function syncModal() { if (modalId) $('#infoSave').textContent = isSaved(modalId) ? 'Remove from list' : 'Save to list'; }

/* ---------- trip form ---------- */
const form = () => $('#tripForm');
function fillDestSelect() {
  $('#tDest').innerHTML = '<option value="">Select a destination…</option>' + DESTINATIONS.map(d => `<option value="${d.id}">${esc(d.name)} – ${esc(d.country)}</option>`).join('');
}
function updateDuration() {
  const s = $('#tStart').value, e = $('#tEnd').value, out = $('#durationPreview'), end = $('#tEnd');
  if (s && e && e < s) { end.setCustomValidity('Return must be on or after departure.'); $('#endMsg').textContent = 'Return must be on or after departure.'; out.textContent = 'Return date is before departure.'; return; }
  end.setCustomValidity(''); $('#endMsg').textContent = 'Pick a return date.';
  const du = duration(s, e);
  out.textContent = du ? `${du.days} days / ${du.nights} night${du.nights === 1 ? '' : 's'}` : 'Choose dates to see trip length.';
}
function resetForm() {
  form().reset(); form().classList.remove('was-validated'); $('#tripId').value = '';
  $('#formHeading').textContent = 'New trip'; $('#tripSubmit').textContent = 'Save trip'; $('#tripCancel').classList.add('d-none');
  $('#tEnd').setCustomValidity(''); updateDuration();
}
function submitTrip(e) {
  e.preventDefault(); updateDuration();
  const f = form();
  if (!f.checkValidity()) { f.classList.add('was-validated'); const bad = $(':invalid', f); bad && bad.focus(); return; }
  const id = $('#tripId').value;
  const rec = { id: id || 't' + Date.now(), title: $('#tTitle').value.trim(), dest: $('#tDest').value, start: $('#tStart').value, end: $('#tEnd').value, budget: $('#tBudget').value, notes: $('#tNotes').value.trim() };
  if (!rec.title) { $('#tTitle').value = ''; f.classList.add('was-validated'); $('#tTitle').focus(); return; }
  if (id) trips = trips.map(t => t.id === id ? rec : t); else trips.push(rec);
  persist(); renderAll(); resetForm(); toast(id ? 'Trip updated' : 'Trip saved');
}
function editTrip(id) {
  const t = trips.find(x => x.id === id); if (!t) return;
  $('#tripId').value = t.id; $('#tTitle').value = t.title; $('#tDest').value = t.dest; $('#tStart').value = t.start; $('#tEnd').value = t.end; $('#tBudget').value = t.budget; $('#tNotes').value = t.notes;
  $('#formHeading').textContent = 'Edit trip'; $('#tripSubmit').textContent = 'Update trip'; $('#tripCancel').classList.remove('d-none');
  form().classList.remove('was-validated'); updateDuration(); $('#tTitle').focus(); form().scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ---------- router ---------- */
const routes = ['home', 'discover', 'bucket', 'planner'];
function route() {
  const r = routes.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home';
  $$('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + r));
  $$('[data-route]').forEach(a => { const on = a.dataset.route === r && a.classList.contains('nav-link'); a.classList.toggle('active', on); on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'); });
  const nav = $('#nav'); if (nav.classList.contains('show')) bootstrap.Collapse.getInstance(nav)?.hide();
  document.title = { home: 'Wanderlist – Travel Bucket List', discover: 'Discover – Wanderlist', bucket: 'My Bucket List – Wanderlist', planner: 'Trip Planner – Wanderlist' }[r];
  hydrateImgs(); window.scrollTo(0, 0); $('#main').focus({ preventScroll: true });
}

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('button,a'); if (!t) return;
  const d = t.dataset;
  if (d.save) toggleSave(d.save);
  else if (d.visit) toggleVisited(d.visit);
  else if (d.remove) { const n = byId(d.remove).name; if (confirm(`Remove ${n} from your bucket list?`)) { saved = saved.filter(s => s.id !== d.remove); persist(); renderAll(); toast(`Removed ${n}`); } }
  else if (d.info) openInfo(d.info);
  else if (d.cat) { filters.cat = d.cat; renderDiscover(); }
  else if (d.filterCat) { filters.cat = d.filterCat; filters.q = ''; $('#q').value = ''; renderDiscover(); }
  else if (d.tab) { filters.tab = d.tab; $$('.btn-tab').forEach(b => { const on = b === t; b.classList.toggle('active', on); b.setAttribute('aria-pressed', on); }); renderBucket(); }
  else if (d.edit) editTrip(d.edit);
  else if (d.del) { const tr = trips.find(x => x.id === d.del); if (tr && confirm(`Delete “${tr.title}”?`)) { trips = trips.filter(x => x.id !== d.del); persist(); renderAll(); if ($('#tripId').value === d.del) resetForm(); toast('Trip deleted'); } }
});
$('#q').addEventListener('input', e => { filters.q = e.target.value; renderDiscover(); });
$('#searchForm').addEventListener('submit', e => e.preventDefault());
$('#region').addEventListener('change', e => { filters.region = e.target.value; renderDiscover(); });
$('#resetFilters').addEventListener('click', () => { Object.assign(filters, { q: '', cat: 'All', region: 'all' }); $('#q').value = ''; $('#region').value = 'all'; renderDiscover(); });
$('#infoSave').addEventListener('click', () => toggleSave(modalId));
$('#tripForm').addEventListener('submit', submitTrip);
$('#tripCancel').addEventListener('click', resetForm);
['tStart', 'tEnd'].forEach(id => $('#' + id).addEventListener('input', updateDuration));
window.addEventListener('hashchange', route);

/* ---------- init ---------- */
fillDestSelect(); renderAll(); route();
})();
