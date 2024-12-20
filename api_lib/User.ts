import axios from "axios";
import { UserInfo } from "@/providers/PassedData";

interface CustomerStore {
  id: number;
  Name: string;
  BusinessType: string;
  Specialty: string;
  AnnualSales: string;
  AnnualRevenue: string;
  YearOpened: number;
  SquareFeet: number;
  NumberOfEmployees: number;
  City: string;
  AddressLine1: string;
  AddressLine2: string | null;
  CountryRegionName: string;
}

interface CustomerIndividual {
  id: number;
  FirstName: string;
  LastName: string;
  MiddleName: string;
  Title: string;
  EmailAddress: string;
  PhoneNumber: string;
  City: string;
  AddressLine1: string;
  AddressLine2: string;
  CountryRegionName: string;
}

export interface CustomerInfo {
  id: number;
  Employee: number | null;
  Territory: number;
  CustomerStore: CustomerStore | null;
  CustomerIndividual: CustomerIndividual | null;
}

interface GetAllCustomer {
  currentPage: number;
}

interface CustomerOpPayload {
  token: string;
}
interface UserOpPayload {
  token: string;
}

export interface UpdateUserInfo {
  name: string;
  JobTitle: string;
  PhoneNumber: string;
  City: string;
  AddressLine2: string;
  AddressLine1: string;
  CountryRegionName: string;
}

export class UserOperation {
  private baseUrl: string;
  private baseURL: string;

  constructor() {
    this.baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/account`;
    this.baseURL = `${process.env.NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/sales`;
  }

  async getUserInfo(payload: UserOpPayload) {
    try {
      const response = await axios.get(`${this.baseUrl}/getemployeeinfo/`, {
        headers: {
          Authorization: `Bearer ${payload.token}`,
          "Content-Type": "application/json",
        },
      });

      return response.status >= 200 || response.status < 300
        ? { error: false, data: response.data as UserInfo }
        : { error: true, data: null };
    } catch (err: any) {
      return { error: true, data: null };
    }
  }

  async getAllUserInfo(payload: CustomerOpPayload, getData: GetAllCustomer) {
    try {
      const response = await axios.post(
        `${this.baseURL}/getcustomer/`,
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
      console.log(response);

      return response.status >= 200 || response.status < 300
        ? { error: false, data: response.data.data as CustomerInfo[] }
        : { error: true, data: null };
    } catch (err: any) {
      return { error: true, data: null };
    }
  }

  async updateUserInfo(payload: UserOpPayload, updateData: UpdateUserInfo) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/editemployeeinfo/`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.status >= 200 || response.status < 300
        ? { error: false, data: response.data.data as UserInfo }
        : { error: true, data: null };
    } catch (err: any) {
      return { error: true, data: null };
    }
  }
}
