import axios from "axios";

export interface SpecialOfferInfo {
  id: number;
  Description: string;
  Type: string;
  StartDate: string;
  EndDate: string;
  MinQty: number;
  MaxQty: number;
  DiscountPct: string;
}

export interface UpdateSpecialOffer {
  specialOfferID: String;
  Description: string;
  Type: string;
  StartDate: string;
  EndDate: string;
  MinQty: number;
  MaxQty: number;
  DiscountPct: string;
}

export interface CreateSpecialOffer {
  Description: string;
  DiscountPct: string;
  Type: string;
  StartDate: string;
  EndDate: string;
  MinQty: number;
  MaxQty: number;
}

export interface DeleteSpecialOffer {
  specialOfferID: String;
}

interface GetSpecialOffer {
  currentPage: number;
}

interface SpecialOfferPayload {
  token: string;
}

export class SpecialOfferOperation {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/sales`;
  }

  async getSpecialOffer(
    payload: SpecialOfferPayload,
    getData: GetSpecialOffer
  ) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/getspecialoffer/`,
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

      return response.status >= 200 || response.status < 300
        ? { error: false, data: response.data.data as SpecialOfferInfo[] }
        : { error: true, data: null };
    } catch (err: any) {
      return { error: true, data: null };
    }
  }

  async updateSpecialOfferInfo(
    payload: SpecialOfferPayload,
    updateData: UpdateSpecialOffer
  ) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/editspecialoffer/`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.status >= 200 || response.status < 300
        ? { error: false, data: response.data as SpecialOfferInfo }
        : { error: true, data: null };
    } catch (err: any) {
      return { error: true, data: null };
    }
  }

  async deleteSpecialOfferInfo(
    payload: SpecialOfferPayload,
    updateData: DeleteSpecialOffer
  ) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/deletespecialoffer/`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.status >= 200 || response.status < 300
        ? { error: false, data: response.data as SpecialOfferInfo }
        : { error: true, data: null };
    } catch (err: any) {
      return { error: true, data: null };
    }
  }

  async createSpecialOfferInfo(
    payload: SpecialOfferPayload,
    updateData: CreateSpecialOffer
  ) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/createspecialoffer/`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.status >= 200 || response.status < 300
        ? { error: false, data: response.data as SpecialOfferInfo }
        : { error: true, data: null };
    } catch (err: any) {
      return { error: true, data: null };
    }
  }
}
