<script lang="ts">
	import * as d3 from 'd3';
	import * as R from 'ramda';
	import {
		poissonDiscSampler,
		generateFeltonLine,
		generateClosedFeltonPolygon
	} from '$lib/utils';

	import type { FeltonData } from '$lib/types';

	export let data: Data[] = [
		{
			month: '2020-01-01',
			top_total: 236,
			bottom_total: 242
		},
		{
			month: '2020-02-01',
			top_total: 378,
			bottom_total: 127
		},
		{
			month: '2020-03-01',
			top_total: 282,
			bottom_total: 324
		},
		{
			month: '2020-04-01',
			top_total: 403,
			bottom_total: 182
		},
		{
			month: '2020-05-01',
			top_total: 359,
			bottom_total: 84
		},
		{
			month: '2020-06-01',
			top_total: 379,
			bottom_total: 324
		},
		{
			month: '2020-07-01',
			// top_total: 1200,
			top_total: 654,
			bottom_total: 158
		},
		{
			month: '2020-08-01',
			top_total: 305,
			bottom_total: 249
		},
		{
			month: '2020-09-01',
			top_total: 290,
			bottom_total: 72
		},
		{
			month: '2020-10-01',
			top_total: 313,
			bottom_total: 197
		},
		{
			month: '2020-11-01',
			top_total: 402,
			bottom_total: 532
		},
		{
			month: '2020-12-01',
			top_total: 286,
			bottom_total: 125
		}
	];

	type Data = {
		month: string;
		top_total: number;
		bottom_total: number;
	};

	// Massage the data so that there are enough points to complete the path
	// Copy the final entry in the array
	const myClonedData = R.clone(data[11]);
	// Now set the date to one month after
	myClonedData.month = '2021-01-01';
	const augmentedData = [...R.clone(data), myClonedData];

	export let width = 1200;
	export let height = 800;

	const textHeight = 30;
	const highlightColor = 'cornflowerblue';
	const normalColor = '#ccc';

	const margins = {
		top: 50,
		bottom: 50,
		left: 50,
		right: 50
	};
	// We know we're showing 12 months so divide into 24 intevals
	// TODO: generalize
	$: labelXOffset = (width - margins.left - margins.right) / 24;
	// $: console.log('X-OFFSET', labelXOffset);

	/* const labelYOffset = 15; */

	/* const formatter = d3.format(".0f"); */
	const dateParser = d3.timeParse('%Y-%m-%d');
	const xAccessor = (d: FeltonData): Date => {
		if (typeof d.month === 'string') {
			return dateParser(d.month) as Date;
		}
		if (typeof d.month === 'number') {
			return new Date(d.month);
		}
		return d.month;
	};
	const topAccessor = (d: FeltonData): number => Number(d.top_total);
	const bottomAccessor = (d: FeltonData): number => Number(d.bottom_total);

	const xScale = d3
		.scaleTime()
		.domain([
			dateParser('2020-01-01') as Date,
			dateParser('2021-01-01') as Date
		])
		.range([margins.left, width - margins.right]);

	// The top scale goes from midpoint to top margin
	// Add 10% of the max top value to the end of the domain
	// to ensure there is headroom on the chart
	const topScale = d3
		.scaleLinear()
		.domain([0, (d3.max(data, topAccessor) as number) * 1.1])
		.range([
			(height - margins.bottom - margins.top) / 2 + margins.top,
			margins.top
		])
		.nice();

	// The bottom scale goes from midpoint to bottom margin
	// Add 10% of the max bottom value to the end of the domain
	// to ensure there is footroom (?) on the chart
	const bottomScale = d3
		.scaleLinear()
		.domain([0, (d3.max(data, bottomAccessor) as number) * 1.1])
		.range([
			(height - margins.bottom - margins.top) / 2 + margins.top,
			height - margins.bottom
		])
		.nice();

	const formatDate = (date: Date): string => {
		let options: Intl.DateTimeFormatOptions = {
			month: 'short'
		};
		return date.toLocaleString('en-us', options);
	};

	// First attempt - using 'curveStepAfter'
	// $: yLine = d3
	//     .line()
	//     .x((d) => xScale(xAccessor(d)))
	//     .y((d) => yScale(yAccessor(d)))
	//     .curve(d3.curveStepAfter)(myData);

	// Second attempt - Felton-style connectors
	const topFeltonData = generateFeltonLine(
		augmentedData,
		xScale,
		xAccessor,
		topScale,
		topAccessor
	);

	const botFeltonData = generateFeltonLine(
		augmentedData,
		xScale,
		xAccessor,
		bottomScale,
		bottomAccessor
	);
	$: topLine = d3.line()(topFeltonData);
	$: bottomLine = d3.line()(botFeltonData);

	// For binding in the markup below
	let xAxis: SVGGElement;

	// Now we need some hackery to get around the extra element that was added at the end
	// Explicitly use the dates from the original data
	$: {
		const xAxisGenerator = d3
			.axisBottom(xScale)
			.tickSize(0)
			.scale(xScale)
			.tickFormat(function (v) {
				return formatDate(v as Date);
			})
			.tickValues(R.map(xAccessor, data));
		// Now remove the axis line
		d3.select(xAxis).call(xAxisGenerator).select('.domain').remove();
	}

	// Use the generator to generate all of the points
	// so that they can be iterated over by svelte
	function generatePoissonPoints(
		width: number,
		height: number,
		radius: number
	) {
		const sampler = poissonDiscSampler(width, height, radius);
		let points = [];
		let a: [number, number] | undefined = sampler();
		while (a) {
			points.push(a);
			a = sampler();
		}
		return points;
	}

	// generate points covering the entire bottom of the SVG
	// they'll be filtered later
	$: points = generatePoissonPoints(
		width,
		(height - margins.top - margins.bottom) / 2,
		10
	);

	$: closedPoly = generateClosedFeltonPolygon(
		augmentedData,
		xScale,
		xAccessor,
		bottomScale,
		bottomAccessor
	);
