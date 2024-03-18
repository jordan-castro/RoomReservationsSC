const express = require("express");
const fs = require("node:fs");
const multer = require("multer");

const sql = require("./src/db/db").sql;
const web3 = require("./src/web3/contract");
const makeHash = require("./src/utils/hash").makeHash;
const result = require("./src/utils/result");
const path = require("node:path");

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
        image TEXT,
        owner TEXT,
        can_reserve BOOLEAN
    );`;
    await sql`CREATE TABLE IF NOT EXISTS Reservation(
        id SERIAL PRIMARY KEY,
        room_id INTEGER,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        is_paid BOOLEAN
    );`;
    await sql`CREATE TABLE IF NOT EXISTS Payment(
        id SERIAL PRIMARY KEY,
        payer TEXT,
        payee TEXT,
        date_paid TIMESTAMP,
        reservation_id INTEGER
    );`;

    res.send("Tables created");
});

app.get("/", (req, res) => {
    res.send("Hello World 2!");
});

// This updates our internal DB
app.get("/crawl_contract", async (req, res) => {

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

    // Save the image in a local directory of images/
    const tempPath = req.file.path;
    const fileName = makeHash(6);
    console.log(fileName);
    const targetPath = path.join(__dirname, "./images/" + fileName + path.extname(req.file.originalname).toLowerCase());
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
            targetPath,
            req.body.price,
            req.body.canReserve,
            req.body.roomOwner
        ).then(async (value) => {
            await value.wait();
            console.log("Room added");
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
        WHERE id = ${req.params.id};
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

// Run server
app.listen(PORT, () => {
    console.log(`Listening at: ${PORT}`);
});