<script setup lang="ts">
import {refAutoReset} from '@vueuse/core'
import {Button} from '@/components/ui/button'
import {Copy, Check} from '@lucide/vue'

const props = defineProps<{snippet: string, disabled?: boolean}>()

const copied = refAutoReset(false, 2000)

async function copy() {
  await navigator.clipboard.writeText(props.snippet)
  copied.value = true
}
</script>

<template>
  <Button variant="ghost" size="icon" class="shrink-0 size-7" :disabled="disabled" @click="copy">
    <Check v-if="copied" class="size-3.5 text-green-500" />
    <Copy v-else class="size-3.5" />
  </Button>
</template>
