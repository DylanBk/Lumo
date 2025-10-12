import 'server-only';

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload } from '@/lib/definitions';


const secret = process.env.SESSION_SECRET;
const encodedKey: Uint8Array = new TextEncoder().encode(secret);

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('1 hour')
        .sign(encodedKey);
};

export async function decrypt(session: string | undefined = '') {
    try {
        const payload = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256']
        });
        return payload;
    } catch (e) {
        console.log(`Error verifying user session: ${e}`)
    };
};

// ===========
// = COOKIES =
// ===========

export async function createSession(id: string, email: string, username: string, role: string) {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    const session = await encrypt({id, email, username, role, expiresAt});
    const cookieStore = await cookies();

    // log everything
    console.log('userdata', id, email, username, role)
    // console.log(```setting cookie, {
    //     session,
    //     httpOnly: true,
    //     secure: false,
    //     expires: expiresAt,
    //     sameSite: 'lax',
    // }```);

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: false, //TODO!: set to true for production
        expires: expiresAt,
        sameSite: 'lax',
        path: '/'
    });
};

export async function getSession() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) return null;

    try {
        const payload = await decrypt(sessionToken);
        return payload;
    } catch (e) {
        console.error(`Error verifying session: ${e}`);

        return null;
    };
};

export async function updateSession() {
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);

    if (!session || !payload) {
        return null;
    };

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    const cookieStore = await cookies();

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: false, //TODO!: set to true for production
        expires: expiresAt,
        sameSite: 'lax',
        path: '/'
    });
};

export async function deleteSession() {
    const cookieStore = await cookies();

    cookieStore.delete('session');
};