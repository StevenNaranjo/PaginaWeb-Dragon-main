// Función para cargar los testimonios
async function cargarTestimonios() {
    try {
        const response = await fetch('https://api-dragon.onrender.com/getTestimoniesAdmin'); // Llama a tu ruta API
        const testimonios = await response.json(); // Obtén los datos en formato JSON

        const tbody = document.getElementById('testimoniesTableBody');
        tbody.innerHTML = ''; // Limpia la tabla antes de añadir los datos

        // Recorre los testimonios y genera una fila por cada uno
        testimonios.forEach(testimonio => {
            const fila = `
                <tr>
                    <td>${testimonio.nombreusuario}</td>
                    <td>${testimonio.comentario}</td>
                    <td>${testimonio.estado === 1 ? 'Aprobado' : 'Pendiente'}</td>
                    <td>
                        <button class="btn btn-outline-success btn-sm" style="font-size: 20px;" onclick="aprobarTestimonio(${testimonio.idtestimonio})">✅</button>
                        <button class="btn btn-outline-danger btn-sm" style="font-size: 20px;" onclick="eliminarTestimonio(${testimonio.idtestimonio})">🗑️</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += fila; // Añade cada fila a la tabla
        });
    } catch (error) {
        console.error('Error al cargar los testimonios:', error);
    }
}

// Función para aprobar un testimonio
async function aprobarTestimonio(idTestimonio) {
    try {
        const response = await fetch(`https://api-dragon.onrender.com/approveTestimony/${idTestimonio}`, {
            method: 'PUT'
        });
        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            cargarTestimonios(); // Recargar la tabla después de aprobar
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error al aprobar el testimonio:', error);
        alert('Error al aprobar el testimonio.');
    }
}

// Función para eliminar un testimonio
async function eliminarTestimonio(idTestimonio) {
    if (confirm('¿Estás seguro de que deseas eliminar este testimonio?')) {
        try {
            const response = await fetch(`https://api-dragon.onrender.com/deleteTestimony/${idTestimonio}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                cargarTestimonios(); // Recargar la tabla después de eliminar
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error al eliminar el testimonio:', error);
            alert('Error al eliminar el testimonio.');
        }
    }
}

// Llama a la función para cargar los testimonios cuando se cargue la página
document.addEventListener('DOMContentLoaded', cargarTestimonios);
