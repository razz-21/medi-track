<script lang="ts">
  import Sidebar from "./Sidebar.svelte";

  let { children } = $props();
</script>

<div class="flex h-screen bg-gray-50">
  <div class="w-[240px]">
    <Sidebar />
  </div>
  <div class="main-container">
    {@render children()}
  </div>
</div>

<style>
  @reference 'tailwindcss';

  .main-container {
    @apply bg-white w-full m-2 p-2 rounded-lg border-gray-200 border;
  }
</style>