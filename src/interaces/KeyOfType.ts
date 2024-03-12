type KeyOfType<T, V> = keyof {
    [P in keyof T as T[P] extends V ? P : never]: T[P];
};

export default KeyOfType;