import server from "./server";

export default async function showBalance(publicKey: string):Promise<string> {
    const result = await fetch(server + "wallet/balance/" + publicKey, {
        method: "GET",
    });

    const json = await result.json();
    return json.result;
}