<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import PreviewProfile from '@/components/PreviewProfile.vue'

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
    profile.value = { background: input.value.trim() }
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
  <div class="p-8 max-w-2xl">
    <h1 class="text-xl font-semibold mb-6">Profile Background</h1>

    <form class="flex flex-col gap-4" @submit.prevent="lookup">
      <div class="flex flex-col gap-1.5">
        <Label for="profile-url">Steam Profile URL</Label>
        <div class="flex gap-2">
          <Input
            id="profile-url"
            v-model="input"
            placeholder="https://steamcommunity.com/id/yourname/"
            :disabled="loading"
            class="flex-1"
          />
          <Button type="submit" :disabled="loading">
            {{ loading ? '查詢中…' : '查詢' }}
          </Button>
        </div>
      </div>
    </form>

    <p v-if="error" class="text-destructive text-sm mt-4">{{ error }}</p>
    <p v-if="profile && !profile.background" class="text-muted-foreground text-sm mt-4">此用戶沒有設定背景</p>
    <div v-else-if="profile" class="mt-6">
      <PreviewProfile :profile="profile" />
    </div>
  </div>
</template>
