/*  - Arreglar la caja donde se muestra el algoritmo
    - Agregar recorrido por niveles
    - Agregar la posibilidad de insertar n cantidad de números aleatorios
    - Agregar la posibilidad de eliminar n cantidad de nodos aleatorios
    - Agregar que cuando se inserte un nodo, si el nodo ya existe, se resalte el nodo
    - Agregar atajos de teclado para realizar las acciones insertar, eliminar, buscar, recorrer, etc
    - Agregar que cuando el cursor esté en algún nodo, se pueda presionar la tecla "D" para eliminar el nodo
    - Agregar que cuando el cursor esté sobre algún nodo, se muestre información sobre el nodo (por ejemplo, el valor del nodo, el nivel, el factor de balance, sus hijos, si es hoja, su recorrido más largo, etc)
    -* Si es posible, agregar un panel de control que te permita ver estados anteriores del árbol, por ejemplo: si el árbol tiene 5 nodos y se le inserta el nodo con valor 44, una vez insertado, que te permita "volver atrás" y ver el árbol antes de que se le insertara el 44 (o sea, cuando tenía 5 nodos). Es propósito de esto es que el usuario pueda ver cómo se va modificando el árbol a medida que se le insertan o eliminan nodos. 
    -* Si el anterior punto fue posible, agregar la misma funcionalidad para cuando se elimina un nodo
    - Agregar la posibilidad de que el usuario pueda ingresar un número en el textbox y que al presionar Enter, se ejecute la acción de insertar
    - Agregar la posibilidad de que el usuario pueda ingresar un número en el textbox y que al presionar Enter, se ejecute la acción de buscar
    - Agregar la posibilidad de que el usuario pueda ingresar un número en el textbox y que al presionar Enter, se ejecute la acción de eliminar
    */


class AvlNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.level = 0;
    }
}

class AvlTree {
    constructor() {
        this.root = null;
        this.circle_radius = 15;
        this.circle_stroke_width = 3;
        this.color = "#1697E5"; //"#84B321"; //F57120
        this.just_inserted_color = "#3DB133"; //"#33FFF6"; //F57120
        this.eliminate_color = "#FF0000"; //F51106
        this.highlight_color = "#ffffff" //orange
        this.traverse_color = "#E3DD15" // yellow 
        this.search_color = "#0B47F3" // blue
        this.circle_text_size = "15px";
        this.y_plus_this = 16; // this is the distance we need to add to the "y" of the line to make it look better
        this.line_stroke_width = 2;
        this.central_point = document.getElementById("svg-tree").clientWidth / 2;
        this.p_info = document.getElementById("infoText");

        // this.circle_radius = 7;
        // this.circle_stroke_width = 1;
        // this.circle_text_size = "8px";
        // this.y_plus_this = 7;
        // this.line_stroke_width = 1;
    }


    // Height
    getHeight(node) {
        if (node == null) {
            return 0;
        }

        return Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
    }

    // Balance Factor
    getBalanceFactor(node) {
        if (node == null) {
            return 0;
        }

        return this.getHeight(node.left) - this.getHeight(node.right);
    }

    // Rotate Right (Left-heavy unbalanced)
    rightRotation(current_node) {
        let new_root = current_node.left;
            
        let temp = new_root.right;


        new_root.right = current_node;
        current_node.left = temp;

        let new_x_new_root = parseInt(document.getElementById("circle-" + current_node.value).getAttribute("cx"));
        let new_y_new_root = parseInt(document.getElementById("circle-" + current_node.value).getAttribute("cy"));

        this.updateNodePositions(new_root, svg_tree, new_x_new_root, new_y_new_root, current_node.level,  "left", current_node.value);

        return new_root;
    }

    // Rotate Left (Right-heavy unbalanced)
    leftRotation(current_node) {
        let new_root = current_node.right;
            
        let temp = new_root.left;

        new_root.left = current_node;
        current_node.right = temp;

        let new_x_new_root = parseInt(document.getElementById("circle-" + current_node.value).getAttribute("cx"));
        let new_y_new_root = parseInt(document.getElementById("circle-" + current_node.value).getAttribute("cy"));

        this.updateNodePositions(new_root, svg_tree, new_x_new_root, new_y_new_root, current_node.level, "right", current_node.value);

         return new_root;
    }



