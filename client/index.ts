import * as _ from 'lodash';
import qs from 'qs';
import axios, { AxiosInstance } from 'axios';
import { ORM } from '../orm';

interface CrudOptions {
  endpoints: Endpoints;
  pk?: string;
  orm?: boolean;
  http?: HttpOptions;
}

interface HttpOptions {
  baseURL?: string;
  headers?: object;
  timeout?: number;
  abort?: boolean;
}

interface Endpoints {
  [EndpointType.meta]?: string;
  [EndpointType.fetch]?: string;
  [EndpointType.create]?: string;
  [EndpointType.update]?: string;
  [EndpointType.delete]?: string;
}

enum EndpointType {
  meta = 'meta',
  fetch = 'fetch',
  create = 'create',
  update = 'update',
  delete = 'delete',
}

interface State {
  loading: boolean;
}

export class CrudClient {
  constructor(options: CrudOptions) {
    this.pk = options.pk || 'id';
    this.endpoints = options.endpoints;
    this.orm = options.orm || true;

    this.http = {
      baseURL: undefined,
      headers: {},
      timeout: undefined,
      abort: true,
      ...(options.http || {}),
    };

    this.axios = axios.create({
      baseURL: this.http.baseURL,
      headers: this.http.headers,
      timeout: this.http.timeout,
    });
  }

  private pk: string;
  private orm: boolean;
  private endpoints: Endpoints;
  private http: HttpOptions;
  private axios: AxiosInstance;
  private abortController: AbortController;

  public state: State = {
    loading: false,
  };

  public async fetch(params?: object) {
    const endpoint = this.getEndpoint(EndpointType.fetch);

    this.setLoading(true);

    if (this.http.abort) {
      if (this.abortController) {
        this.abortController.abort();
      }

      this.abortController = new AbortController();
    }

    try {
      const response = await this.axios.get(endpoint, {
        signal: this.abortController.signal,
        params: params,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
      });

      return this.prepareItems(response?.data?.data?.items || []);
    } catch (e) {
      throw e;
    } finally {
      this.setLoading(false);
    }
  }

  public async create(data: object) {
    const endpoint = this.getEndpoint(EndpointType.create);

    const response = await this.axios.post(endpoint, {
      data,
    });

    return response?.data;
  }

  public async update(pk: string | number, data: object) {
    const endpoint = this.getEndpoint(EndpointType.update, pk);

    const response = await this.axios.post(endpoint, {
      pk,
      data,
    });

    return response?.data;
  }

  public async delete(pk: string | number) {
    const endpoint = this.getEndpoint(EndpointType.delete, pk);

    const response = await this.axios.post(endpoint, {
      pk: pk,
    });

    return response;
  }

  private getEndpoint(endpointType: EndpointType, pk?: string | number): string | undefined {
    let endpoint = this.endpoints[endpointType];

    if (!endpoint) {
      throw new Error(`Endpoint ${EndpointType.fetch} is not found!`);
    }

    if (pk) {
      endpoint = endpoint.split(':pk').join(pk.toString());
    }

    return endpoint;
  }

  private setLoading(state: boolean) {
    this.state.loading = state;
  }

  private prepareItems(items: object[]) {
    if (this.orm) {
      const itemsClone = _.cloneDeep(items);
      const itemsORM = new ORM(itemsClone, this.pk, {
        update: ({ pk, data, level }) => {
          return this.update(pk, data);
        },
        delete: ({ pk, level }) => {
          return this.delete(pk);
        },
      }).getItems();

      return itemsORM;
    }

    return items;
  }
}
