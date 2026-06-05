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
    status.value = '此瀏覽器不支援資料夾選擇，請使用 Chrome 或 Edge'
    return
  }
  try {
    dirHandle.value = await (window as any).showDirectoryPicker({mode: 'readwrite'})
    status.value = `已選擇資料夾：${dirHandle.value!.name}`
  } catch {
    // user cancelled
  }
}

async function run() {
  if (!showcase.images.length) {status.value = '請先選擇圖片'; return }
  if (!dirHandle.value) {status.value = '請先選擇輸出資料夾'; return }
  running.value = true
  status.value = ''
  try {
    await crop(dirHandle.value, profile, showcase)
    status.value = `完成！共處理 ${showcase.images.length} 張圖片`
  } catch (err) {
    status.value = `錯誤：${(err as Error).message}`
  }
  running.value = false
}
</script>

<template>
  <PreviewProfile  :profile="profile" :showcase="showcase" class="sticky top-0"  />
  <div class="w-full p-8 flex flex-col gap-6 bg-background z-10">
    <h1 class="text-xl font-semibold">Steam 展示欄切圖工具</h1>

    <div class="flex flex-col gap-1.5">
      <Label>展示欄類型</Label>
      <Select v-model="showcase.kind">
        <SelectTrigger class="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem :value="ShowcaseKind.Artwork">藝術作品展示欄</SelectItem>
          <SelectItem :value="ShowcaseKind.Featured">精選藝術作品展示欄</SelectItem>
          <SelectItem :value="ShowcaseKind.Workshop">工作坊展示欄</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="flex flex-col gap-1.5">
      <Label for="bg-url">背景圖 URL</Label>
      <Input id="bg-url" v-model="profile.background as string" placeholder="https://..." type="url" />
    </div>

    <div v-if="showcase.kind === ShowcaseKind.Artwork" class="flex items-center gap-2">
      <Checkbox id="trim-top" v-model="showcase.trimmed" />
      <Label for="trim-right">裁減 [更多圖片]</Label>
    </div>

    <div class="flex flex-col gap-1.5">
      <Label for="file-input">選擇圖片</Label>
      <input id="file-input" type="file" accept="image/*" multiple
        class="text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-border file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground"
        @change="onFileChange" />
      <p v-if="showcase.images.length" class="text-sm text-muted-foreground">已選擇 {{ showcase.images.length }} 張圖片</p>
    </div>

    <div class="flex gap-2">
      <Button variant="outline" :disabled="running" @click="pickFolder">選擇輸出資料夾</Button>
      <Button :disabled="running || !showcase.images.length || !dirHandle" @click="run">
        {{ running ? '處理中…' : '開始切圖' }}
      </Button>
    </div>

    <p v-if="status" :class="status.startsWith('錯誤') ? 'text-destructive' : 'text-green-500'" class="text-sm">
      {{ status }}
    </p>
  </div>
</template>