</script>

<p class="text-center text-lg text-gray-700 bg-white">
	Felton 2013 Histogram - Variant 2
</p>
<svg
	style="--label-size: {textHeight}px; --highlight-color: {highlightColor}; --normal-color: {normalColor};"
	class="border border-gray-500 w-full h-auto"
	viewBox="0 0 {width} {height}"
>
	<!-- The following technique is from: -->
	<!-- https://tympanus.net/codrops/2019/01/22/svg-filter-effects-outline-text-with-femorphology/ -->
	<filter id="outline">
		<feMorphology
			in="SourceAlpha"
			result="DILATED"
			operator="dilate"
			radius="5"
		/>
		<feFlood
			flood-color="rgba(55, 65, 81, 1)"
			flood-opacity="1"
			result="BACKGROUND"
		/>
		<feComposite in="BACKGROUND" in2="DILATED" operator="in" result="OUTLINE" />

		<feMerge>
			<feMergeNode in="OUTLINE" />
			<feMergeNode in="SourceGraphic" />
		</feMerge>
	</filter>
	<!-- <polygon
        style="fill:none"
        points={`${margins.left},${margins.top} ${width - margins.right},${
            margins.top
        } ${width - margins.right},${height - margins.bottom} ${margins.left},${
            height - margins.bottom
        }`}
    /> -->
	{#each points as point}
		{#if d3.polygonContains(closedPoly, [point[0], height / 2 + point[1]])}
			<circle
				class="stipple"
				cx={point[0]}
				cy={height / 2 + point[1]}
				r={2.5}
			/>
		{/if}
	{/each}

	<path class="top-line" d={topLine} />
	<path class="bottom-line" d={bottomLine} />
	<g
		class="label"
		bind:this={xAxis}
		transform="translate({labelXOffset} {height - textHeight - margins.bottom})"
	/>
	<line
		class="baseline"
		x1={margins.left}
		x2={width - margins.right}
		y1={(height - margins.top - margins.bottom) / 2 + margins.top}
		y2={(height - margins.top - margins.bottom) / 2 + margins.top}
	/>
	<text
		class="top-label"
		filter="url(#outline)"
		text-anchor="end"
		x={width - margins.right}
		y={(height - margins.top - margins.bottom) / 2 +
			margins.top -
			textHeight / 2}>Top</text
	>
	<text
		class="bottom-label"
		filter="url(#outline)"
		text-anchor="end"
		x={width - margins.right}
		y={(height - margins.top - margins.bottom) / 2 + margins.top + textHeight}
		>Bottom</text
	>
</svg>

<style>
	svg {
		fill: var(--normal-color);
		stroke: var(--normal-color);
	}

	.top-label {
		font-size: var(--label-size);
		fill: var(--highlight-color);
		stroke: var(--highlight-color);
	}

	.bottom-label {
		font-size: var(--label-size);
		fill: var(--normal-color);
		stroke: var(--norman-color);
	}

	.label {
		font-size: var(--label-size);
		text-anchor: middle;
		color: var(--normal-color);
	}
	.top-line {
		stroke: var(--highlight-color);
		stroke-width: 5px;
		fill: none;
	}

	.bottom-line {
		stroke: var(--normal-color);
		stroke-width: 3px;
		fill: none;
	}

	.baseline {
		stroke-width: 3px;
	}

	.stipple {
		fill: var(--normal-color);
		stroke-width: 0px;
	}
</style>
