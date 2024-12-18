export type ClassMock<T> = {
  [P in keyof T]: T[P];
};
