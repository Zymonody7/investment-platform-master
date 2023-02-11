export interface Editable<R, T> {
  create(request: R): Promise<T | ResType>;

  edit(request: R): Promise<T | ResType>;
}

export interface ResType {
  msg: string;
  code: number;
}
