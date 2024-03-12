export function capitalize<S extends string>(string: S): Capitalize<S> {
    if (!string) return string as Capitalize<S>;

    return (string[0].toUpperCase() +
        string.slice(1).toLowerCase()) as Capitalize<S>;
}

export function repeat(string: string, times: number): string {
    return new Array(times).fill(string).join('');
}
