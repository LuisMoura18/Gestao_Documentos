const API_URL = window.location.protocol === 'file:' ? 'http://localhost:3000' : window.location.origin;
const documentId = new URLSearchParams(window.location.search).get('id');

const titleElement = document.querySelector('#document-title');
const descriptionElement = document.querySelector('#document-description');
const dateElement = document.querySelector('#document-date');
const fileElement = document.querySelector('#document-file');
const downloadLink = document.querySelector('#download-link');
const commentsList = document.querySelector('#comments-list');
const commentCount = document.querySelector('#comment-count');
const commentForm = document.querySelector('#comment-form');
const feedback = document.querySelector('#detail-feedback');

function formatDate(dateValue, includeTime = false) {
  const options = includeTime ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' };
  return new Intl.DateTimeFormat('pt-BR', options).format(new Date(dateValue));
}

function escapeHtml(value = '') {
  const element = document.createElement('span');
  element.textContent = value;
  return element.innerHTML;
}

function renderComments(comments) {
  commentCount.textContent = comments.length;
  if (!comments.length) {
    commentsList.innerHTML = '<p class="empty-state">Nenhum comentario neste documento.</p>';
    return;
  }
  commentsList.innerHTML = comments.map((comment) => `
    <article class="comment-item">
      <p>${escapeHtml(comment.text)}</p>
      <time datetime="${comment.date}">${formatDate(comment.date, true)}</time>
    </article>
  `).join('');
}

async function loadDocument() {
  if (!documentId) throw new Error('Nenhum documento foi informado.');
  const response = await fetch(`${API_URL}/documents/${documentId}`);
  if (!response.ok) throw new Error('Documento nao encontrado.');
  const documentData = await response.json();
  titleElement.textContent = documentData.title;
  descriptionElement.textContent = documentData.description || 'Sem descricao cadastrada.';
  dateElement.textContent = `Adicionado em ${formatDate(documentData.dataUpload)}`;
  fileElement.textContent = documentData.nameFile;
  downloadLink.href = `${API_URL}/documents/${documentData.id}/download`;
  renderComments(documentData.comments || []);
}

async function addComment(event) {
  event.preventDefault();
  const textInput = document.querySelector('#comment-text');
  const submitButton = commentForm.querySelector('button');
  submitButton.disabled = true;
  feedback.className = 'feedback';
  feedback.textContent = 'Salvando comentario...';
  try {
    const response = await fetch(`${API_URL}/documents/${documentId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textInput.value }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || 'Nao foi possivel salvar o comentario.');
    textInput.value = '';
    feedback.className = 'feedback success';
    feedback.textContent = 'Comentario adicionado.';
    await loadDocument();
  } catch (error) {
    feedback.className = 'feedback error';
    feedback.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
}

commentForm.addEventListener('submit', addComment);
loadDocument().catch((error) => {
  feedback.className = 'feedback error';
  feedback.textContent = error.message;
  titleElement.textContent = 'Nao foi possivel carregar';
});
