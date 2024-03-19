exports.smartQuery = async (sql, table, where) => {
    console.log(`SELECT * FROM ${table} WHERE ${where}`);
    return await sql`SELECT * FROM ${table} WHERE ${where}`;
}

exports.doesExist = async (sql, table, where) => {
    return (await this.smartQuery(sql, table, where)).length > 0;
}