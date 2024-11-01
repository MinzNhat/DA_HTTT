import axios from "axios";

export interface SalesOrderDetail {
  productID: string;
  OrderQty: string;
}

export interface SalesOrderInfo {
  id: number;
  SalesOrderDetail: SalesOrderDetail[];
  OrderDate: string;
  DueDate: string;
  ShipDate: string;
  ShipMethod: string;
  Comment: string;
  SubTotal: string;
  TaxAmt: string;
  Freight: string;
  TotalDue: string;
  Employee: number;
  Customer: number;
  Territory: number;
}

export interface UpdateSalesOrderInfo {
  id: string;
  SalesOrderDetail: SalesOrderDetail[];
  OrderDate: string;
  DueDate: string;
  ShipDate: string;
  ShipMethod: string;
  Comment: string;
  SubTotal: string;
  TaxAmt: string;
  Freight: string;
  TotalDue: string;
  Employee: number;
  Customer: number;
  Territory: number;
}

export interface DeleteSalesOrderInfo {
  salesOrderHeaderID: String;
}

export interface CreateSalesOrderInfo {
  SalesOrderDetail: SalesOrderDetail[];
  OrderDate: string;
  DueDate: string;
  ShipDate: string;
  ShipMethod: string;
  Comment: string;
  SubTotal: string;
  TaxAmt: string;
  Freight: string;
  TotalDue: string;
  Employee: number;
  Customer: number;
  Territory: number;
}

interface SalesOrderPayload {
  token: string;
}

export class SalesOrderOperation {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/sales`;
  }

  async getSpecialOffer(payload: SalesOrderPayload) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/getsalesorderinformation/`,
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.status === 200
        ? { error: false, data: response.data as SalesOrderInfo }
        : { error: true, data: null };
    } catch (err: any) {
      return { error: true, data: null };
    }
  }

  async updateSpecialOfferInfo(
    payload: SalesOrderPayload,
    updateData: UpdateSalesOrderInfo
  ) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/editsalesorder/`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.status === 202
        ? { error: false, data: response.data as SalesOrderInfo }
        : { error: true, data: null };
    } catch (err: any) {
      return { error: true, data: null };
    }
  }

  async deleteSalesOrderInfo(
    payload: SalesOrderPayload,
    updateData: DeleteSalesOrderInfo
  ) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/deletesalesorder/`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.status === 202
        ? { error: false, data: response.data as SalesOrderInfo }
        : { error: true, data: null };
    } catch (err: any) {
      return { error: true, data: null };
    }
  }

  async createSalesOrderInfo(
    payload: SalesOrderPayload,
    updateData: CreateSalesOrderInfo
  ) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/createsalesorder/`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.status === 202
        ? { error: false, data: response.data as SalesOrderInfo }
        : { error: true, data: null };
    } catch (err: any) {
      return { error: true, data: null };
    }
  }
}
