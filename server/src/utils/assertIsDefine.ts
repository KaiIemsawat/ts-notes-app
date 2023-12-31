// allows any type -> check if not null -> get none null back

export function assertIsDefine<T>(val: T): asserts val is NonNullable<T> {
    if (!val) {
        throw Error("Expected 'val' to be defined, but recieved " + val);
    }
}
