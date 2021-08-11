# Guía para ejecutar localmente la aplicación móvil Su Salud.

## Descripción del proyecto.
La presente aplicación forma parte de una asignación universitaria. Dicha apliación está destinada a una empresa que ofrezca servicios médicos.  
La aplicación cuenta con un sistema sencillo de roles, donde existe el rol de paciente y el rol de doctor. En cuanto al paciente, puede registrarse, iniciar sesión, agendar una cita, ver sus citas agendadas, y cancelar una cita. Por otra parte, un médico puede registrarse, agendar citas a terceras personas, ver citas de los pacientes, administrar citas (cancelarlas o marcarlas como completadas), agregar servicios médicos (medicina general, laboratorio, cardiología, etc.), y modificar roles de usuarios (cambiar un doctor a paciente o viceversa).  

## Requisitos
 * Tener instalado [NodeJS](https://nodejs.org/en/download/).
 * Tener instalado [Ionic](https://ionicframework.com/docs/intro/cli).
 * Tener Android Studio construir la aplicación para Android o Xcode para iOS.
 * Opcional: Tener [ngrok](https://dashboard.ngrok.com/get-started/setup) para redirigir la dirección de la API y poder ejecutar la aplicación adecuadamente en el emulador.  De no contar con ello, se podrá ejecutar en el navegador.

## Pasos para ejecutar el proyecto
 1. Clonar el proyecto.
 2. En el directorio del proyecto, ejecutar el comando `npm install`.
 3. Ejecutar la [API](https://github.com/alvifa604/appointments-app-u/blob/master/README.md).
    * Nota: Si no se ejecuta la API no se podrá explorar por completo la aplicación.
 4. Crear los roles de 'paciente' y 'doctor' directamente en la base de datos.
    * Nota: Esto es necesario para el funcionamiento de la aplicación, ya que cuando se crea un usuario, se le asigna el rol de paciente automáticamente. 
 5. Opcional: Ejecutar ngrok.
    * Redirigir el tráfico a localhost:5001 ejecutando el comando `./ngrok http https://localhost:5001`.
    * Copiar la URL generada (Ej: https://jjhbj23423sdj.ngrok.io) y utilizarla para realizar las peticiones.
 6. Copiar la dirección local de la API (ya sea la-generada-con-ngrok/api o localhost:5001/api) en el archivo environment.ts, en la propiedad apiURL.
 7. Ejecutar la aplicación.
    * Opción 1:
      1. Ejecutar el comando `ionic serve`.
      2. Abrir la aplicación en el navegador (localhost:8100 es la dirección por defecto).
      3. Explorar la aplicación en el navegador.
    * Opción 2:
      1. Ejecutar el comando `ionic build`.
      2. Ejecutar el comando `ionic capacitor run android -l --external`. Compilará la versión de Android y abrirá el emulador. con la aplicación corriendo. De igual manera se podrá ver la aplicación en el navegador.  Se recomienda utilizar esta opción.
      3. Explorar la aplicación en el emulador de Android.
    * Opción 3:
      1. Ejecutar el comando `ionic build`.
      2. Ejecutar el comando `ionic capacitor run ios --livereload --external`. Compilará la versión de iOS y abrirá el emulador con la aplicación corriendo. De igual manera se podrá ver la aplicación en el navegador.
      3. Explorar la aplicación en el emulador de Xcode.  
      
Notas: 
* Para poder explorar por completo la aplicación, se le debe asignar a un usuario el rol de 'doctor' directamente en la base de datos.
* Para ejecutar la aplicación con las opciones 2 o 3, se necesita ngrok para que funcione adecuadamente, y las herramientas pertinentes (Android Studio para Android y Xcode para iOS).
