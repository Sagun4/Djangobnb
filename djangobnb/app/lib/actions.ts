'use server';

import { cookies } from 'next/headers';

export async function handleRefresh() {
    console.log('handleRefresh');

    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
        return null;
    }

    const cookieStore = await cookies();

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/token/refresh/`, {
            method: 'POST',
            body: JSON.stringify({
                refresh: refreshToken
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const json = await response.json();
        console.log('Response - Refresh:', json);

        if (json.access) {
            try {
                cookieStore.set('session_access_token', json.access, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60, // 60 minutes
                    path: '/'
                });
            } catch (cookieError) {
                console.log('Could not set session_access_token cookie during render:', cookieError);
            }

            return json.access;
        } else {
            await resetAuthCookies();
            return null;
        }
    } catch (error) {
        console.log('error', error);
        await resetAuthCookies();
        return null;
    }
}
export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
    const cookieStore = await cookies();

    cookieStore.set('session_userid', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/'
    });

    cookieStore.set('session_access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60, // 60 minutes
        path: '/'
    });

    cookieStore.set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/'
    });
}

export async function resetAuthCookies() {
    try {
        let cookieStore = await cookies();

        cookieStore.set('session_userid', '');
        cookieStore.set('session_access_token', '');
        cookieStore.set('session_refresh_token', '');
    } catch (cookieError) {
        console.log('Could not reset auth cookies during render:', cookieError);
    }
}

//
// Get data

export async function getUserId() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('session_userid')?.value;
    return userId ? userId : null;
}

export async function getAccessToken() {
    let cookieStore = await cookies();
    let accessToken = cookieStore.get('session_access_token')?.value;
    
    if (accessToken) {
        try {
            const parts = accessToken.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
                const exp = payload.exp;
                const now = Math.floor(Date.now() / 1000);
                // If token expires in less than 10 seconds, force a refresh
                if (exp && exp - now < 10) {
                    console.log('Access token is expired or close to expiring, refreshing...');
                    accessToken = undefined;
                }
            } else {
                accessToken = undefined;
            }
        } catch (e) {
            console.error('Error decoding access token:', e);
            accessToken = undefined;
        }
    }

    if (!accessToken) {
        accessToken = await handleRefresh();
    }
    return accessToken;
}

export async function getRefreshToken() {
    let cookieStore = await cookies();
    let refreshToken = cookieStore.get('session_refresh_token')?.value;
    return refreshToken;
}
