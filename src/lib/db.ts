'server-only';
import pg from 'pg';

// prevent ts error
const dbGlobal = global as unknown as {db: pg.Pool};

// const db = new pg.Pool({
//     connectionString: process.env.NEXT_SUPABASE_URI,
//     ssl: { rejectUnauthorized: false }
// });

// re-use existing pool if exists
export const db =
    dbGlobal.db ??
    new pg.Pool({
        connectionString: process.env.SUPABASE_URI,
        ssl: { rejectUnauthorized: false },
});

// store globally so hot-reload uses it
// this stops connection spam form Next.js hot-reload
if (process.env.NODE_ENV !== 'production') {
    dbGlobal.db = db;
};

export default db;