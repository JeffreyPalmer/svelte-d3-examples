export function poissonDiscSampler(width: number, height: number, radius: number) {
    var k = 30, // maximum number of samples before rejection
        radius2 = radius * radius,
        R = 3 * radius2,
        cellSize = radius * Math.SQRT1_2,
        gridWidth = Math.ceil(width / cellSize),
        gridHeight = Math.ceil(height / cellSize),
        grid = new Array(gridWidth * gridHeight),
        queue: number[][] = [],
        queueSize = 0,
        sampleSize = 0

    return function () {
        if (!sampleSize)
            return sample(Math.random() * width, Math.random() * height)

        // Pick a random existing sample and remove it from the queue.
        while (queueSize) {
            var i = (Math.random() * queueSize) | 0,
                s: number[] = queue[i]

            // Make a new candidate between [radius, 2 * radius] from the existing sample.
            for (var j = 0; j < k; ++j) {
                var a = 2 * Math.PI * Math.random(),
                    r = Math.sqrt(Math.random() * R + radius2),
                    x = s[0] + r * Math.cos(a),
                    y = s[1] + r * Math.sin(a)

                // Reject candidates that are outside the allowed extent,
                // or closer than 2 * radius to any existing sample.
                if (
                    0 <= x &&
                    x < width &&
                    0 <= y &&
                    y < height &&
                    far(x, y)
                )
                    return sample(x, y)
            }

            queue[i] = queue[--queueSize]
            queue.length = queueSize
        }
    }

    function far(x: number, y: number) {
        var i = (x / cellSize) | 0,
            j = (y / cellSize) | 0,
            i0 = Math.max(i - 2, 0),
            j0 = Math.max(j - 2, 0),
            i1 = Math.min(i + 3, gridWidth),
            j1 = Math.min(j + 3, gridHeight)

        for (j = j0; j < j1; ++j) {
            var o = j * gridWidth
            for (i = i0; i < i1; ++i) {
                if ((s = grid[o + i])) {
                    var s,
                        dx = s[0] - x,
                        dy = s[1] - y
                    if (dx * dx + dy * dy < radius2) return false
                }
            }
        }

        return true
    }

    function sample(x: number, y: number) {
        var s = [x, y]
        queue.push(s)
        grid[gridWidth * ((y / cellSize) | 0) + ((x / cellSize) | 0)] = s
        ++sampleSize
        ++queueSize
        return s
    }
}


export function generateFeltonLine(data: any, xScale: any, xAccessor: any, yScale: any, yAccessor: any) {
    // this is only correct because of 0-based arrays and # segments = # points - 1
    const segments = data.length
    const segmentWidth =
        xScale(xAccessor(data[1])) - xScale(xAccessor(data[0]))
    const connectorWidth = segmentWidth / 20 // 5% on each side

    // start with the first point, as it (and the last point) are special cases
    let result = [[xScale(xAccessor(data[0])), yScale(yAccessor(data[0]))]]
    // TODO: Add a bounds check here
    for (let i = 1; i < data.length - 1; i++) {
        result.push([
            xScale(xAccessor(data[i])) - connectorWidth,
            yScale(yAccessor(data[i - 1])),
        ])
        result.push([
            xScale(xAccessor(data[i])) + connectorWidth,
            yScale(yAccessor(data[i])),
        ])
    }
    // Add the final point
    result.push([
        xScale(xAccessor(data[data.length - 1])),
        yScale(yAccessor(data[data.length - 1])),
    ])
    return result
}

export function generateClosedFeltonPolygon(data:any, xScale:any, xAccessor:any, yScale:any, yAccessor:any) {
    const lineSegments = generateFeltonLine(
        data,
        xScale,
        xAccessor,
        yScale,
        yAccessor
    );
    return [
        [xScale(xAccessor(data[0])), yScale(0)],
        ...lineSegments,
        [xScale(xAccessor(data[data.length - 1])), yScale(0)],
        [xScale(0), yScale(0)],
    ];
}