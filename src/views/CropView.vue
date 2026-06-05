<script setup lang="ts">
import {ref} from 'vue'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import PreviewProfile from '@/components/PreviewProfile.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {reactive} from 'vue'
import {Showcase, ShowcaseKind} from '@/utils/showcase'
import {Profile} from '@/utils/profile'
import {crop} from '@/utils/crop'
import {Checkbox} from '@/components/ui/checkbox'

const profile = reactive(Profile.create())
const showcase = reactive<Showcase>(Showcase.create())

const status = ref('')
const running = ref(false)

const dirHandle = ref<FileSystemDirectoryHandle | null>(null)

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  showcase.images = input.files ? Array.from(input.files) : []
}

async function pickFolder() {
  if (!('showDirectoryPicker' in window)) {
    status.value = 'This browser does not support folder selection. Please use Chrome or Edge.'
    return
  }
  try {
    dirHandle.value = await (window as any).showDirectoryPicker({mode: 'readwrite'})
    status.value = `Selected folder: ${dirHandle.value!.name}`
  } catch {
    // user cancelled
  }
}

async function run() {
  if (!showcase.images.length) {status.value = 'Please select images first.'; return }
  if (!dirHandle.value) {status.value = 'Please select an output folder first.'; return }
  running.value = true
  status.value = ''
  try {
    await crop(dirHandle.value, profile, showcase)
    status.value = `Done! Processed ${showcase.images.length} image(s).`
  } catch (err) {
    status.value = `Error: ${(err as Error).message}`
  }
  running.value = false
}
</script>

<template>
  <PreviewProfile  :profile="profile" :showcase="showcase" class="sticky top-0"  />
  <div class="w-full p-8 flex flex-col gap-6 bg-background z-10">
    <h1 class="text-xl font-semibold">Steam Showcase Crop Tool</h1>

    <div class="flex flex-col gap-1.5">
      <Label>Showcase Type</Label>
      <Select v-model="showcase.kind">
        <SelectTrigger class="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem :value="ShowcaseKind.Artwork">Artwork Showcase</SelectItem>
          <SelectItem :value="ShowcaseKind.Featured">Featured Artwork Showcase</SelectItem>
          <SelectItem :value="ShowcaseKind.Workshop">Workshop Showcase</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="flex flex-col gap-1.5">
      <Label for="bg-url">Background Image URL</Label>
      <Input id="bg-url" v-model="profile.background as string" placeholder="https://..." type="url" />
    </div>

    <div v-if="showcase.kind === ShowcaseKind.Artwork" class="flex items-center gap-2">
      <Checkbox id="trim-more" v-model="showcase.trimmed" />
      <Label for="trim-more">Trim [More Items]</Label>
    </div>

    <div class="flex flex-col gap-1.5">
      <Label for="file-input">Select Images</Label>
      <input id="file-input" type="file" accept="image/*" multiple
        class="text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-border file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground"
        @change="onFileChange" />
      <p v-if="showcase.images.length" class="text-sm text-muted-foreground">{{ showcase.images.length }} image(s) selected</p>
    </div>

    <div class="flex gap-2">
      <Button variant="outline" :disabled="running" @click="pickFolder">Select Output Folder</Button>
      <Button :disabled="running || !showcase.images.length || !dirHandle" @click="run">
        {{ running ? 'Processing…' : 'Start Crop' }}
      </Button>
    </div>

    <p v-if="status" :class="status.startsWith('Error') ? 'text-destructive' : 'text-green-500'" class="text-sm">
      {{ status }}
    </p>
  </div>
</template>
