<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { toast } from "svelte-sonner";
	import type { PageData } from "./$types";

  export let data: PageData;
</script>


<div class="h-[100vh] flex items-center justify-center">
  <div class="flex flex-col gap-4 items-center">
    <h1 class="text-2xl font-bold">Welcome to Meditrack</h1>
    <div class="flex gap-2">
      <Button variant="default">Login</Button>
      <Button variant="default" on:click={() => toast.success("Wecome to Meditrack")}>Click me</Button>
    </div>

    {JSON.stringify(data)}
  </div>
</div>

