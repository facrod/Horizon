import bcrypt from "bcrypt";

async function encrypt (password) {
    return await bcrypt.hash(password, Number(process.env.SALT));
}

async function compare (password, hash) {
    return await bcrypt.compare(password, hash);
}

export {
    encrypt,
    compare
}