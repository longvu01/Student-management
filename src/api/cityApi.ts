import { City } from 'models';
import { ListResponse } from './../models/common';
import axiosClient from './axiosClient';

const cityApi = {
  getAll(): Promise<ListResponse<City>> {
    const url = '/cities';
    return axiosClient.get(url, {
      params: {
        _page: 1,
        _limit: 100,
      },
    });
  },
};

export default cityApi;
