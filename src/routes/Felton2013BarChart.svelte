<script lang="ts">
  import * as d3 from "d3";
  import * as R from "ramda";

  interface Data {
    name: string;
    total_actions: number;
  }

  export let data: Data[] = [
    {
      name: "Sommer Wolfe",
      total_actions: 337
    },
    {
      name: "Elias Vančo",
      total_actions: 260
    },
    {
      name: "Milka Winfield",
      total_actions: 236
    },
    {
      name: "Fritz Nadya",
      total_actions: 188
    },
    {
      name: "Ellie-Louise Schofield",
      total_actions: 186
    },
    {
      name: "Ana Byrne",
      total_actions: 152
    },
    {
      name: "Lana Bolton",
      total_actions: 274
    },
    {
      name: "Lili Broadhurst",
      total_actions: 84
    },
    {
      name: "Judy Sheldon",
      total_actions: 138
    },
    {
      name: "Ricardo Price",
      total_actions: 281
    }
  ];

  const width = 1200;

  const margins = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
  };

  const topN = 10;

  const textHeight = 30;
  const barOffset = 15;
  const linePadding = 40;
  const lineHeight = textHeight + linePadding;

  // Compute the overall height of the visual
  const height = topN * lineHeight + margins.top + margins.bottom;

  const highlightColor = "cornflowerblue";

  const metricAccessor = (d: Data) => d.total_actions;
  const titleAccessor = (d: Data) => d.name;

  // Grab the maximum value from the data for later use
  const xMax = d3.max(data, metricAccessor);
  const xScale = d3
    .scaleLinear()
    .domain([0, xMax ? xMax : 0])
    .range([margins.left, width - margins.right]);

  // Calculate the index-based offset from the top of the SVG
  // Note: Add textHeight to shift text below the starting point
  //       as text is placed according the the baseline
  const yOffsetFn = (i: number) => lineHeight * i + margins.top + textHeight;

  const diff = (a: Data, b: Data) => metricAccessor(b) - metricAccessor(a);
  const topParticipants = R.take(topN, R.sort(diff, data));
</script>

<p class="text-center text-lg text-gray-700 bg-white">Felton 2013 Bar Chart</p>
<svg
  style="--label-size: {textHeight}px; --highlight-color: {highlightColor};"
  class="border border-gray-500"
  viewBox="0 0 {width} {height}"
>
  {#each topParticipants as participant, i}
    <text class="label" text-anchor="start" x={xScale(0)} y={yOffsetFn(i)}
      >{titleAccessor(participant)}
    </text>
    <text
      class="label highlight"
      text-anchor="end"
      x={xScale(xMax ? xMax : 0)}
      y={yOffsetFn(i)}
      >{metricAccessor(participant)}
    </text>
    <!-- Left to Right -->
    <!-- <line
            class="dash"
            x1={xScale(0)}
            x2={xScale(xMax)}
            y1={yOffsetFn(i) + barOffset}
            y2={yOffsetFn(i) + barOffset}
        /> -->
    <!-- Right to left -->
    <line
      class="dash"
      x1={xScale(xMax ? xMax : 0)}
      x2={xScale(0)}
      y1={yOffsetFn(i) + barOffset}
      y2={yOffsetFn(i) + barOffset}
    />
    <line
      class="measure highlight"
      x1={xScale(0)}
      x2={xScale(metricAccessor(participant))}
      y1={yOffsetFn(i) + barOffset}
      y2={yOffsetFn(i) + barOffset}
    />
  {/each}
  <!-- <polygon
        style="fill: none"
        points={`${margins.left},${margins.top} ${width - margins.right},${
            margins.top
        } ${width - margins.right},${height - margins.bottom} ${margins.left},${
            height - margins.bottom
        }`}
    /> -->
</svg>

<style>
  svg {
    width: 100%;
    height: auto;
  }
  .label {
    font-size: var(--label-size);
  }
  .highlight {
    fill: var(--highlight-color);
    stroke: var(--highlight-color);
    font-weight: bold;
  }
  .measure {
    stroke-width: 5px;
  }
  .dash {
    stroke-dasharray: 3px 9px;
    stroke-width: 3px;
  }
</style>