    //                  MINE

    performRotationWithAnimation(rotationFunction, current_node) {
        return new Promise(resolve => {
            let newRoot = rotationFunction.call(this, current_node);

            setTimeout(() => {
                resolve(newRoot);
            }, 1500); // Delay for visualization (this is what it takes between each rotation)
        });
    }

    async balanceTreeWithAnimation(current_node) {
        let balance_factor = this.getBalanceFactor(current_node);


        if (balance_factor > 1 && this.getBalanceFactor(current_node.left) >= 0) {
            console.log("right rotation")
            return await this.performRotationWithAnimation(this.rightRotation, current_node);
        }

        if (balance_factor < -1 && this.getBalanceFactor(current_node.right) <= 0) {
            console.log("left rotation")
            return await this.performRotationWithAnimation(this.leftRotation, current_node);
        }

        if (balance_factor > 1 && this.getBalanceFactor(current_node.left) < 0) {
            console.log("left right rotation")

            current_node.left = await this.performRotationWithAnimation(this.leftRotation, current_node.left);
            return await this.performRotationWithAnimation(this.rightRotation, current_node);
        }

        if (balance_factor < -1 && this.getBalanceFactor(current_node.right) > 0) {
            console.log("right left rotation")
            current_node.right = await this.performRotationWithAnimation(this.rightRotation, current_node.right);
            return await this.performRotationWithAnimation(this.leftRotation, current_node);
        }

        

        return current_node;
    }


    // Insert
    async insert(value, svg_element){
        this.showAlgorithm('i');
        this.root = await this._insertNode(this.root, value, 0, svg_element, this.central_point, 50, null);
        console.log("Max height: ", this.getHeight(this.root));
        this.resetNodes();
        this.resizeNodes(this.getHeight(this.root) - 1);
        // this.resizeNodes22(this.root, this.getHeight(this.root) - 1, 50);
    }

    async _insertNode(current_node, value, level, svg_element, x, y, valueParent, x_parent=0, y_parent=0, direction=null) {
        if (current_node == null) {
            let new_node = new AvlNode(value);
            new_node.level = level;
            console.log("Inserting: ", value);
            this.drawCircle(svg_element, value, x, y, this.circle_radius, this.just_inserted_color);
            await this.drawLineWithAnimation(svg_element, x, y, x_parent, y_parent, valueParent, direction, this.just_inserted_color);
            // svg_element, x_current_node, y_current_node, x2, y2, value, valueParent, color
            return new_node;
        }

        if (value < current_node.value) {
            this.p_info.innerHTML = value + " is less than " + current_node.value + ", going left";
            await this.highlightNode(current_node.value, this.highlight_color);
            this.highlightLine(current_node.value, "left", this.highlight_color);
            current_node.left = await this._insertNode(current_node.left, value, level + 1, svg_element, x - (this.central_point * (1 / Math.pow(2, current_node.level + 1))), y + 50, current_node.value, x, y, "left");
        } 
        else if (value > current_node.value) {
            this.p_info.innerHTML = value + " is greater than " + current_node.value + ", going right";
            await this.highlightNode(current_node.value, this.highlight_color);
            this.highlightLine(current_node.value, "right", this.highlight_color);
            current_node.right = await this._insertNode(current_node.right, value, level + 1, svg_element, x + (this.central_point * (1 / Math.pow(2, current_node.level + 1))), y + 50, current_node.value, x, y, "right");
        }
        else{ // it means the value already exists
            return current_node;
        }

        // current_node = this.balanceTree(current_node);
        current_node = await this.balanceTreeWithAnimation(current_node);

        return current_node;
    }

    // Remove
    async remove(value) {
        this.root = await this._removeNode(this.root, value, null, this.central_point, 50);
        this.resetNodes();
        this.resizeNodes(this.getHeight(this.root) - 1);
    }

