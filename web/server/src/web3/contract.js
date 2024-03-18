const ethers = require("ethers");
const ABI = require("./abi.json");

const PUBLIC_KEY = "0x5fE36840E5c4E56a6ffc9a88151e8304AeC0fdfF";
const PRIVATE_KEY = "c10a4e2680bf378e3555af593bee5dd7ac9e0ffad0fb8e6bbea322cdcd241c41";
const RPC_URL = "https://rpc.ankr.com/polygon_mumbai";
const CONTRACT_ADDRESS = "0x426D808652D3B6D958813d5F158e67157995a84e";

exports.getContract = (wallet) => {
    return new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
};
exports.getWallet = () => {
    return new ethers.Wallet(PRIVATE_KEY, this.getRPC());
};
exports.getRPC = () => {
    return new ethers.JsonRpcProvider(RPC_URL);
};

exports.PUBLIC_KEY = PUBLIC_KEY;