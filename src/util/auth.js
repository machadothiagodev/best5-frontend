import { redirect } from 'react-router-dom';

export function getAuthToken() {
    return localStorage.getItem('authToken');
}

export function setAuthToken(authToken) {
    return localStorage.setItem('authToken', authToken);
}

export function deleteAuthToken() {
    localStorage.removeItem('authToken');
}

export function isLogIn() {
    return getAuthToken() !== null;
}

export function checkUserLogin() {
    return !isLogIn() ? redirect('/login') : null;
}