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

export function debounce<T extends (...args: T[]) => void>(
	callback: T,
	wait = 300
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	return (...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			callback(...args);
		}, wait);
	};
}
