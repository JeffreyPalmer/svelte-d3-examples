<script lang="ts">
  import * as d3 from 'd3';

  export let width = 1200;
  export let height = 800;

  let textHeight = 30;
  let highlightColor = 'cornflowerblue';

  let margins = {
    top: 80,
    bottom: 80,
    left: 80,
    right: 80
  };

  $: xScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([margins.left, width - margins.right]);
  $: yScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([height - margins.bottom, margins.top]);
</script>

<p class="text-center text-lg text-gray-700 bg-white">D3 Base Component</p>
<svg
  style="--label-size: {textHeight}px; --highlight-color: {highlightColor};"
  class="border border-gray-500 w-full h-auto"
  viewBox="0 0 {width} {height}"
>
  <text
    class="label"
    x={0}
    y={height}
    dominant-baseline="auto"
    text-anchor="start">[0, {height}]</text
  >
  <text
    class="label"
    x={width}
    y={height}
    dominant-baseline="auto"
    text-anchor="end">[{height}, 0]</text
  >
  <text
    class="label"
    x={0}
    y={textHeight}
    dominant-baseline="auto"
    text-anchor="start">[0, 0]</text
  >
  <text
    class="label"
    x={width}
    y={textHeight}
    dominant-baseline="auto"
    text-anchor="end">[{width}, 0]</text
  >
  <polygon
    style="fill: none;"
    points={`${margins.left},${margins.top} ${width - margins.right},${
      margins.top
    } ${width - margins.right},${height - margins.bottom} ${margins.left},${
      height - margins.bottom
    }`}
  />
  <line
    class="fill-current"
    x1={xScale(0)}
    y1={yScale(0)}
    x2={xScale(100)}
    y2={yScale(100)}
  />
  <text class="label" x={xScale(0)} y={yScale(0) + textHeight}>(0,0)</text>
  <text
    class="label"
    x={xScale(100)}
    y={yScale(100)}
    text-anchor="end"
    dominant-baseline="bottom">(100,100)</text
  >
</svg>

<style>
  .label {
    font-size: var(--label-size);
  }
  svg {
    fill: var(--highlight-color);
    stroke: var(--highlight-color);
  }
</style>
