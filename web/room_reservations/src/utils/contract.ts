import Abi from './abi.json';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x426D808652D3B6D958813d5F158e67157995a84e";
const PROVIDER_ADDRESS = "https://rpc.ankr.com/polygon_mumbai/";

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