// Import everything
import { ethers } from "ethers";

/**
 * Chequea si un wallet esta connectado.
 * 
 * @returns {boolean}
 */
export function isConnected() : boolean {
    const connected = sessionStorage.getItem("connected");
    return connected === "true";
}  
  
export function stopConnecting() {
    sessionStorage.setItem("connected", "false");
}
  
export function needToConnect() {
    sessionStorage.setItem("connected", "true");
}
  
declare const window: any;
  
/**
 * Connecta a la wallet de metamask.
 * 
 * @returns {Web3 | boolean}
 */
export async function connectWallet(): Promise<ethers.BrowserProvider | undefined> {
    let provider;
    // let signer;
    if (window.ethereum == null) {
        console.log("Metmask is not installed, using read only defaults.");
        return undefined;
        // provider = ethers.getDefaultProvider();
    } else {
        // Connect to the MetaMask EIP-1193 object. This is a standard
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.
        provider = new ethers.BrowserProvider(window.ethereum)
        
        return provider;
        // // It also provides an opportunity to request access to write
        // // operations, which will be performed by the private key
        // // that MetaMask manages for the user.
        // signer = await provider.getSigner();
    }
}

/**
 * Intenta a connectar a un walleto. Usa esto cuando 
 * se necesita una wallet pero no queries preguntar por accesso.
 * 
 * @returns `Promise<string | boolean>`
 */
export const grabWallet = async () => {
    if (isConnected()) {
        return await connectWallet();
    } else {
        return false;
    }
}