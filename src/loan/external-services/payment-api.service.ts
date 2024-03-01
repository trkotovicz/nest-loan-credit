import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { IPayment } from './interfaces/external-api.interface';

@Injectable()
export class PaymentApiService {
  private _API_URL: string;

  constructor() {
    this._API_URL =
      'https://run.mocky.io/v3/b0720c91-035f-42a7-9f65-248e081b2921';
  }

  async fetchData(): Promise<IPayment> {
    try {
      const response = await axios.get(this._API_URL);

      console.log('payment request', response.data);

      return response.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
