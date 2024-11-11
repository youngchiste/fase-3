const express = require('express');
const bodyParser = require('body-parser');
const db = require('./src/db/connection');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/modulos', (req, res) => {
    db.query('SELECT * FROM Modulo', (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get('/api/severidades', (req, res) => {
    db.query('SELECT * FROM Severidad', (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.post('/api/tickets', (req, res) => {
    const { modulo_id, severidad_id, descripcionBreve, descripcionDetallada } = req.body;
    const fecha_creacion = new Date().toISOString().split('T')[0];

    const ticketQuery = 'INSERT INTO Ticket (fecha_creacion, descripcion_breve, descripcion_detallada) VALUES (?, ?, ?)';
    db.query(ticketQuery, [fecha_creacion, descripcionBreve, descripcionDetallada], (err, result) => {
        if (err) throw err;
        const ticket_id = result.insertId;

        const severidadTicketQuery = 'INSERT INTO Severidad_Ticket (ticket_id, severidad_id, fecha_inicio_severidad) VALUES (?, ?, ?)';
        db.query(severidadTicketQuery, [ticket_id, severidad_id, fecha_creacion], (err) => {
            if (err) throw err;

            const moduloTicketQuery = 'INSERT INTO Modulo_Ticket (ticket_id, modulo_id, fecha_inicio_modulo) VALUES (?, ?, ?)';
            db.query(moduloTicketQuery, [ticket_id, modulo_id, fecha_creacion], (err) => {
                if (err) throw err;
                res.send({ ticket_id });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
