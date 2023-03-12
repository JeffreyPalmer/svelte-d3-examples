<script lang="ts">
	// import * as d3 from 'd3';
	import * as aq from 'arquero';

	import WeeklyVolumeHeader from './WeeklyVolumeHeader.svelte';
	import HourlyVolume from './HourlyVolume.svelte';

	import json from '$lib/data/volume-weekly-activity-by-hour.json';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import type { InputData, ParsedData } from '$lib/types';

	export let width = 1200;
	// export let height = 800;

	const highlightColor = 'gold';
	const normalColor = '#ccc';

	async function loadData() {
		const rawData: InputData = json;
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
				count: (d: ParsedData) => aq.op.parse_int(d.count, 10),
				week: (d: ParsedData) => aq.op.parse_date(d.week)
			});

		return allData;
	}

	let loaded = false;
	let pullReqs: ParsedData[] = [];
	let issues: ParsedData[] = [];
	let branches: ParsedData[] = [];
	let data: ColumnTable;

	loadData().then((res: ColumnTable) => {
		// resorting to ! as any undefined checks breaks arquero
		// it's fine in this case but should be avoided
		pullReqs = res
			.filter((d) => d!.event === 'pull_requests')
			.objects() as ParsedData[];
		issues = res.filter((d) => d!.event === 'issues').objects() as ParsedData[];
		branches = res
			.filter((d) => d!.event === 'branches')
			.objects() as ParsedData[];
		data = res as ColumnTable;
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
