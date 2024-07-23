<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import Alerta from './components/Alerta.vue'
import Spinner from './components/Spinner.vue'


const monedas = ref([
  { codigo: 'USD', texto: 'Dolar de Estados Unidos'},
  { codigo: 'EUR', texto: 'Euro'},
  { codigo: 'GBP', texto: 'Libra Esterlina'},
  { codigo: 'ARS', texto: 'Peso Argentino'},
  { codigo: 'MXN', texto: 'Peso Mexicano'},
])

const criptomonedas = ref([])
const error = ref('')
const cotizacion = ref({})
const loading = ref(false)

const cotizar = reactive({
  moneda: '',
  criptomoneda: '',
})

onMounted(() => {
  const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD'
  fetch(url)
    .then(res => res.json())
    .then(({ Data }) => criptomonedas.value = Data)
})

const cotizarCripto = () => {
  if(Object.values(cotizar).includes('')) {
    error.value = 'Todos los campos son obligatorios'
    setTimeout(() => {
      error.value = ''
    }, 3000)
    return
  }
  
  obtenerCotizacion()
}

const obtenerCotizacion = async () => {
  const { moneda, criptomoneda } = cotizar
  loading.value = true
  cotizacion.value = {}

  try {
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda},&tsyms=${moneda}`
    const res = await fetch(url)
    const data = await res.json()
    cotizacion.value = data.DISPLAY[criptomoneda][moneda]

  } catch (error) {
    console.console.log(error)

  } finally {
    loading.value = false
  }
}

const MostrarResultado = computed(() => {
  return Object.values(cotizacion.value).length > 0
})

</script>

<template>
  <div class="contenedor">
    <h1 class="titulo">Cotizador de <span>Criptomonedas</span></h1>
    <div class="contenido">
      
      <Alerta v-if="error">
        <p>{{ error }}</p>
      </Alerta>

      <form 
        class="formulario"
        @submit.prevent="cotizarCripto" 
      >
        
        <div class="campo">
          <label for="moneda">Moneda</label>
          <select 
            id="moneda"
            v-model="cotizar.moneda"
          >
            <option value="">-- Seleccione --</option>
            <option 
              v-for="moneda in monedas" 
              :key="moneda.codigo" 
              :value="moneda.codigo"
            >{{ moneda.texto }}
            </option>
          </select>
        </div>
        
        <div class="campo">
          <label for="cripto">Criptomoneda</label>
          <select 
            id="cripto"
            v-model="cotizar.criptomoneda"
          >
            <option value="">-- Seleccione --</option>
            <option 
              v-for="criptomoneda in criptomonedas" 
              :key="criptomoneda.CoinInfo.Name" 
              :value="criptomoneda.CoinInfo.Name"
            >{{ criptomoneda.CoinInfo.FullName }}
            </option>
          </select>
        </div>
          <input type="submit" value="Cotizar" />
      </form>

      <Spinner v-if="loading" />

      <div
        v-if="MostrarResultado" 
        class="contenedor-resultado"
      >
        <h2>Cotización</h2>
        <div class="resultado">
          <img
            :src="`https://www.cryptocompare.com/${cotizacion.IMAGEURL}`" alt="imagen cripto"
          />
          <div>
            <p>El precio es de: <span>{{ cotizacion.PRICE }}</span></p>
            <p>El precio más alto del día: <span>{{ cotizacion.HIGHDAY }}</span></p>
            <p>El precio más bajo del día: <span>{{ cotizacion.LOWDAY }}</span></p>
            <p>Variación últimas 24 horas: <span>{{ cotizacion.CHANGEPCT24HOUR }}%</span></p>
            <p>Última actualización: <span>{{ cotizacion.LASTUPDATE }}</span></p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
