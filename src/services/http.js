import axios from 'axios'
import utils from '@/utils/utils'

async function request(opt, callback) {
  utils.load()

  await axios
    .request(opt)
    .then((response) => {
      callback(response)
    })
    .catch((error) => {
      console.log(error.message)
      callback(error.message)
    })
    .finally(() => {
      utils.load(false)
    })
}

function get(url, back = null) {
  const opt = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json'
    }
  }

  request(opt, back)
}

export default {
  request,
  get
}
