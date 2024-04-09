import server from "./server";

export default async function addRoom(
    name: string, 
    typeOf: string, 
    physicalAddress: string,
    logo: File, 
    owner: string,
    key: string,
    contactEmail: string,
    contactPhone: string
):Promise<boolean> {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("physicalAddress", physicalAddress);
    formData.append("image", logo);
    formData.append("typeOf", typeOf);
    formData.append("owner", owner);
    formData.append("key", key);
    formData.append("contactEmail", contactEmail);
    formData.append("contactPhone", contactPhone);

    const result = await fetch(server + "contract/addProperty", {
        method: "POST",
        body: formData,
    });

    // Check result
    const json = await result.json();
    console.log(json.result);
    return json.result == 0;
}
