// VARIABLES
var myTree = new AvlTree();
var tree_container = document.getElementById("tree-container");
var svg_tree = document.getElementById("svg-tree");
let divInfo = document.getElementById("divInfo");
let titulo = document.getElementById("tituloInfo");
let p_info = document.getElementById("infoText");


function showControls(controlID, optionBtn_Top) {
    var control = document.getElementById(controlID);
    control.style.position = "absolute";
    // console.log("La opcion seleccionada es: ", controlID);
    control.style.top = optionBtn_Top - 48 + "px";
    // console.log(control.style.top);
    // control.style.left = control.parentElement.offsetLeft;
    control.style.display = "block";
}


function hideControls(controlID) {
    var control = document.getElementById(controlID);
    control.style.display = "none"; // Ocultar los controles
}


function toggleControls(controlID, position_top) {
    var control = document.getElementById(controlID);
    var controlsContainer = document.getElementById("controlsContainer");
    
    // Mostrar los controles correspondientes y ocultar los demás
    controlsContainer.querySelectorAll(".controls").forEach(function(controlElement) {
        if (controlElement === control) {
            if (control.style.display === "none") {
                showControls(controlID, position_top);
            } else {
                hideControls(controlID);
            }
        } else {
            hideControls(controlElement.id);
        }
    });


    // clear the error message and border color
    let messages_containers = document.getElementsByClassName("error-message");
    let textboxes = document.getElementsByClassName("textbox")
    //recorrer las colecciones de elementos y limpiarlos
    for (let i = 0; i < messages_containers.length; i++) {
        messages_containers[i].textContent = "";
        textboxes[i].style.borderColor = "";
        textboxes[i].value = "";
    }
}

function optionButton(selectedBtn){
    // console.log("La opcion seleccionada es: ", selectedBtn);
    var boton = document.getElementById(selectedBtn);
    var btn_data = boton.getAttribute("data-option");
    // console.log(boton);
    let position = boton.getBoundingClientRect();
    // console.log(position.top);
    toggleControls(btn_data + "Controls", position.top);
}



// REALIZAR PETICIONES AL SERVIDOR

async function insertNode() {
    // Lógica para la opción 'Insert'
    // ...

    // // clear the input field
    // textbox.value = ""; 
    // // alert("Insertar");
    // toggleControls("insertControls");
    
    
    // get the input field
    let textbox = document.getElementById("nodeValue");

    if (validateInput("nodeValue")) {
    
    //get the node value 
    let nodeValue = document.getElementById("nodeValue").value;
    nodeValue = parseInt(nodeValue);

    titulo.innerHTML = "Insert(" + nodeValue + ")";
    divInfo.style.display = "block";

    await myTree.insert(nodeValue, svg_tree);
    // myTree.performRotation();

    console.log(myTree);
    console.log(myTree.central_point);
    console.log(svg_tree.clientWidth);
    console.log(myTree.root);

    // console.log("The max level is: ", myTree.getMaxLevel(myTree.root));
    // console.log("The height of the tree is: ", myTree.getHeight(myTree.root));


    // // clear the input field
    // textbox.value = ""; 
    // // alert("Insertar");
    // toggleControls("insertControls");
    }
    else{
        
        for (let i = 0; i < 10; i++) {
            // insert random numbers (between -99 and 99)
            let random_number = Math.floor(Math.random() * 199) - 99;
            titulo.innerHTML = "Insert(" + random_number + ")";
            divInfo.style.display = "block";
            await myTree.insert(random_number, svg_tree);
        }
    }

    

    // setTimeout(() => {
    //     divInfo.style.display = "none";
    //     p_info.innerHTML = "";
    // }, 2000);

    // clear the input field
    textbox.value = ""; 
    // alert("Insertar");
    toggleControls("insertControls");
}

