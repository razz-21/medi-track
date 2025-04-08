<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { toast } from "svelte-sonner";
</script>


<div class="h-[100vh] flex items-center justify-center">
  <div>
    <h1 class="text-2xl font-bold">Welcome to Meditrack</h1>
    <div class="flex gap-2">
      <Button variant="default">Login</Button>
      <Button variant="default" on:click={() => toast.success("Wecome to Meditrack")}>Click me</Button>
    </div>
  </div>
</div>

