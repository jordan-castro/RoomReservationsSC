# RoomReservations Polygon Smart Contract

A Polygon Solidity smart contract for room reservations.

## Requirements:
- OpenZeppelin

## Features:
- Polygon testnet
- UI
    - Create room
    - Reserve room
    - Pay for room
- room and booking data on smart contract

## Run
To run the application

```bash
cd client

$ npm run build
$ npm run start
```

In other terminal
```bash
cd server

npm install
node index.js
```


UI:
- [x] Add users button to authorize accounts
    - Address
    - Return a key
- [x] Change statuts:
    - [x] Address & key
- [x] Delete resercation:
    - [x] Address & key
- [x] Add Room:
    - [x] Address & key
- [x] Add wallets
    - Public keys
    - Private Kyes
- [x] Show balance

Smart Contract:
- [x] Create keys
- [x] Save keys associated with addresses
- [x] On addRoom:
    - Verify key account
- [x] On Change status:
    - Verify key account
- [x] Delete reservation:
    - Verify key account

Server:
- routes:
    - [x] createWallet
    - [x] verifyTransaction
    - [x] showBalance
    - [x] addUser
    - [x] getKey/{public_address}?secret=
- [x] user table:
    - hold wallets
        - public
        - private [encrypted]
- [x] auth keys:
    - public address
    - secret key [encrypted]