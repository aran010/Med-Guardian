async function postJSON(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${text}`);
  }
  return res.json();
}

function parseCsv(input) {
  if (!input) return [];
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function renderResult(data) {
  const container = document.getElementById('result');
  container.classList.remove('hidden');

  const badge = `<span class="badge ${data.triage}">${data.triage.toUpperCase()}</span>`;
  const redFlags = data.red_flags && data.red_flags.length
    ? `<h3>Red flags</h3><ul>${data.red_flags.map((f) => `<li>${f}</li>`).join('')}</ul>`
    : '';
  const conditions = data.likely_conditions && data.likely_conditions.length
    ? `<h3>Likely conditions</h3><ul class="conditions">${data.likely_conditions
        .map((c) => `<li><strong>${c.name}</strong> — confidence ${(c.confidence * 100).toFixed(0)}%${c.reasoning ? ` — ${c.reasoning}` : ''}</li>`)
        .join('')}</ul>`
    : '';
  const actions = data.recommended_actions && data.recommended_actions.length
    ? `<h3>Recommended actions</h3><ul>${data.recommended_actions.map((a) => `<li>${a}</li>`).join('')}</ul>`
    : '';
  const advice = data.advice_message ? `<p>${data.advice_message}</p>` : '';

  container.innerHTML = `
    <div>${badge}</div>
    ${redFlags}
    ${conditions}
    ${actions}
    ${advice}
    <p style="color:#6b7280; font-size:12px; margin-top:12px;">${data.disclaimer}</p>
  `;
}

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('symptom-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      age_years: document.getElementById('age').value ? Number(document.getElementById('age').value) : null,
      sex: document.getElementById('sex').value,
      symptoms: parseCsv(document.getElementById('symptoms').value),
      severity: document.getElementById('severity').value || null,
      medical_history: parseCsv(document.getElementById('medical_history').value),
      medications: parseCsv(document.getElementById('medications').value),
      pregnant: (function(){
        const v = document.getElementById('pregnant').value;
        if (v === 'true') return true;
        if (v === 'false') return false;
        return null;
      })(),
      additional_context: document.getElementById('additional_context').value || null,
    };

    try {
      const apiBase = '';
      const result = await postJSON(`${apiBase}/api/symptom-check`, payload);
      renderResult(result);
    } catch (err) {
      alert(err.message || 'Something went wrong');
    }
  });
});