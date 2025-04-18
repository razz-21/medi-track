export function isEmptyObject(obj: Record<string, unknown>) {
	return Object.keys(obj).length === 0;
}

export function isEmptyArray(arr: unknown[]) {
	return arr.length === 0;
}

export function isEmptyString(str: string) {
	return str.length === 0;
}

export function isObjectEqual(obj1: Record<string, unknown>, obj2: Record<string, unknown>) {
	return JSON.stringify(obj1) === JSON.stringify(obj2);
}
