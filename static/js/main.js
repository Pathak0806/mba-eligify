// ────────────────────────────────────────────────────────────────
//  MBA Eligify — Frontend Logic
// ────────────────────────────────────────────────────────────────

let allColleges = [];
let userName = '';

// ── Category pills ──────────────────────────────────────────────
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    document.getElementById('category').value = pill.dataset.val;
  });
});

// ── Form submit ──────────────────────────────────────────────────
document.getElementById('eligibilityForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name     = document.getElementById('name').value.trim();
  const dob      = document.getElementById('dob').value;
  const twelfth  = document.getElementById('twelfth').value;
  const catScore = document.getElementById('cat_score').value;
  const category = document.getElementById('category').value;

  if (!category) {
    flashPills();
    return;
  }

  showLoading('Analysing your profile…');

  try {
    const res = await fetch('/api/eligible', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, dob, twelfth, cat_score: catScore, category })
    });
    const data = await res.json();
    hideLoading();

    if (data.error) { alert(data.error); return; }

    allColleges = data.colleges;
    userName = data.name;
    renderResults(data);

    // Scroll to results
    setTimeout(() => {
      document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

  } catch (err) {
    hideLoading();
    alert('Something went wrong. Please try again.');
  }
});

// ── Render results ───────────────────────────────────────────────
function renderResults(data) {
  const section = document.getElementById('results');
  section.classList.remove('hidden');

  document.getElementById('resultsTitle').textContent =
    `${data.count} College${data.count !== 1 ? 's' : ''} Found for ${data.name}`;

  document.getElementById('resultsMeta').textContent =
    `Sorted by Best ROI`;

  renderGrid(allColleges);
}

