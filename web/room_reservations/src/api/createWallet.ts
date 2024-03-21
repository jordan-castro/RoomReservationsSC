import server from "./server";

/**
 * A Wallet type for interfacing with the server response.
 */
type RRWallet = {
    public: string;
    private: string;
};

export default async function createWallet():Promise<RRWallet | null> {
    const result = await fetch(server + "wallet/create", {
        method: "GET",
    });

    const json = await result.json();

    if (json.result === 1) {
        return null;
    }

    // We have a wallet
    return {
        public: json.result.publicKey,
        private: json.result.privateKey
    };
}