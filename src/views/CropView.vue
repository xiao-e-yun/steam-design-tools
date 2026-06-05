<script setup lang="ts">
import { ref } from 'vue'
import { buildComposite, sliceCanvas, saveSlices } from '@/utils/crop'
import type { ShowcaseType } from '@/utils/crop'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AcceptableValue } from 'reka-ui'

const type = ref<ShowcaseType>(0)
const typeStr = ref('0')
const bgUrl = ref('')
const files = ref<File[]>([])
const trimRight = ref(false)
const dirHandle = ref<FileSystemDirectoryHandle | null>(null)
const status = ref('')
const running = ref(false)

function onTypeChange(val: AcceptableValue) {
  if (val === null) return
  typeStr.value = String(val)
  type.value = Number(val) as ShowcaseType
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  files.value = input.files ? Array.from(input.files) : []
}

async function pickFolder() {
  if (!('showDirectoryPicker' in window)) {
    status.value = '此瀏覽器不支援資料夾選擇，請使用 Chrome 或 Edge'
    return
  }
  try {
    dirHandle.value = await (window as any).showDirectoryPicker({ mode: 'readwrite' })
    status.value = `已選擇資料夾：${dirHandle.value!.name}`
  } catch {
    // user cancelled
  }
}

async function run() {
  if (!files.value.length) { status.value = '請先選擇圖片'; return }
  if (!dirHandle.value) { status.value = '請先選擇輸出資料夾'; return }
  running.value = true
  status.value = ''
  try {
    for (let i = 0; i < files.value.length; i++) {
      const file = files.value[i]!
      status.value = `處理中 ${i + 1} / ${files.value.length}：${file.name}`
      const composite = await buildComposite(file as File, type.value, bgUrl.value.trim() || null)
      const slices = sliceCanvas(composite, type.value, file.name, trimRight.value)
      await saveSlices(slices, dirHandle.value!)
    }
    status.value = `完成！共處理 ${files.value.length} 張圖片`
  } catch (err) {
    status.value = `錯誤：${(err as Error).message}`
  } finally {
    running.value = false
  }
}
</script>

<template>
  <div class="p-8 max-w-xl flex flex-col gap-6">
    <h1 class="text-xl font-semibold">Steam 展示欄切圖工具</h1>

    <div class="flex flex-col gap-1.5">
      <Label>展示欄類型</Label>
      <Select :model-value="typeStr" @update:model-value="onTypeChange">
        <SelectTrigger class="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">藝術作品展示欄（615px）</SelectItem>
          <SelectItem value="1">精選藝術作品展示欄（630px）</SelectItem>
          <SelectItem value="2">工作坊展示欄（628px）</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="flex flex-col gap-1.5">
      <Label for="bg-url">背景圖 URL（選填）</Label>
      <Input id="bg-url" v-model="bgUrl" placeholder="https://..." type="url" />
    </div>

    <div v-if="type === 0" class="flex items-center gap-2">
      <input id="trim-right" v-model="trimRight" type="checkbox" class="size-4 rounded border-border" />
      <Label for="trim-right">裁減更多圖片（右側底部額外裁去 70px）</Label>
    </div>

    <div class="flex flex-col gap-1.5">
      <Label for="file-input">選擇圖片（可多選）</Label>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        multiple
        class="text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-border file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground"
        @change="onFileChange"
      />
      <p v-if="files.length" class="text-sm text-muted-foreground">已選擇 {{ files.length }} 張圖片</p>
    </div>

    <div class="flex gap-2">
      <Button variant="outline" :disabled="running" @click="pickFolder">選擇輸出資料夾</Button>
      <Button :disabled="running || !files.length || !dirHandle" @click="run">
        {{ running ? '處理中…' : '開始切圖' }}
      </Button>
    </div>

    <p v-if="status" :class="status.startsWith('錯誤') ? 'text-destructive' : 'text-green-500'" class="text-sm">
      {{ status }}
    </p>
  </div>
</template>
