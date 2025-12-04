function registrarUsuario(){
//crear variable: nombre, apellido, correo, clave,confirmacion de clave,
let nombre=document.getElementById("nombres").value;
let apellido=document.getElementById("apellidos").value;
let correo=document.getElementById("correo").value;
let clave=document.getElementById("clave").value;
let confirmacionClave = document.getElementById("confirmarClave").value;
let fechaNacimiento = document.getElementById("fechaNacimiento").value;
//validar que los campos no esten vacios
if(nombre=="" || apellido=="" || correo==""||clave==""||confirmacionClave==""||fechaNacimiento==""){
    alert("Por favor complete todos los campos");
    return;
}
if(clave!=confirmacionClave){
    alert("Las contraseñas no coinciden");
    document.getElementById("clave").style.border="1px solid red";
    document.getElementById("confirmarClave").style.border="1px solid red";
    return;
}
// Validar mínima longitud de contraseña
if (clave.length < 8) {
    alert("La clave debe tener mínimo 8 caracteres. 🔐");
    document.getElementById('clave').style.borderColor = 'red';
    return;
}

// Validar que el usuario no este registrado
if (localStorage.getItem('usuario_' + correo)) {
    alert('El correo ya está registrado');
    return;
}

// se crea el objeto para guardarlo en localstorage
let usuario = {
    nombres: nombre,
    apellidos: apellido,
    correo: correo,
    clave: clave,
    fechaNacimiento: fechaNacimiento,
};

//Guardar los datos en localstorage
localStorage.setItem('usuario_' + correo, JSON.stringify(usuario));
alert('Registro exitoso');
window.location.href = 'index.html';
}

function iniciarSesion(){
    let correo=document.getElementById("correo").value;
    let clave=document.getElementById("clave").value;   
    let datos=localStorage.getItem('usuario_' + correo);
    if(!datos){
        alert("Usuario no encontrado");
        return;
    }

    let usuario=JSON.parse(datos);
    if(usuario.clave!=clave){
        alert("Clave incorrecta");
        return;
    }

localStorage.setItem("usuarioActivo", correo);
window.location.href="inicio.html";


}

function mostrarBienvenida() {
    let correoActivo = localStorage.getItem('usuarioActivo');
    if (!correoActivo) { // Si no hay usuario activo, redirigir a la página de inicio de sesión
        window.location.href = 'index.html';
        return;
    }
    const raw = localStorage.getItem('usuario_' + correoActivo);
    // Obtener los datos del usuario activo
    if (!raw) {
      window.location.href = 'index.html';
      return;
    }

    let datos = JSON.parse(raw);

    document.getElementById('mensajeBienvenida').innerHTML = ` <i class="fas fa-user-circle"></i> ¡Bienvenido/a, <a href="perfil.html">${datos.nombres}</a>!`;

    mostrarTareas(); // Mostrar tareas al cargar
}

function cerrarSesion() {
    localStorage.removeItem('usuarioActivo'); // Eliminar el usuario activo del almacenamiento local
    const confirmar = confirm("¿Deseas salir del sitio?");

    if (confirmar) {
        alert("Gracias por visitar la página. ¡Hasta pronto!");

        setTimeout(() => {
            window.location.href = "https://www.google.com";
        }, 500);

    } else {
        alert(" Qué bueno que decidiste quedarte.");
    }
}

function guardarTarea(event) {
  event.preventDefault(); // Evitar recarga de página
  
  let tarea = document.getElementById('nuevaTarea').value.trim();

  if (!tarea) {
    alert('Por favor, ingresa una tarea válida');
    return;
  }

  let correoActivo = localStorage.getItem('usuarioActivo');
  let listaTareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];

  listaTareas.push(tarea);
  localStorage.setItem('tareas_' + correoActivo, JSON.stringify(listaTareas));
  
  document.getElementById('nuevaTarea').value = '';
  mostrarTareas();
}

function mostrarTareas() {
  let correoActivo = localStorage.getItem('usuarioActivo');
  let tareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];

  let lista = document.getElementById('listaTareas');
  lista.innerHTML = '';

  if (tareas.length === 0) {
    lista.innerHTML = `
      <div class="lista-vacia">
        <i class="fas fa-inbox"></i>
        <p>No tienes tareas aún. ¡Crea una para comenzar!</p>
      </div>
    `;
    return;
  }

  tareas.forEach((tarea, indice) => {
    lista.innerHTML += `
      <div class="tarea-item">
        <div class="tarea-texto">
          ${tarea}
        </div>
        <div class="tarea-acciones">
          <button class="btn-accion btn-editar" onclick="irAEditar(${indice})">
            <i class="fas fa-edit"></i> Editar
          </button>
          <button class="btn-accion btn-eliminar" onclick="eliminarTarea(${indice})">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
    `;
  });
}

