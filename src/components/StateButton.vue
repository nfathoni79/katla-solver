<script setup>
import { computed } from 'vue'
import cntl from 'cntl'
import twMergeX from '../utils/twMergeX'

const props = defineProps({
  state: Number,
})

const colorClasses = computed(() => {
  switch (props.state) {
    case 0:
      return cntl`bg-gray-300`
    case 1:
      return cntl`bg-yellow-300`
    case 2:
      return cntl`bg-green-300`
    default:
      return cntl`bg-transparent`
  }
})
</script>

<template>
  <button type="button"
    :class="twMergeX(['w-3 h-3 rounded-full', colorClasses],
    $attrs.class)"></button>
</template>