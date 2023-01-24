<script lang="ts">
	import * as d3 from 'd3';
	import * as aq from 'arquero';

	import WeeklyVolumeHeader from './WeeklyVolumeHeader.svelte';
	import HourlyVolume from './HourlyVolume.svelte';

	import json from '$lib/data/volume-weekly-activity-by-hour.json';

	export let width = 1200;
	// export let height = 800;

	const highlightColor = 'gold';
	const normalColor = '#ccc';

	async function loadData() {
		const rawData = json;
		aq.addFunction('d3_parse_date', d3.timeParse('%Y-%m-%d'), {
			override: true
		});
		const allData = aq
			.from(rawData.data)
			.fold(['pull_requests', 'issues', 'branches'], {
				as: ['event', 'count']
			})
			.derive({
				count: (d) => aq.op.parse_int(d.count),
				week: (d) => aq.op.d3_parse_date(d.week)
			});

		return allData;
	}
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