function eliminarTarea(indice) {
let confirmacion = confirm('¿Estás seguro de que deseas eliminar esta tarea?');

  if (confirmacion) { // Si el usuario confirma la eliminación
    let correoActivo = localStorage.getItem('usuarioActivo');
    let tareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];

    tareas.splice(indice, 1); // Eliminar la tarea del array
    localStorage.setItem('tareas_' + correoActivo, JSON.stringify(tareas));
    // stringify convierte el array de tareas en una cadena JSON y lo guarda en el almacenamiento local
    alert('Tarea eliminada correctamente');
    mostrarTareas();
}
}

function irAEditar(indice) {
  let correoActivo = localStorage.getItem('usuarioActivo');
  let tareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];

  let tarea = tareas[indice];
  document.getElementById('tareaEditada').value = tarea;
  indiceTareaEditando = indice;

  document.getElementById('editarModal').classList.add('show');
  document.getElementById('editarModal').style.display = 'flex';
}

function guardarEdicion() {
  if (indiceTareaEditando === null) return;

  let nuevaTarea = document.getElementById('tareaEditada').value.trim();
  if (!nuevaTarea) {
    alert('La tarea no puede estar vacía');
    return;
  }

  let correoActivo = localStorage.getItem('usuarioActivo');
  let tareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];

  tareas[indiceTareaEditando] = nuevaTarea;
  localStorage.setItem('tareas_' + correoActivo, JSON.stringify(tareas));

  cerrarModal();
  mostrarTareas();
}

function cerrarModal() {
  document.getElementById('editarModal').classList.remove('show');
  document.getElementById('editarModal').style.display = 'none';
  indiceTareaEditando = null;
}

let indiceTareaEditando = null;

// Cerrar modal al hacer clic en la X o fuera del contenido
document.addEventListener('DOMContentLoaded', function() {
  // Cerrar modal al hacer clic fuera del contenido
  window.addEventListener('click', function(event) {
    let modal = document.getElementById('editarModal');
    if (event.target === modal) {
      cerrarModal();
    }
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      cerrarModal();
    }
  });
});
function cargarDatosUsuario() {
  let correoActivo = localStorage.getItem('usuarioActivo');
  if (!correoActivo) {
    window.location.href = 'index.html';
    return;
  }

  let datos = JSON.parse(localStorage.getItem('usuario_' + correoActivo));
  if (!datos) {
    window.location.href = 'index.html';
    return;
  }

  // Llenar el formulario con los datos del usuario
  document.getElementById('nombres').value = datos.nombres || '';
  document.getElementById('apellidos').value = datos.apellidos || '';
  document.getElementById('correo').value = datos.correo || '';
  document.getElementById('fechaNacimiento').value = datos.fechaNacimiento || '';

  // Actualizar el header con el nombre del usuario
  let nombreCompleto = (datos.nombres + ' ' + datos.apellidos).trim();
  document.getElementById('nombreCompleto').textContent = nombreCompleto || 'Tu Nombre';
  document.getElementById('correoMostrado').textContent = datos.correo || 'tu@email.com';
}

function mostrarMensaje(tipo, texto) {
  if (tipo === 'exito') {
    document.getElementById('textoExito').textContent = texto;
    document.getElementById('mensajeExito').classList.add('show');
    setTimeout(() => {
      document.getElementById('mensajeExito').classList.remove('show');
    }, 3000);
  } else if (tipo === 'error') {
    document.getElementById('textoError').textContent = texto;
    document.getElementById('mensajeError').classList.add('show');
    setTimeout(() => {
      document.getElementById('mensajeError').classList.remove('show');
    }, 3000);
  }
}

