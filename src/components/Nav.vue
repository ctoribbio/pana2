<template>
  <nav class="navbar">
    <div class="alleft">
      <ul class="inline list">
        <li class="navItem"><a class="navLink" href="/map">Ver el Mapa</a></li>
        <li class="navItem"><a class="navLink" href="/new">Añade tu empresa</a></li>
      </ul>
    </div>
    <div class="alright dropdown">
      <i class="perfil material-symbols-outlined"> person </i>
    <div class="dropdown-content">
            <a href="/profile">Tu Perfil</a>
            <a href="/">Cerrar Sesion</a>
    </div>
    </div>
  </nav>
</template>

<script>
import NAVBAR from "../assets/styles/navbar.css"
  export default{
    name : "Nav",
    mounted(){
       var tag = document.createElement("link");
    tag.setAttribute("rel", "stylesheet");
    tag.setAttribute(
      "href",
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,300,1,0"
    );
    document.head.appendChild(tag);

     tag = document.createElement("link");
    tag.setAttribute("rel", "stylesheet");
    tag.setAttribute(
      "href",
      NAVBAR
    );
    document.head.appendChild(tag);
    }
  }
</script>