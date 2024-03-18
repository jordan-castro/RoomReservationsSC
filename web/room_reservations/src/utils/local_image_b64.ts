// This is to upload a image without needing a form.
export default async function localImageB64(image: File):Promise<string> {
//     # const preview = URL.createObjectURL(im.files[0]);
//     # const arraybuffer = await (await fetch(preview)).arrayBuffer();
//     # function _arrayBufferToBase64( buffer ) {
//     # var binary = '';
//     # var bytes = new Uint8Array( buffer );
//     # var len = bytes.byteLength;
//     # for (var i = 0; i < len; i++) {
//     #     binary += String.fromCharCode( bytes[ i ] );
//     # }
//     # return window.btoa( binary );
// # }
// # const b64 = _arrayBufferToBase64(arrayBuffer)
    const preview = URL.createObjectURL(image);
    const arrayBuffer = await (await fetch(preview)).arrayBuffer();
    let binary = '';
    let bytes = new Uint8Array(arrayBuffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    
    return window.btoa(binary);
}