<script lang="ts">
	// import * as d3 from 'd3';
	import * as aq from 'arquero';

	import WeeklyVolumeHeader from './WeeklyVolumeHeader.svelte';
	import HourlyVolume from './HourlyVolume.svelte';

	import json from '$lib/data/volume-weekly-activity-by-hour.json';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import type { GHData, ParsedGHData } from '$lib/types';

	export let width = 1200;
	// export let height = 800;

	const highlightColor = 'gold';
	const normalColor = '#ccc';

	async function loadData() {
		const rawData: { data: GHData[] } = json;
		// Removed this as I couldn't see what it changed from the default
		// aq.addFunction('d3_parse_date', d3.timeParse('%Y-%m-%d'), {
		// 	override: true
		// });
		const allData = aq
			.from(rawData.data)
			.fold(['pull_requests', 'issues', 'branches'], {
				as: ['event', 'count']
			})
			.derive({
				count: (d: ParsedGHData) => aq.op.parse_int(d.count, 10),
				week: (d: ParsedGHData) => aq.op.parse_date(d.week)
			});

		return allData;
	}

	let loaded = false;
	let pullReqs: ParsedGHData[];
	let issues: ParsedGHData[];
	let branches: ParsedGHData[];
	let data: ColumnTable;

	loadData().then((res: ColumnTable) => {
		// Forcing typescript to recognise the output of
		// arquero with ! and as, since the library does not
		// appear to support TS
		pullReqs = res
			.filter((d) => d && d.event === 'pull_requests') // eslint-disable-line @typescript-eslint/no-non-null-assertion
			.objects() as ParsedGHData[];
		issues = res
			.filter((d) => d && d.event === 'issues') // eslint-disable-line @typescript-eslint/no-non-null-assertion
			.objects() as ParsedGHData[];
		branches = res
			.filter((d) => d && d.event === 'branches') // eslint-disable-line @typescript-eslint/no-non-null-assertion
			.objects() as ParsedGHData[];
		data = res;
		loaded = true;
	});
</script>

<div style="--highlight-color: {highlightColor}">
	<p class="text-center text-lg text-gray-700 bg-white">
		Felton 2013 Volume Chart
	</p>
	<div class="p-5">
		{#if loaded}
			<WeeklyVolumeHeader {data} {width} />
			<HourlyVolume
				data={pullReqs}
				{width}
				{highlightColor}
				{normalColor}
				title="PULL REQUESTS"
			/>
			<HourlyVolume
				data={issues}
				{width}
				{highlightColor}
				{normalColor}
				title="ISSUES"
			/>
			<HourlyVolume
				data={branches}
				{width}
				{highlightColor}
				{normalColor}
				title="BRANCHES"
			/>
		{/if}
	</div>
</div>
