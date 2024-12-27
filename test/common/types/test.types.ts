export type ClassMock<T> = {
  [P in keyof T]: T[P];
};

export type ClassMockWithout<T, K = object> = Omit<T, keyof K>;
