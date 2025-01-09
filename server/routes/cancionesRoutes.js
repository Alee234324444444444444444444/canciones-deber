let express = require('express');
let router = express.Router();
let Cancion = require('../models/cancion'); 

// Ruta para obtener todas las canciones
router.get('/', async (req, res) => {
    try {
        const canciones = await Cancion.find();
        res.json(canciones);
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener las canciones' });
    }
});

// Ruta para agregar una nueva canción
router.post('/agregar', async (req, res) => {
    const { nombre, artista, urlYoutube } = req.body;

    if (!nombre || !artista || !urlYoutube) {
        return res.status(400).send({ error: 'Faltan datos de la canción' });
    }

    try {
        const nuevaCancion = new Cancion({ nombre, artista, urlYoutube });
        await nuevaCancion.save();
        res.status(201).json(nuevaCancion);
    } catch (error) {
        res.status(500).send({ error: 'Error al agregar la canción' });
    }
});

// Ruta para votar por una canción
router.post('/votar', async (req, res) => {
    const { id } = req.body;  

    if (!id) {
        return res.status(400).send({ error: 'Se requiere un id de canción' });
    }

    try {
        const cancion = await Cancion.findById(id); 
        if (!cancion) {
            return res.status(404).send({ error: 'Canción no encontrada' });
        }

        
        cancion.votos = (cancion.votos || 0) + 1;
        await cancion.save();

        
        res.json(cancion);
    } catch (error) {
        res.status(500).send({ error: 'Error al registrar el voto' });
    }
});



router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const cancionEliminada = await Cancion.findByIdAndDelete(id);
        if (!cancionEliminada) {
            return res.status(404).send({ error: 'Canción no encontrada' });
        }

        res.status(200).send({ message: 'Canción eliminada exitosamente' });
    } catch (error) {
        res.status(500).send({ error: 'Error al eliminar la canción' });
    }
});




// Ruta para eliminar una canción
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const cancionEliminada = await Cancion.findByIdAndDelete(id);
        if (!cancionEliminada) {
            return res.status(404).send({ error: 'Canción no encontrada' });
        }

        res.status(200).send({ message: 'Canción eliminada exitosamente' });
    } catch (error) {
        res.status(500).send({ error: 'Error al eliminar la canción' });
    }
});


module.exports = router;