async function removeNode() {
    // Lógica para la opción 'Remove'
    // ...

    if(validateInput("nodeValueRemove")){

            //get the input field
    let textbox = document.getElementById("nodeValueRemove");
    //get the node value
    let nodeValue = document.getElementById("nodeValueRemove").value;
    
    titulo.innerHTML = "Remove(" + nodeValue + ")";
    divInfo.style.display = "block";

    await myTree.remove(nodeValue);
    console.log(myTree);




    setTimeout(() => {
        divInfo.style.display = "none";
        p_info.innerHTML = "";
    }, 2000);

    // limpiar el input field
    textbox.value = "";
    toggleControls("removeControls");
    }
}

async function searchNode() {
    // Lógica para la opción 'Search'
    // ...

    if(validateInput("nodeValueSearch")){
        //get the input field
    let textbox = document.getElementById("nodeValueSearch");
    //get the node value
    let nodeValue = document.getElementById("nodeValueSearch").value;

    titulo.innerHTML = "Search(" + nodeValue + ")";
    divInfo.style.display = "block";

    let founded = await myTree.search(nodeValue);

    if(founded != null){
        p_info.innerHTML = "The node " + nodeValue + " was found";
    }
    else{
        p_info.innerHTML = "The node " + nodeValue + " was not found";
    }

    setTimeout(() => {
        myTree.resetNodes();
        divInfo.style.display = "none";
        p_info.innerHTML = "";
    }, 2000);

    console.log(myTree.central_point);
    // limpiar el input field
    textbox.value = "";
    toggleControls("searchControls");
    }
}

function preorden(){

    myTree.preorderTraversal();
    toggleControls("transverseControls");

    titulo.innerHTML = "Preorder";
    divInfo.style.display = "block";

}

function inorden(){
   
    myTree.inorderTraversal();
    toggleControls("transverseControls");

    titulo.innerHTML = "Inorder";
    divInfo.style.display = "block";
}

function postorden(){
    myTree.postorderTraversal();
    toggleControls("transverseControls");

    titulo.innerHTML = "Postorder";
    divInfo.style.display = "block";
}



// VALIDACIONES

// validar que los inputs no esten vacios y acepten solo numeros
function validateInput(id_control){
    let textbox = document.getElementById(id_control);
    let value = document.getElementById(id_control).value;
    let container_id = textbox.getAttribute("data-option");
    // console.log(container_id);
    let error_message_container = document.getElementById('error-message-' + container_id);

     if (value === "") {
        // alert("El campo no puede estar vacio");
        // show error message
        error_message_container.textContent = 'Fill the input field';

    textbox.style.borderColor = 'red';
        textbox.value = "";
        return false;
     }
     else if (value > 99 || value < -99) {
        // alert("El campo solo acepta numeros entre -99 y 99");
        // show error message
        error_message_container.textContent = 'The value must be between -99 and 99';
        textbox.style.borderColor = 'red';
        textbox.value = "";
        return false;
     }
     else {
            return true;
     }
}



function asignar_eventos(){
    set_input_event("nodeValue");
    set_input_event("nodeValueRemove");
    set_input_event("nodeValueSearch");
}

//Asignar evento 'input' a los input fields
function set_input_event(id_input_field){
    let txtbx1 = document.getElementById(id_input_field);
    let id_message_container = txtbx1.getAttribute("data-option");
    txtbx1.addEventListener('input', function(event) {
        // get the value of the input field
        value = event.target.value;

        // delete all characters except numbers (and minus sign))
        value = value.replace(/[^0-9-]/g, '');
        
        // be sure that the first character is not a zero
         if (value.charAt(0) === '0') {
            value = value.replace(/[^1-9]/g, '');
        }
        
        // update the value of the input field
        event.target.value = value;

        // Clear previous error message and border color
    document.getElementById('error-message-' + txtbx1.getAttribute("data-option")).textContent = '';
    txtbx1.style.borderColor = '';
    });
}


window.onload = asignar_eventos;
