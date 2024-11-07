import axios from "axios";

export interface ProductInfo {
  id: number;
  Name: string;
  Manufacturer: string;
  Summary: string;
  WarrantyPeriod: string;
  RiderExperience: string;
  Description: string;
  Size: string;
  Style: string;
  StandardCost: string;
  ListPrice: string;
}

// export interface UpdateProductInfo {
//   productID: string;
//   Name: string;
//   Manufacturer: string;
//   Summary: string;
//   WarrantyPeriod: string;
//   RiderExperience: string;
//   Description: string;
//   Size: string;
//   Style: string;
//   StandardCost: string;
//   ListPrice: string;
// }

// export interface CreateProductInfo {
//   Name: string;
//   Manufacturer: string;
//   Summary: string;
//   WarrantyPeriod: string;
//   RiderExperience: string;
//   Description: string;
//   Size: string;
//   Style: string;
//   StandardCost: string;
//   ListPrice: string;
// }

export type CreateProductInfo = Omit<ProductInfo, "id">;

export type UpdateProductInfo = Partial<ProductInfo> & { productID: string };

export interface DeleteProduct {
  productID: String;
}

interface ProductPayload {
  token: string;
}

export class ProductOperation {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/sales`;
  }

  async getSpecialOffer(payload: ProductPayload) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/getproductinformation/`,
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.status === 200
        ? { error: false, data: response.data as ProductInfo[] }
        : { error: true, data: null };
    } catch (err: any) {
      return { error: true, data: null };
    }
  }

  async updateProductInfo(
    payload: ProductPayload,
    updateData: UpdateProductInfo
  ) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/editproductinformation/`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);

      return response.status === 202
        ? { error: false, data: response.data as ProductInfo }
        : { error: true, data: null };
    } catch (err: any) {
      return { error: true, data: null };
    }
  }

  async deleteProductInfo(payload: ProductPayload, updateData: DeleteProduct) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/deleteproduct/`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.status === 202
        ? { error: false, data: response.data as ProductInfo }
        : { error: true, data: null };
    } catch (err: any) {
      return { error: true, data: null };
    }
  }

  async createProductInfo(
    payload: ProductPayload,
    updateData: CreateProductInfo
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

      return response.status === 202
        ? { error: false, data: response.data as ProductInfo }
        : { error: true, data: null };
    } catch (err: any) {
      return { error: true, data: null };
    }
  }
}
