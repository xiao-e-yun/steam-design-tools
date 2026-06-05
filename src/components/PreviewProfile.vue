<script setup lang="ts">
import type {Rect} from '@/utils';
import type {Profile} from '@/utils/profile';
import {Showcase} from '@/utils/showcase';
import {computedAsync} from '@vueuse/core';
import {computed, onUnmounted, ref} from 'vue'

const props = withDefaults(defineProps<{
  profile: Profile,
  showcase?: Showcase,
}>(), {
  showcase: () => Showcase.create(),
})
const backgroundStyle = computed(() => {
  const bg = props.profile.background ||
    "https://shared.fastly.steamstatic.com/community_assets/images/items/2640280/217bf7da4b58119d7298612c8350b93ca4e5b8c1.jpg"
  return {backgroundImage: `url(${bg})`}
})

const containerPath = `
M0 0 h976 v1165 a5 5 0 01-5 5 H5 a5 5 0 01-5-5 V0 z
M29 30 a5 5 0 00-5 5 v154 a5 5 0 005 5 h154 a5 5 0 005-5 V35 a5 5 0 00-5-5 H29 z
`.trim()

const height = computedAsync(async () => Showcase.readHeight(props.showcase), 600)
const regions = computed(() => Showcase.regions(props.showcase, height.value))
const clipPath = computed(() => {
  const ox = showcaseRegion.value.x - 472
  const oy = showcaseRegion.value.y
  return regions.value.map(({x, y, w, h}) =>
    `M${ox + x + 5} ${oy + y} h${w - 10} a5 5 0 0 1 5 5 v${h - 10} a5 5 0 0 1 -5 5 h${10 - w} a5 5 0 0 1 -5 -5 v${10 - h} a5 5 0 0 1 5 -5 z`
  ).join(" ")
})

let index = ref(0);
let interval = NaN;
const images = computed<string[]>(prev => {
  index.value = 0
  clearInterval(interval)
  if (props.showcase.images.length > 1)
    interval = setInterval(() => index.value = (index.value + 1) % props.showcase.images.length, 1000 / 20)

  if (prev) prev.map(URL.revokeObjectURL)
  return props.showcase.images.map(file => URL.createObjectURL(file)) ?? []
})
onUnmounted(() => images.value.map(URL.revokeObjectURL))

const showcase = computed(() => images.value[index.value])
const showcaseRegion = computed<Rect>(() => Showcase.backgroundRegion(props.showcase, height.value))
</script>

<template>
  <div :class="$style.preview" :style="backgroundStyle">
    <div :class="$style.previewBg">
      <video v-if="profile.animatedBackground" :poster="profile.background ?? undefined" autoplay loop muted playsinline
        style="width: 1920px; height: 1080px">
        <source :src="profile.animatedBackground.webm" type="video/webm" />
        <source :src="profile.animatedBackground.mp4" type="video/mp4" />
      </video>
      <img v-else-if="profile.background" :src="profile.background" :class="$style.bgImage" alt="" />
    </div>
    <div :class="$style.previewContainer">
      <svg width="100%" height="100%" viewBox="0 0 976 1170" fill="none" xmlns="http://www.w3.org/2000/svg">
        <clipPath v-if="showcase" id="clip">
          <path fill-rule="evenodd" clip-rule="evenodd" :d="clipPath" fill="white" />
        </clipPath>

        <image v-if="showcase" :href="showcase" :x="showcaseRegion.x - 472" :y="showcaseRegion.y"
          :width="showcaseRegion.w" :height="showcaseRegion.h" preserveAspectRatio="xMidYMid slice"
          clip-path="url(#clip)" />

        <path fill-rule="evenodd" clip-rule="evenodd" :d="`${containerPath} ${clipPath}`" fill="#12151a"
          opacity="0.5" />
      </svg>
    </div>
  </div>
</template>

<style module>
.preview {
  width: 100%;
  aspect-ratio: 1920 / 1080;
  overflow: hidden;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 0;
}

.previewBg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.bgImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.artworkImage {
  position: absolute;
  z-index: 1;
  object-fit: cover;
  object-position: top left;
}

.previewContainer {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: calc(976 / 1920 * 100%);
  margin: 0 auto;
}
</style>
