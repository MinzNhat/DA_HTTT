'use client';
import { createContext, ReactNode, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import RenderCase from '@/components/rendercase';
import NotiPopup from '@/components/notification';
import { useIntl } from 'react-intl';

interface UserAuthContextInterface {
    accessToken: string | null;
    loading: boolean;
    login: (email: string, password: string, remember: boolean) => Promise<boolean>;
    logout: () => void;
    register: (name: string, email: string, password: string, re_password: string) => Promise<boolean>;
    active: (uid: string, token: string) => Promise<boolean>;
    forgot: (email: string) => Promise<boolean>;
    confirmForgot: (uid: string, token: string, password: string) => Promise<boolean>;
}

interface UserLogin {
    email: string,
    password: string,
}

interface UserRegister {
    name: string,
    email: string,
    password: string,
    re_password: string,
}

interface UserActive {
    uid: string,
    token: string,
}

interface UserForgotPassword {
    email: string
}

interface UserConfirmForgotPassword {
    uid: string,
    token: string,
    new_password: string
}

export const UserAuthContext = createContext({} as UserAuthContextInterface);

type Props = {
    children: ReactNode;
};

export const UserAuthProvider = ({ children }: Props) => {
    const router = useRouter();
    const intl = useIntl();
    const [message, setMessage] = useState<string>("")
    const [openNotification, setOpenNotification] = useState<boolean>(false)
    const [accessToken, setAccessToken] = useState<string | null>(typeof window !== "undefined" ? localStorage?.getItem('accessToken') : null);
    const [refreshToken, setRefreshToken] = useState<string | null>(typeof window !== "undefined" ? localStorage?.getItem('refreshToken') : null);
    const [sessionExpireTime, setSessionExpireTime] = useState<number | null>(typeof window !== "undefined" ? Number(localStorage?.getItem('sessionExpireTime')) : null);
    const [loading, setLoading] = useState<boolean>(false);

    const login = async (email: string, password: string, remember: boolean) => {
        setLoading(true);
        let error = true;

        try {
            const body: UserLogin = {
                email: email,
                password: password,
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/auth/jwt/create`,
                body,
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status >= 200 || response.status < 300) {
                setAccessToken(response.data.access);
                setRefreshToken(response.data.refresh);
                localStorage.setItem('accessToken', response.data.access);
                localStorage.setItem('refreshToken', response.data.refresh);

                if (!remember) {
                    const expireTime = Date.now() + Number(process.env.NEXT_PUBLIC_SESSION_TIME);
                    setSessionExpireTime(expireTime);
                    localStorage.setItem('sessionExpireTime', expireTime.toString());
                }
                error = false
            } else {
                error = true
            }
        } catch (err: any) {
            error = true
        }

        setLoading(false);

        return error
    };

    const logout = () => {
        setOpenNotification(false)
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('sessionExpireTime');
        setAccessToken(null);
        setRefreshToken(null);
        setSessionExpireTime(null);
        router.push('/');
    };

    const register = async (name: string, email: string, password: string, re_password: string) => {
        setLoading(true);
        let error = true;

        try {
            const body: UserRegister = {
                name: name,
                email: email,
                password: password,
                re_password: re_password
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/auth/users/`,
                body,
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status >= 200 || response.status < 300) {
                error = false
            } else {
                error = true
            }
        } catch (err: any) {
            error = true
        }

        setLoading(false);

        return error
    };

    const active = async (uid: string, token: string) => {
        setLoading(true);
        let error = true;

        try {
            const body: UserActive = {
                uid: uid,
                token: token
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/auth/users/activation/`,
                body,
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status >= 200 || response.status < 300) {
                error = false
            } else {
                error = true
            }
        } catch (err: any) {
            error = true
        }

        setLoading(false);

        return error
    };

    const forgot = async (email: string) => {
        setLoading(true);
        let error = true;

        try {
            const body: UserForgotPassword = {
                email: email
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/auth/users/reset_password/`,
                body,
                { headers: { 'Content-Type': 'application/json' } }
            );

            console.log(response)

            if (response.status >= 200 || response.status < 300) {
                error = false
            } else {
                error = true
            }
        } catch (err: any) {
            error = true
        }

        setLoading(false);

        return error
    };

    const confirmForgot = async (uid: string, token: string, password: string) => {
        setLoading(true);
        let error = true;

        try {
            const body: UserConfirmForgotPassword = {
                uid: uid,
                token: token,
                new_password: password
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/auth/users/reset_password_confirm/`,
                body,
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status >= 200 || response.status < 300) {
                error = false
            } else {
                error = true
            }
        } catch (err: any) {
            error = true
        }

        setLoading(false);

        return error
    };

    useEffect(() => {
        if (sessionExpireTime && Date.now() >= sessionExpireTime) {
            setMessage(intl.formatMessage({ id: "Auth.message" }))
            setOpenNotification(true)
        }
    }, [sessionExpireTime]);

    const contextData = {
        accessToken,
        loading,
        login,
        logout,
        register,
        active,
        forgot,
        confirmForgot
    };

    return (
        <UserAuthContext.Provider value={contextData}>
            <RenderCase renderIf={openNotification}>
                <NotiPopup message={message} onClose={logout} />
            </RenderCase>
            {children}
        </UserAuthContext.Provider>
    );
};

export const useUserAuthContext = () => useContext(UserAuthContext);
