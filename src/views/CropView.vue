<script setup lang="ts">
import { ref } from 'vue'
import { buildComposite, sliceCanvas, saveSlices } from '@/utils/crop'
import type { ShowcaseType } from '@/utils/crop'

const type = ref<ShowcaseType>(0)
const bgUrl = ref('')
const files = ref<File[]>([])
const trimRight = ref(false)
const dirHandle = ref<FileSystemDirectoryHandle | null>(null)
const status = ref('')
const running = ref(false)

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
  <main>
    <h1>Steam 展示欄切圖工具</h1>

    <section>
      <label>
        展示欄類型
        <select v-model.number="type">
          <option :value="0">藝術作品展示欄（615px）</option>
          <option :value="1">精選藝術作品展示欄（630px）</option>
          <option :value="2">工作坊展示欄（628px）</option>
        </select>
      </label>
    </section>

    <section>
      <label>
        背景圖 URL（選填）
        <input v-model="bgUrl" placeholder="https://..." type="url" />
      </label>
    </section>

    <section v-if="type === 0">
      <label>
        <input v-model="trimRight" type="checkbox" />
        裁減更多圖片（右側底部額外裁去 70px）
      </label>
    </section>

    <section>
      <label>
        選擇圖片（可多選）
        <input type="file" accept="image/*" multiple @change="onFileChange" />
      </label>
      <p v-if="files.length">已選擇 {{ files.length }} 張圖片</p>
    </section>

    <section>
      <button @click="pickFolder" :disabled="running">選擇輸出資料夾</button>
    </section>

    <section>
      <button @click="run" :disabled="running || !files.length || !dirHandle">
        {{ running ? '處理中…' : '開始切圖' }}
      </button>
    </section>

    <p v-if="status" :class="status.startsWith('錯誤') ? 'error' : 'info'">{{ status }}</p>
  </main>
</template>

<style scoped>
main {
  max-width: 600px;
  margin: 4rem auto;
  padding: 0 1rem;
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
label {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.9rem;
  color: #ccc;
}
input[type="url"],
select {
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #555;
  border-radius: 4px;
  background: #1a1a1a;
  color: #eee;
}
button {
  align-self: flex-start;
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  background: #1b2838;
  color: #c7d5e0;
  border: 1px solid #4c6b8a;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled { opacity: 0.5; cursor: not-allowed; }
.error { color: #e06c6c; }
.info { color: #8bc34a; }
</style>
