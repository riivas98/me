// Establecer la conexión con la base de datos
let db;
const request = indexedDB.open('MiBaseDeDatos', 1);

request.onerror = function(event) {
    console.log('Error al abrir la base de datos', event.target.error);
};

request.onupgradeneeded = function(event) {
    db = event.target.result;

    // Crear un almacén de objetos (tabla) en la base de datos
    const objectStore = db.createObjectStore('registros', { keyPath: 'id', autoIncrement: true });

    // Definir los índices para buscar y ordenar los registros
    objectStore.createIndex('nombre', 'nombre', { unique: false });
    objectStore.createIndex('apellido', 'apellido', { unique: false });

    console.log('Base de datos creada correctamente');
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log('Base de datos abierta correctamente');
};

// Funciones para manipular los registros

function guardarRegistro() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;

    const transaction = db.transaction(['registros'], 'readwrite');
    const objectStore = transaction.objectStore('registros');

    const registro = { nombre: nombre, apellido: apellido };
    const request = objectStore.add(registro);

    request.onsuccess = function(event) {
        console.log('Registro agregado correctamente');
    };

    transaction.oncomplete = function(event) {
        document.getElementById('nombre').value = '';
        document.getElementById('apellido').value = '';
        console.log('Transacción completada: registro guardado');
    };

    transaction.onerror = function(event) {
        console.log('Error en la transacción', event.target.error);
    };
}

function borrarRegistro() {
    const id = parseInt(prompt('Ingrese el ID del registro a borrar'));

    const transaction = db.transaction(['registros'], 'readwrite');
    const objectStore = transaction.objectStore('registros');
    const request = objectStore.delete(id);

    request.onsuccess = function(event) {
        console.log('Registro borrado correctamente');
    };

    transaction.oncomplete = function(event) {
        console.log('Transacción completada: registro borrado');
    };

    transaction.onerror = function(event) {
        console.log('Error en la transacción', event.target.error);
    };
}

function verRegistros() {
    const transaction = db.transaction(['registros'], 'readonly');
    const objectStore = transaction.objectStore('registros');
    const request = objectStore.getAll();

    request.onsuccess = function(event) {
        const registros = event.target.result;
        const tablaRegistros = document.getElementById('tablaRegistros');

        // Limpiar la tabla antes de mostrar los registros
        while (tablaRegistros.rows.length > 1) {
            tablaRegistros.deleteRow(1);
        }

        // Llenar la tabla con los registros
        for (const registro of registros) {
            const row = tablaRegistros.insertRow();
            const idCell = row.insertCell(0);
            const nombreCell = row.insertCell(1);
            const apellidoCell = row.insertCell(2);

            idCell.textContent = registro.id;
            nombreCell.textContent = registro.nombre;
            apellidoCell.textContent = registro.apellido;
        }

        console.log('Registros obtenidos correctamente');
    };

    transaction.onerror = function(event) {
        console.log('Error en la transacción', event.target.error);
    };
}

function actualizarRegistro() {
    const id = parseInt(prompt('Ingrese el ID del registro a actualizar'));
    const nombre = prompt('Ingrese el nuevo nombre');
    const apellido = prompt('Ingrese el nuevo apellido');

    const transaction = db.transaction(['registros'], 'readwrite');
    const objectStore = transaction.objectStore('registros');
    const request = objectStore.get(id);

    request.onsuccess = function(event) {
        const registro = event.target.result;

        if (registro) {
            registro.nombre = nombre;
            registro.apellido = apellido;

            const updateRequest = objectStore.put(registro);

            updateRequest.onsuccess = function(event) {
                console.log('Registro actualizado correctamente');
            };
        } else {
            console.log('No se encontró el registro');
        }
    };

    transaction.oncomplete = function(event) {
        console.log('Transacción completada: registro actualizado');
    };

    transaction.onerror = function(event) {
        console.log('Error en la transacción', event.target.error);
    };
}