    async _removeNode(current_node, value, valueParent, x, y, xParent=0, yParent=0, direction=null, third_case=false) {
        if (current_node == null) {
            this.p_info.innerHTML = "The node " + value + " was not found";
            return null;
        }

        if(!third_case){
            this.p_info.innerHTML = "Looking for " + value + " to remove";
        }

        if (value < current_node.value) {
            await this.highlightNode(current_node.value, this.highlight_color);
            await this.highlightLine(current_node.value, "left", this.highlight_color);
            current_node.left = await this._removeNode(current_node.left, value, current_node.value, x - (this.central_point * (1 / Math.pow(2, current_node.level + 1))), y + 50, x, y, "left", third_case);
        } else if (value > current_node.value) {
            await this.highlightNode(current_node.value, this.highlight_color);
            await this.highlightLine(current_node.value, "right", this.highlight_color);
            current_node.right = await this._removeNode(current_node.right, value, current_node.value, x + (this.central_point * (1 / Math.pow(2, current_node.level + 1))), y + 50, x, y, "right", third_case);
        } else { //it means we found the node to remove
            // Case 1: No child (leaf node)
            if (current_node.left == null && current_node.right == null) {
                if(!third_case){
                    current_node = null;
                await this.highlightNode(value, this.eliminate_color);
                this.p_info.innerHTML = value + " found and removing it";
                this.deleteCircle(value);
                await this.deleteLineWithAnimation(valueParent, direction);
                }
                else{
                    current_node = null;
                await this.highlightNode(value, this.traverse_color);
                this.deleteCircle(value);
                await this.deleteLineWithAnimation(valueParent, direction);
                }
            }
            // Case 2: One child 
            else if (current_node.left == null) {
                current_node = current_node.right;
                await this.highlightNode(value, this.eliminate_color);
                this.p_info.innerHTML = "Removing " + value + " and replacing it with " + current_node.value + " (right child)";
                this.deleteCircle(value);
                await this.deleteLineWithAnimation(value, "right");
                this.updateNodePositionWhenDelete(current_node, x, y, current_node.level, "right")
            } else if (current_node.right == null) {
                current_node = current_node.left;
                await this.highlightNode(value, this.eliminate_color);
                this.p_info.innerHTML = "Removing " + value + " and replacing it with " + current_node.value + " (left child)";
                this.deleteCircle(value);
                await this.deleteLineWithAnimation(value, "left");
                this.updateNodePositionWhenDelete(current_node, x, y, current_node.level, "left")
            }
            // Case 3: Two children (we replace the node with the min node of the right subtree aka the successor) 
            else {
                let temp = this.findMinNode(current_node.right);
                let old_value = current_node.value;
                current_node.value = temp.value;
                await this.highlightNode(old_value, this.eliminate_color);
                this.p_info.innerHTML = "Removing " + old_value + " and replacing it with " + temp.value + " (successor)";
                await this.highlightLine(old_value, "right", this.highlight_color)
                current_node.right = await this._removeNode(current_node.right, temp.value, old_value, x + (this.central_point * (1 / Math.pow(2, current_node.level + 1))), y + 50, x, y, "right", true);
                this.updateCircleValue(old_value, temp.value);
            }
            console.log("node removed:", value);
        }

        if (current_node == null) {
            return current_node;
        }

        current_node = await this.balanceTreeWithAnimation(current_node);

        return current_node;
    }

    // Find min node
    findMinNode(current_node) {
        if (current_node.left == null) {
            return current_node;
        } else {
            return this.findMinNode(current_node.left);
        }
    }

    // Search
    async search(value) {
        return await this._searchNode(this.root, value);
        
    }

    async _searchNode(current_node, value) {
        if (current_node == null) {
            return null;
        }
        this.p_info.innerHTML = "Comparing " + value + " with " + current_node.value;

        if (value < current_node.value) {
            await this.highlightNode(current_node.value, this.highlight_color); //#0B47F3
            // this.p_info.innerHTML = "Comparing " + value + " with " + current_node.left.value;
            this.highlightLine(current_node.value, "left", this.highlight_color)
            return this._searchNode(current_node.left, value);
        } else if (value > current_node.value) {
            await this.highlightNode(current_node.value, this.highlight_color);
            // this.p_info.innerHTML = "Comparing " + value + " with " + current_node.right.value;
            this.highlightLine(current_node.value, "right", this.highlight_color)
            return this._searchNode(current_node.right, value);
        } else {
            await this.highlightNode(current_node.value, "#000DFF");
            return current_node;
        }
    }

