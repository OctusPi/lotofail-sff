import { ref } from 'vue'

const bets = ref(localStorage.getItem('bets'))
const prizes = ref(localStorage.getItem('prizes'))

function setbets(betsValue) {
  localStorage.setItem('bets', JSON.stringify(betsValue))
  bets.value = betsValue
}

function setprizes(prizesValue) {
  localStorage.setItem('prizes', JSON.stringify(prizesValue))
  prizes.value = prizesValue
}

function getbets() {
  try {
    return JSON.parse(bets.value)
  } catch (e) {
    console.log('Fail parse string to JSON')
    return []
  }
}

function getprizes() {
  try {
    return JSON.parse(prizes.value)
  } catch (e) {
    console.log('Fail parse string to JSON')
    return { start: 0, end: 0 }
  }
}

function clear() {
  localStorage.removeItem('bets')
  localStorage.removeItem('prizes')
}

export default {
  bets: bets.value,
  prizes: prizes.value,
  setbets,
  getbets,
  setprizes,
  getprizes,
  clear
}
