// Make a random sequence of characters
exports.makeHash = (count) => {
    const CHARACTERS = "abcdefghijklmnopqrstuvwxyz1234567890";
    let hash = "";
    for (let i = 0; i < count; i++) {
        hash += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    }

    return hash;
}
