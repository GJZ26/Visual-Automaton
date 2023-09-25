import { Node } from "./nodes"
import Transition from "./Transitions"

/**
 * Animator es el encargado de asignar los estados, colores y poco más a los Nodes
 * y transiciones.
 */
export class Animator {

    /**
     * 
     * @param {HTMLCanvasElement} canvasElement 
     */
    constructor(canvasElement) {
        this.canvas = canvasElement
        this.context = canvasElement.getContext('2d')
        this.canvas.width = window.innerWidth - 7.1
        this.canvas.height = window.innerHeight - 7.1
        this.tost = -1

        let margin = 120

        this.nodes = [
            new Node(100 + (margin * 1), 150, undefined, undefined, this.context, true), // Node inicial
            new Node(100 + (margin * 2), 150, undefined, undefined, this.context),
            new Node(100 + (margin * 3), 150, undefined, undefined, this.context),
            new Node(100 + (margin * 4), 150, undefined, undefined, this.context),
            new Node(100 + (margin * 5), 150, undefined, undefined, this.context),
            new Node(100 + (margin * 6), 150, undefined, undefined, this.context),
            new Node(100 + (margin * 7), 150, undefined, undefined, this.context),
            new Node(100 + (margin * 8), 150, undefined, undefined, this.context),
            new Node(100 + (margin * 9), 150, undefined, undefined, this.context),
            new Node(100 + (margin * 10), 150, undefined, undefined, this.context, false, true), // Node final
            // Parallel Nodes
            new Node(100 + (margin * 5), 250, undefined, undefined, this.context),
            new Node(100 + (margin * 6), 50, undefined, undefined, this.context),
        ]

        this.transitions = [
            new Transition(this.nodes[0], this.nodes[1], "P", this.context),
            new Transition(this.nodes[1], this.nodes[2], "[F-U]", this.context),
            new Transition(this.nodes[2], this.nodes[3], "[A-Z]", this.context),
            new Transition(this.nodes[3], this.nodes[4], "-", this.context),
            new Transition(this.nodes[4], this.nodes[5], "0", this.context),
            new Transition(this.nodes[5], this.nodes[6], "[1-9]", this.context),
            new Transition(this.nodes[6], this.nodes[7], "[0-9]", this.context),
            new Transition(this.nodes[7], this.nodes[8], "-", this.context),
            new Transition(this.nodes[8], this.nodes[9], "[A-Z]", this.context),

            new Transition(this.nodes[4], this.nodes[10], "[1-9]", this.context),
            new Transition(this.nodes[10], this.nodes[6], "[0-9]", this.context),

            new Transition(this.nodes[5], this.nodes[11], "0", this.context),
            new Transition(this.nodes[11], this.nodes[7], "[1-9]", this.context),
        ]

        /*
        Este evento es implementado para obtener la posicion del mouse en la pantalla, y mover el node a la posicion del mouse
        */
        window.addEventListener("mousemove", (e) => {
            if (this.tost < 0 || this.tost >= this.nodes.length) return;
            this.nodes[this.tost].x = e.offsetX;
            this.nodes[this.tost].y = e.offsetY;
        })

        /*
        Este evento ayuda a saber si un click cae dentro del área de un Node, para seleccionarlo y poder moverlo, o simplemente posicionarlo.
        */
        window.addEventListener("click", (e) => {
            if (this.tost !== -1) {
                this.tost = -1;
                return
            }
            for (let i = 0; i < this.nodes.length; i++) {
                if (
                    ((e.offsetX > this.nodes[i].x - this.nodes[i].radius) &&
                        (e.offsetX < this.nodes[i].x + this.nodes[i].radius)) &&
                    ((e.offsetY > this.nodes[i].y - this.nodes[i].radius) &&
                        (e.offsetY < this.nodes[i].y + this.nodes[i].radius))
                ) {
                    this.tost = i
                }
            }
        })
    }

    /**
     * Este método recorre la coleccion de Nodes y transiciones y ejecuta el método de renderizado de cada uno de ellos.
     */
    render() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.nodes.map((node, index) => {
            node.setTag(index)
            node.render()
        })
        this.transitions.map((transition) => {
            transition.render()
        })
    }

    /**
     * Este método comienza la ejecución del autómata
     * @param {HTMLHeadElement} textToVerify - El texto (el elemento H3) donde se aloja el texto que queremos verificar.
     */
    startValidation(textToVerify) {
        textToVerify.classList.add("reviewing")
        let initialNode = undefined

        // Recorre la lista de Nodos para saber cual es el nodo inicial
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].isInitial) {
                initialNode = this.nodes[i]
                break;
            }
        }

        // Recorre la lista de transiciones, y vincula a cada nodo con su transiciones que continuan, y los que tiene por detrás
        for (let i = 0; i < this.transitions.length; i++) {
            this.transitions[i].from.next.push(this.transitions[i])
            this.transitions[i].to.previous.push(this.transitions[i])
        }

        // Enviamos el primer nodo para que empiece a verificar
        readNodes(initialNode, 0, textToVerify)
        /* let initialNode = undefined
        let finalNode = undefined
        console.log(textToVerify.textContent)
        const callStack = []
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].isInitial) {
                initialNode = this.nodes[i]
                break;
            }
        }

        for (let i = 0; i < this.transitions.length; i++) {
            this.transitions[i].from.next.push(this.transitions[i].to)
            this.transitions[i].to.previous.push(this.transitions[i].from)
        }

        readNodes(initialNode)
        */
    }
}

