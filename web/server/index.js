const express = require("express");
const fs = require("node:fs");
const multer = require("multer");
const { get } = require("node:http");
const path = require("node:path");

const sql = require("./src/db/db").sql;
const web3 = require("./src/web3/contract");
const makeHash = require("./src/utils/hash").makeHash;
const result = require("./src/utils/result");
const rrcrypto = require("./src/utils/rrcrypto");
const wallet = require("./src/web3/wallet");

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
    // If the tables exists drop them
    try {
        await sql`DROP TABLE Room`;
    } catch (e) {
        console.log(e);
    }
    try {
        await sql`DROP TABLE Reservation`;
    } catch (e) {
        console.log(e);
    }
    try {
        await sql`DROP TABLE Payment`;
    } catch (e) {
        console.log(e);
    }
    try {
        await sql`DROP TABLE Property`;
    } catch (e) {
        console.log(e);
    }
    // THESE TABLES ARE DECENTRILIZED
    await sql`CREATE TABLE IF NOT EXISTS Room (
        id SERIAL PRIMARY KEY,
        property_id INTEGER,
        title TEXT,
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
        is_paid BOOLEAN,
        was_deleted BOOLEAN
    );`;
    await sql`CREATE TABLE IF NOT EXISTS Payment(
        id SERIAL PRIMARY KEY,
        payer TEXT,
        payee TEXT,
        date_paid INTEGER,
        reservation_id INTEGER
    );`;
    await sql`CREATE TABLE IF NOT EXISTS Property(
        id SERIAL PRIMARY KEY,
        name TEXT,
        logo TEXT,
        typeOf TEXT,
        physicalAddress TEXT,
        owner TEXT,
        contactEmail TEXT,
        contactPhone TEXT
    );
    `;

    // THESE TABLES ARE CENTRALIZED
    await sql`CREATE TABLE IF NOT EXISTS Wallet(
        id SERIAL PRIMARY KEY,
        public_key TEXT,
        private_key TEXT
    );`;
    await sql`CREATE TABLE IF NOT EXISTS AuthKey(
        id SERIAL PRIMARY KEY,
        public_key TEXT,
        secret_key TEXT
    );
    `;

    res.send("Tables created");
});

app.get("/", (req, res) => {
    res.send("Hello World 2!");
});

