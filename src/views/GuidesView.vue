<script setup lang="ts">
import {ref} from 'vue'
import {Button} from '@/components/ui/button'
import {ExternalLink, Copy, Check} from '@lucide/vue'

interface Guide {
  title: string
  description: string
  url?: string
  snippet: string
}

const guides: Guide[] = [
  {
    title: 'Upload Long Artwork',
    description: 'On the Steam upload page, run this snippet in the browser console to configure the form for a long artwork upload.',
    url: 'https://steamcommunity.com/sharedfiles/edititem/767/3/',
    snippet: "$J('#image_width').val(1000),$J('#image_height').val(1);",
  },
  {
    title: 'Upload Long Screenshot',
    description: 'On the Steam upload page, run this snippet in the browser console to configure the form for a long screenshot upload.',
    url: 'https://steamcommunity.com/sharedfiles/edititem/767/3/',
    snippet: "$J('#image_width').val(1000),$J('#image_height').val(1),$J('[name=file_type]').val(5);",
  },
  {
    title: 'Upload Long Workshop Item',
    description: 'On the Steam upload page, run this snippet in the browser console to configure the form for a long workshop item upload.',
    url: 'https://steamcommunity.com/sharedfiles/edititem/767/3/',
    snippet: "$J('[name=consumer_app_id]').val(480);$J('[name=file_type]').val(0);$J('[name=visibility]').val(0);",
  },
  {
    title: 'Upload Long Guide',
    description: 'On the Steam guide creation page, run this snippet in the browser console to configure the form for a long guide upload.',
    url: 'https://steamcommunity.com/sharedfiles/editguide/?appid=480',
    snippet: "$J('[name=consumer_app_id]').val(480);$J('[name=file_type]').val(9);$J('[name=visibility]').val(0);",
  },
]

const copied = ref<number | null>(null)

async function copy(index: number, snippet: string) {
  await navigator.clipboard.writeText(snippet)
  copied.value = index
  setTimeout(() => { copied.value = null }, 2000)
}
</script>

<template>
  <div class="p-8 max-w-2xl flex flex-col gap-6">
    <div>
      <h1 class="text-xl font-semibold">Upload Guides</h1>
      <p class="text-sm text-muted-foreground mt-1">
        How to upload long images to Steam. Open the upload page, paste the snippet into your browser console, then upload your image.
        Based on <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=2175748848" target="_blank" rel="noopener" class="underline hover:text-foreground transition-colors">this guide</a>.
      </p>
    </div>

    <div v-for="(guide, i) in guides" :key="i" class="rounded-lg border border-border p-5 flex flex-col gap-3">
      <div class="flex items-start justify-between gap-2">
        <div>
          <h2 class="font-medium">{{ guide.title }}</h2>
          <p class="text-sm text-muted-foreground mt-0.5">{{ guide.description }}</p>
        </div>
        <Button v-if="guide.url" variant="ghost" size="icon" class="shrink-0" as-child>
          <a :href="guide.url" target="_blank" rel="noopener" title="Open upload page">
            <ExternalLink class="size-4" />
          </a>
        </Button>
      </div>

      <div class="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
        <code class="flex-1 text-xs font-mono break-all">{{ guide.snippet }}</code>
        <Button variant="ghost" size="icon" class="shrink-0 size-7" @click="copy(i, guide.snippet)">
          <Check v-if="copied === i" class="size-3.5 text-green-500" />
          <Copy v-else class="size-3.5" />
        </Button>
      </div>
    </div>
  </div>
</template>
