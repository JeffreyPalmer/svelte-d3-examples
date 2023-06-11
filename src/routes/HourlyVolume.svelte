<script lang="ts">
  import * as d3 from "d3";
  import type { ParsedGHData } from "$lib/types";

  export let title: string;
  export let width: number;
  const ratio = 5 / 1;
  $: height = width / ratio;

  const topPadding = 25;
  const bottomPadding = 10;

  // point sizing control
  const maxRadius = 2.5;
  const boundPercentile = 0.99;

  export let highlightColor: string;
  export let normalColor: string;

  export let data: ParsedGHData[];
  const xAccessor = (d: ParsedGHData) => d.week;
  const yAccessor = (d: ParsedGHData) => d.hour;
  const sizeAccessor = (d: ParsedGHData) => Number(d.count);

  const weeks = data.filter((d: ParsedGHData) => yAccessor(d) == 0);
  const sidePadding = width / weeks.length / 2;

  const xDomain = d3.extent(weeks, xAccessor) as [Date, Date];

  $: xScale = d3
    .scaleTime()
    .domain(xDomain)
    .range([sidePadding, width - sidePadding]);

  $: yScale = d3
    .scaleLinear()
    .domain([0, 23])
    .range([topPadding, height - bottomPadding]);

  // find an upper limit for the radius scale based on boundPercentile
  // this allows us to use .clamp(true) to keep outliers from overwhelming the visual
  const sizeLimit = d3.quantile(data, boundPercentile, sizeAccessor) ?? 0;

  const radiusScale = d3
    .scaleSqrt()
    .domain([0, sizeLimit])
    .range([0, maxRadius])
    .clamp(true);

  const getHoursForWeek = (data: ParsedGHData[], week: Date) => {
    const result = d3.filter(
      data,
      (d: ParsedGHData) => xAccessor(d)?.valueOf() === week.valueOf()
    );
    return result;
  };

  // biggest rewrite of typing project, have a look and see if satisfied:
  const p80 = d3.quantile(data, 0.9, (d) => sizeAccessor(d)) ?? 0;
  const colorScale = d3
    .scaleLinear<string>()
    .domain([0, p80])
    .range([normalColor, highlightColor]);

  const opacityScale = d3.scaleThreshold().domain([p80]).range([0.5, 1.0]);
</script>

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
