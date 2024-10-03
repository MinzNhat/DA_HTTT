import axios from 'axios';
import { UserInfo } from '@/providers/PassedData';

interface UserOpPayload {
    token: string
}

export interface UpdateUserInfo {
    name: string,
    JobTitle: string,
    PhoneNumber: string,
    City: string,
    AddressLine2: string,
    AddressLine1: string,
    CountryRegionName: string
}

export class UserOperation {
    private baseUrl: string;

    constructor() {
        this.baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/account`;
    }

    async getUserInfo(payload: UserOpPayload) {
        try {
            const response = await axios.get(`${this.baseUrl}/getemployeeinfo/`,
                {
                    headers: {
                        'Authorization': `Bearer ${payload.token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            return response.status === 200 ? { error: false, data: response.data as UserInfo } : { error: true, data: null }
        } catch (err: any) {
            return { error: true, data: null }
        }
    }

    async updateUserInfo(payload: UserOpPayload, updateData: UpdateUserInfo) {
        try {
            const response = await axios.post(`${this.baseUrl}/editemployeeinfo/`,
                updateData,
                {
                    headers: {
                        'Authorization': `Bearer ${payload.token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            return response.status === 202 ? { error: false, data: response.data as UserInfo } : { error: true, data: null }
        } catch (err: any) {
            return { error: true, data: null }
        }
    }
}