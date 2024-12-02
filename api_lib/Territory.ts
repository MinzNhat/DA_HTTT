import axios from "axios";

export interface TerritoryInfo {
  id: number;
  Name: string;
  Group: string;
  SalesYTD: string;
  SalesLastYear: string;
}
interface GetTerritory {
  currentPage: number;
}

interface TerritoryPayload {
  token: string;
}

export class TerritoryOperation {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/sales`;
  }

  async getTerritory(payload: TerritoryPayload, getData: GetTerritory) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/getterritory/`,
        {
          page: getData.currentPage,
        },
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.status === 202
        ? { error: false, data: response.data.data as TerritoryInfo[] }
        : { error: true, data: null };
    } catch (err: any) {
      return { error: true, data: null };
    }
  }
}
