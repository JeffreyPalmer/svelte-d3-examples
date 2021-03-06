<script>
    import * as d3 from "d3";
    import * as aq from "arquero";
    import { color } from "d3";

    export let title;
    export let width;
    const ratio = 5 / 1;
    $: height = width / ratio;

    const topPadding = 25;
    const bottomPadding = 10;

    // point sizing control
    const maxRadius = 2.5;
    const boundPercentile = 0.99;

    export let highlightColor;
    export let normalColor;

    export let data;
    const xAccessor = (d) => d.week;
    const yAccessor = (d) => d.hour;
    const sizeAccessor = (d) => d.count;

    $: weeks = data.filter((d) => yAccessor(d) == 0);
    $: sidePadding = width / weeks.length / 2;

    $: xScale = d3
        .scaleTime()
        .domain(d3.extent(weeks, xAccessor))
        .range([sidePadding, width - sidePadding]);

    $: yScale = d3
        .scaleLinear()
        .domain([0, 23])
        .range([topPadding, height - bottomPadding]);

    // find an upper limit for the radius scale based on boundPercentile
    // this allows us to use .clamp(true) to keep outliers from overwhelming the visual
    $: sizeLimit = d3.quantile(data, boundPercentile, sizeAccessor);

    $: radiusScale = d3
        .scaleSqrt()
        .domain([0, sizeLimit])
        .range([0, maxRadius])
        .clamp(true);

    function getHoursForWeek(data, week) {
        const result = d3.filter(
            data,
            (d) => xAccessor(d)?.valueOf() === week.valueOf()
        );
        return result;
    }

    $: p80 = d3.quantile(data, 0.8, sizeAccessor);
    $: colorScale = d3
        .scaleThreshold()
        .domain([p80])
        .range([normalColor, highlightColor]);
    $: opacityScale = d3.scaleThreshold().domain([p80]).range([0.5, 1.0]);
</script>

<style>
    circle {
        stroke: none;
    }
    .title {
        stroke: none;
        font-size: 12px;
    }
    .time-label {
        stroke: none;
        font-size: 12px;
        text-anchor: end;
    }
</style>

<svg viewBox="0 0 {width} {height}">
    {#each weeks as week}
        {#each getHoursForWeek(data, xAccessor(week)) as hour}
            <circle
                cx={xScale(xAccessor(hour))}
                cy={yScale(yAccessor(hour))}
                r={radiusScale(sizeAccessor(hour))}
                fill={colorScale(sizeAccessor(hour))}
                opacity={opacityScale(sizeAccessor(hour))}
            />
        {/each}
    {/each}
    <line class="baseline" x1={0} x2={width} y1={0} y2={0} />
    <text class="title" x={0} y={15}>{title}</text>
    <text class="time-label" x={width} y={15}>AM</text>
    <text class="time-label" x={width} y={height - 5}>PM</text>
</svg>
