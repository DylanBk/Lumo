import db from "@/config/db";


export async function createPost(id: string, username: string, content: string) {
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        const q = await client.query(
            'INSERT INTO posts (content, author_id, author_name) VALUES ($1, $2, $3)',
            [content, id, username]
            );

        await client.query('COMMIT');

        return q.rows[0];
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        await client.release();
    }
};

export async function getPost(id?: string, authorName?: string, content?: string) {

};

export async function getPosts() {
    try {
        const q = await db.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT 20');

        return q.rows;
    } catch (e) {
        throw e;
    };
};