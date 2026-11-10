const form = document.querySelector("#mahasiswa-form");
const namaInput = document.querySelector("#nama");
const nrpInput = document.querySelector("#nrp");
const originalNrpInput = document.querySelector("#original-nrp");
const formTitle = document.querySelector("#form-title");
const submitButton = document.querySelector("#submit-button");
const cancelEditButton = document.querySelector("#cancel-edit");
const refreshButton = document.querySelector("#refresh-button");
const list = document.querySelector("#mahasiswa-list");
const studentCount = document.querySelector("#student-count");
const feedback = document.querySelector("#feedback");
const startupNotice = document.querySelector("#startup-notice");
let currentMahasiswa = [];

function showFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.classList.toggle("error", isError);
  feedback.hidden = false;
}

function clearFeedback() {
  feedback.textContent = "";
  feedback.classList.remove("error");
  feedback.hidden = true;
}

function makeCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value;
  return cell;
}

function makeActionButton(label, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `button button-secondary button-small ${className}`;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function renderMahasiswa(mahasiswa) {
  currentMahasiswa = mahasiswa;
  list.replaceChildren();
  studentCount.textContent = String(mahasiswa.length);

  if (mahasiswa.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.className = "table-message";
    cell.colSpan = 4;
    cell.textContent = "Belum ada data mahasiswa. Tambahkan melalui formulir.";
    row.append(cell);
    list.append(row);
    return;
  }

  mahasiswa.forEach((item, index) => {
    const row = document.createElement("tr");
    row.append(
      makeCell(String(index + 1)),
      makeCell(item.nama),
      makeCell(item.nrp),
    );

    const actionCell = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "row-actions";
    actions.append(
      makeActionButton("Edit", "", () => startEditing(item)),
      makeActionButton("Hapus", "button-delete", () => removeMahasiswa(item)),
    );
    actionCell.append(actions);
    row.append(actionCell);
    list.append(row);
  });
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const result = await response.json();

  if (!response.ok || result.status !== true) {
    throw new Error(result.message || "Permintaan tidak dapat diproses.");
  }

  return result;
}

async function loadMahasiswa() {
  list.replaceChildren();
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.className = "table-message";
  cell.colSpan = 4;
  cell.textContent = "Memuat data mahasiswa...";
  row.append(cell);
  list.append(row);

  try {
    const result = await requestJson("/mahasiswa");
    renderMahasiswa(result.data);
  } catch (error) {
    studentCount.textContent = "—";
    const errorRow = document.createElement("tr");
    const errorCell = document.createElement("td");
    errorCell.className = "table-message";
    errorCell.colSpan = 4;
    errorCell.textContent =
      error instanceof Error ? error.message : "Gagal memuat data mahasiswa.";
    errorRow.append(errorCell);
    list.replaceChildren(errorRow);
  }
}

function startEditing(mahasiswa) {
  clearFeedback();
  formTitle.textContent = "Edit mahasiswa";
  submitButton.textContent = "Simpan perubahan";
  cancelEditButton.hidden = false;
  originalNrpInput.value = mahasiswa.nrp;
  namaInput.value = mahasiswa.nama;
  nrpInput.value = mahasiswa.nrp;
  namaInput.focus();
}

function resetForm() {
  form.reset();
  originalNrpInput.value = "";
  formTitle.textContent = "Tambah mahasiswa";
  submitButton.textContent = "Simpan mahasiswa";
  cancelEditButton.hidden = true;
}

async function removeMahasiswa(mahasiswa) {
  const confirmed = window.confirm(
    `Hapus data ${mahasiswa.nama} (NRP ${mahasiswa.nrp})?`,
  );
  if (!confirmed) return;

  clearFeedback();
  try {
    const result = await requestJson(
      `/mahasiswa/${encodeURIComponent(mahasiswa.nrp)}`,
      { method: "DELETE" },
    );
    if (originalNrpInput.value === mahasiswa.nrp) resetForm();
    showFeedback(result.message);
    await loadMahasiswa();
  } catch (error) {
    showFeedback(
      error instanceof Error ? error.message : "Gagal menghapus data mahasiswa.",
      true,
    );
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearFeedback();

  const originalNrp = originalNrpInput.value;
  const payload = {
    nama: namaInput.value.trim(),
    nrp: nrpInput.value.trim(),
  };

  const duplicate = currentMahasiswa.some(
    (mahasiswa) =>
      mahasiswa.nrp === payload.nrp && mahasiswa.nrp !== originalNrp,
  );
  if (duplicate) {
    nrpInput.setCustomValidity("NRP sudah terdaftar. Gunakan NRP lain.");
    nrpInput.reportValidity();
    return;
  }

  submitButton.disabled = true;
  const url = originalNrp
    ? `/mahasiswa/${encodeURIComponent(originalNrp)}`
    : "/mahasiswa";
  const options = originalNrp
    ? {
        method: "PUT",
        body: JSON.stringify({ nama: payload.nama, nrpBaru: payload.nrp }),
      }
    : { method: "POST", body: JSON.stringify(payload) };

  try {
    const result = await requestJson(url, options);
    resetForm();
    showFeedback(result.message);
    await loadMahasiswa();
  } catch (error) {
    showFeedback(
      error instanceof Error ? error.message : "Gagal menyimpan data mahasiswa.",
      true,
    );
  } finally {
    submitButton.disabled = false;
  }
});

cancelEditButton.addEventListener("click", () => {
  resetForm();
  clearFeedback();
});

nrpInput.addEventListener("input", () => {
  nrpInput.setCustomValidity("");
});

refreshButton.addEventListener("click", () => {
  clearFeedback();
  loadMahasiswa();
});

if (window.location.protocol === "file:") {
  startupNotice.innerHTML =
    'Halaman ini sedang dibuka sebagai file, jadi data belum tersambung. Jalankan <code>npm run dev</code> di terminal folder proyek, lalu buka <a href="http://localhost:3000">http://localhost:3000</a>.';
  startupNotice.hidden = false;
  for (const control of form.elements) control.disabled = true;
  refreshButton.disabled = true;
  studentCount.textContent = "—";
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.className = "table-message";
  cell.colSpan = 4;
  cell.textContent = "Buka aplikasi melalui server untuk melihat data mahasiswa.";
  row.append(cell);
  list.replaceChildren(row);
} else {
  loadMahasiswa();
}
