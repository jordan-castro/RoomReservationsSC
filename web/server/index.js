const express = require("express");
const fs = require("node:fs");
const multer = require("multer");

const sql = require("./src/db/db").sql;
const web3 = require("./src/web3/contract");
const makeHash = require("./src/utils/hash").makeHash;
const result = require("./src/utils/result");
const path = require("node:path");
const { smartQuery, doesExist } = require("./src/db/query");
const { smartInsert } = require("./src/db/insert");
const { get } = require("node:http");

// const express = require("express");
// const sql = require("./db/db");

const app = express();

// Configuration
const PORT = 3001;
const IP = "localhost";

app.use(express.json());
// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});

const uploadImage = multer({
    dest: "./images/"
});

// Intialize the DB by adding necessary tables and SCHEMA
app.get("/initializedb", async (req, res) => {
    await sql`CREATE TABLE IF NOT EXISTS Room (
        id SERIAL PRIMARY KEY,
        title TEXT,
        physical_address TEXT,
        room_id INTEGER,
        image TEXT,
        price INTEGER,
        owner TEXT,
        can_reserve BOOLEAN
    );`;
    await sql`CREATE TABLE IF NOT EXISTS Reservation(
        id SERIAL PRIMARY KEY,
        reservation_id INTEGER,
        reserver TEXT,
        room_id INTEGER,
        start_date INTEGER,
        end_date INTEGER,
        is_paid BOOLEAN
    );`;
    await sql`CREATE TABLE IF NOT EXISTS Payment(
        id SERIAL PRIMARY KEY,
        payer TEXT,
        payee TEXT,
        date_paid INTEGER,
        reservation_id INTEGER
    );`;

    res.send("Tables created");
});

app.get("/", (req, res) => {
    res.send("Hello World 2!");
});

// This updates our internal DB
app.get("/crawl_contract", async (req, res) => {
    const contract = web3.getContract(web3.getWallet());

    // Rooms
    const rooms = await contract.getRooms();
    console.log(rooms);

    for (let i = 0; i < rooms.length; i++) {
        const query = await sql`
        SELECT * FROM Room WHERE room_id = ${rooms[i][2]};
        `;

        if (query.length == 0) {
            await sql`
            INSERT INTO Room (
                title,
                physical_address,
                room_id,
                image,
                price,
                owner,
                can_reserve
            )
            VALUES (
                ${rooms[i][0]},
                ${rooms[i][1]},
                ${rooms[i][2]},
                ${rooms[i][3]},
                ${rooms[i][4]},
                ${rooms[i][5]},
                ${rooms[i][6]}
            )
            `;
        } else {
            await sql`
                UPDATE Room 
                SET can_reserve = ${rooms[i][6]}
            `;
        }
    }

    // Reservations
    const reservations = await contract.getReservations();
    for (let i = 0; i < reservations.length; i++) {
        const query = await sql`
        SELECT * FROM Reservation WHERE room_id = ${reservations[i][1]} AND start_date = ${reservations[i][2]} AND end_date = ${reservations[i][3]} AND reserver = ${reservations[i][0]};
        `;
        if (query.length == 0) {
            await sql`
            INSERT INTO Reservation (
                reserver,
                reservation_id,
                room_id,
                start_date,
                end_date,
                is_paid
            )
            VALUES (
                ${reservations[i][0]},
                ${i},
                ${reservations[i][1]},
                ${reservations[i][2]},
                ${reservations[i][3]},
                ${reservations[i][4]}
            )
            `;
        } else {
            // Update
            await sql`
            UPDATE Reservation
            SET is_paid = ${reservations[i][4]}
            WHERE id = ${query[0].id};
            `;
        }
    }

    // Payments
    const payments = await contract.getPayments();
    console.log(payments);
    for (let i = 0; i < payments.length; i++) {
        const query = await sql`
        SELECT * FROM Payment WHERE reservation_id = ${payments[i][3]} AND payer = ${payments[i][0]} AND payee = ${payments[i][1]} AND date_paid = ${payments[i][2]};
        `;
        if (query.length == 0) {
            await sql`
            INSERT INTO Payment (
                payer,
                payee,
                date_paid,
                reservation_id
            )
            VALUES (
                ${payments[i][0]},
                ${payments[i][1]},
                ${payments[i][2]},
                ${payments[i][3]}
            )
            `;
        }
    }

    res.send("Contract has been crawled and values updated.");
});

app.post("/contract/crawl", async (req, res) => {
    get("http://localhost:3001/crawl_contract");
    res.send("0");
});

