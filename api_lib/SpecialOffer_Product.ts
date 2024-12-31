import axios from "axios";
import { SpecialOfferInfo } from "./SpecialOffer";

interface SpecialOfferProductPayload {
  token: string;
}

export interface GetSpecialOfferProduct {
  productID: number;
}

export interface CreateSpecialOfferProduct {
  specialOfferID: string;
  productID: string;
}

export interface DeleteSpecialOfferProduct {
  specialOfferID: string;
  productID: string;
}

export class SpecialOfferProductrOperation {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/sales`;
  }

  async getSpecialOffer(payload: SpecialOfferProductPayload, getData: GetSpecialOfferProduct) {
    try {
      const response = await axios.post(`${this.baseUrl}/getallspecialofferproduct/`, getData, {
        headers: {
          Authorization: `Bearer ${payload.token}`,
          "Content-Type": "application/json",
        },
      });

      return response.status >= 200 || response.status < 300
        ? { error: false, data: response.data as SpecialOfferInfo[] }
        : { error: true, data: null };
    } catch (err: any) {
      return { error: true, data: null };
    }
  }

  async deleteSpecialOfferInfo(
    payload: SpecialOfferProductPayload,
    updateData: DeleteSpecialOfferProduct
  ) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/deletespecialofferproduct/`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.status >= 200 || response.status < 300
        ? { error: false, data: true }
        : { error: true, data: null };
    } catch (err: any) {
      console.log(err)
      return { error: true, data: null };
    }
  }

  async createSpecialOfferInfo(
    payload: SpecialOfferProductPayload,
    createData: CreateSpecialOfferProduct
  ) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/createspecialofferproduct/`,
        createData,
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.status >= 200 || response.status < 300
        ? { error: false, data: response.data as string[] }
        : { error: true, data: null };
    } catch (err: any) {
      return { error: true, data: null };
    }
  }
}
