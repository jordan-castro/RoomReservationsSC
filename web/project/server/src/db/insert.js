exports.smartInsert = async (sql, table, values) => {
    let columns = [];
    let vals = [];
    for (let key of Object.keys(values)) {
        columns.push(key); 
        vals.push(values[key]);
    }
    
    await sql`
        INSERT INTO ${table} (
            ${columns.join(",")}
        )
        VALUES (
            ${vals.join(", ")}
        );
    `;
}