    // Traverse
    // async preorderTraversal() {
    //     this.p_info.innerHTML = "";
    //     await this._preorderTraversal(this.root);
    //     this.resetNodes();
    // }

    // async _preorderTraversal(current_node) {
    //     if (current_node != null) {
    //         console.log(current_node.value);
    //         this.p_info.innerHTML += current_node.value + " ";
    //         this.highlightNode(current_node.value, this.traverse_color, true)
    //         await this.fillNode(current_node.value, this.traverse_color);
    //         this.highlightLine(current_node.value, "left", this.traverse_color);
    //         await this._preorderTraversal(current_node.left);
    //         this.highlightLine(current_node.value, "right", this.traverse_color);
    //         await this._preorderTraversal(current_node.right);
    //     }
    // }


    async preorderTraversal() {
        this.p_info.innerHTML = '';
        await this._preorderTraversal(this.root);
        this.resetNodes();
    }
    
    async _preorderTraversal(current_node, isFirstNode = true) {
        if (current_node != null) {
            console.log(current_node.value);
            if (!isFirstNode) {
                this.p_info.innerHTML += ', '; // Add comma between nodes
            }
            await this.highlightNode(current_node.value, this.traverse_color, true);
            await this.fillNode(current_node.value, this.traverse_color);
            this.p_info.innerHTML += current_node.value;
            this.highlightLine(current_node.value, 'left', this.traverse_color);
            await this._preorderTraversal(current_node.left, false);
            this.highlightLine(current_node.value, 'right', this.traverse_color);
            await this._preorderTraversal(current_node.right, false);
        }
    }
    


    async inorderTraversal() {
        this.p_info.innerHTML = "";
        await this._inorderTraversal(this.root);
        this.resetNodes();
    }

    async _inorderTraversal(current_node) {
        if (current_node != null) {
            await this.highlightNode(current_node.value, this.traverse_color, true)
            this.highlightLine(current_node.value, "left", this.traverse_color);
            await this._inorderTraversal(current_node.left);
            console.log(current_node.value);
            await this.fillNode(current_node.value, this.traverse_color);
            // show the value of the node in the info box and separate each value with a comma (except if it is the last node)
            if(this.p_info.innerHTML == ""){
                this.p_info.innerHTML += current_node.value;
            }
            else{
                this.p_info.innerHTML += ", " + current_node.value;
            }
            this.highlightLine(current_node.value, "right", this.traverse_color);
            await this._inorderTraversal(current_node.right, false);
        }
    }

    async postorderTraversal() {
        this.p_info.innerHTML = "";
        await this._postorderTraversal(this.root);
        this.resetNodes();
    }

    async _postorderTraversal(current_node) {
        if (current_node != null) {
            await this.highlightNode(current_node.value, this.traverse_color, true)
            this.highlightLine(current_node.value, "left", this.traverse_color);
            await this._postorderTraversal(current_node.left);
            this.highlightLine(current_node.value, "right", this.traverse_color);
            await this._postorderTraversal(current_node.right);
            console.log(current_node.value);
            await this.fillNode(current_node.value, this.traverse_color)
            // show the value of the node in the info box and separate each value with a comma (except if it is the last node)
            if(this.p_info.innerHTML == ""){
                this.p_info.innerHTML += current_node.value;
            }
            else{
                this.p_info.innerHTML += ", " + current_node.value;
            }
        }
    }

    async fillNode(value, color) {
        return new Promise(resolve => {
            const node = document.getElementById("circle-" + value);
            const text = document.getElementById("text-" + value);
            anime({
                targets: node,
                r: [this.circle_radius,this.circle_radius - 1 + 5, this.circle_radius], // Cambio de tamaño
                fill: [color, color, color], // Cambio de color
                duration: 1000,
                easing: 'easeInOutQuad',
                complete: resolve,
              });
            
              anime({
                targets: text,
                fill: ["#ffffff", "#ffffff", "#ffffff"], // Cambio de color
                duration: 1000,
                easing: 'easeInOutQuad',
                complete: resolve,
              })
        });
    }

