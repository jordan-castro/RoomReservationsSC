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
- Add users button to authorize accounts
    - Address
    - Return a key
- Change statuts:
    - Address & key
- Delete resercation:
    - Address & key
- Add wallets
    - Public keys
    - Private Kyes
- Show balance

Smart Contract:
- Create keys
- Save keys associated with addresses
- On addRoom:
    - Verify key account
- On Change status:
    - Verify key account
- Delete reservation :
    - Verify key account

Server:
- routes:
    - createWallet
    - verifyTransaction
    - showBalance
- user table:
    - hold wallets
        - public
        - private
- auth keys:
    - public address
    - secret key
