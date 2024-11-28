import axios from "axios";

export interface OverviewProgression {
  time: string;
  revenue: number;
  profit: number;
  cost: number;
}

export interface OverviewStats {
  revenue: number;
  profit: number;
  cost: number;
}

export interface TopProduct {
  id: number;
  name: string;
  revenue: number;
}

export interface TopTerritory {
  territory_id: number;
  territory_name: string;
  revenue: number;
  cost: number;
  profit: number;
}

interface DashboardPayload {
  token: string;
}

export class DashboardOperation {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${process.env
      .NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/dashboard`;
  }

  async getOverviewProgression(payload: DashboardPayload) {
    try {
      const response = await axios.get(`${this.baseUrl}/overviewprogression/`, {
        headers: {
          Authorization: `Bearer ${payload.token}`,
          "Content-Type": "application/json",
        },
      });

      return response.status === 200
        ? { error: false, data: response.data as OverviewProgression[] }
        : { error: true, data: null };
    } catch (err: any) {
      console.log(err);
      return { error: true, data: null };
    }
  }

  async getOverviewStats(payload: DashboardPayload) {
    try {
      const response = await axios.get(`${this.baseUrl}/overviewstats/`, {
        headers: {
          Authorization: `Bearer ${payload.token}`,
          "Content-Type": "application/json",
        },
      });

      return response.status === 200
        ? { error: false, data: response.data as OverviewStats }
        : { error: true, data: null };
    } catch (err: any) {
      console.log(err);
      return { error: true, data: null };
    }
  }

  async getTopProducts(payload: DashboardPayload) {
    try {
      const response = await axios.get(`${this.baseUrl}/topproducts/`, {
        headers: {
          Authorization: `Bearer ${payload.token}`,
          "Content-Type": "application/json",
        },
      });

      return response.status === 200
        ? { error: false, data: response.data as TopProduct[] }
        : { error: true, data: null };
    } catch (err: any) {
      console.log(err);
      return { error: true, data: null };
    }
  }

  async getTopTerritory(payload: DashboardPayload) {
    try {
      const response = await axios.get(`${this.baseUrl}/topterritory/`, {
        headers: {
          Authorization: `Bearer ${payload.token}`,
          "Content-Type": "application/json",
        },
      });

      return response.status === 200
        ? { error: false, data: response.data as TopTerritory[] }
        : { error: true, data: null };
    } catch (err: any) {
      console.log(err);
      return { error: true, data: null };
    }
  }
}
