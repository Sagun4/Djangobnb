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
            cookieStore.set('session_access_token', json.access, {
                httpOnly: true,
                secure:false, // Set to false to allow client-side access
                maxAge: 60 * 60, // 60 minutes
                path: '/'
            });

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
        secure: false, // Set to false to allow client-side access
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/'
    });

    cookieStore.set('session_access_token', accessToken, {
        httpOnly: true,
        secure: false, // Set to false to allow client-side access
        maxAge: 60 * 60, // 60 minutes
        path: '/'
    });

    cookieStore.set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: false, // Set to false to allow client-side access
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/'
    });
}

export async function resetAuthCookies() {
    let cookieStore = await cookies();

    cookieStore.set('session_userid', '');
    cookieStore.set('session_access_token', '');
    cookieStore.set('session_refresh_token', '');
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
