import server from "./server";

export default async function addUser(
    ownerAddress: string,
    secretKey: string
):Promise<boolean> {
    const result = await fetch(server + "contract/addUser", {
        method: "POST",
        body: JSON.stringify({
            ownerAddress,
            secretKey
        }),
        headers: {
            "content-type": "application/json",
        },
    });

    return (await result.json()).result == 0;
}