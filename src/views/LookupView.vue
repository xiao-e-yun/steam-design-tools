<script setup lang="ts">
import {ref} from 'vue'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import PreviewProfile from '@/components/PreviewProfile.vue'
import {Profile} from '@/utils/profile'

const input = ref('')
const profile = ref<Profile>({
  background: null,
})
const error = ref('')
const loading = ref(false)

function parseUrl(raw: string): ["id" | "name", string] | null {
  const s = raw.trim()
  const idMatch = s.match(/steamcommunity\.com\/profiles\/(\d+)/)
  if (idMatch?.[1]) return ["id", idMatch[1]]
  const nameMatch = s.match(/steamcommunity\.com\/id\/([a-zA-Z0-9_-]+)/)
  if (nameMatch?.[1]) return ["name", nameMatch[1]]
  return null
}

async function lookup() {
  error.value = ''
  const parsed = parseUrl(input.value)
  if (!parsed) {
    profile.value = Profile.create({
      background: input.value.trim()
    })
    return
  }
  loading.value = true
  try {
    const [name, value] = parsed
    const res = await fetch(`/api/profile?${name}=${encodeURIComponent(value)}`)
    const data = await res.json()
    if (!res.ok) {error.value = data.error ?? '發生錯誤'; return }
    profile.value = data
  } catch {
    error.value = '網路錯誤'
  }
  loading.value = false
}
</script>

<template>
  <PreviewProfile :profile="profile" class="sticky top-0"  />
  <div class="w-full p-8 flex flex-col gap-6 bg-background z-10">
    <h1 class="text-xl font-semibold mb-6">Profile Background</h1>

    <form class="flex flex-col gap-4" @submit.prevent="lookup">
      <div class="flex flex-col gap-1.5">
        <Label for="profile-url">Steam Profile URL</Label>
        <div class="flex gap-2">
          <Input id="profile-url" v-model="input" placeholder="https://steamcommunity.com/id/yourname/"
            :disabled="loading" class="flex-1" />
          <Button type="submit" :disabled="loading">
            {{ loading ? '查詢中…' : '查詢' }}
          </Button>
        </div>
      </div>
    </form>
    <p v-if="error" class="text-destructive text-sm mt-4">{{ error }}</p>
  </div>
</template>
