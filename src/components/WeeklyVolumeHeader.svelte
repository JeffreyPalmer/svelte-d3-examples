<script>
    import * as d3 from "d3";
    import * as aq from "arquero";
    import { generateFeltonLine } from "../utils";

    export let width;
    // TODO: What's the right ratio for this component?
    const ratio = 10 / 1;
    $: height = width / ratio;

    const topPadding = 20;
    const axisPadding = 16;

    export let data;

    // given an array of weekly total elements, create a new entry
    // that has the same value as the existing last entry but is
    // one week in the future
    function createNewLastElement(data) {
        const newElement = { ...data[data.length - 1] };
        newElement.week = d3.timeWeek.offset(newElement.week, 1);
        return newElement;
    }

    // get the count for every week
    $: weeklyTotals = data
        .groupby("week")
        .rollup({ total: (d) => aq.op.sum(d.count) })
        .orderby("week")
        .objects();

    $: augmentedWeeklyTotals = [
        ...weeklyTotals,
        createNewLastElement(weeklyTotals),
    ];

    const xAccessor = (d) => d.week;
    const yAccessor = (d) => d.total;
    $: xScale = d3
        .scaleTime()
        .domain(d3.extent(augmentedWeeklyTotals, xAccessor))
        .range([0, width]);

    $: yScale = d3
        .scaleLinear()
        .domain([0, d3.max(augmentedWeeklyTotals, yAccessor)])
        .range([height, topPadding])
        .nice();

    $: yLine = d3.line()(
        generateFeltonLine(
            augmentedWeeklyTotals,
            xScale,
            xAccessor,
            yScale,
            yAccessor
        )
    );
    // use d3.bisect to find the location closest to the start of the month?

    const formatDate = d3.timeFormat("%b");

    // generate a collection of days in the middle of each month
    $: months = d3.timeMonth.range(
        weeklyTotals[0].week,
        weeklyTotals[weeklyTotals.length - 1].week
    );
    $: midMonths = months.map((d) => d3.timeDay.offset(d, 15));

    let xAxis;
    $: {
        const xAxisGenerator = d3
            .axisBottom()
            .tickSize(0)
            .scale(xScale)
            .tickFormat((d) => formatDate(d))
            .tickValues(midMonths);

        d3.select(xAxis).call(xAxisGenerator).select(".domain").remove();
    }

    const dateFinder = d3.bisector(xAccessor);
    function findHeightAtDate(data, date) {
        const index = dateFinder.left(data, date) - 1;

        // if the current date is a sunday (the start of the week) we'll
        // have some issues with the Felton line transitions, so work around
        // that by averaging neighboring measure heights
        if (date.getDay() === 0) {
            return (
                (yScale(yAccessor(data[index])) +
                    yScale(yAccessor(data[index + 1]))) /
                2
            );
        } else {
            return yScale(yAccessor(data[index]));
        }
    }
</script>

<style>
    .total {
        stroke: var(--highlight-color);
        stroke-width: 2px;
        fill: none;
    }
    .axis {
        stroke: none;
        font-size: 12px;
        text-anchor: middle;
    }
    .dashed-line {
        stroke-dasharray: 1px 3px;
        stroke-width: 1px;
    }
</style>

<svg viewBox="0 0 {width} {height}">
    {#each months as month}
        <line
            class="dashed-line"
            x1={xScale(month)}
            x2={xScale(month)}
            y1={yScale(0)}
            y2={findHeightAtDate(weeklyTotals, month)}
        />
    {/each}
    <path class="total" d={yLine} />
    <g
        class="axis"
        bind:this={xAxis}
        transform="translate(0, {height - axisPadding})"
    />
</svg>
