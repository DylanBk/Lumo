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
        client.release();
    }
};

export async function getPost(id?: string, authorName?: string, content?: string) {
    console.error('/lib/post.ts -> getPost is not a function yet...');
};

export async function getPosts(id: string | null, limit = 20) {
    try {
        const q = await db.query(`
            SELECT
                p.id,
                p.content,
                p.author_id,
                p.author_name,
                p.likes,
                p.reposts,
                /*p.shares,*/
                p.comments,
                p.created_at,
                EXISTS (SELECT 1 FROM likes WHERE post = p.id AND "user" = $1) AS liked,
                EXISTS (SELECT 1 FROM reposts WHERE post = p.id AND "user" = $1) AS reposted,
                /*EXISTS (SELECT 1 FROM shares WHERE post = p.id AND "user" = $1) AS shared,*/
                EXISTS (SELECT 1 FROM comments WHERE post = p.id AND "user" = $1) AS commented
            FROM posts p
            ORDER BY p.created_at DESC
            LIMIT $2;
            `, [id ? parseInt(id) : null, limit]
        );

        return q.rows;
    } catch (e) {
        throw e;
    };
};

export async function updatePost({
    userId,
    postId,
    content = null,
    like = null,
    repost = null,
    share = null,
    comment = null,
}: {
    userId: string;
    postId: string;
    content?: string | null;
    like?: '+' | '-' | null;
    repost?: '+' | '-' | null;
    share?: '+' | '-' | null;
    comment?: '+' | '-' | null;
}) {
    const client = await db.connect();
    const numPostId = parseInt(postId);
    const numUserId = parseInt(userId);

    try {
        await client.query('BEGIN');

        if (content) {
            const q = await client.query(
                'UPDATE posts SET content = $1 WHERE id = $2 RETURNING *',
                [content, numPostId]
            );

            await client.query('COMMIT');
            return q?.rows[0];
        } else if (like) {
            const increment = like === '+' ? 1 : -1;

            console.log(`Updating likes by ${increment} for post ${postId}`);

            const q = await client.query(
                'UPDATE posts SET likes = likes + $1 WHERE id = $2 RETURNING *',
                [increment, numPostId]
            );

            console.log('Rows affected:', q.rowCount);

            if (like === '+') {
                await client.query(
                    'INSERT INTO likes (post, "user") VALUES ($1, $2) ON CONFLICT (post, "user") DO NOTHING',
                    [numPostId, numUserId]
                );
            } else {
                await client.query(
                    'DELETE FROM likes WHERE post = $1 AND "user" = $2',
                    [numPostId, numUserId]
                );
            };

            await client.query('COMMIT');
            return q.rows[0];
        } else if (repost) {
            const increment = repost === '+' ? 1 : -1;

            const q = await client.query(
                `UPDATE posts SET reposts = reposts + $1 WHERE id = $2 RETURNING *`,
                [increment, numPostId]
            );

            if (repost === '+') {
                await client.query(
                    'INSERT INTO reposts (post, "user") VALUES ($1, $2) ON CONFLICT (post, "user") DO NOTHING',
                    [numPostId, numUserId]
                );
            } else {
                await client.query(
                    'DELETE FROM reposts WHERE post = $1 AND "user" = $2',
                    [numPostId, numUserId]
                );
            };

            await client.query('COMMIT');
            return q.rows[0];
        // } else if (share) {
        //     const increment = share === '+' ? 1 : -1;

        //     const q = await client.query('UPDATE posts SET shares = shares + $1 WHERE id = $2 RETURNING *',
        //     [increment, numPostId]
        // );
        // console.log('post shared')

        // if (share === '+') {
        //     await client.query(
        //         'INSERT INTO shares (post, "user") VALUES ($1, $2) ON CONFLICT (post, "user") DO NOTHING',
        //         [numPostId, numUserId]
        //     );
        //     console.log('shared')
        // } else {
        //     await client.query(
        //         'DELETE FROM shares WHERE post = $1 AND "user" = $2',
        //         [numPostId, numUserId]
        //     );
        //     console.log('unshared')
        // }

        // await client.query('COMMIT');
        // return q.rows[0];
        } else if (comment) {
            const op = comment === '+' ? '+' : '-';
            const q = await client.query(
                `UPDATE posts SET comments = comments ${op} 1 WHERE id = $1 RETURNING *`,
                [numPostId]
            );

            await client.query('COMMIT');
            return q?.rows[0];
        } else {
            throw new Error('No valid fields to update');
        };
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    };
};

export async function deletePost(id: string) {
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        const q = await client.query(
            'DELETE FROM posts WHERE id = $1 RETURNING *',
            [id]
        );

        await client.query('COMMIT');
        return q.rows[0];
    } catch (e) {
        throw e;
    } finally {
        client.release();
    };
};