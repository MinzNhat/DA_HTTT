'use client';

import { useUserAuthContext } from '@/providers/AuthProvider';
import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingUI from '@/components/loading';

interface Props {
    params: {
        uid: string;
        token: string;
    };
}

const ActivatePage: FC<Props> = ({ params }) => {
    const { uid, token } = params;
    const { active, loading } = useUserAuthContext();
    const router = useRouter();
    const [message, setMessage] = useState<string>("Đang kích hoạt tài khoản...");
    const [countdown, setCountdown] = useState<number>(5);
    const [hasActivated, setHasActivated] = useState<boolean>(false);

    useEffect(() => {
        const activateAccount = async () => {
            if (!hasActivated && uid && token) {
                const success = await active(uid, token);
                if (success) {
                    setMessage("Tài khoản đã được kích hoạt thành công! Chuyển hướng về trang chủ sau 5 giây.");
                } else {
                    setMessage("Kích hoạt thất bại. Vui lòng kiểm tra lại thông tin.");
                }
                setHasActivated(true);
            }
        };
        activateAccount();
    }, [uid, token, active, hasActivated]);

    useEffect(() => {
        if (message.includes("thành công")) {
            const interval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            const timeout = setTimeout(() => {
                router.push('/');
            }, 5000);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [message, router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-2">
            <p>{message}</p>
            {message.includes("thành công") && (
                <p>Chuyển hướng sau: {countdown}s</p>
            )}
            {loading && <LoadingUI />}
        </div>
    );
};

export default ActivatePage;
