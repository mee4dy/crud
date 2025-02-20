export interface FindParams {
  attributes?: {
    include?: any;
    exclude?: any;
  };
  include?: any;
  scope?: string | string[];
  limit?: number;
  offset?: number;
  where?: any;
  order?: any;
  group?: any;
}
