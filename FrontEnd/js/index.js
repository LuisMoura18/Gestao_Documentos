const API_URL = window.location.protocol === 'file:' ? 'http://localhost:3000' : window.location.origin;

const listElement = document.querySelector('#documents-list');
const form = document.querySelector('#upload-form');
const fileInput = document.querySelector('#file');
const fileName = document.querySelector('#file-name');
const feedback = document.querySelector('#upload-feedback');
const refreshButton = document.querySelector('#refresh-button');

function formatDate(dateValue) {
  if (!dateValue) return 'Data nao informada';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(dateValue));
}

function getFileExtension(fileNameValue) {
  const extension = fileNameValue?.split('.').pop();
  return extension && extension.length <= 5 ? extension : 'file';
}

function renderDocuments(documents) {
  if (!documents.length) {
    listElement.innerHTML = '<p class="empty-state">Nenhum documento cadastrado ainda.</p>';
    return;
  }

  listElement.innerHTML = documents.map((document) => `
    <a class="document-row" href="document.html?id=${document.id}">
      <span class="doc-symbol">${getFileExtension(document.nameFile)}</span>
      <span>
        <h3>${escapeHtml(document.title)}</h3>
        <p>${formatDate(document.dataUpload)}${document.description ? ` · ${escapeHtml(document.description)}` : ''}</p>
      </span>
      <span class="row-arrow">→</span>
    </a>
  `).join('');
}

function escapeHtml(value = '') {
  const element = document.createElement('span');
  element.textContent = value;
  return element.innerHTML;
}

async function loadDocuments() {
  listElement.innerHTML = '<div class="loading-state">Carregando documentos...</div>';
  try {
    const response = await fetch(`${API_URL}/documents`);
    if (!response.ok) throw new Error('Nao foi possivel carregar os documentos.');
    renderDocuments(await response.json());
  } catch (error) {
    listElement.innerHTML = `<p class="empty-state">${error.message} Verifique se o backend esta rodando.</p>`;
  }
}

fileInput.addEventListener('change', () => {
  fileName.textContent = fileInput.files[0]?.name || 'Escolha um arquivo';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  feedback.className = 'feedback';
  feedback.textContent = 'Enviando documento...';

  const formData = new FormData(form);
  try {
    const response = await fetch(`${API_URL}/documents`, { method: 'POST', body: formData });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || 'Nao foi possivel salvar o documento.');
    form.reset();
    fileName.textContent = 'Escolha um arquivo';
    feedback.className = 'feedback success';
    feedback.textContent = 'Documento salvo com sucesso.';
    await loadDocuments();
  } catch (error) {
    feedback.className = 'feedback error';
    feedback.textContent = error.message;
  }
});

refreshButton.addEventListener('click', loadDocuments);
loadDocuments();