// This updates our internal DB
app.get("/crawl_contract", async (req, res) => {
    const contract = web3.getContract(web3.getWallet());
    // get("http://localhost:3001/initializedb");

    // Properties
    const properties = await contract.getProperties();
    console.log(properties);

    for (let i = 0; i < properties.length; i++) {
        await sql`
            INSERT INTO Property (
                name,
                logo,
                typeOf,
                physicalAddress,
                owner,
                contactEmail,
                contactPhone
            ) VALUES (
                ${properties[i][0]},
                ${properties[i][1]},
                ${properties[i][2]},
                ${properties[i][3]},
                ${properties[i][4]},
                ${properties[i][5]},
                ${properties[i][6]}
            );
        `;
    }

    // Rooms
    const rooms = await contract.getRooms();
    console.log(rooms);

    for (let i = 0; i < rooms.length; i++) {
        await sql`
            INSERT INTO Room (
                property_id,
                title,
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
    }

    // Reservations
    const reservations = await contract.getReservations();
    for (let i = 0; i < reservations.length; i++) {
        console.log(reservations[i]);
        await sql`
            INSERT INTO Reservation (
                reserver,
                reservation_id,
                room_id,
                start_date,
                end_date,
                is_paid,
                was_deleted
            )
            VALUES (
                ${reservations[i][0]},
                ${i},
                ${reservations[i][1]},
                ${reservations[i][2]},
                ${reservations[i][3]},
                ${reservations[i][4]},
                ${reservations[i][5]}
            )
        `;
    }

    // Payments
    const payments = await contract.getPayments();
    console.log(payments);
    for (let i = 0; i < payments.length; i++) {
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

    res.send("Contract has been crawled and values updated.");
});

app.post("/contract/crawl", async (req, res) => {
    get("http://localhost:3001/crawl_contract");
    res.send("0");
});

// Add property
app.post("/contract/addProperty", uploadImage.single("image"), async (req, res) => {
    // Make sure all required values are passed
    if (req.body.name === undefined
        || req.body.typeOf === undefined
        || req.body.physicalAddress === undefined
        || req.body.contactEmail === undefined
        || req.body.contactPhone === undefined
        || req.body.owner === undefined
        || req.body.key === undefined
        || req.file === undefined
    ) {
        res.send(result.negative());
        return;
    }

    // Save the image in a local directory
    const tempPath = req.file.path;
    const fileName = makeHash(6);
    console.log(fileName);
    const targetPath = path.join("./images/" + fileName + path.extname(req.file.originalname).toLowerCase());
    fs.rename(tempPath, targetPath, err => {
        if (err) {
            res.send(result.negative(3));
            return;
        }

        const wallet = web3.getWallet();
        const contract = web3.getContract(wallet);

        // Sign the transaction
        const imagePath = "http://localhost:3001/" + targetPath;

        contract.addProperty(
            req.body.name,
            imagePath,
            req.body.typeOf,
            req.body.physicalAddress,
            req.body.owner,
            req.body.contactEmail,
            req.body.contactPhone,
            req.body.key
        ).then(async (value) => {
            await value.wait();
            console.log("Property added");

            await sql`
            INSERT INTO Property (
                name,
                logo,
                typeOf,
                physicalAddress,
                owner,
                contactEmail,
                contactPhone
            )
            VALUES (
                ${req.body.name},
                ${imagePath},
                ${req.body.typeOf},
                ${req.body.physicalAddress},
                ${req.body.owner},
                ${req.body.contactEmail},
                ${req.body.contactPhone}
            )
            `;

            res.send(result.positive());
        }).catch((reason) => {
            console.log(reason);
            res.send(result.negative(2));
        })
    });
});

// Add room
app.post("/contract/addRoom", uploadImage.single("image"), async (req, res) => {
    // Make sure all requires values are passed
    if (req.body.propertyId === undefined
        || req.body.roomTitle === undefined
        || req.file === undefined
        || req.body.price === undefined
        || req.body.canReserve === undefined
        || req.body.roomOwner === undefined
        || req.body.key === undefined
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
        const imagePath = "http://localhost:3001/" + targetPath;

        contract.addRoom(
            req.body.propertyId,
            req.body.roomTitle,
            imagePath,
            req.body.price,
            req.body.canReserve,
            req.body.roomOwner,
            req.body.key
        ).then(async (value) => {
            await value.wait();
            console.log("Room added");
            const roomId = Number(await contract.getRoomsLength()) - 1;

            await sql`
            INSERT INTO Room (
                property_id,
                title,
                room_id,
                image,
                price,
                owner,
                can_reserve
            )
            VALUES (
                ${req.body.propertyId}
                ${req.body.roomTitle},
                ${roomId},
                ${imagePath},
                ${req.body.price},
                ${req.body.roomOwner},
                ${req.body.canReserve}
            )
            `;

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
        const reservationId = Number(await contract.getReservationsLength()) - 1;
        console.log("Reservation made");

        await sql`
        INSERT INTO reservation (
            reserver,
            reservation_id,
            room_id,
            start_date,
            end_date,
            is_paid,
            was_deleted
        ) VALUES (
            ${req.body.reserver},
            ${reservationId},
            ${req.body.roomId},
            ${req.body.startDate},
            ${req.body.endDate},
            false,
            false
        );
        `;
        // get("http://localhost:3001/crawl_contract");

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
        || req.body.key === undefined
    ) {
        res.send(result.negative());
        return;
    }

    const wallet = web3.getWallet();
    const contract = web3.getContract(wallet);

    contract.deleteReservation(
        req.body.roomId,
        req.body.reservationId,
        req.body.deleter,
        req.body.key
    ).then(async (value) => {
        await value.wait();
        console.log("Reservation deleted");

        await sql`
        UPDATE reservation SET was_deleted = true WHERE reservation_id = ${req.body.reservationId};
        `;

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
        || req.body.key === undefined
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
        req.body.from,
        req.body.key
    ).then(async (value) => {
        await value.wait();
        console.log("Room status updated");
        await sql`
        UPDATE Room SET can_reserve = ${req.body.canReserve} WHERE room_id = ${req.body.roomId}
        `;
        // get("http://localhost:3001/crawl_contract");

        res.send(result.positive());
    }).catch((reason) => {
        console.log(reason);
        res.send(result.negative(2));
    })

});

// Add users 
app.post("/contract/addUser", (req, res) => {
    if (req.body.ownerAddress === undefined
        || req.body.secretKey === undefined
    ) {
        res.send(result.negative());
        return;
    }

    const wallet = web3.getWallet();
    const contract = web3.getContract(wallet);

    contract.setSecretKey(
        req.body.ownerAddress,
        req.body.secretKey
    ).then(async (value) => {
        await value.wait();

        // Key was added succesfully. Update DB
        await sql`
        INSERT INTO AuthKey (
            public_key,
            secret_key
        )
        VALUES (
            ${req.body.ownerAddress},
            ${rrcrypto.encrypt(req.body.secretKey)}
        );
        `;

        res.send(result.positive());
    }).catch((reason) => {
        console.log(reason);
        res.send(result.negative(2));
    });
});

app.get("/contract/makePayment/:id", async (req, res) => {
    const wallet = web3.getWallet();
    const contract = web3.getContract(wallet);

    try {
        const paymentResult = await contract.payments(req.params.id);

        await sql`
        INSERT INTO Payment (
            payer,
            payee,
            date_paid,
            reservation_id
        ) VALUES (
            ${paymentResult[0]},
            ${paymentResult[1]},
            ${paymentResult[2]},
            ${Number(paymentResult[3])}
        )
        `;

        await sql`
        UPDATE reservation SET is_paid = true WHERE reservation_id = ${Number(paymentResult[3])}
        `;

    } catch (e) {
        console.log(e);
        res.send(result.negative(2));
    }

})

app.get("/user/secret/:public", async (req, res) => {
    if (req.query.secret === undefined) {
        res.send("No secret defined.");
        return;
    }

    const query = await sql`
    SELECT * FROM AuthKey WHERE public_key = ${req.params.public};
    `;

    if (query.length === 0) {
        res.send("No user found");
        return;
    }

    // Decrypt
    const dresult = rrcrypto.decrypt(query[0].secret_key, req.query.secret);
    res.send(result.positiveWith(dresult));
});

app.get("/user/private/:public", async (req, res) => {
    if (req.query.secret === undefined) {
        res.send("No secret defined");
        return;
    }

    const query = await sql`
    SELECT * FROM Wallet WHERE public_key = ${req.params.public}
    `;

    // Descrypt
    const d = rrcrypto.decrypt(query[0].private_key, req.query.secret);
    res.send(result.positiveWith(d));
})

app.get("/wallet/balance/:public", async (req, res) => {
    const query = await sql`
    SELECT * FROM Wallet WHERE public_key = ${req.params.public};
    `;

    if (query.length === 0) {
        res.send(result.negative());
        return;
    }
    // WEB3 provider
    const provider = web3.getRPC();
    provider.getBalance(req.params.public).then((value) => {
        res.send(result.positiveWith(value.toString()));
    }).catch((reason) => {
        console.log(reason);
        res.send(result.negative(2));
    });
});

app.get("/wallet/create", async (req, res) => {
    const newWallet = wallet.createWallet();
    // add to DB
    await sql`
    INSERT INTO Wallet (
        public_key,
        private_key
    )
    VALUES (
        ${newWallet.address},
        ${rrcrypto.encrypt(newWallet.privateKey)}
    )
    `;

    res.send(result.positiveWith({ publicKey: newWallet.address, privateKey: newWallet.privateKey }));
});

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

app.get('/db/properties', async (req, res) => {
    try {
        const query = await sql`
        SELECT * FROM property;
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