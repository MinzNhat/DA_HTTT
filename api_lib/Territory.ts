import axios from "axios";

export interface TerritoryInfo {
  id: number;
  Name: string;
  Group: string;
  SalesYTD: string;
  SalesLastYear: string;
}

interface TerritoryPayload {
  token: string;
}

export class TerritoryOperation {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/sales`;
  }

  async getTerritory(payload: TerritoryPayload) {
    try {
      const response = await axios.get(`${this.baseUrl}/getallterritory/`, {
        headers: {
          Authorization: `Bearer ${payload.token}`,
          "Content-Type": "application/json",
        },
      });

      return response.status === 200
        ? { error: false, data: response.data as TerritoryInfo }
        : { error: true, data: null };
    } catch (err: any) {
      return { error: true, data: null };
    }
  }
}
