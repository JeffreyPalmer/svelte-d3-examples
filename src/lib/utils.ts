import type { FeltonData } from '$lib/types';

export function poissonDiscSampler(
	width: number,
	height: number,
	radius: number
): () => [number, number] | undefined {
	const k = 30, // maximum number of samples before rejection
		radius2 = radius * radius,
		R = 3 * radius2,
		cellSize = radius * Math.SQRT1_2,
		gridWidth = Math.ceil(width / cellSize),
		gridHeight = Math.ceil(height / cellSize),
		grid = new Array(gridWidth * gridHeight),
		queue: number[][] = [];

	let queueSize = 0,
		sampleSize = 0;

	return function () {
		if (!sampleSize)
			return sample(Math.random() * width, Math.random() * height);

		// Pick a random existing sample and remove it from the queue.
		while (queueSize) {
			const i = (Math.random() * queueSize) | 0;
			const s: number[] = queue[i];

			// Make a new candidate between [radius, 2 * radius] from the existing sample.
			for (let j = 0; j < k; ++j) {
				const a = 2 * Math.PI * Math.random(),
					r = Math.sqrt(Math.random() * R + radius2),
					x = s[0] + r * Math.cos(a),
					y = s[1] + r * Math.sin(a);

				// Reject candidates that are outside the allowed extent,
				// or closer than 2 * radius to any existing sample.
				if (0 <= x && x < width && 0 <= y && y < height && far(x, y))
					return sample(x, y);
			}

			queue[i] = queue[--queueSize];
			queue.length = queueSize;
		}
	};

	function far(x: number, y: number) {
		let i = (x / cellSize) | 0,
			j = (y / cellSize) | 0;
		const i0 = Math.max(i - 2, 0),
			j0 = Math.max(j - 2, 0),
			i1 = Math.min(i + 3, gridWidth),
			j1 = Math.min(j + 3, gridHeight);

		for (j = j0; j < j1; ++j) {
			const o = j * gridWidth;
			for (i = i0; i < i1; ++i) {
				let s;
				if ((s = grid[o + i])) {
					const dx = s[0] - x,
						dy = s[1] - y;
					if (dx * dx + dy * dy < radius2) return false;
				}
			}
		}

		return true;
	}

	function sample(x: number, y: number): [number, number] {
		const s = [x, y];
		queue.push(s);
		grid[gridWidth * ((y / cellSize) | 0) + ((x / cellSize) | 0)] = s;
		++sampleSize;
		++queueSize;
		return s as [number, number];
	}
}

export function generateFeltonLine(
	data: FeltonData[],
	xScale: (arg: Date) => number,
	xAccessor: (arg: FeltonData) => Date,
	yScale: (arg: number) => number,
	yAccessor: (arg: FeltonData) => number
): [number, number][] {
	// this is only correct because of 0-based arrays and # segments = # points - 1
	// const segments = data.length
	const segmentWidth = xScale(xAccessor(data[1])) - xScale(xAccessor(data[0]));
	const connectorWidth = segmentWidth * 0.05; // 5% on each side

	// start with the first point, as it (and the last point) are special cases
	const result = [[xScale(xAccessor(data[0])), yScale(yAccessor(data[0]))]];
	// TODO: Add a bounds check here
	for (let i = 1; i < data.length - 1; i++) {
		result.push([
			xScale(xAccessor(data[i])) - connectorWidth,
			yScale(yAccessor(data[i - 1]))
		]);
		result.push([
			xScale(xAccessor(data[i])) + connectorWidth,
			yScale(yAccessor(data[i]))
		]);
	}
	// Add the final point
	result.push([
		xScale(xAccessor(data[data.length - 1])),
		yScale(yAccessor(data[data.length - 1]))
	]);
	return result as [number, number][];
}

export function generateClosedFeltonPolygon(
	data: FeltonData[],
	xScale: (arg: Date) => number,
	xAccessor: (arg: FeltonData) => Date,
	yScale: (arg: number) => number,
	yAccessor: (arg: FeltonData) => number
): [number, number][] {
	const lineSegments = generateFeltonLine(
		data,
		xScale,
		xAccessor,
		yScale,
		yAccessor
	);
	return [
		// First point - on the origin
		[xScale(xAccessor(data[0])), yScale(0)],

		// Now the generated points for the measure lines
		...lineSegments,

		// Bring the line back to the x-axis
		[xScale(xAccessor(data[data.length - 1])), yScale(0)],

		// Now close the polygon by going back to the origin
		[xScale(xAccessor(data[0])), yScale(0)]
	];
}

export function isNumber(value: unknown): number {
	if (typeof value === 'number' && !isNaN(value)) {
		return value;
	} else if (typeof value === 'string' && !isNaN(parseFloat(value))) {
		return parseFloat(value);
	}

	throw new Error('Value is not a number');
}

export function convertToDate(value: string | number | Date): Date {
	if (typeof value === 'string') {
		return new Date(value);
	} else if (typeof value === 'number') {
		return new Date(value);
	} else if (value instanceof Date) {
		return value;
	} else {
		throw new Error('Invalid input. Expected string, number, or Date.');
	}
}