/**
 * Esta funcion lee el Nodo actual, verifica el caracter que tiene que revisar, y valida si coincide con algunas
 * de sus transiciones siguientes.
 * @param {HTMLHeadElement} textToVerify - El elemento que H3 donde está el texto a verificar.
 * @param {Node} currentNode - El Nodo actual a validar.
 * @param {number} charFrom - El indíce del caracter del string que estamos revisando.
 */
function readNodes(currentNode, charFrom, textToVerify) {
    let timeout=20 // Tiempo que se detiene la animacion en cada iteracion de caracter
    let goodChild = 0; // El índice de la transición en donde sí pasó la regla
    let isPassed = false // Flag para saber si el autómata logró encontrar una regla válida para el carácter

    if (currentNode.isFinal) {
        currentNode.color = "green"
        textToVerify.innerHTML = textToVerify.textContent
        textToVerify.removeAttribute("class")
        textToVerify.classList.add("passed")
        restartButton()
        return;
    }

    // Recorre todas las transiciones que tiene por delante, y revisa si el carácter del string que tiene que validar
    // respeta alguna de las reglas de las transiciones
    for (let i = 0; i < currentNode.next.length; i++) {
        if (currentNode.next[i].rule.test(textToVerify.textContent[charFrom])) {
            goodChild = i;
            isPassed = true
            break
        }
    }

    // Cambia el colore del nodo y de su transicion, a blanco para indicar que ese nodo está validando actualmente.
    currentNode.next[goodChild].changeStatus("Active")
    currentNode.changeStatus("Active")

    // Este es un remedio raro para ponerle color a cada letra del h3
    /*
    Basicamente. por cada letra, adjunta un elemento span dentro del h3, 
    ese span tiene una clase espeçifica para cambiar el color de la letra
    según si ya ha sido revisada, o está activa.
     */
    let temp = document.createElement("p")
    for (let i = 0; i < textToVerify.textContent.length; i++) {
        let letter = document.createElement("span")
        if (i == charFrom) {
            letter.classList.add("active")
        }
        else if (i < charFrom) {
            letter.classList.add("reviewed")
        }
        letter.textContent = textToVerify.textContent[i]
        temp.appendChild(letter)
    }
    textToVerify.innerHTML = temp.innerHTML
    temp.innerHTML = ""

    // Set timeout para dar un pequeño delay entre la revision actual, y la siguiente revision del siguiente nodo.
    setTimeout(() => {
        if (currentNode.next.length == 0 || !isPassed) {       // Si no hay más transiciones que revisar o no se ha podido encontrar
            currentNode.next[goodChild].changeStatus("Wrong") // una transicion válida para el caracter, cambia el texto a rojo
            currentNode.changeStatus("Wrong")                // y no hace otro llamado a los nodos siguientes.
            for (let i = 0; i < textToVerify.textContent.length; i++) {
                let letter = document.createElement("span")
                if (i == charFrom) {
                    letter.classList.add("wrong")
                }
                else if (i < charFrom) {
                    letter.classList.add("reviewed")
                }
                letter.textContent = textToVerify.textContent[i]
                temp.appendChild(letter)
            }
            textToVerify.innerHTML = temp.innerHTML
            temp.innerHTML = ""
            restartButton()
            return;
        }
        // Caso contrario, lo pinta de azul
        currentNode.next[goodChild].changeStatus("Passed")
        currentNode.changeStatus("Passed")

        // Se espara un momento
        setTimeout(() => {
            // Y se vuelve a llamar, pero con el siguiente Nodo de la transición correcta, e incrementando el índice del carácter a revisar
            readNodes(currentNode.next[goodChild].to, charFrom + 1, textToVerify)
        }, timeout/2)
    }, timeout)
    /* let nextNodesNumber = currentNode.next.length
    let currentChilds = 0;
    let currentChar = stringVerify.slice(1)

    if (currentNode.isFinal) {
        currentNode.color = "green"
        return true;
    }
    if (nextNodesNumber == 0) {
        currentNode.color = "red"
        return false;
    }

    currentNode.next.
    currentNode.color = "blue"
    readNodes(currentNode.next[currentChilds], currentChar)
    */
}

/**
 * Reemplaza el botón de "Empezar revision" con "Probar con otro", que básicamente refresca la página xd
 */
function restartButton(){
    const oldBtn = document.getElementById("coolBtn")
    document.getElementById("cool").removeChild(oldBtn)
    const newBtn = document.createElement("button")
    newBtn.textContent = "Probar con otro"
    newBtn.onclick = () =>{
        window.location.reload()
    }
    newBtn.id = "coolBtn"
    document.getElementById("cool").appendChild(newBtn)
}