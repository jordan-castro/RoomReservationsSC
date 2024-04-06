import server from "./server";

export default async function addRoom(
    roomTitle: string, 
    physicalAddress: string, 
    image: File, 
    price: number, 
    canReserve: boolean,
    roomOwner: string,
    key: string
):Promise<boolean> {
    const formData = new FormData();

    formData.append("roomTitle", roomTitle);
    formData.append("physicalAddress", physicalAddress);
    formData.append("image", image);
    formData.append("price", price.toString());
    formData.append("canReserve", canReserve.toString());
    formData.append("roomOwner", roomOwner);
    formData.append("key", key);

    const result = await fetch(server + "contract/addRoom", {
        method: "POST",
        body: formData,
    });

    // Check result
    const json = await result.json();
    console.log(json.result);
    return json.result == 0;
}