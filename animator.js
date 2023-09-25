import { Node } from "./nodes"
import Transition from "./Transitions"

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
            new Node(100 + (margin * 1), 150, undefined, undefined, this.context, true),
            new Node(100 + (margin * 2), 150, undefined, undefined, this.context),
            new Node(100 + (margin * 3), 150, undefined, undefined, this.context),
            new Node(100 + (margin * 4), 150, undefined, undefined, this.context),
            new Node(100 + (margin * 5), 150, undefined, undefined, this.context),
            new Node(100 + (margin * 6), 150, undefined, undefined, this.context),
            new Node(100 + (margin * 7), 150, undefined, undefined, this.context),
            new Node(100 + (margin * 8), 150, undefined, undefined, this.context),
            new Node(100 + (margin * 9), 150, undefined, undefined, this.context),
            new Node(100 + (margin * 10), 150, undefined, undefined, this.context, false, true),
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

        window.addEventListener("mousemove", (e) => {
            if (this.tost < 0 || this.tost >= this.nodes.length) return;
            this.nodes[this.tost].x = e.offsetX;
            this.nodes[this.tost].y = e.offsetY;
        })

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
     * 
     * @param {HTMLHeadElement} textToVerify 
     */
    startValidation(textToVerify) {
        textToVerify.classList.add("reviewing")
        let initialNode = undefined
        const callStack = []

        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].isInitial) {
                initialNode = this.nodes[i]
                break;
            }
        }

        for (let i = 0; i < this.transitions.length; i++) {
            this.transitions[i].from.next.push(this.transitions[i])
            this.transitions[i].to.previous.push(this.transitions[i])
        }

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
 * @param {HTMLHeadElement} textToVerify 
 * @param {Node} currentNode 
 */
function readNodes(currentNode, charFrom, textToVerify) {
    let timeout=20
    let goodChild = 0;
    let isPassed = false
    if (currentNode.isFinal) {
        currentNode.color = "green"
        textToVerify.innerHTML = textToVerify.textContent
        textToVerify.removeAttribute("class")
        textToVerify.classList.add("passed")
        restartButton()
        return;
    }


    for (let i = 0; i < currentNode.next.length; i++) {
        if (currentNode.next[i].rule.test(textToVerify.textContent[charFrom])) {
            goodChild = i;
            isPassed = true
            break
        }
    }

    currentNode.next[goodChild].changeStatus("Active")
    currentNode.changeStatus("Active")

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


    setTimeout(() => {
        if (currentNode.next.length == 0 || !isPassed) {
            currentNode.next[goodChild].changeStatus("Wrong")
            currentNode.changeStatus("Wrong")
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
        currentNode.next[goodChild].changeStatus("Passed")
        currentNode.changeStatus("Passed")
        setTimeout(() => {
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