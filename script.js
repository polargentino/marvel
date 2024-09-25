const publicKey = '1e53f82a1a8481420ae86de5e9a39ba2';
const privateKey = '71a9e7edb773f6b34995767ba3156090137d065d';
let offset = 0;
const limit = 10;

function createHash(ts, publicKey, privateKey) {
  return CryptoJS.MD5(ts + privateKey + publicKey).toString();
}

async function fetchMarvelCharacters(searchQuery = '') {
  const ts = Date.now().toString();
  const hash = createHash(ts, publicKey, privateKey);
  let url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`;

  if (searchQuery) {
    url += `&nameStartsWith=${searchQuery}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.data.results.length > 0) {
      displayCharacters(data.data.results);
    } else {
      alert('No se encontraron personajes.');
    }
  } catch (error) {
    console.error('Error al obtener personajes de Marvel:', error);
  }
}

function displayCharacters(characters) {
  const charactersDiv = document.getElementById('characters');

  characters.forEach(character => {
    const characterElement = document.createElement('div');
    characterElement.classList.add('character');
    characterElement.innerHTML = `
      <h2>${character.name}</h2>
      <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
      <p>${character.description || 'No hay descripción disponible.'}</p>
    `;
    charactersDiv.appendChild(characterElement);
  });
}

function clearCharacters() {
  document.getElementById('characters').innerHTML = '';
}

document.getElementById('loadMore').addEventListener('click', () => {
  offset += limit;
  fetchMarvelCharacters();
});

document.getElementById('searchBtn').addEventListener('click', () => {
  const searchQuery = document.getElementById('search').value.trim();
  offset = 0;
  clearCharacters(); 
  fetchMarvelCharacters(searchQuery);
});

fetchMarvelCharacters();

// Movimiento aleatorio de la imagen
const marvelImg = document.getElementById('marvelImg');
const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;

function moveImageRandomly() {
  const randomX = Math.random() * (viewportWidth - marvelImg.width);
  const randomY = Math.random() * (viewportHeight - marvelImg.height);

  marvelImg.style.left = `${randomX}px`;
  marvelImg.style.top = `${randomY}px`;
}

setInterval(moveImageRandomly, 1500);



// Obtener referencia al halo
const halo = document.querySelector('.halo');

// Evento para seguir el cursor con el halo
document.addEventListener('mousemove', (event) => {
  // Coordenadas del cursor
  const x = event.clientX;
  const y = event.clientY;
  
  // Posicionar el halo en el cursor
  halo.style.left = `${x}px`;
  halo.style.top = `${y}px`;
});

