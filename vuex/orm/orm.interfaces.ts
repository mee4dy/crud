export interface Actions {
  commit?: Function;
  update?: Function;
  delete?: Function;
}

export interface Level {
  parentPK: string | number;
  path: string;
}
