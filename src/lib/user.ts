import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import db from '@/config/db';

import { createSession, deleteSession } from '@/lib/session';
import { uploadAvatar, deleteAvatar } from './aws';


export const runtime = 'nodejs';


export async function createUser(email: string, username: string, password: string) {
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        const hashedPw = await bcrypt.hash(password, 10);

        const emailCheck = await client.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        if (emailCheck.rowCount && emailCheck.rowCount > 0) {
            throw new Error('A user with that email address already exists.');
        };

        const usernameCheck = await client.query(
            `SELECT * FROM users WHERE username = $1`,
            [username]
        );

        if (usernameCheck.rowCount && usernameCheck.rowCount > 0) {
            throw new Error('A user with that username already exists.');
        };

        const q = await client.query(
            `INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING ID`,
            [email, username, hashedPw]
        );

        const filePath = path.join(process.cwd(), "public", "user.png");
        const fileBuffer = fs.readFileSync(filePath);
        const mimeType = "image/png";

        const res = await uploadAvatar(q.rows[0].id, fileBuffer, mimeType);

        if (!res) throw new Error('Error uploading default avatar to S3');

        await client.query('COMMIT');

        return q.rows[0];
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    };
};

export async function loginUser(email: string, password: string) {
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        const user = await client.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        if (!user) throw new Error('No user found with that email address.');

        const pwCheck = await bcrypt.compare(password, user.rows[0].password);

        if (!pwCheck) throw new Error('Incorrect password.');

        await createSession(
            String(user.rows[0].id),
            user.rows[0].email,
            user.rows[0].username,
            String(user.rows[0].role),
            `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_DOMAIN}/${user.rows[0].id}.png?t=${Date.now()}`
        );

        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    };
};

export const getUser = async (id: string) => {
    try {
        const q = await db.query(
            `SELECT * FROM users WHERE id = $1`,
            [id]
        );

        if (q.rowCount === 0) throw new Error('No user found with that ID');

        return q.rows[0];
    } catch (e) {
        console.error('getUser error:', e);
        throw e;
    }
};

export const updateUser = async (id: string, attr: string, content: string) => {
    const client = await db.connect();

    try {
        await client.query('BEGIN');
        console.log('data', id, attr, content)

        if (attr === 'avatar') {
            console.log('uploading avatar...');

            // `content` is a base64 data URL (string)
            // Remove the prefix (e.g. "data:image/png;base64,")
            const base64Data = content.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");

            // Try to extract the mime type dynamically (optional)
            const mimeMatch = content.match(/^data:(image\/\w+);base64,/);
            const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

            console.log('bm', buffer, mimeType);

            const res = await uploadAvatar(id, buffer, mimeType);

            if (!res) throw new Error('Error uploading avatar to S3');
            console.log('res', res);

            return;
        } else {
            const q = await client.query(
                `UPDATE users SET ${attr} = $1 WHERE id = $2 RETURNING *`,
                [content, id]
            );

            if (q.rowCount === 0) throw new Error('No user found with that ID');

            await client.query('COMMIT');

            return q.rows[0];
        };
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    };
};

export const deleteUser = async (id: string) => {
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        const q = await client.query(
            `DELETE FROM users WHERE id = $1`,
            [id]
        );
        if (q.rowCount === 0) throw new Error('No user found with that ID');

        const res = await deleteAvatar(id);
        if (!res) throw new Error('Error deleting avatar from S3');

        await deleteSession();
        await client.query('COMMIT');

        return true;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    };
};