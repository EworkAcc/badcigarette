import crypto from 'crypto';

export function hashPassword(password: string, salt: string) {
    return new Promise((resolve, reject) => {
        crypto.scrypt(password.normalize(), salt, 64, (err, hash) => {
            if (err) reject (err)
            resolve(hash.toString('hex').normalize());
        })
    })
}

export function generateSalt() {
    return crypto.randomBytes(16).toString('hex').normalize();
}

{/**const salt = generateSalt();
const hashedPassword = hashPassword(data.password, salt);

const [user] = await db
    .insert(UserTable)
    .values({
        username: data.name,
        email: data.email,
        password: hashedPassword,
        salt: salt
    })
    .returning({id: UserTable.id, role: UserTable.role});
    if (user = null) return "Unable to create account";
} catch { 
    return "Error creating user";
}
**/}