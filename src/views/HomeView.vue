<script setup>
import { ref } from 'vue'
import store from '@/stores/local'
import http from '@/services/http'

const url = 'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil/'
const game = ref({
  alert: { view: false, txt: '' },
  dozens: [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25'
  ],
  bets: store.getbets() ?? [],
  tmp_bet: [],
  prizes: store.getprizes() ?? { start: 0, end: 0 },
  prizes_interval: 0,
  s_prize: null,
  bet_winner: null
})

function addBet() {
  if (!game.value.tmp_bet.length) {
    game.value.alert = { view: true, txt: 'Nenhuma dezena selecionada...' }
    return
  }

  game.value.bets.push([...game.value.tmp_bet])
  store.setbets(game.value.bets)
}

function removeBet(index) {
  game.value.bets = game.value.bets.filter((o, i) => i !== index)
  store.setbets(game.value.bets)
}

function addPrizes() {
  store.setprizes(game.value.prizes)
  game.value.prizes_interval = parseInt(game.value.prizes.end) - parseInt(game.value.prizes.start)
}

function getResult() {
  http.get(url + game.value.s_prize, (resp) => {
    game.value.bet_winner = resp
    if (resp.status === 200) {
      game.value.bet_winner = resp.data.listaDezenas
    } else {
      game.value.bet_winner = null
      game.value.alert = {
        view: true,
        txt: 'Resultado Indisponivel, tente novamente mais tarde...'
      }
    }
  })
}

function checkWinner(bet) {
  if (game.value.bet_winner) {
    let r = 0
    bet.forEach((e) => {
      if (game.value.bet_winner.includes(e)) {
        r++
      }
    })

    return `Total Acertos: ${r}`
  }
}
</script>

<template>
  <!-- Modal Add Game -->
  <div
    class="modal fade"
    id="addGame"
    tabindex="-1"
    aria-labelledby="addGameLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header border-0">
          <h1 class="modal-title" id="addGameLabel">Adicionar Jogo</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col m-2" v-for="d in game.dozens" :key="d">
              <input
                type="checkbox"
                class="btn-check"
                :id="`btn-check${d}`"
                :value="d"
                autocomplete="off"
                v-model="game.tmp_bet"
              />
              <label class="btn btn-sm btn-outline-success btn-dozen" :for="`btn-check${d}`">{{
                d
              }}</label>
            </div>
          </div>
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            <i class="bi bi-door-open"></i>
            Cancelar
          </button>
          <button
            @click="addBet"
            type="button"
            class="btn btn-outline-success"
            data-bs-dismiss="modal"
          >
            <i class="bi bi-plus-circle"></i>
            Adicionar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Cry View -->
  <div
    class="modal fade"
    id="cryView"
    tabindex="-1"
    aria-labelledby="cryViewLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-2">
        <div class="modal-header border-0">
          <h1 class="modal-title" id="cryViewLabel">Adicionar Sorterios</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row mb-3 g-3">
            <div class="col-sm-12 col-md-6">
              <label for="p_start" class="form-label">Sorteio Inicial</label>
              <input
                type="text"
                name="p_start"
                class="form-control"
                id="p_start"
                placeholder="000"
                v-model="game.prizes.start"
              />
            </div>
            <div class="col-sm-12 col-md-6">
              <label for="p_end" class="form-label">Sorteio Final</label>
              <input
                type="text"
                name="p_end"
                class="form-control"
                id="p_end"
                placeholder="0000"
                v-model="game.prizes.end"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            <i class="bi bi-door-open"></i>
            Cancelar
          </button>
          <button
            @click="addPrizes"
            type="button"
            class="btn btn-outline-success"
            data-bs-dismiss="modal"
          >
            <i class="bi bi-plus-circle"></i>
            Adicionar
          </button>
        </div>
      </div>
    </div>
  </div>

  <main class="main-view">
    <nav class="navbar">
      <div class="container px-0 justify-content-end">
        <button
          @click="game.tmp_bet = []"
          class="btn btn-outline-success me-2"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#addGame"
        >
          <i class="bi bi-bounding-box"></i>
          Adicionar Jogo
        </button>
        <button
          class="btn btn-outline-success"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#cryView"
        >
          <i class="bi bi-receipt"></i>
          Adicionar Sorteios
        </button>
      </div>
    </nav>

    <section class="box container my-4 p-4">
      <div class="box-title">
        <h1 class="m-0 p-0">Meus Jogos LotoFacil</h1>
        <p class="m-0 p-0 small">Adicione seus jogos para verificar o resultado</p>
      </div>
      <div class="box-games my-4">
        <div v-if="game.bets.length">
          <div class="form-winner mb-2 p-2">
            <label class="form-label d-block">Selecione o Sorteio</label>
            <div class="input-group mb-3">
              <select
                class="form-control"
                aria-label="Recipient's username"
                aria-describedby="button-addon2"
                v-model="game.s_prize"
              >
                <option :value="parseInt(game.prizes.start)">
                  {{ parseInt(game.prizes.start) }}
                </option>
                <option
                  v-for="i in game.prizes_interval"
                  :key="i"
                  :value="parseInt(game.prizes.start) + i"
                >
                  {{ parseInt(game.prizes.start) + i }}
                </option>
              </select>

              <button
                @click="getResult"
                class="btn btn-outline-success"
                type="button"
                id="button-addon2"
              >
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>

          <p>{{ game.bet_winner }}</p>

          <div class="row">
            <div v-for="(bet, i) in game.bets" :key="i" class="col-md-6 col-lg-3">
              <div class="bet-tab d-flex flex-wrap m-2">
                <div class="m-1" v-for="b in bet" :key="b">
                  <span class="bet-cell">{{ b }}</span>
                </div>
              </div>
              <div class="d-flex justify-content-between px-2">
                <div>{{ checkWinner(bet) }}</div>
                <i class="bi bi-trash text-danger i-point" @click="removeBet(i)"></i>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center">
          <i class="bi bi-boxes fs-5"></i>
          <p class="small">Nenhum jogo adicionado...</p>
        </div>
      </div>
    </section>
  </main>

  <!-- Notifys -->
  <div v-if="game.alert.view" class="alert alert-warning p-4 rounded-4" role="alert">
    <div class="alert-heading d-flex justify-content-between align-items-center">
      <h4 class="p-0 m-0 small"><i class="me-1 bi bi-exclamation-circle"></i> Alerta</h4>
      <button class="btn" type="button" aria-label="Close" @click="game.alert.view = false">
        <i class="bi bi-x-circle"></i>
      </button>
    </div>
    <p class="small p-0 m-0">{{ game.alert.txt }}</p>
  </div>
</template>

<style scoped>
.main-view {
  width: 100%;
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.box {
  border: 2px solid #009973;
  border-radius: 10px;
}

.box-title {
  text-align: center;
}
.box-title h1 {
  font-size: 1.3rem;
  color: #009973;
}

.modal-content {
  background-color: var(--color-background);
}

.modal-title {
  font-size: 1rem;
  color: #009973;
}

.btn-dozen {
  width: 35px !important;
}

.bet-tab {
  border: 2px solid #009973;
  border-radius: 10px;
}

.bet-cell {
  width: 30px;
  padding: 3px 0;
  display: inline-block;
  border: 2px solid #009973;
  border-radius: 50%;
  font-size: 0.8rem;
  text-align: center;
}

.i-point {
  cursor: pointer;
}
</style>
