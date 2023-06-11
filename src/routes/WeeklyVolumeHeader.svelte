<script lang="ts">
	import * as d3 from 'd3';
	import * as aq from 'arquero';
	import { generateFeltonLine } from '$lib/utils';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import type { FeltonData } from '$lib/types';
	import { isNumber, convertToDate } from '$lib/utils';

	export let width: number;
	// TODO: What's the right ratio for this component?
	const ratio = 10 / 1;
	$: height = width / ratio;

	const topPadding = 20;
	const axisPadding = 16;

	export let data: ColumnTable;

	// given an array of weekly total elements, create a new entry
	// that has the same value as the existing last entry but is
	// one week in the future
	function createNewLastElement(data: FeltonData[]) {
		const newElement = { ...data[data.length - 1] };
		if (newElement.week instanceof Date) {
			newElement.week = d3.timeWeek.offset(newElement.week, 1);
		}
		return newElement;
	}

	// get the count for every week
	const weeklyTotals = data
		.groupby('week')
		.rollup({ total: (d) => aq.op.sum(d!.count) }) // eslint-disable-line @typescript-eslint/no-non-null-assertion
		.orderby('week')
		.objects() as FeltonData[];

	const augmentedWeeklyTotals: FeltonData[] = [
		...weeklyTotals,
		createNewLastElement(weeklyTotals)
	];

	const xAccessor = (d: FeltonData): Date => convertToDate(d.week);

	const yAccessor = (d: FeltonData): number =>
		isNumber(d.total) ? Number(d.total) : 0;

	const xs: Date[] = augmentedWeeklyTotals.map(xAccessor);
	const ys: number[] = augmentedWeeklyTotals.map(yAccessor);

	const xExtents = [xs[0], xs[xs.length - 1]];
	const xDomain = xExtents.map((d) => new Date(d));

	const xScale = d3.scaleTime().domain(xDomain).range([0, width]);

	const yDomain = [0, Math.max(...ys)];

	const yScale = d3
		.scaleLinear()
		.domain(yDomain)
		.range([height, topPadding])
		.nice();

	const feltonData = generateFeltonLine(
		augmentedWeeklyTotals,
		xScale,
		xAccessor,
		yScale,
		yAccessor
	);

	$: yLine = d3.line()(feltonData);
	// use d3.bisect to find the location closest to the start of the month?

	const formatDate = d3.timeFormat('%b');

	// generate a collection of days in the middle of each month
	$: months = d3.timeMonth.range(xExtents[0], xExtents[1]);

	$: midMonths = months.map((d) => d3.timeDay.offset(d, 15));

	let xAxis: SVGGElement;
	$: {
		const xAxisGenerator = d3
			.axisBottom(xScale)
			.tickSize(0)
			.scale(xScale)
			.tickFormat((d) => formatDate(d as Date))
			.tickValues(midMonths);

		d3.select(xAxis).call(xAxisGenerator).select('.domain').remove();
	}

	const dateFinder = d3.bisector(xAccessor);
	const findHeightAtDate = (data: FeltonData[], date: Date) => {
		const index = dateFinder.left(data, date) - 1;

		// if the current date is a sunday (the start of the week) we'll
		// have some issues with the Felton line transitions, so work around
		// that by averaging neighboring measure heights
		if (date.getDay() === 0) {
			return (
				(yScale(yAccessor(data[index])) + yScale(yAccessor(data[index + 1]))) /
				2
			);
		} else {
			return yScale(yAccessor(data[index]));
		}
	};
</script>

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