function actualizarPerfil() {
  let nombres = document.getElementById('nombres').value.trim();
  let apellidos = document.getElementById('apellidos').value.trim();
  let fechaNacimiento = document.getElementById('fechaNacimiento').value;
  let claveActual = document.getElementById('claveActual').value;
  let nuevaClave = document.getElementById('nuevaClave').value;
  let confirmarNuevaClave = document.getElementById('confirmarNuevaClave').value;

  if (!nombres || !apellidos || !fechaNacimiento) {
    mostrarMensaje('error', 'Por favor completa todos los campos obligatorios');
    return;
  }

  let correoActivo = localStorage.getItem('usuarioActivo');
  let datos = JSON.parse(localStorage.getItem('usuario_' + correoActivo));

  // Validar cambio de contraseña
  if (nuevaClave || confirmarNuevaClave || claveActual) {
    if (!claveActual) {
      mostrarMensaje('error', 'Debes ingresar tu contraseña actual para cambiarla');
      return;
    }

    if (datos.clave !== claveActual) {
      mostrarMensaje('error', 'La contraseña actual es incorrecta');
      return;
    }

    if (nuevaClave !== confirmarNuevaClave) {
      mostrarMensaje('error', 'Las nuevas contraseñas no coinciden');
      return;
    }

    if (nuevaClave.length > 0 && nuevaClave.length < 8) {
      mostrarMensaje('error', 'La nueva contraseña debe tener mínimo 8 caracteres');
      return;
    }

    if (nuevaClave) {
      datos.clave = nuevaClave;
    }
  }

  // Actualizar datos
  datos.nombres = nombres;
  datos.apellidos = apellidos;
  datos.fechaNacimiento = fechaNacimiento;

  localStorage.setItem('usuario_' + correoActivo, JSON.stringify(datos));

  // Actualizar header
  let nombreCompleto = (nombres + ' ' + apellidos).trim();
  document.getElementById('nombreCompleto').textContent = nombreCompleto;

  // Limpiar campos de contraseña
  document.getElementById('claveActual').value = '';
  document.getElementById('nuevaClave').value = '';
  document.getElementById('confirmarNuevaClave').value = '';

  mostrarMensaje('exito', 'Perfil actualizado correctamente');
}

// Edita un solo campo del usuario activo. Maneja cambio de correo (traslada la entrada en localStorage)
function editarDatoUsuario(campo, valor) {
  let correoActivo = localStorage.getItem('usuarioActivo');
  if (!correoActivo) {
    mostrarMensaje('error', 'No hay usuario activo');
    return false;
  }

  let datos = JSON.parse(localStorage.getItem('usuario_' + correoActivo));
  if (!datos) {
    mostrarMensaje('error', 'Usuario no encontrado');
    return false;
  }

  // Si se intenta cambiar el correo, mover la entrada en localStorage
  if (campo === 'correo') {
    let nuevoCorreo = valor.trim();
    if (!nuevoCorreo) {
      mostrarMensaje('error', 'El correo no puede estar vacío');
      return false;
    }

    // Evitar sobreescribir otro usuario existente
    if (localStorage.getItem('usuario_' + nuevoCorreo)) {
      mostrarMensaje('error', 'El correo ya está en uso');
      return false;
    }

    datos.correo = nuevoCorreo;
    // Guardar con la nueva clave y eliminar la antigua
    localStorage.setItem('usuario_' + nuevoCorreo, JSON.stringify(datos));
    localStorage.removeItem('usuario_' + correoActivo);
    // Actualizar usuario activo
    localStorage.setItem('usuarioActivo', nuevoCorreo);

    // Actualizar campos en la UI si existen
    if (document.getElementById('correo')) document.getElementById('correo').value = nuevoCorreo;
    if (document.getElementById('correoMostrado')) document.getElementById('correoMostrado').textContent = nuevoCorreo;
    mostrarMensaje('exito', 'Correo actualizado correctamente');
    return true;
  }

  // Actualizar el campo en el objeto y persistir
  datos[campo] = valor;
  localStorage.setItem('usuario_' + correoActivo, JSON.stringify(datos));

  // Actualizar UI dependiendo del campo
  if (campo === 'nombres' || campo === 'apellidos') {
    if (document.getElementById('nombres')) document.getElementById('nombres').value = datos.nombres || '';
    if (document.getElementById('apellidos')) document.getElementById('apellidos').value = datos.apellidos || '';
    let nombreCompleto = ((datos.nombres || '') + ' ' + (datos.apellidos || '')).trim();
    if (document.getElementById('nombreCompleto')) document.getElementById('nombreCompleto').textContent = nombreCompleto || 'Tu Nombre';
  }

  if (campo === 'fechaNacimiento') {
    if (document.getElementById('fechaNacimiento')) document.getElementById('fechaNacimiento').value = datos.fechaNacimiento || '';
  }

  // No mostrar la contraseña en claro, pero si se cambió, limpiar campos relacionados
  if (campo === 'clave') {
    if (document.getElementById('claveActual')) document.getElementById('claveActual').value = '';
    if (document.getElementById('nuevaClave')) document.getElementById('nuevaClave').value = '';
    if (document.getElementById('confirmarNuevaClave')) document.getElementById('confirmarNuevaClave').value = '';
  }

  mostrarMensaje('exito', 'Dato actualizado correctamente');
  return true;
}