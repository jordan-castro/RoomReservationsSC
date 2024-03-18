// import postgres from 'postgres';
const postgres = require("postgres");

exports.sql = postgres({
    host: "localhost",
    port: 5432,
    database: "room_reservations",
    user: "postgres",
    password: "xxxxxxx",
    ssl: "prefer"
    // connection: "host=localhost port=5432 dbname=room_reservations user=postgres password=xxxxxxx sslmode=prefer"
});
