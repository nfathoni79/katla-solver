<script setup>
import { ref, onMounted } from 'vue'
import cntl from 'cntl'

import AButton from './components/AButton.vue'
import StateButton from './components/StateButton.vue'

import wordlist from './data/wordlist'

const filteredWords = ref([])

const wordRules = ref([
  { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 },
  { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 },
  { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 },
  { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 },
  { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 },
])

const charCount = ref(0)
const mobileWord = ref('')

const getCharState = (index) => {
  return (wordRules.value[index].char !== '')
    ? wordRules.value[index].state
    : -1
}

const changeCharState = (index) => {
  wordRules.value[index].state = (wordRules.value[index].state + 1) % 3
}

const getSquareColorClasses = (index) => {
  if (wordRules.value[index].char !== '') {
    switch (wordRules.value[index].state) {
      case 0:
        return cntl`bg-gray-600`
      case 1:
        return cntl`bg-yellow-600`
      case 2:
        return cntl`bg-green-600`
      default:
        return cntl`bg-transparent`
    }
  }

  return cntl`bg-transparent`
}

const filterWords = () => {
  let filtered = wordlist.filter(word => {
    let check = true  // all rules
    let checkNo = true  // not included characters
    let checkNoPos = true  // wrong position characters

    for (const [index, square] of wordRules.value.entries()) {
      if (square.char !== '') {
        switch (square.state) {
          case 0:
            checkNo &&= !word.includes(square.char)
            check &&= checkNo
            break
          case 1:
            check &&= word.includes(square.char)

            checkNoPos &&= word.charAt(index % 5) !== square.char
            check &&= checkNoPos
            break
          case 2:
            check &&= word.charAt(index % 5) === square.char
            break;
          default:
            break
        }
      }
    }

    if (charCount.value < 5) {
      return word.includes('a')
        && word.includes('i')
        && word.includes('u')
    }

    return check
  })

  filteredWords.value = filtered
}

const setWordRules = () => {
  for (let i = 0; i < mobileWord.value.length; i++) {
    wordRules.value[i + charCount.value].char =
      mobileWord.value.charAt(i).toLowerCase()
  }

  charCount.value += mobileWord.value.length
  mobileWord.value = ''
}

const clearWordRules = () => {
  wordRules.value = [
    { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 },
    { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 },
    { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 },
    { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 },
    { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 }, { char: '', state: 0 },
  ]

  charCount.value = 0
  filterWords()
}

const isMobile = () => {
  return navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/iPhone/i)
}

onMounted(() => {
  const inputs = document.querySelectorAll('input.word-char')

  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('keydown', event => {
      if (event.key === 'Enter') return
      
      event.preventDefault()

      if (event.key === 'Backspace') {
        if (inputs[i].value === '') {
          if (i !== 0) {
            inputs[i - 1].focus()
            inputs[i - 1].value = ''
            wordRules.value[i - 1].char = ''
            charCount.value--
          }
        } else {
          inputs[i].value = ''
          wordRules.value[i].char = ''
        }
      } else if (event.keyCode >= 65 && event.keyCode <= 90) {
        inputs[i].value = event.key
        wordRules.value[i].char = event.key

        if (i !== inputs.length - 1) {
          inputs[i + 1].focus()
          charCount.value++
        }
      }
    })
  }

  filterWords()
})
</script>

<template>
  <div class="mx-auto max-w-md lg:max-w-4xl p-4">
    <div class="flex items-center justify-center gap-2">
      <img src="/logo.png" alt="Logo" class="w-12 h-auto">
      <h1 class="text-3xl font-bold text-gray-900">Katla Solver</h1>
    </div>

    <div class="mt-4 flex items-stretch lg:items-start
      flex-col lg:flex-row gap-4">
      <div>
        <form v-if="isMobile()" @submit.prevent="setWordRules()" class="mb-4">
          <label for="word-mobile">You're using mobile browser, enter each word below:</label>
          <input id="word-mobile" type="text" v-model="mobileWord"
            class="w-full rounded-md
            uppercase text-lg text-center font-bold">
        </form>

        <form @submit.prevent="filterWords()">
          <div class="grid grid-cols-5 gap-2 max-w-md">
            <div v-for="n in 25" :key="n" class="relative mx-auto">
              <input :id="`char-${n}`" v-model="wordRules[n - 1].char"
                type="text" maxlength="1" :disabled="isMobile()"
                :class="['word-char w-full rounded-md',
                'uppercase text-lg text-center font-bold text-white',
                getSquareColorClasses(n - 1)]">
              
              <StateButton :state="getCharState(n - 1)"
                @click="changeCharState(n - 1)"
                class="absolute top-1 right-1" />
            </div>
          </div>

          <div class="mt-4 flex">
            <AButton type="button" color="red"
              @click="clearWordRules()"
              class="w-full">
              Clear
            </AButton>

            <AButton type="submit" color="green"
              class="ml-2 w-full">
              Find
            </AButton>
          </div>
        </form>
      </div>

      <div class="grid grid-cols-5 gap-1 grow">
        <div v-for="word in filteredWords" :key="word"
          class="uppercase text-center text-gray-900">
          {{ word }}
        </div>
      </div>
    </div>
  </div>
</template>