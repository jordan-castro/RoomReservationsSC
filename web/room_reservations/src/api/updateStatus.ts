import server from "./server";

export default async function updateStatus(
    roomId: number,
    canReserve: boolean,
    from: string
) {
    const result = await fetch(server + "contract/updateStatus", {
        method: "POST",
        body: JSON.stringify({
            roomId,
            canReserve,
            from
        }),
        headers: {
            "content-type": "application/json"
        }
    });

    const json = await result.json();
    console.log(json);

    return json.result == 0;
}