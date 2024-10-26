import bcrypt from "bcrypt";
import express from "express";
const app = express();
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import connectsqlite from "connect-sqlite3";

const db = await open({
    driver: sqlite3.Database,
    filename: "database.sqlite"
})

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
//Main Page
app.get('/', (req, res) => {
    res.render('index', { error: "" });
});
app.post('/', async (req, res) => {

    const data = req.body;
    if (await checkUserExistens(data)) {
        res.render('index', { error: "Sie sind bereits angemeldet" });
        return;
    }
    await db.run("INSERT INTO anmeldungen (name, vorname, mail) VALUES (?,?,?)", data.surename, data.vorname, data.mail);
    res.redirect('/');
})

app.get('/impressum', (req, res) => {
    res.render('impressum');
});

app.listen('5000');

async function checkUserExistens(data) {
    const userdata = await db.get("SELECT mail FROM anmeldungen WHERE mail = ?", data.mail);
    if (!userdata) {
        return false;
    }
    return true;
}