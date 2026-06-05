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
    if (!res.ok) {error.value = data.error ?? 'Unknown error'; return }
    profile.value = data
  } catch (e) {
    error.value = (e instanceof Error) ? e.message : 'Unknown error'
  }
  loading.value = false
}
</script>

<template>
  <PreviewProfile :profile="profile" class="sticky top-0" />
  <div class="w-full p-8 flex flex-col gap-6 bg-background z-10">
    <h1 class="text-xl font-semibold mb-6">Profile Background</h1>

    <form class="flex flex-col gap-4" @submit.prevent="lookup">
      <div class="flex flex-col gap-1.5">
        <Label for="profile-url" class="justify-between">
          Steam Profile URL
          <p v-if="error" class="text-destructive text-xs">
            {{ error }}
          </p>
        </Label>
        <div class="flex gap-2">
          <Input id="profile-url" v-model="input" placeholder="https://steamcommunity.com/id/yourname/"
            :disabled="loading" class="flex-1" />
          <Button type="submit" :disabled="loading"> Lookup </Button>
        </div>
      </div>
    </form>
    <h1>Results</h1>
    <div class="flex flex-col gap-2">
      <Label> Background Url </Label>
      <Input label="Background URL" :value="profile.background" placeholder="Background URL" readonly />
      <Label> Animated Background </Label>
      <Input label="Mp4 Background URL" :value="profile.animatedBackground?.mp4" placeholder="Mp4 Background URL" readonly />
      <Input label="Webm Background URL" :value="profile.animatedBackground?.webm" placeholder="Webm Background URL" readonly />
    </div>
  </div>
</template>
