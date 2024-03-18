import server from "./server";

export default async function deleteReservation(
    roomId: number,
    reservationId: number,
    deleter: string
): Promise<boolean> {
    const result = await fetch(server + "contract/deleteReservation", {
        method: "POST",
        body: JSON.stringify({
            roomId,
            reservationId,
            deleter
        }),
        headers: {
            "content-type": "application/json",
        }
    });

    const json = await result.json();
    console.log(json);

    return json.result == 0;
}