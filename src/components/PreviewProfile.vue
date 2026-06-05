<script setup lang="ts">
interface Profile {
  background: string | null
  animatedBackground?: { webm: string; mp4: string }
}

const props = defineProps<{ profile: Profile }>()
</script>

<template>
  <div
    :class="$style.preview"
    :style="profile.background ? { backgroundImage: `url(${profile.background})` } : {}"
  >
    <div :class="$style.previewBg">
      <video
        v-if="profile.animatedBackground"
        :poster="profile.background"
        autoplay
        loop
        muted
        playsinline
        style="width: 1920px; height: 1080px"
      >
        <source :src="profile.animatedBackground.webm" type="video/webm" />
        <source :src="profile.animatedBackground.mp4" type="video/mp4" />
      </video>
      <img v-else-if="profile.background" :src="profile.background" :class="$style.bgImage" alt="" />
    </div>
    <div :class="$style.previewContainer">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 976 1170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 0h976v1165a5 5 0 01-5 5H5a5 5 0 01-5-5V0zm28 256a5 5 0 00-5 5v804a5 5 0 005 5h496a5 5 0 005-5V261a5 5 0 00-5-5H29zm510 5a5 5 0 015-5h90a5 5 0 015 5v804a5 5 0 01-5 5h-90a5 5 0 01-5-5V272zM29 30a5 5 0 00-5 5v154a5 5 0 005 5h154a5 5 0 005-5V35a5 5 0 00-5-5H29z"
          fill="#12151a"
          opacity="0.5"
        />
      </svg>
    </div>
  </div>
</template>

<style module>
.preview {
  position: relative;
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

.previewContainer {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: calc(976 / 1920 * 100%);
  margin: 0 auto;
}
</style>
