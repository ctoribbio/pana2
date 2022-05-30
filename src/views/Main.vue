<template>
  <div class="hello">
    <h1>Proximo Paso</h1>
    <a href="/map">Ver el Mapa</a>
    <a href="/new">Registra tu empresa</a>
    <a href="/login">Cerrar sesion</a>
  </div>
</template>

<script>
export default {
  name: 'Home',
  created(){
      
      if(localStorage.getItem("token") == undefined) {
          location.replace("/login")
      }
  },
  props: {
    msg: String
  }
}
</script>