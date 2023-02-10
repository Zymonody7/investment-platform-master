export interface Editable<R, T> {
  create(request: R): Promise<T>;

  edit(id: string, request: R): Promise<T>;
}
