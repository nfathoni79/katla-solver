<script setup>
import { computed } from 'vue'
import cntl from 'cntl'
import twMergeX from '../utils/twMergeX'

const props = defineProps({
  color: String,
})

const colorClasses = computed(() => {
  switch (props.color) {
    case 'blue':
      return cntl`
        bg-blue-600 hover:bg-blue-700
        text-blue-50 focus:ring-blue-300
      `
    case 'red':
      return cntl`
        bg-red-600 hover:bg-red-700
        text-red-50 focus:ring-red-300
      `
    case 'green':
      return cntl`
        bg-green-600 hover:bg-green-700
        text-green-50 focus:ring-green-300
      `
    default:
      return cntl`
      bg-blue-600 hover:bg-blue-700
        text-blue-50 focus:ring-blue-300
      `
  }
})
</script>

<template>
  <button
    :class="twMergeX(['inline-flex items-center justify-center',
    'rounded-md shadow-md px-2 py-2 font-semibold',
    'focus:outline-none focus:ring-2', colorClasses], $attrs.class)">
    <slot></slot>
  </button>
</template>