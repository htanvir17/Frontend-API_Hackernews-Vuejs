# IMPLEMENTACION DE APP WEB RESPONSIVE    
- Requisitos: es necesario conocer JS ya que VUE es un framework de este, y para poder usar este framework hay que saber el patron view-model (VueJS coge lo mejor de React y Angular)
- No es necesario hacer ninguna instalacion, tenemos dos opciones para trabajr con Vue:
   - con CDN ⇒ hay que usar la ruta que proporciona Vue (no es recomendable su uso para proyectos, sino para ejemplos)
   - con CLI
- instalar la extension "vetur" de VS en el navegador

## Configuracion  
- tenemos la herramienta de scaffolding por línea de comandos de Vue que es: vue-cli <br>
Vue.js provee una CLI oficial para estructurar rápidamente Aplicaciones de una Sola Página (SPA), provee configuraciones todo-en-uno para un flujo de trabajo frontend moderno:
   
- antes hay que tener instalado npm y node (este tiene que ser la ultima version sino fallara en la instalacion de vue)
   - si el proyecto ya existo o he colonado, basta con hacer <br>
      ```js
      npm install 
      npm run serve
      ```
   - sino
      ```js
      sudo npm install -g @vue/cli #instala framework vue
      vue create my-project #CLI nos crea la estructura del proyecto
      cd my-project
      npm run serve
      vue ui #si queremos acceder al panel de control del proyecto 
      ```


# RESUMEN   
El codigo esta en la carpeta src

`main.js` ⇒ es la configuracion base donde se crea el programa con la instancia de Vue y donde va a montarse; en lugar de una instancia de Vue podria tener 2 o mas, pero entre ellas no se pueden comunicar ya que cada uno tendra un punto de montaje diferente ⇒ por eso de alli tenemos el concepto de Componentes, que estan dentro de la instancia y entre ellos pueden comunicarse de diferentes formas

`archivo.vue` sigue una estructura, engloba los conceptos de template (HTML), script (JS) y style (CSS) <br>
`App.vue` ⇒ es el primer componente (template | script | style) o componente superior que va existie en nuestra app y sobre el vamos a ir incorporando mas componentes 

podemos agregar eventos en los tag de la siguiente manera:
   ```html
   <form @submit="addToCart">...</form>
   <input @keyp.enter="send">
  ```
**Style binding**
```html
<div :style="{ backgroundColor: my_prop.my_color }"> </div> #la propiedad css se ha usado como camelCase
<h1 style="{ 'font-size': 13px}"> #la propieda de css se ha usuado como kebab-case
```

Propiedad props: para pasar datos entre componentes

En `main.js` ⇒ **router.beforeEach()** se ejecuta cada vez que nos cambiamos de url

`authMixin.js` ⇒ genera un token al iniciar la sesion con google y lo guarda en el **localStorage**

vue-router es la libreria de enrutamiento <br>
```html
   <router-link v-bind:to="'/newest'">News</router-link>   o   <router-link to="/path">News</router-link>  ⇒ crea un link hacia la ruta con nombre path  
   el componente router-link funciona igual que <a> en que que "href" seria igual a "to" (hacia donde tiene que ir)
   aqui el path /newest es reconocido porque las rutas estan incorporadas en la instancia de Vue
   si no queremos usar este directriz, por ejemplo, podemos usar lo siguiente ⇒ <a :href="'/item?id=' + contribution_list[index - 1].id_contribution"> </a>
```

Los "mixins" son una forma flexible de distribuir funcionalidades reutilizables para componentes de Vue. <br>
&nbsp; &nbsp; Un objeto mixin puede contener cualquier opción de componente. Cuando un componente usa un mixin, todas las opciones en el mixins se “mezclan” en las propias opciones del componente.

`apitools.js` ⇒ genera la Api key para el usuario

```html
<li v-for="(fruit, index) in fruits"> ⇒ dentro del for se admite un segundo params opcional que indica el indice del elemento actual (empezando desde 0)
   tambien es equivalente <li v-for="fruit in fruits" :key="fruit"></li> 
```

`Axios`: es una libreria o es un cliente HTTP basado en Promesas para Javascript, el cual puede ser utilizado tanto en tu aplicación Front-end, como en el Back-end con Nodejs.
```js
   Utilizando axios, es muy sencillo enviar peticiones a endpoints REST y realizar operaciones CRUD.

   por ejemplo, la sintaxis de axios para hacer una peticion de post en la url de api
   axios({
      method: 'post',
      url: 'https://hackers-asw.herokuapp.com/api/contributions/' + idcontrib + '/votes',
      headers: {
         Authorization: apitools.getApikey(),
   }).then(response => {...
                       }).catch((error) => {..
                                           })
```

La funcion `async` define una función asíncrona, esta puede contener una expresión `await`, la cual pausa la ejecución de la función asíncrona y espera la resolución de la Promise pasada y, a continuación, reanuda la ejecución de la función async y devuelve el valor resuelto.

Un ejemplo de la directriz v-model
   ```html
   <input type="textarea" v-model="form.texto"> ⇒ si hay un cambio en esta entrada del formulario (Estado) entonces el valor del campo form.text tambien tiene que actualizarse 
   ```

`Vuex`es un plugin que ofrece un almacén de datos centralizado para usar dentro de la aplicación