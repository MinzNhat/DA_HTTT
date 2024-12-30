import axios from "axios";

interface SpecialOfferProductPayload {
  token: string;
}

export interface GetSpecialOfferProduct {
  productID: string;
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
      const response = await axios.post(`${this.baseUrl}/getallspecialoffer/`, getData, {
        headers: {
          Authorization: `Bearer ${payload.token}`,
          "Content-Type": "application/json",
        },
      });

      return response.status >= 200 || response.status < 300
        ? { error: false, data: response.data as string[] }
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
        ? { error: false, data: true }
        : { error: true, data: null };
    } catch (err: any) {
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
