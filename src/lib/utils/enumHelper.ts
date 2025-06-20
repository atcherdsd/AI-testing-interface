export function mapStringToEnum<T extends Record<string, string>>(
    enumObject: T,
    value: string,
    fallback: T[keyof T]
): T[keyof T] {
    const enumValues = Object.values(enumObject);
    return enumValues.includes(value as T[keyof T]) ? (value as T[keyof T]) : fallback;
}