    // Representation
    drawCircle(svg_element, value, x, y, radius, color) {
        // create a svg circle
        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", radius);
        circle.setAttribute("fill", "none");
        circle.setAttribute("stroke", color);
        circle.setAttribute("stroke-width", this.circle_stroke_width);
        circle.setAttribute("data-value", value);
        circle.setAttribute("id", "circle-" + value);

        // create a svg text
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x);
        text.setAttribute("y", y);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("fill", color); // text color
        text.setAttribute("font-size", this.circle_text_size);
        text.setAttribute("id", "text-" + value);
        text.textContent = value;

        // append circle and text to svg element
        svg_element.appendChild(circle);
        svg_element.appendChild(text);
    }

    deleteCircle(value) {
        var circle = document.getElementById("circle-" + value);
        var text = document.getElementById("text-" + value);
        circle.remove();
        text.remove();
    }

    updateCircleValue(value, newValue) {
        var circle = document.getElementById("circle-" + value);
        var text = document.getElementById("text-" + value);
        circle.setAttribute("data-value", newValue);
        circle.setAttribute("id", "circle-" + newValue);
        text.setAttribute("id", "text-" + newValue);
        text.textContent = newValue;

        // Update lines
        var lineLeft = document.getElementById("line" + value + "left");
        var lineRight = document.getElementById("line" + value + "right");
        if (lineLeft != null) {
            lineLeft.setAttribute("id", "line" + newValue + "left");
        }
        if (lineRight != null) {
            lineRight.setAttribute("id", "line" + newValue + "right");
        }
    }


    //                                      MINE

    async drawLineWithAnimation(svg_element, x_current_node, y_current_node, x2, y2, valueParent, direction, color) {
        if (x2 !== 0 && y2 !== 0) {
            return new Promise(resolve => {
                // create a svg line
                var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", x_current_node);
                line.setAttribute("y1", y_current_node - this.y_plus_this);
                line.setAttribute("x2", x_current_node); // Start line at current node position
                line.setAttribute("y2", y_current_node - this.y_plus_this); // Start line at current node position
                line.setAttribute("stroke", color);
                line.setAttribute("stroke-width", this.line_stroke_width);
                line.setAttribute("id", "line" + valueParent + direction);
                // line.setAttribute("id", "line" + valueParent + "-" + value);
                console.log("drawing line", line.getAttribute("id"));

                // append line to svg element
                svg_element.appendChild(line);

                // Animate line to its final position
                anime({
                    targets: line,
                    x2: x2,
                    y2: y2 + this.y_plus_this,
                    easing: "easeInOutQuad",
                    duration: 1000,
                    complete: resolve,
                });
            });
        }
    }

    async deleteLineWithAnimation(valueParent, direction) {
        return new Promise(resolve => {
            let line = document.getElementById("line" + valueParent + direction);
            if (line != null) {
                anime({
                    targets: line,
                    x2: line.getAttribute("x1"),
                    y2: line.getAttribute("y1"),
                    easing: "easeInOutQuad",
                    duration: 1000,
                    complete: resolve,
                });
                setTimeout(() => {
                    line.remove();
                }, 1000);
            }
        });
    }

    removeLine(value, root){
        if(root != null){
            console.log("checando nodo", value, "con nodo padre", root.value);
            let line = document.getElementById("line" + value + "-" + root.value);
            if(line != null){
                console.log("removingLine", line.id)
                document.getElementById("svg-tree").removeChild(line);
            }
            else{
                this.removeLine(value, root.left);
                this.removeLine(value, root.right);
            }
        }

    }


    updateNodePositionWhenDelete(root, x, y, level, direction=null, valueParent=null, xParent=0, yParent=0) {
        if(root === null){
            return;
        }
        let svg_element = document.getElementById("svg-tree");

        if(direction != null){
            //remove the line connecting the node with its parent
            // this.removeLine(root.value, valueParent);
            let line = document.getElementById("line" + valueParent + direction);
            console.log("searching line uNPWD" + valueParent + direction + "to remove");
            console.log("linea obtenida uNPWD:", line);
            if(line != null){
                console.log("removing line uNPWD", line.id)
                document.getElementById("svg-tree").removeChild(line);
            }
        }

        this.animateNodeMove(root.value, x, y);

        // update level
        root.level = level - 1;

        // redraw the line connecting the node with its parent
        setTimeout(() =>{
            this.drawLineWithAnimation(svg_element, x, y, xParent, yParent, valueParent, direction, this.color)
        }, 1500);

        var dx = this.central_point * (1 / Math.pow(2, root.level + 1));
        this.updateNodePositionWhenDelete(root.left, x - dx, y + 50, level - 1, "left", root.value, x, y);
        this.updateNodePositionWhenDelete(root.right, x + dx, y + 50, level - 1,  "right", root.value, x, y);
    }


    updateNodePositions(root, svg_element, x, y, level, direction=null, valueParent=null, xParent=0, yParent=0) {
        if (root === null) {
            return;
        }
        
        if(direction != null){
            //remove the line connecting the node with its parent
            // this.removeLine(root.value, valueParent);
            let line = document.getElementById("line" + valueParent + direction);
            console.log("searching line" + valueParent + direction + "to remove");
            console.log("linea obtenida:", line);
            if(line != null){
                console.log("removing line", line.id)
                document.getElementById("svg-tree").removeChild(line);
            }
        }

        this.animateNodeMove(root.value, x, y);


        // update level
        root.level = level;

        // redraw the line connecting the node with its parent
        setTimeout(() =>{
            this.drawLineWithAnimation(svg_element, x, y, xParent, yParent, valueParent, direction, this.color)
        }, 1500)
    
        // Actualizar las coordenadas de los hijos
        var dx = this.central_point * (1 / Math.pow(2, root.level + 1));
        this.updateNodePositions(root.left, svg_element, x - dx, y + 50, level + 1, "left", root.value, x, y);
        this.updateNodePositions(root.right, svg_element, x + dx, y + 50, level + 1,  "right", root.value, x, y);
    }

    // animate node movement
    animateNodeMove(value, newX, newY) {
        
        anime({
          targets: `#circle-${value}`,
          cx: newX,
          cy: newY,
          easing: "easeInOutQuad",
          duration: 1500,
        });
        anime({
            targets: `#text-${value}`,
            x: newX,
            y: newY,
            easing: "easeInOutQuad",
            duration: 1500,
        });
      }

      // transform the nodes when they reach level 6
      resizeNodes(level){
        if(level >= 6){
            //this second if is to avoid the nodes to be resized more than once
            if(this.circle_radius != 7){
                // change the dimensions of the nodes
                this.circle_radius = 7;
                this.circle_stroke_width = 1;
                this.circle_text_size = "8px";
                this.y_plus_this = 7; // we change this here so when a new node is inserted the line connecting it with its parent looks good
                this.line_stroke_width = 1;
                var circles = document.querySelectorAll("circle");
                var lines = document.querySelectorAll("line");
                var texts = document.querySelectorAll("text");
                for (var i = 0; i < circles.length; i++) {
                    circles[i].setAttribute("r", this.circle_radius);
                    circles[i].setAttribute("stroke-width", this.circle_stroke_width);
                    // circles[i].setAttribute("stroke", "blue");
                    texts[i].setAttribute("font-size", this.circle_text_size);
                    // texts[i].setAttribute("fill", "blue");
                    if(lines[i]){
                        var y2 = parseInt(lines[i].getAttribute("y2"));
                    var y1 = parseInt(lines[i].getAttribute("y1"));
                    lines[i].setAttribute("y1", y1 + 9);
                    lines[i].setAttribute("y2", y2 - 9);
                    lines[i].setAttribute("stroke-width", this.line_stroke_width);
                    }
                }
        }
        }
        else {
            if(this.circle_radius != 15){
                // change the dimensions of the nodes
                this.circle_radius = 15;
                this.circle_stroke_width = 3;
                this.circle_text_size = "15px";
                this.y_plus_this = 16; // we change this here so when a new node is inserted the line connecting it with its parent looks good
                this.line_stroke_width = 2;
                var circles = document.querySelectorAll("circle");
                var lines = document.querySelectorAll("line");
                var texts = document.querySelectorAll("text");
                for (var i = 0; i < circles.length; i++) {
                    circles[i].setAttribute("r", this.circle_radius);
                    circles[i].setAttribute("stroke-width", this.circle_stroke_width);
                    // circles[i].setAttribute("stroke", "blue");
                    texts[i].setAttribute("font-size", this.circle_text_size);
                    // texts[i].setAttribute("fill", "blue");
                    if(lines[i]){
                        var y2 = parseInt(lines[i].getAttribute("y2"));
                    var y1 = parseInt(lines[i].getAttribute("y1"));
                    lines[i].setAttribute("y1", y1 - 9);
                    lines[i].setAttribute("y2", y2 + 9);
                    lines[i].setAttribute("stroke-width", this.line_stroke_width);
                    }
                }
        }
        }

      }

    //   resizeNodes22(root, level, y){
    //     if(root === null){
    //         return;
    //     }
    //     if(level >= 2){
    //         this.circle_radius = 7;
    //         this.circle_stroke_width = 1;
    //         this.circle_text_size = "8px";
    //         this.y_plus_this = 7;
    //         this.line_stroke_width = 1;
    //         var circle = document.getElementById("circle-" + root.value);
    //         var text = document.getElementById("text-" + root.value);
    //         var lineLeft = document.getElementById("line" + root.value + "left");
    //         var lineRight = document.getElementById("line" + root.value + "right");
    //         circle.setAttribute("r", this.circle_radius);
    //         circle.setAttribute("stroke-width", this.circle_stroke_width);
    //         text.setAttribute("font-size", this.circle_text_size);
    //         if(lineLeft){
    //             // lineLeft.setAttribute("y1", y + 50 - this.y_plus_this);
    //             // lineLeft.setAttribute("y2", y + this.y_plus_this);
    //         }
    //         if(lineRight){
    //             // lineRight.setAttribute("y1", y + 50 - this.y_plus_this);
    //             // lineRight.setAttribute("y2", y + this.y_plus_this);
    //         }

    //         this.resizeNodes22(root.left, level, y + 50);
    //         this.resizeNodes22(root.right, level, y + 50);
    //     }
    //   }

        // animate the nodes when inserting a new node
        async highlightNode(nodeValue, color, traverse=false) {
            return new Promise(resolve => {
                const node = document.getElementById("circle-" + nodeValue);
                const text = document.getElementById("text-" + nodeValue);
            if(!traverse){
                anime({
                    targets: node,
                    r: [this.circle_radius,this.circle_radius - 1 + 5, this.circle_radius], // Cambio de tamaño
                    // fill: ["#fff", "#fff", "#fff"], // Cambio de color
                    stroke: [color, color, color], // Cambio de color
                    duration: 1000,
                    easing: 'easeInOutQuad',
                    complete: resolve,
                  });
            }
            else{
                anime({
                    targets: node,
                    stroke: [color, color, color], // Cambio de color
                    duration: 1000,
                    easing: 'easeInOutQuad',
                    complete: resolve,
                  });
              }
            
              anime({
                targets: text,
                fill: [color, color, color], // Cambio de color
                duration: 1000,
                easing: 'easeInOutQuad',
                complete: resolve,
              })

              
            });

            
        }

        resetNodes(){
            var circles = document.querySelectorAll("circle");
            var texts = document.querySelectorAll("text");
            var lines = document.querySelectorAll("line");
            for (var i = 0; i < circles.length; i++) {
                // circles[i].setAttribute("r", "7");
                circles[i].setAttribute("stroke-width", this.circle_stroke_width);
                circles[i].setAttribute("stroke", this.color);
                circles[i].setAttribute("fill", "none");
                texts[i].setAttribute("font-size", this.circle_text_size);
                texts[i].setAttribute("fill", this.color);
            }

            lines.forEach(line => {
                line.setAttribute("stroke", this.color);
                line.setAttribute("stroke-width", this.line_stroke_width);
                line.setAttribute("style", "none");
            });
        }

        // highlightLine(value, direction){
        //     const line = document.getElementById("line" + value + direction);
        //    if (line){
        //     return new Promise(resolve => {
                
        //         anime({
        //             targets: line,
        //             // strokeDashaarray: [0, line.getAttribute("length")],
        //             strokeOpacity: [0, 1],
        //             stroke: ["#F57120", "#F57120", "#F57120"], // Cambio de color
        //             strokeWidth: [2, 2 + 5, 2], // Cambio de tamaño
        //             easing: "easeInOutQuad",
        //             duration: 500,
        //             complete: resolve,
        //         })
        //     });
        //    }
        // }

        highlightLine(value, direction, color) {
            const line = d3.select("#line" + value + direction);
            if (line.node()) {
              return new Promise(resolve => {
                const gradientId = "colorGradient"; // ID del gradiente definido en el SVG
                
                // Aplicar gradiente de color al trazo de la línea
                line.style("stroke", `url(#${gradientId})`);
                var stops = document.querySelectorAll("stop");
                stops.forEach(stop => {
                    stop.setAttribute("stop-color", color);
                });
                
                // Animar el gradiente de opacidad para crear el efecto de cambio gradual
                line.style("stroke-opacity", 0)
                  .transition()
                  .duration(500)
                  .style("stroke-opacity", 1)
                  .on("end", resolve);
              });
            }
          }



        // to put the algorithm in the info box and show it
        showAlgorithm(action){
            var mainDiv = document.getElementById("divInfo");
            // mainDiv.removeChild(this.p_info);
            // inside tempDiv we will create the divs that will contain the steps of the algorithm
            var tempDiv = document.createElement("div");
            mainDiv.appendChild(tempDiv);   
            if(action === 'i'){
                let div1 = document.createElement("div");
                let div2 = document.createElement("div");
                let div3 = document.createElement("div");
                let div4 = document.createElement("div");
                let div5 = document.createElement("div");
                let div6 = document.createElement("div");
                let div7 = document.createElement("div");
                
                // put the info in the divs
                div1.innerHTML = "Looking for the right place to insert the node";
                div2.innerHTML = "Checking the balance factor";
                div3.innerHTML = "Left Rotation";
                div4.innerHTML = "Right Rotation";
                div5.innerHTML = "Left-Right Rotation";
                div6.innerHTML = "Right-Left Rotation";
                div7.innerHTML = "Node balanced";

                // append the divs to the tempDiv
                tempDiv.appendChild(div1);
                tempDiv.appendChild(div2);
                tempDiv.appendChild(div3);
                tempDiv.appendChild(div4);
                tempDiv.appendChild(div5);
                tempDiv.appendChild(div6);
                tempDiv.appendChild(div7);
                mainDiv.appendChild(tempDiv);


            }

            setTimeout(() => {
                mainDiv.removeChild(tempDiv);
            }, 2000);
            }
        }
        


        // // show the insertion algorithm
        // showAlgorithm(action, current_value, bf){
        //     mainDiv = document.getElementById("divInfo");
        //     mainDiv.removeChild(this.p_info);
        //     // inside tempDiv we will create the divs that will contain the steps of the algorithm
        //     tempDiv = document.createElement("div");
        //     mainDiv.appendChild(tempDiv);
        //     if(action === 'i'){
        //         step1 = document.createElement("div");
        //         step1.innerHTML = "Looking for the right place to insert the new node";
        //         step2 = document.createElement("div");
        //         step2.innerHTML = "The bf of " + current_value + " is " + bf;
        //         step3_1 = document.createElement("div");
        //         step3_1.innerHTML = "Left Rotation"
        //         step3_2 = document.createElement("div");
        //         step3_2.innerHTML = "Right Rotation"
        //         step3_3 = document.createElement("div");
        //         step3_3.innerHTML = "Left-Right Rotation"
        //         step3_4 = document.createElement("div");
        //         step3_4.innerHTML = "Right-Left Rotation"
        //         step4 = document.createElement("div");
        //         step4.innerHTML = current_value + " is balanced";
        //     }
        // }



//#008000 green