<script setup lang="ts">
import { ref } from 'vue'

interface Profile {
  background: string | null
  animatedBackground?: { webm: string; mp4: string }
}

const input = ref('')
const profile = ref<Profile | null>(null)
const error = ref('')
const loading = ref(false)

function parseUrl(raw: string): { name: string } | { id: string } | null {
  const s = raw.trim()
  const idMatch = s.match(/steamcommunity\.com\/profiles\/(\d+)/)
  if (idMatch?.[1]) return { id: idMatch[1] }
  const nameMatch = s.match(/steamcommunity\.com\/id\/([a-zA-Z0-9_-]+)/)
  if (nameMatch?.[1]) return { name: nameMatch[1] }
  return null
}

async function lookup() {
  error.value = ''
  profile.value = null
  const parsed = parseUrl(input.value)
  if (!parsed) {
    error.value = '請輸入有效的 Steam 個人頁面 URL'
    return
  }
  loading.value = true
  try {
    const params = 'name' in parsed
      ? `name=${encodeURIComponent(parsed.name)}`
      : `id=${encodeURIComponent(parsed.id)}`
    const res = await fetch(`/api/profile?${params}`)
    const data = await res.json()
    if (!res.ok) { error.value = data.error ?? '發生錯誤'; return }
    profile.value = data
  } catch {
    error.value = '網路錯誤'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main>
    <h1>Steam Profile Background</h1>
    <form @submit.prevent="lookup">
      <input
        v-model="input"
        placeholder="https://steamcommunity.com/id/yourname/"
        :disabled="loading"
      />
      <button type="submit" :disabled="loading">{{ loading ? '查詢中…' : '查詢' }}</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <div v-if="profile" class="result">
      <p v-if="!profile.background" class="no-bg">此用戶沒有設定背景</p>
      <template v-else>
        <video
          v-if="profile.animatedBackground"
          :poster="profile.background"
          autoplay loop muted playsinline
        >
          <source :src="profile.animatedBackground.webm" type="video/webm" />
          <source :src="profile.animatedBackground.mp4" type="video/mp4" />
        </video>
        <img v-else :src="profile.background" alt="profile background" />
      </template>
    </div>
  </main>
</template>

<style scoped>
main {
  max-width: 720px;
  margin: 4rem auto;
  padding: 0 1rem;
  font-family: sans-serif;
}
h1 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}
form {
  display: flex;
  gap: 0.5rem;
}
input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #555;
  border-radius: 4px;
  background: #1a1a1a;
  color: #eee;
}
button {
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  background: #1b2838;
  color: #c7d5e0;
  border: 1px solid #4c6b8a;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled { opacity: 0.5; cursor: not-allowed; }
.error { color: #e06c6c; margin-top: 0.75rem; }
.no-bg { color: #888; margin-top: 1rem; }
.result { margin-top: 1.5rem; }
.result img,
.result video {
  width: 100%;
  border-radius: 4px;
}
</style>
