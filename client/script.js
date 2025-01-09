const API = 'http://localhost:3000/aplicacion/canciones';


const formAgregar = document.getElementById('form-agregar-cancion');
const listaCanciones = document.getElementById('lista-canciones');
const randomSongsContainer = document.getElementById('random-songs');
const cancionAleatoriaBtn = document.getElementById('cancion-aleatoria-btn');


const esURLValidaYoutube = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
};

const mostrarError = (mensaje) => alert(mensaje);

// Agregar una nueva canción
formAgregar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const artista = document.getElementById('artista').value.trim();
    const urlYoutube = document.getElementById('urlYoutube').value.trim();

    if (!nombre || !artista || !urlYoutube) {
        mostrarError('Por favor, completa todos los campos.');
        return;
    }

    if (!esURLValidaYoutube(urlYoutube)) {
        mostrarError('Por favor, proporciona una URL válida de YouTube.');
        return;
    }

    try {
        const response = await fetch(`${API}/agregar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, artista, urlYoutube }),
        });

        if (!response.ok) throw new Error('Error al agregar la canción.');

        alert('Canción agregada exitosamente.');
        formAgregar.reset();
        obtenerCanciones();
    } catch (error) {
        mostrarError(error.message);
    }
});

// Obtener todas las canciones registradas
const obtenerCanciones = async () => {
    try {
        const response = await fetch(API);
        const canciones = await response.json();

        listaCanciones.innerHTML = '';
        canciones.forEach((cancion) => {
            const div = document.createElement('div');
            div.classList.add('cancion-card');
            div.innerHTML = `
                <div class="cancion-card-content">
                    <p><strong>${cancion.nombre}</strong> - <strong>${cancion.artista}</strong></p>
                    <span id="voto-count-${cancion._id}">Votos: ${cancion.votos || 0}</span>
                    <button class="voto-btn" onclick="votar('${cancion._id}')">Votar</button>
                    <button><a href="${cancion.urlYoutube}" target="_blank" class="youtube-link">Ver</a></button>
                    <button class="eliminar-btn" onclick="eliminarCancion('${cancion._id}')">Eliminar</button>
                </div>
            `;
            listaCanciones.appendChild(div);
        });
    } catch (error) {
        console.error('Error al obtener las canciones:', error);
    }
};

// Eliminar una canción
async function eliminarCancion(id) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta canción?');
    if (confirmacion) {
        try {
            const response = await fetch(`/aplicacion/canciones/${id}`, { method: 'DELETE' });
            if (response.ok) {
                alert('Canción eliminada correctamente.');
                location.reload(); 
            } else {
                alert('Hubo un problema al eliminar la canción.');
            }
        } catch (error) {
            alert('Error de conexión al intentar eliminar la canción.');
        }
    }
}



// Función para votar por una canción
const votar = async (id) => {
    try {
        const response = await fetch(`${API}/votar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) throw new Error('Error al registrar el voto.');

        const updatedSong = await response.json();
        const votoSpan = document.getElementById(`voto-count-${id}`);
        votoSpan.textContent = `Votos: ${updatedSong.votos}`;
    } catch (error) {
        mostrarError(error.message);
    }
};

// Función para mostrar una canción aleatoria
const mostrarCancionAleatoria = async () => {
    try {
        const response = await fetch(API);
        const canciones = await response.json();

        if (canciones.length === 0) {
            mostrarError('No hay canciones registradas.');
            return;
        }

        
        const cancionAleatoria = canciones[Math.floor(Math.random() * canciones.length)];

        randomSongsContainer.innerHTML = `
            <div class="cancion-card">
                <div class="cancion-card-content">
                    <p><strong>${cancionAleatoria.nombre}</strong> - ${cancionAleatoria.artista}</p>
                    <span id="voto-count-${cancionAleatoria._id}">Votos: ${cancionAleatoria.votos || 0}</span>
                    <button class="voto-btn" id="votar-aleatoria" data-id="${cancionAleatoria._id}">Votar</button>
                    <button><a href="${cancionAleatoria.urlYoutube}" target="_blank" class="youtube-link">Ver</a></button>
                    
                    
                </div>
            </div>
        `;

       
        setTimeout(() => {
            // Obtener el botón de votar
            const votarAleatoriaBtn = document.getElementById('votar-aleatoria');
            if (votarAleatoriaBtn) {
                votarAleatoriaBtn.addEventListener('click', () => {
                    votar(cancionAleatoria._id);
                });
            }
        }, 0);  
    } catch (error) {
        mostrarError('Error al obtener la canción aleatoria.');
    }
};


cancionAleatoriaBtn.addEventListener('click', mostrarCancionAleatoria);


document.querySelectorAll('.tab-button').forEach((button) => {
    button.addEventListener('click', () => {
        const tab = button.dataset.tab;

        
        document.querySelectorAll('.tab-button').forEach((btn) => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        
        document.querySelectorAll('.tab-content').forEach((content) => {
            content.classList.remove('active');
        });
        document.getElementById(tab).classList.add('active');
    });
});

obtenerCanciones();
