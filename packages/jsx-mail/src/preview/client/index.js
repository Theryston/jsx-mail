/* eslint-disable no-undef */
const socket = io(`http://localhost:3256`);

const LOADING_HTML =
  "<!doctype html><html><head><style>body {display: flex; align-self: center; justify-content: center; width: 100%; height: 100%; padding: 0; margin: 0; padding-top: 100px;} .loader {border: 1px solid #f3f3f3; border-top: 1px solid #3498db; border-radius: 50%; width: 20px; height: 20px; animation: spin 2s linear infinite;} @keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}</style></head><body><div class='loader'></div></body></html>";

socket.on('connect', () => {
  const iframe = document.getElementById('preview');
  iframe.srcdoc = LOADING_HTML;
  socket.emit('template');
});

function buildFolderStructure(paths, currentTemplate) {
  const root = {};

  paths.forEach((path) => {
    const parts = path.split(':');
    let currentLevel = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (i < parts.length - 1) {
        if (!currentLevel[part]) {
          currentLevel[part] = {};
        }
        currentLevel = currentLevel[part];
      } else {
        if (!currentLevel.files) {
          currentLevel.files = [];
        }
        currentLevel.files.push({
          name: part,
          isCurrent: path === currentTemplate,
          path,
        });
      }
    }
  });

  return root;
}

function renderTemplates(folders) {
  const container = document.getElementById('templates-container');
  container.innerHTML = '';

  function renderFolder(folder, level, currentContainer) {
    const folderContainer = document.createElement('div');
    folderContainer.classList.add('template-folder');

    const folderName = document.createElement('p');
    folderName.classList.add('folder-name');
    folderName.innerText = level;
    folderName.title = level;
    currentContainer.appendChild(folderName);

    Object.keys(folder).forEach((key) => {
      if (key === 'files') {
        folder[key].forEach((file) => {
          const fileContainer = document.createElement('div');
          fileContainer.classList.add('template-item');
          fileContainer.classList.toggle('current-template', file.isCurrent);
          fileContainer.innerText = file.name;
          fileContainer.title = file.name;
          fileContainer.addEventListener('click', () => {
            const iframe = document.getElementById('preview');
            iframe.srcdoc = LOADING_HTML;
            socket.emit('template', file.path);
          });
          folderContainer.appendChild(fileContainer);
        });
      } else {
        renderFolder(folder[key], key, folderContainer);
      }
    });

    currentContainer.appendChild(folderContainer);
  }

  Object.keys(folders).forEach((key) => {
    renderFolder(folders[key], key, container);
  });
}

socket.on('templates', (data) => {
  const folders = buildFolderStructure(data.templates, data.currentTemplate);

  renderTemplates({
    '': folders,
  });
});

socket.on('code', (data) => {
  const iframe = document.getElementById('preview');
  iframe.srcdoc = data.code;
});

socket.on('error', (error) => {
  const iframe = document.getElementById('preview');
  iframe.srcdoc = `<h1>Error</h1><p>${
    error.message || error
  }</p><p>To see more details of the error look in the terminal where JSX Mail is running</p>`;
});
