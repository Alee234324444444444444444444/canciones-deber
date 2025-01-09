const Cancion = require('../models/cancion');

// Obtener todas las canciones
const obtenerCanciones = async (req, res) => {
    try {
        const canciones = await Cancion.find();
        res.json(canciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las canciones.' });
    }
};

// Agregar una nueva canción
const agregarCancion = async (req, res) => {
    const { nombre, artista, urlYoutube } = req.body;

    if (!nombre || !artista || !urlYoutube) {
        return res.status(400).json({ message: 'Por favor, completa todos los campos.' });
    }

    try {
        const cancion = new Cancion({ nombre, artista, urlYoutube });
        await cancion.save();
        res.status(201).json(cancion);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar la canción.' });
    }
};

// Votar por una canción (incrementar el contador de votos)
const votarCancion = async (req, res) => {
    const { id } = req.params;

    try {
        const cancion = await Cancion.findById(id);
        if (!cancion) {
            return res.status(404).json({ message: 'Canción no encontrada.' });
        }

        cancion.votos += 1;
        await cancion.save();
        res.status(200).json(cancion);
    } catch (error) {
        res.status(500).json({ message: 'Error al votar por la canción.' });
    }
};

// Obtener una canción aleatoria
const obtenerCancionAleatoria = async (req, res) => {
    try {
        const count = await Cancion.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const cancion = await Cancion.find().skip(randomIndex).limit(1);
        res.json(cancion[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la canción aleatoria.' });
    }
};

module.exports = {
    obtenerCanciones,
    agregarCancion,
    votarCancion,
    obtenerCancionAleatoria,
};
