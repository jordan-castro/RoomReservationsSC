import Abi from './abi.json';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0xF386ebf823848acA847343E65a3C1D6AB2BB1C0c";
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