async function cargarServicios() {
    try {
        const response = await fetch('https://api-dragon.onrender.com/getServicesAdmin'); // Llama a tu ruta API
        const servicios = await response.json(); // Obtén los datos en formato JSON

        const tbody = document.getElementById('serviciosTableBody');
        tbody.innerHTML = ''; // Limpia la tabla antes de añadir los datos

        // Recorre los servicios y genera una fila por cada uno
        servicios.forEach(servicio => {
            const fechaSalida = new Date(servicio.horafechasalida).toLocaleDateString();
            const fechaLlegada = new Date(servicio.horafechallegada).toLocaleDateString();
            // Mapa de tipos de actividad
            const tipoActividadMap = {
                0: 'Campamento',
                1: 'Hospedaje',
                2: 'Senderismo',
                3: 'Tours',
                4: 'Voluntariado',
                5: 'Alianza'
            };
            
            // Obtener el tipo de actividad del mapa, o "Otro" si no está definido
            const tipoActividad = tipoActividadMap[servicio.tipo] || 'Otro'
            const fila = `
                <tr>
                    <td>${servicio.nombre}</td>
                    <td>${servicio.codigoservicio}</td>
                    <td>${fechaSalida} al ${fechaLlegada}</td>
                    <td>${tipoActividad}</td>
                    <td style="text-align: right;">₡${parseFloat(servicio.precio).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-outline-success btn-sm" style="font-size: 20px;" onclick="guardarCodigoServicioYEditar(${servicio.codigoservicio})">✏️</button>
                        <button class="btn btn-outline-danger btn-sm" style="font-size: 20px;" onclick="eliminarServicio(${servicio.codigoservicio})">🗑️</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += fila; // Añade cada fila a la tabla
        });
    } catch (error) {
        console.error('Error al cargar los servicios:', error);
    }
}

function guardarCodigoServicioYEditar(codigoServicio) {
    if (codigoServicio) {
        sessionStorage.setItem('codigoServicio', codigoServicio);
        window.location.href = 'modifActividad.html'; // Redirige a la página sin parámetros en la URL
    } else {
        console.error('No se pudo guardar el código del servicio, es nulo o indefinido');
    }
}
// Función para eliminar un servicio
async function eliminarServicio(codigoServicio) {
    if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
        try {
            const response = await fetch(`https://api-dragon.onrender.com/deleteServicio/${codigoServicio}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                cargarServicios(); // Recargar la tabla después de eliminar
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error al eliminar el servicio:', error);
            alert('Error al eliminar el servicio.');
        }
    }
}

// Llama a la función para cargar los servicios cuando se cargue la página
document.addEventListener('DOMContentLoaded', cargarServicios);
