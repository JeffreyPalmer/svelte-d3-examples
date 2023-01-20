<script lang="ts">
    import * as d3 from "d3";
    import * as R from "ramda";

    export let data = [
        {
            month: "2020-01-01",
            total: 236,
        },
        {
            month: "2020-02-01",
            total: 378,
        },
        {
            month: "2020-03-01",
            total: 282,
        },
        {
            month: "2020-04-01",
            total: 403,
        },
        {
            month: "2020-05-01",
            total: 359,
        },
        {
            month: "2020-06-01",
            total: 379,
        },
        {
            month: "2020-07-01",
            // total: 1200,
            total: 654,
        },
        {
            month: "2020-08-01",
            total: 305,
        },
        {
            month: "2020-09-01",
            total: 290,
        },
        {
            month: "2020-10-01",
            total: 313,
        },
        {
            month: "2020-11-01",
            total: 402,
        },
        {
            month: "2020-12-01",
            total: 286,
        },
    ];

    // Massage the data so that there are enough points to complete the path
    // Copy the final entry in the array
    const myClonedData = R.clone(data[11]);
    // Now set the date to one month after
    myClonedData.month = "2021-01-01";
    const augmentedData = [...R.clone(data), myClonedData];

    export let width = 1200;
    export let height= 800;

    const textHeight = 30;
    const highlightColor = "cornflowerblue";
    const normalColor = "#ccc";

    let margins = {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
    };
    // We know we're showing 12 months so divide into 24 intervals
    // TODO: generalize
    $: labelXOffset = (width - margins.left - margins.right) / 24;
    // $: console.log("X-OFFSET", labelXOffset);

    const labelYOffset = 15;

    const formatter = d3.format(".0f");
    const dateParser = d3.timeParse("%Y-%m-%d");
    const xAccessor = (d) => dateParser(d.month);
    const yAccessor = (d) => d.total;

    // How to calculate the scale factor which will get us the most-significant digit
    $: yMin = d3.min(data, yAccessor);
    $: scale = Math.pow(10, Math.floor(Math.log10(yMin)));
    // $: console.log("SCALE", scale);

    $: xScale = d3
        .scaleTime()
        .domain([dateParser("2020-01-01"), dateParser("2021-01-01")])
        .range([margins.left, width - margins.right]);

    // Mention that you need to reverse the top and bottom in the range
    $: yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, yAccessor) + d3.max(data, yAccessor) / 10])
        .range([height - margins.bottom, margins.top])
        .nice();

    function formatDate(date) {
        let options = {
            month: "short",
        };
        return date.toLocaleString("en-us", options);
    }

    function generateFeltonLine(data, xScale, xAccessor, yScale, yAccessor) {
        // this is only correct because of 0-based arrays and # segments = # points - 1
        /* const segments = data.length; */
        const segmentWidth =
            xScale(xAccessor(data[1])) - xScale(xAccessor(data[0]));
        const connectorWidth = segmentWidth * 0.05; // 5% on each side

        // start with the first point, as it (and the last point) are special cases
        let result = [[xScale(xAccessor(data[0])), yScale(yAccessor(data[0]))]];
        // TODO: Add a bounds check here
        for (let i = 1; i < data.length - 1; i++) {
            result.push([
                xScale(xAccessor(data[i])) - connectorWidth,
                yScale(yAccessor(data[i - 1])),
            ]);
            result.push([
                xScale(xAccessor(data[i])) + connectorWidth,
                yScale(yAccessor(data[i])),
            ]);
        }
        // Add the final point
        result.push([
            xScale(xAccessor(data[data.length - 1])),
            yScale(yAccessor(data[data.length - 1])),
        ]);
        return result;
    }

    // First attempt - using 'curveStepAfter'
    // $: yLine = d3
    //     .line()
    //     .x((d) => xScale(xAccessor(d)))
    //     .y((d) => yScale(yAccessor(d)))
    //     .curve(d3.curveStepAfter)(myData);

    // Second attempt - Felton-style connectors
    $: yLine = d3.line()(
        generateFeltonLine(augmentedData, xScale, xAccessor, yScale, yAccessor)
    );
    // $: console.log("FELTON LINE:", yLine);

    // For binding in the markup below
    let xAxis;

    // Now we need some hackery to get around the extra element that was added at the end
    // Explicitly use the dates from the original data
    $: {
        const xAxisGenerator = d3
            .axisBottom()
            .tickSize(0)
            .scale(xScale)
            .tickFormat(function (v) {
                return formatDate(v);
            })
            .tickValues(R.map(xAccessor, data));
        // Now remove the axis line
        d3.select(xAxis).call(xAxisGenerator).select(".domain").remove();
    }
</script>

<style>
    .title {
        font-size: var(--label-size);
        /* font-weight: bold; */
        color: var(--normal-color);
    }
    .label {
        font-size: var(--label-size);
        /* font-weight: bold; */
        text-anchor: middle;
        color: var(--normal-color);
    }
    .scale-label {
        font-size: var(--label-size);
        /* font-weight: bold; */
        text-anchor: end;
        color: var(--normal-color);
    }
    svg {
        fill: var(--normal-color);
        stroke: var(--normal-color);
    }

    .line {
        stroke: var(--highlight-color);
        stroke-width: 5px;
        fill: none;
    }
</style>

<p class="text-center text-lg text-gray-700 bg-white">
    Felton 2013 Histogram - Variant 1
</p>
<svg
    style="--label-size: {textHeight}px; --highlight-color: {highlightColor}; --normal-color: {normalColor};"
    class="border border-gray-500 w-full h-auto"
    viewBox="0 0 {width} {height}"
>
    <text class="title" x={margins.left} y={margins.top + textHeight}
        >TOTAL MONTHLY MEASUREMENT</text
    >
    <text
        class="scale-label"
        x={width - margins.right}
        y={margins.top + textHeight}>&times;{formatter(scale)}</text
    >
    <path class="line" d={yLine} />
    {#each data as datum}
        <text
            class="label"
            x={xScale(xAccessor(datum)) + labelXOffset}
            y={yScale(yAccessor(datum)) - labelYOffset}
            >{formatter(yAccessor(datum) / scale)}</text
        >
    {/each}
    <g
        class="label"
        bind:this={xAxis}
        transform="translate({labelXOffset} {height -
            textHeight -
            margins.bottom})"
    />
    <!-- <polygon
        style="fill:none"
        points={`${margins.left},${margins.top} ${width - margins.right},${
            margins.top
        } ${width - margins.right},${height - margins.bottom} ${margins.left},${
            height - margins.bottom
        }`}
    /> -->
</svg>