function renderGrid(colleges) {
  const grid = document.getElementById('collegeGrid');
  grid.innerHTML = '';

  if (colleges.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem;color:var(--text-muted);">
      <div style="font-size:3rem;margin-bottom:1rem;">🎓</div>
      <p style="font-size:1.1rem;">No colleges match your current filters.</p>
    </div>`;
    return;
  }

  colleges.forEach((c, i) => {
    const card = document.createElement('div');
    card.className = 'college-card';
    card.style.animationDelay = `${i * 0.04}s`;
    card.innerHTML = buildCardHTML(c);
    card.addEventListener('click', () => openModal(c.college_name));
    grid.appendChild(card);
  });
}

function buildCardHTML(c) {
  const tierClass = c.tier === 'Tier 1' ? 'tier-1' : c.tier === 'Tier 2' ? 'tier-2' : 'tier-3';
  const roiFormatted = c.roi_score ? c.roi_score.toFixed(2) : '–';
  const feesFormatted = c.fees ? `₹${c.fees}L` : '–';
  const pkgFormatted = c.avg_package ? `₹${c.avg_package}L` : '–';
  const placementFormatted = c.placement_pct ? `${c.placement_pct}%` : '–';

  return `
    <div class="card-tier ${tierClass}">✦ ${c.tier || 'Unranked'}</div>
    <div class="card-name">${c.college_name}</div>
    <div class="card-location">📍 ${c.city}, ${c.state}</div>
    <div class="card-metrics">
      <div class="metric">
        <div class="metric-label">Fees</div>
        <div class="metric-value">${feesFormatted}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Avg Package</div>
        <div class="metric-value">${pkgFormatted}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Placement</div>
        <div class="metric-value">${placementFormatted}</div>
      </div>
      <div class="metric">
        <div class="metric-label">ROI Score</div>
        <div class="metric-value gold">${roiFormatted}</div>
      </div>
    </div>
    <div class="card-footer">
      <span class="card-type">${c.ownership_type || ''} · ${c.institute_category || ''}</span>
      <span class="card-view-btn">Details →</span>
    </div>
  `;
}

// ── Filters ──────────────────────────────────────────────────────
document.getElementById('searchFilter').addEventListener('input', applyFilters);
document.getElementById('tierFilter').addEventListener('change', applyFilters);
document.getElementById('sortFilter').addEventListener('change', applyFilters);

function applyFilters() {
  const search  = document.getElementById('searchFilter').value.toLowerCase();
  const tier    = document.getElementById('tierFilter').value;
  const sortBy  = document.getElementById('sortFilter').value;

  let filtered = allColleges.filter(c => {
    const matchSearch = c.college_name.toLowerCase().includes(search) ||
                        c.city.toLowerCase().includes(search);
    const matchTier   = !tier || c.tier === tier;
    return matchSearch && matchTier;
  });

  // Sort
  if (sortBy === 'roi')         filtered.sort((a,b) => b.roi_score - a.roi_score);
  else if (sortBy === 'package') filtered.sort((a,b) => b.avg_package - a.avg_package);
  else if (sortBy === 'fees_asc') filtered.sort((a,b) => a.fees - b.fees);
  else if (sortBy === 'placement') filtered.sort((a,b) => b.placement_pct - a.placement_pct);

  renderGrid(filtered);
}

// ── Modal ────────────────────────────────────────────────────────
async function openModal(collegeName) {
  showLoading('Fetching college details…');

  try {
    const encoded = encodeURIComponent(collegeName);
    const res = await fetch(`/api/college/${encoded}`);
    const d = await res.json();
    hideLoading();

    if (d.error) { alert(d.error); return; }

    renderModal(d);
    document.getElementById('collegeModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  } catch (err) {
    hideLoading();
    alert('Could not load college details.');
  }
}

function renderModal(d) {
  const tierClass = d.tier === 'Tier 1' ? 'tier-1' : d.tier === 'Tier 2' ? 'tier-2' : 'tier-3';

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-header">
      <div class="modal-tier"><span class="card-tier ${tierClass}">✦ ${d.tier}</span></div>
      <div class="modal-name">${d.college_name}</div>
      <div class="modal-location">📍 ${d.city}, ${d.state}, ${d.country} · ${d.institute_category} · ${d.ownership_type}</div>
    </div>

    <!-- Financial Overview -->
    <div class="modal-section">
      <div class="modal-section-title">Financial Overview</div>
      <div class="modal-grid">
        <div class="modal-metric"><div class="modal-metric-label">Fees</div><div class="modal-metric-value">₹${d.fees}L</div></div>
        <div class="modal-metric"><div class="modal-metric-label">Avg Package</div><div class="modal-metric-value">₹${d.avg_package}L</div></div>
        <div class="modal-metric"><div class="modal-metric-label">Highest Package</div><div class="modal-metric-value">₹${d.highest_package}L</div></div>
        <div class="modal-metric"><div class="modal-metric-label">ROI Score</div><div class="modal-metric-value" style="color:var(--gold)">${d.roi_score.toFixed(3)}</div></div>
      </div>
    </div>

    <!-- Placement -->
    <div class="modal-section">
      <div class="modal-section-title">Placements & Rankings</div>
      <div class="modal-grid">
        <div class="modal-metric"><div class="modal-metric-label">Placement %</div><div class="modal-metric-value">${d.placement_pct}%</div></div>
        <div class="modal-metric"><div class="modal-metric-label">NIRF Rank 2025</div><div class="modal-metric-value">${d.nirf_rank}</div></div>
        <div class="modal-metric"><div class="modal-metric-label">NIRF Applicable</div><div class="modal-metric-value">${d.nirf_applicable}</div></div>
        <div class="modal-metric"><div class="modal-metric-label">Duration</div><div class="modal-metric-value">${d.program_duration}</div></div>
      </div>
    </div>

    <!-- Specializations -->
    <div class="modal-section">
      <div class="modal-section-title">Specializations</div>
      <div class="badge-row">
        ${(d.specializations || '').split(',').map(s => `<span class="badge badge-neutral">${s.trim()}</span>`).join('')}
      </div>
    </div>

    <!-- Features -->
    <div class="modal-section">
      <div class="modal-section-title">Campus Features</div>
      <div class="badge-row">
        <span class="badge ${d.scholarships_available === 'Yes' ? 'badge-yes' : 'badge-no'}">
          ${d.scholarships_available === 'Yes' ? '✓' : '✗'} Scholarships
        </span>
        <span class="badge ${d.internship_mandatory === 'Yes' ? 'badge-yes' : 'badge-no'}">
          ${d.internship_mandatory === 'Yes' ? '✓' : '✗'} Internship Mandatory
        </span>
        <span class="badge ${d.exchange_program_available === 'Yes' ? 'badge-yes' : 'badge-no'}">
          ${d.exchange_program_available === 'Yes' ? '✓' : '✗'} Exchange Program
        </span>
      </div>
      ${d.scholarships_available === 'Yes' ? `<p style="font-size:0.82rem;color:var(--text-muted);margin-top:0.75rem;">Scholarship Types: ${d.scholarship_type}</p>` : ''}
    </div>

    <!-- CAT Cutoffs -->
    <div class="modal-section">
      <div class="modal-section-title">CAT Cutoffs by Category</div>
      <table class="cutoff-table">
        <thead><tr><th>General</th><th>EWS</th><th>OBC</th><th>SC</th><th>ST</th></tr></thead>
        <tbody>
          <tr>
            <td>${d.cat_general}</td>
            <td>${d.cat_ews}</td>
            <td>${d.cat_obc}</td>
            <td>${d.cat_sc}</td>
            <td>${d.cat_st}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Official Website -->
    ${d.official_website && d.official_website !== '#' ? `
    <a href="${d.official_website}" target="_blank" rel="noopener" class="modal-website-btn">
      🌐 Visit Official Website →
    </a>` : ''}
  `;
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('collegeModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('collegeModal')) closeModal();
});

function closeModal() {
  document.getElementById('collegeModal').classList.add('hidden');
  document.body.style.overflow = '';
}

// Keyboard ESC to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ── Loading helpers ──────────────────────────────────────────────
function showLoading(text = 'Loading…') {
  document.getElementById('loadingText').textContent = text;
  document.getElementById('loadingOverlay').classList.remove('hidden');
}
function hideLoading() {
  document.getElementById('loadingOverlay').classList.add('hidden');
}

// ── Flash pills if no category selected ─────────────────────────
function flashPills() {
  const container = document.querySelector('.category-pills');
  container.style.outline = '2px solid var(--rust)';
  container.style.borderRadius = '12px';
  setTimeout(() => { container.style.outline = ''; }, 1500);
}
