//Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


//Eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);    

    formulario.addEventListener('submit', agregarGasto);

}

//Clases 
class Presupuesto{
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];  
    }

    nuevoGasto(gasto){    //ESTE metodo incluira el objeto gasto en la class Presupuesto y creará desde ese metodo un arreglo con el 
        this.gastos = [...this.gastos, gasto]; // valor del elemento this.gastos que está dentro del objeto presupuesto. Para que nuevoGasto pueda extraer el valor que esta en  
        this.calcularRestante(); // this.gastos cuando se creo el metodo nuevoGasto se antepone el objeto presupuesto (presupuesto.nuevoGasto (gasto)) 
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto ) => total + gasto.cantidad, 0);    //este metodo suma todos los valores del arreglo y toma dos parametros
        this.restante = this.presupuesto - gastado; 
    }    

    eliminarGasto(id){ 
        this.gastos = this.gastos.filter( gasto => gasto.id !== id );
        this.calcularRestante();
    }
}
class UI { 
    
    insertarPresupuesto (cantidad) {
        //Estrae valor del objeto presupuesto. La otra forma de hacerlo es con cantidad.presupuesto cantidad.restante
        const { presupuesto, restante } = cantidad;

        //Le asigna el valor al HTML
        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
    
        //crear div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
    
        // Mensaje de error 
        divMensaje.textContent = mensaje;

        //Insertar en el HTML
        document.querySelector('.primario').insertBefore( divMensaje, formulario);
        
        //Quitar del HTML
    
        setTimeout (() => {
            divMensaje.remove();
        }, 3000);
    }
    
    mostrarGastos(gastos){ //esta funcion agrega el gasto (el gasto es la cantidad y el gasto) a listado
 
        this.limpiarHTML(); //Elimina el HTML
        
        //Iterar sobre los gastos
        gastos.forEach( gasto => {     //gastos es un arreglo de objeto y con gasto se accede a cada objeto el arreglo
            
            const { cantidad, nombre, id } = gasto; //gasto itera sobre esos tres elementos del arreglo gastos,
                                                    // de esa forma se evita escribir gasto.cantidad gasto.nombre gasto.id
            
            
            // Crear un LI
            const nuevoGasto = document.createElement("li");
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id; 

            // Agregar un HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad}</span>`;

            // Boton para borrar el gasto
            const btnBorrar = document.createElement("button");
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times'; //esta propiedad con textContent no la toma
            btnBorrar.onclick = () => {    //de esta forma primero se llama al evento y luego se ejectura la funcion
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);


            //Agregar al HTML
            gastoListado.appendChild (nuevoGasto);

        });

    }
    limpiarHTML(){
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstElementChild);
        }
    
    }
    actualizarRestante(restante) {
        document.querySelector("#restante").textContent = restante;
    }

    comprobarPresupuesto(presupuestObj){
        const{ presupuesto, restante } = presupuestObj;  //PAra extraer el valor del objeto es necesario almacenarlo en una variable por mas que despues no se use esa variable
    
        const restanteDiv = document.querySelector(".restante");

        //Comprobar 25%
        if( ( presupuesto / 4 ) > restante ) { 
            restanteDiv.classList.remove("alert-success", "alert-warning"); //si esta en verde puede pasar a amarillo
            restanteDiv.classList.add("alert-danger");
        } else if ((presupuesto / 2) > restante ) {
            restanteDiv.classList.remove("alert-success");
            restanteDiv.classList.add("alert-warning");
        }else {
            restanteDiv.classList.remove("alert-danger", "alert-warning");
            restanteDiv.classList.add("alert-success");
        }

        // Si el total es 0 o menor que 0
        if(restante <=0){
            ui.imprimirAlerta("El presupuesto se ha agotado", "error");
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

//Instanciar

const ui = new UI();  // De esta forma almaceno en la constante ui la class UI, de manera que si quiero llamar a una propiedad de esa clase lo hago con ui.propiedad de la clase

let presupuesto    //IMPORTANTE: esto va a ser el nombre del constructor de la clase Presupuesto y tendra como valor lo que se ingrese en el promt

//funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('Cual es su presupuesto?');

    //console.log(Number(presupuestoUsuario)); //convierte en numero el valor que se ingrese
 
    if(presupuestoUsuario === " " || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
        return;
    }

    //Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario); //ESTA LINEA NO LA ENTIENDO, al igua que abajo, pareciera que cada vez que se quiere acceder a una clase se debe crear una variable o constante
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);   //Si se le pasa presupuesto Usuario solamente se asignara el valor ingresado, en cambio presupuesto es TODO el objeto de la clase cantidad
}                                          //ESTA LINEA TAMPOCO LA ENTIENDO, pareciera que para llamar el metodo de la clase en necesario crear una constante e instanciar las clase

//Añade gastos
function agregarGasto(e){
    e.preventDefault();


    //Leer los datos del formulario
    const nombre = document.querySelector("#gasto").value;
    const cantidad = Number(document.querySelector("#cantidad").value);

    //Validar
    if(nombre=== "" || cantidad ==="") {
        ui.imprimirAlerta ("Ambos campos son obligatorios", "error");
        
        return;
         
        }else if (cantidad <=0 || isNaN(cantidad) ) {
         ui.imprimirAlerta ("Cantidad no valida", "error");
         
         return;
        
        }
        //Generar un objeto con el gasto
        const gasto = { nombre, cantidad, id: Date.now() }   //esto es diferente a distrocyorin (que extrae valor de un objeto), esto es object literal y sirve para crear un objeto
                                          //Cada gasto tendra su id                          
        /* gasto{
            nombre : nombre;
            cantidad : cantidad;
            id: Date.now()
        }*/
        
        // añade nuevo gasto 
        presupuesto.nuevoGasto(gasto);     //ESTO ES PORQUE al arreglo del objeto presupuesto -this.gastos- le voy a agregar el objeto recien creado gasto,
                                           // EL metodo nuevoGasto es el que incluira en el objeto presupuesto el objeto gasto 

        //Mensaje de todo bien
        ui.imprimirAlerta("Gasto agregado correctamente")
        
        
        //Imprimir los gastos
        const {gastos, restante } = presupuesto;  //con esa sintaxis se extrae del objeto presupuesto solo los datos del elemento gastos (gastos es un arreglo del del objeto presupuesto)
        
        ui.mostrarGastos(gastos);  
        
        ui.actualizarRestante(restante);

        ui.comprobarPresupuesto(presupuesto);

        //Reiniciar el formulario
        formulario.reset();     
    
    }

    function eliminarGasto(id) {
        //Elimina del objeto
        presupuesto.eliminarGasto(id);

        //Elimina los gastos del HTML
        const {gastos, restante} = presupuesto;
        ui.mostrarGastos(gastos); //toma solo el gasto del objeto
        
        ui.actualizarRestante(restante); //toma solo el restante del objeto

        ui.comprobarPresupuesto(presupuesto); // toma todo el objeto

    
    }
