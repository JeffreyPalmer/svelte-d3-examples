<script lang="ts">
  import D3Base from './D3Base.svelte';
  import Felton2013BarChart from './Felton2013BarChart.svelte';
  import Felton2013Histogram from './Felton2013Histogram.svelte';
  import Felton2013HistogramPart2 from './Felton2013HistogramPart2.svelte';
  import Felton2013VolumeChart from './Felton2013VolumeChart.svelte';
</script>

<div class="m-8">
  <p class="text-center font-bold text-3xl my-8">D3 / Svelte Examples</p>
  <div class="grid grid-cols-2 gap-10">
    <div class="bg-gray-700">
      <D3Base />
    </div>
    <div class="bg-gray-700">
      <Felton2013BarChart />
    </div>
    <div class="bg-gray-700">
      <Felton2013Histogram />
    </div>
    <div class="bg-gray-700">
      <Felton2013HistogramPart2 />
    </div>
    <div class="bg-gray-700 col-span-2">
      <Felton2013VolumeChart />
    </div>
  </div>
</div>

<style>
  :global(svg) {
    color: #ccc;
    stroke: #ccc;
    fill: #ccc;
  }
</style>
