<script lang="ts">
	// import * as d3 from 'd3';
	import * as aq from 'arquero';

	import WeeklyVolumeHeader from './WeeklyVolumeHeader.svelte';
	import HourlyVolume from './HourlyVolume.svelte';

	import json from '$lib/data/volume-weekly-activity-by-hour.json';

	export let width = 1200;
	// export let height = 800;

	const highlightColor = 'gold';
	const normalColor = '#ccc';

	type Data = {
		week: string;
		hour: number;
		pull_requests: string;
		issues: string;
		branches: string;
	};
	type InputData = {
		data: Data[];
	};
	type ParsedData = {
		count: {
			data: number[];
		};
		event: {
			data: string[];
		};
		hour: {
			data: number[];
		};
		week: {
			data: Date[];
		};
	};

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
	// TODO: Figure out how to type the ColumnTable from arquero sent to the template
</script>

<div style="--highlight-color: {highlightColor}">
	<p class="text-center text-lg text-gray-700 bg-white">
		Felton 2013 Volume Chart
	</p>
	<div class="p-5">
		{#await loadData() then data}
			<WeeklyVolumeHeader {data} {width} />
			<HourlyVolume
				data={data.filter((d) => d.event === 'pull_requests').objects()}
				{width}
				{highlightColor}
				{normalColor}
				title="PULL REQUESTS"
			/>
			<HourlyVolume
				data={data.filter((d) => d.event === 'issues').objects()}
				{width}
				{highlightColor}
				{normalColor}
				title="ISSUES"
			/>
			<HourlyVolume
				data={data.filter((d) => d.event === 'branches').objects()}
				{width}
				{highlightColor}
				{normalColor}
				title="BRANCHES"
			/>
		{/await}
	</div>
</div>
