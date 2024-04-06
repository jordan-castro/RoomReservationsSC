import Abi from './abi.json';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x2940C03feD9DC29DE88b3060defB7e3759f9499c";
const PROVIDER_ADDRESS = "https://rpc.ankr.com/polygon_mumbai/";
// const PROVIDER_ADDRESS = "HTTP://127.0.0.1:7545"; // Local


declare const window: any;

/**
 * Create a connection to our Smart Contract.
 * 
 * @rerturns {Contract}
 */
export default function connectToSmartContract(signer: ethers.Signer): ethers.Contract {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, Abi, signer);
    
    window.contract = contract;

    return contract;
}
