<script setup>
import { ref, onMounted } from "vue"


const monedas = ref([
  { codigo: 'USD', texto: 'Dolar de Estados Unidos'},
  { codigo: 'EUR', texto: 'Euro'},
  { codigo: 'GBP', texto: 'Libra Esterlina'},
  { codigo: 'ARS', texto: 'Peso Argentino'},
  { codigo: 'MXN', texto: 'Peso Mexicano'},
])

const criptomonedas = ref([])

onMounted(() => {
  const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD'
  fetch(url)
    .then(res => res.json())
    .then(({ Data }) => criptomonedas.value = Data)
})

</script>

<template>
  <div class="contenedor">
    <h1 class="titulo">Cotizador de <span>Criptomonedas</span></h1>
    <div class="contenido">
      <form class="formulario">
        
        <div class="campo">
          <label for="moneda">Moneda</label>
          <select id="moneda">
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
          <select id="cripto">
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
    </div>
  </div>
</template>
