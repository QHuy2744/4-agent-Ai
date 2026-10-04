export function renderSpreadsheet(container) {
  let gridHTML = '<div class="spreadsheet-grid">';
  gridHTML += '<div class="ss-cell"></div>';
  for (let c = 0; c < 10; c++) gridHTML += `<div class="ss-cell"><b>${String.fromCharCode(65 + c)}</b></div>`;
  for (let r = 1; r <= 20; r++) {
    gridHTML += `<div class="ss-cell"><b>${r}</b></div>`;
    for (let c = 0; c < 10; c++) {
      gridHTML += `<input class="ss-cell" data-row="${r}" data-col="${c}" value="">`;
    }
  }
  gridHTML += '</div>';
  container.innerHTML = `
    <div style="display:flex;flex-direction:column;height:100%;">
      <div style="margin-bottom:8px;">Formula: <input id="ss-formula" style="width:300px;" placeholder="=SUM(A1:A5)"></div>
      ${gridHTML}
    </div>
  `;
}