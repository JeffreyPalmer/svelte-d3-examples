<script lang="typescript">
	import D3Base from "./components/D3Base.svelte";
	import Felton2013BarChart from "./components/Felton2013BarChart.svelte";
	import Felton2013Histogram from "./components/Felton2013Histogram.svelte";
	import Felton2013HistogramPart2 from "./components/Felton2013HistogramPart2.svelte";
</script>

<style>
	:global(svg) {
		color: #ccc;
		stroke: #ccc;
		fill: #ccc;
	}
</style>

<div class="m-8">
	<p class="text-center font-bold text-3xl my-8">D3 / Svelte Examples</p>
	<div class="grid grid-cols-2 gap-10">
		<div class="bg-gray-700">
			<D3Base />
		</div>
		<div class=" bg-gray-700">
			<Felton2013BarChart />
		</div>
		<div class=" bg-gray-700">
			<Felton2013Histogram />
		</div>
		<div class=" bg-gray-700">
			<Felton2013HistogramPart2 />
		</div>
	</div>
</div>
