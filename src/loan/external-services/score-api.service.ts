import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { IScore } from './interfaces/external-api.interface';

@Injectable()
export class ScoreApiService {
  private _API_URL: string;

  constructor() {
    this._API_URL =
      'https://run.mocky.io/v3/bd4b499c-15ff-4f8c-af98-1a0ce2c9d9a2';
  }

  async fetchData(): Promise<IScore> {
    try {
      const response = await axios.get(this._API_URL);

      console.log('score request', response.data);

      return response.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
