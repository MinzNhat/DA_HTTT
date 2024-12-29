import axios from "axios";

export interface Element {
    type: string;
    query: string;
    content: string | [];
}

interface AnalysisPayload {
    token: string;
    prompt: string;
}

export class AnalysisOperation {
    private baseUrl: string;

    constructor() {
        this.baseUrl = `${process.env
            .NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/analysis`;
    }

    async getReport(payload: AnalysisPayload) {
        try {
            const response = await axios.post(`${this.baseUrl}/prompt/`,
                {
                    prompt: payload.prompt,
                }, {
                headers: {
                    Authorization: `Bearer ${payload.token}`,
                    "Content-Type": "application/json",
                },
            });

            return response.status >= 200 || response.status < 300
                ? { error: false, data: response.data.list as Element[] }
                : { error: true, data: null };
        } catch (err: any) {
            console.log(err);
            return { error: true, data: null };
        }
    }
}
