import server from "./server";

/**
 * Makes a reservation by sending a POST request to the server.
 *
 * @param {number} roomId - The ID of the room to reserve.
 * @param {number} startDate - The start date of the reservation.
 * @param {number} endDate - The end date of the reservation.
 * @param {string} reserver - The name of the person making the reservation.
 * @return {Promise<boolean>} Returns a boolean indicating if the reservation was successful.
 */
export default async function makeReservation(
    roomId: number,
    startDate: number,
    endDate: number,
    reserver: string
): Promise<boolean> {
    const body = JSON.stringify({
        roomId,
        startDate,
        endDate,
        reserver
    });

    console.log(body);

    const result = await fetch(server + "contract/makeReservation", {
        method: "POST",
        body,
        headers: {
            "content-type": "application/json",
        }
    });

    const json = await result.json();
    console.log(json);
    return json.result == 0;
}