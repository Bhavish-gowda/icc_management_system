const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'icc_management'
});

// Connect MySQL
db.connect((err) => {

    if(err) {
        console.log('Database Error:', err);
    } else {
        console.log('MySQL Connected Successfully');
    }

});

// TEST ROUTE
app.get('/', (req, res) => {
    res.send('ICC Cricket Management Backend Running');
});

// ADD PLAYER API
app.post('/add-player', (req, res) => {

    const { name, country, role, runs } = req.body;

    // SQL QUERY
    const sql = `
        INSERT INTO players(name, country, role, runs)
        VALUES (?, ?, ?, ?)
    `;

    // SHOW QUERY IN TERMINAL
    console.log('\n==============================');
    console.log('SQL QUERY EXECUTED:');
    console.log(sql);

    console.log('VALUES:', {
        name,
        country,
        role,
        runs
    });

    // EXECUTE QUERY
    db.query(sql, [name, country, role, runs], (err, result) => {

        if(err) {
            console.log(err);
            res.send(err);
        } else {

            // LOG ACTIVITY
            const logSql = `
                INSERT INTO logs(username, activity)
                VALUES (?, ?)
            `;

            const activity = `Added player ${name}`;

            db.query(logSql, ['Admin', activity]);

            console.log('LOG CREATED:', activity);

            res.send('Player Added Successfully');
        }

    });

});

// GET ALL PLAYERS API
app.get('/players', (req, res) => {

    const sql = `
        SELECT * FROM players
        ORDER BY player_id DESC
    `;

    console.log('\n==============================');
    console.log('SQL QUERY EXECUTED:');
    console.log(sql);

    db.query(sql, (err, result) => {

        if(err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }

    });

});

// DELETE PLAYER API
app.delete('/delete-player/:id', (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM players
        WHERE player_id = ?
    `;

    console.log('\n==============================');
    console.log('SQL DELETE EXECUTED for ID:', id);

    db.query(sql, [id], (err, result) => {

        if(err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            // LOG ACTIVITY
            const logSql = `
                INSERT INTO logs(username, activity)
                VALUES (?, ?)
            `;
            const activity = `Deleted player with ID: ${id}`;
            
            db.query(logSql, ['Admin', activity]);
            console.log('LOG CREATED:', activity);

            res.send('Player Deleted Successfully');
        }

    });

});

// --- COUNTRIES API ---

// GET ALL COUNTRIES
app.get('/countries', (req, res) => {
    const sql = `
        SELECT * FROM countries
        ORDER BY country_id DESC
    `;
    console.log('\n==============================');
    console.log('SQL QUERY EXECUTED (GET Countries):');
    console.log(sql);

    db.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

// ADD COUNTRY
app.post('/add-country', (req, res) => {
    const { name, format, captain, coach, rank } = req.body;
    const sql = `
        INSERT INTO countries(country_name, format, captain, head_coach, ranking)
        VALUES (?, ?, ?, ?, ?)
    `;
    console.log('\n==============================');
    console.log('SQL QUERY EXECUTED (ADD Country):');
    console.log(sql);
    console.log('VALUES:', { name, format, captain, coach, rank });

    db.query(sql, [name, format, captain, coach, rank], (err, result) => {
        if(err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            const logSql = `INSERT INTO logs(username, activity) VALUES (?, ?)`;
            const activity = `Added country: ${name}`;
            db.query(logSql, ['Admin', activity]);
            console.log('LOG CREATED:', activity);
            res.send('Country Added Successfully');
        }
    });
});

// DELETE COUNTRY
app.delete('/delete-country/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM countries WHERE country_id = ?`;
    console.log('\n==============================');
    console.log('SQL DELETE EXECUTED (Country) for ID:', id);

    db.query(sql, [id], (err, result) => {
        if(err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            const logSql = `INSERT INTO logs(username, activity) VALUES (?, ?)`;
            const activity = `Deleted country with ID: ${id}`;
            db.query(logSql, ['Admin', activity]);
            console.log('LOG CREATED:', activity);
            res.send('Country Deleted Successfully');
        }
    });
});

// --- MATCHES API ---

// GET ALL MATCHES
app.get('/matches', (req, res) => {
    const sql = `
        SELECT * FROM matches
        ORDER BY match_id DESC
    `;
    console.log('\n==============================');
    console.log('SQL QUERY EXECUTED (GET Matches):');
    console.log(sql);

    db.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

// ADD MATCH
app.post('/add-match', (req, res) => {
    const { team1, team2, format, match_date, venue } = req.body;
    const sql = `
        INSERT INTO matches(team1, team2, format, match_date, venue)
        VALUES (?, ?, ?, ?, ?)
    `;
    console.log('\n==============================');
    console.log('SQL QUERY EXECUTED (ADD Match):');
    console.log(sql);
    console.log('VALUES:', { team1, team2, format, match_date, venue });

    db.query(sql, [team1, team2, format, match_date, venue], (err, result) => {
        if(err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            const logSql = `INSERT INTO logs(username, activity) VALUES (?, ?)`;
            const activity = `Scheduled match: ${team1} vs ${team2}`;
            db.query(logSql, ['Admin', activity]);
            console.log('LOG CREATED:', activity);
            res.send('Match Scheduled Successfully');
        }
    });
});

// DELETE MATCH
app.delete('/delete-match/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM matches WHERE match_id = ?`;
    console.log('\n==============================');
    console.log('SQL DELETE EXECUTED (Match) for ID:', id);

    db.query(sql, [id], (err, result) => {
        if(err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            const logSql = `INSERT INTO logs(username, activity) VALUES (?, ?)`;
            const activity = `Deleted match with ID: ${id}`;
            db.query(logSql, ['Admin', activity]);
            console.log('LOG CREATED:', activity);
            res.send('Match Deleted Successfully');
        }
    });
});

// VIEW LOGS API
app.get('/logs', (req, res) => {

    const sql = `
        SELECT * FROM logs
        ORDER BY log_time DESC
    `;

    console.log('FETCHING LOGS');

    db.query(sql, (err, result) => {

        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }

    });

});

// START SERVER
app.listen(5000, () => {
    console.log('Server Running on Port 5000');
});