import { ref, onMounted, computed } from 'vue'
 
export default function useCripto() {

    const criptomonedas = ref([])

    const monedas = ref([
        { codigo: 'USD', texto: 'Dolar de Estados Unidos'},
        { codigo: 'EUR', texto: 'Euro'},
        { codigo: 'GBP', texto: 'Libra Esterlina'},
        { codigo: 'ARS', texto: 'Peso Argentino'},
        { codigo: 'MXN', texto: 'Peso Mexicano'},
      ])
      const cotizacion = ref({})
      const loading = ref(false)
      const error = ref('')

      onMounted(() => {
        const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD'
        fetch(url)
          .then(res => res.json())
          .then(({ Data }) => criptomonedas.value = Data)
      })

      const obtenerCotizacion = async (cotizar) => {
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

      const mostrarResultado = computed(() => {
        return Object.values(cotizacion.value).length > 0
      })

      return {
        monedas,
        criptomonedas,
        loading,
        cotizacion,
        obtenerCotizacion,
        mostrarResultado,
    }
}