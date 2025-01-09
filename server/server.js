let express = require('express');
let mongoose = require('mongoose');
let cancionesRoutes = require('./routes/cancionesRoutes');
let cors = require('cors');
let path = require('path'); 
let port = 3000;
let app = express();


app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '../client')));

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/musica', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });


// Rutas
app.use('/aplicacion/canciones', cancionesRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
