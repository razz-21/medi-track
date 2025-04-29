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

export function isObject(value: unknown): boolean {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function areArraysEqual(arr1: unknown[], arr2: unknown[]): boolean {
	if (arr1.length !== arr2.length) return false;

	for (let i = 0; i < arr1.length; i++) {
		if (isObject(arr1[i]) && isObject(arr2[i])) {
			if (
				Object.keys(
					objectDifference(arr1[i] as Record<string, unknown>, arr2[i] as Record<string, unknown>)
				).length > 0
			) {
				return false;
			}
		} else if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
			if (!areArraysEqual(arr1[i] as unknown[], arr2[i] as unknown[])) {
				return false;
			}
		} else if (arr1[i] !== arr2[i]) {
			return false;
		}
	}
	return true;
}

export function objectDifference(
	obj1: Record<string, unknown>,
	obj2: Record<string, unknown>
): Record<string, unknown> {
	const result: Record<string, unknown> = {};

	for (const key of Object.keys(obj1)) {
		// Handle nested objects
		if (isObject(obj1[key]) && isObject(obj2[key])) {
			const nestedDiff = objectDifference(
				obj1[key] as Record<string, unknown>,
				obj2[key] as Record<string, unknown>
			);
			if (Object.keys(nestedDiff).length > 0) {
				result[key] = nestedDiff;
			}
		}
		// Handle arrays
		else if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
			if (!areArraysEqual(obj1[key], obj2[key])) {
				result[key] = obj1[key];
			}
		}
		// Handle primitive values
		else if (obj1[key] !== obj2[key]) {
			result[key] = obj1[key];
		}
	}

	return result;
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

export function transformDotNotationObject(data: Record<string, unknown>) {
	const result: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(data)) {
		// Skip if the value is null or undefined
		if (value === null || value === undefined) continue;

		// Split the key by dots
		const parts = key.split('.');
		let current = result;

		// Iterate through all parts except the last one
		for (let i = 0; i < parts.length - 1; i++) {
			const part = parts[i];
			// Create nested object if it doesn't exist
			current[part] = (current[part] as Record<string, unknown>) || {};
			current = current[part] as Record<string, unknown>;
		}

		// Set the value at the last part
		const lastPart = parts[parts.length - 1];
		current[lastPart] = value;
	}

	return result;
}
