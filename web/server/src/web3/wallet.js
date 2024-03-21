const ethers = require("ethers");
const contract = require("./contract");

exports.getWallet = (privateKey) => {
    return new ethers.Wallet(privateKey, contract.getRPC());
}

exports.createWallet = () => {
    return ethers.Wallet.createRandom(contract.getRPC());
}