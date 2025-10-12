import bcrypt from 'bcrypt';
import db from '@/lib/db';

import { createSession } from '@/lib/session';


export async function createUser(email: string, username: string, password: string) {
    try {
        const hashedPw = await bcrypt.hash(password, 10);

        const emailCheck = await db.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        if (emailCheck.rowCount && emailCheck.rowCount > 0) {
            throw new Error('A user with that email address already exists.');
        };

        const usernameCheck = await db.query(
            `SELECT * FROM users WHERE username = $1`,
            [username]
        );

        if (usernameCheck.rowCount && usernameCheck.rowCount > 0) {
            throw new Error('A user with that username already exists.');
        };

        const q = await db.query(
            `INSERT INTO users (email, username, password) VALUES ($1, $2, $3)`,
            [email, username, hashedPw]
        );

        return q.rows[0];
    } catch (e) {
        throw e;
    };
};

export async function loginUser(email: string, password: string) {
    try {
        const user = await db.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        if (!user) throw new Error('No user found with that email address.');


        const pwCheck = await bcrypt.compare(password, user.rows[0].password);

        console.log('pwcheck', pwCheck)

        if (pwCheck) {
            await createSession(
                user.rows[0].id,
                user.rows[0].email,
                user.rows[0].username,
                user.rows[0].role
            );
        } else {
            throw new Error('Incorrect password.');
        };
    } catch (e) {
        throw e;
    };
};