// Add room
app.post("/contract/addRoom", uploadImage.single("image"), async (req, res) => {
    // Make sure all requires values are passed
    if (req.body.roomTitle === undefined
        || req.body.physicalAddress === undefined
        || req.file === undefined
        || req.body.price === undefined
        || req.body.canReserve === undefined
        || req.body.roomOwner === undefined
    ) {
        res.send(result.negative());
        return;
    }

    req.body.canReserve = req.body.canReserve === "true"
    // Save the image in a local directory of images/
    const tempPath = req.file.path;
    const fileName = makeHash(6);
    console.log(fileName);
    const targetPath = path.join("./images/" + fileName + path.extname(req.file.originalname).toLowerCase());
    fs.rename(tempPath, targetPath, err => {
        if (err) {
            res.send(result.negative(3))
            return
        };
        const wallet = web3.getWallet();
        const contract = web3.getContract(wallet);

        // Sign the transaction for no GAS fees to the user

        contract.addRoom(
            req.body.roomTitle,
            req.body.physicalAddress,
            "http://localhost:3001/" + targetPath,
            req.body.price,
            req.body.canReserve,
            req.body.roomOwner
        ).then(async (value) => {
            await value.wait();
            console.log("Room added");

            get("http://localhost:3001/crawl_contract");

            res.send(result.positive());
        }).catch((reason) => {
            console.log(reason);
            res.send(result.negative(2));
        });
    });
});

// Make a reservation
app.post("/contract/makeReservation", async (req, res) => {
    if (req.body.roomId === undefined
        || req.body.startDate === undefined
        || req.body.endDate === undefined
        || req.body.reserver === undefined
    ) {
        console.log(req.body);
        res.send(result.negative());
        return;
    }
    // bool checkReserved, // If false, it assumes you know that the dates are not currently already reserved.

    const wallet = web3.getWallet();
    const contract = web3.getContract(wallet);

    contract.makeReservation(
        req.body.roomId,
        req.body.startDate,
        req.body.endDate, true,
        req.body.reserver
    ).then(async (value) => {
        await value.wait();
        console.log("Reservation made");
        get("http://localhost:3001/crawl_contract");
        
        res.send(result.positive());
    }).catch((reason) => {
        console.log(reason);
        res.send(result.negative(2));
    });
});

// Delete a reservation
app.post("/contract/deleteReservation", (req, res) => {
    if (req.body.roomId === undefined
        || req.body.reservationId === undefined
        || req.body.deleter === undefined
    ) {
        res.send(result.negative());
        return;
    }

    const wallet = web3.getWallet();
    const contract = web3.getContract(wallet);

    contract.deleteReservation(
        req.body.roomId,
        req.body.reservationId,
        req.body.deleter
    ).then(async (value) => {
        await value.wait();
        console.log("Reservation deleted");
        get("http://localhost:3001/crawl_contract");

        res.send(result.positive());
    }).catch((reason) => {
        console.log(reason);
        res.send(result.negative(2));
    });
});

// Change room canReserve status
app.post("/contract/updateStatus", (req, res) => {
    if (req.body.roomId === undefined
        || req.body.canReserve === undefined
        || req.body.from === undefined
    ) {
        console.log(req.body);
        res.send(result.negative());
        return;
    }

    const wallet = web3.getWallet();
    const contract = web3.getContract(wallet);

    contract.updateRoomReservationStatus(
        req.body.roomId,
        req.body.canReserve,
        req.body.from
    ).then(async (value) => {
        await value.wait();
        console.log("Room status updated");
        get("http://localhost:3001/crawl_contract");

        res.send(result.positive());
    }).catch((reason) => {
        console.log(reason);
        res.send(result.negative(2));
    })

})

app.get('/db/rooms', async (req, res) => {
    try {
        const query = await sql`
        SELECT * FROM room;
        `;

        res.send(result.positiveWith(query));
    } catch (err) {
        console.log(err);
        res.send(result.negative());
    }
});

app.get('/db/rooms/:id', async (req, res) => {
    try {
        const query = await sql`
        SELECT * FROM room
        WHERE room_id = ${req.params.id};
        `;
        res.send(result.positiveWith(query));
    } catch (err) {
        console.log(err);
        res.send(result.negative());
    }
})

app.get('/db/reservations', async (req, res) => {
    try {
        const query = await sql`
        SELECT * FROM reservation;
        `;
        res.send(result.positiveWith(query));
    } catch (err) {
        console.log(err);
        res.send(result.negative());
    }
});

app.get('/db/reservations/:id', async (req, res) => {
    try {
        const query = await sql`
        SELECT * FROM reservation
        WHERE id = ${req.params.id};
        `;
        res.send(result.positiveWith(query));
    } catch (err) {
        console.log(err);
        res.send(result.negative());
    }
})

app.get('/db/payments', async (req, res) => {
    try {
        const query = await sql`
            SELECT * FROM payment;
            `;
        res.send(result.positiveWith(query));
    } catch (err) {
        console.log(err);
        res.send(result.negative());
    }
});

app.get('/db/payments/:id', async (req, res) => {
    try {
        const query = await sql`
        SELECT * FROM payment
        WHERE id = ${req.params.id};
        `;
        res.send(result.positiveWith(query));
    } catch (err) {
        console.log(err);
        res.send(result.negative());
    }
})

// For images
app.get('/images/:name', async (req, res) => {
    fs.readFile(`./images/${req.params.name}`, (err, data) => {
        if (err) {
            res.send(result.negative(3));
            return;
        }
        res.send(data);
    })
})

// Run server
app.listen(PORT, () => {
    console.log(`Listening at: ${PORT}`);
});