import Transition from "./Transitions";

/**
 * Node hace referencia a las bolitas de los autómatas
 * Esta clase es la encargada de administrar y renderizarlas
 */
export class Node {

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {Array<Transition>} previous - Usado por animator.js
     * @param {Array<Transition>} next  - Usado por animator.js
     * @param {CanvasRenderingContext2D} context 
     */
    constructor(x, y, previous=[], next=[], context, isInitial = false, isFinal = false) {
        this.x = x;
        this.y = y;
        this.radius = 25
        this.next = next;
        this.previous = previous
        this.context = context;
        this.isInitial = isInitial;
        this.isFinal = isFinal
        this.color = "rgb(222, 222, 222)"
    }

    /**
     * 
     * @param {string} identified - Se usa al momento de renderizar, es la letra que se renderiza dentro del círculo después de la "Q"
     */
    setTag(identified) {
        this.context.save()
        this.context.fillStyle = this.color
        this.context.font = `normal ${this.radius - 4}px monospace`
        const text = `Q${identified}`
        const textSize = this.context.measureText(text)
        this.context.fillText(text, this.x - (textSize.width / 2), this.y + (this.radius / 4))
        this.context.restore()
    }

    /**
     * Renderiza el Node actual
     */
    render() {
        this.context.save()
        this.context.strokeStyle = this.color
        this.context.beginPath()
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        this.context.stroke()
        this.context.closePath()
        // Si es final, dibujará un circulo de menor tamaño en la misma posición del circulo principal
        if (this.isFinal) {
            this.context.beginPath()
            this.context.arc(this.x, this.y, this.radius - 5, 0, Math.PI * 2)
            this.context.stroke()
            this.context.closePath()
        }
        // Esto dibuja un triangulo antes del circulo, en caso de que sea invocado como un Node inicial
        if (this.isInitial) {
            this.context.beginPath()
            this.context.moveTo(this.x - this.radius - 3, this.y)
            this.context.lineTo(this.x - this.radius - 25, this.y - (this.radius - 9))
            this.context.lineTo(this.x - this.radius - 25, this.y + (this.radius - 9))
            this.context.lineTo(this.x - this.radius - 3, this.y)
            this.context.stroke()
            this.context.closePath()
        }
        this.context.restore()
    }

    /**
     * Cambia el color del Node y de la letra del identificador según la situacion
     * @param {string} mood - Color del Node y de la letra
     */
    changeStatus(mood = "Active" || "Inactive" || "Passed") {
        switch (mood) {
            case "Active": this.color = "rgb(222, 222, 222)"; break;
            case "Inactive": this.color = "rgb(94, 94, 94)"; break;
            case "Wrong": this.color = "red"; break;
            case "Passed": this.color = "blue"; break;
            default: this.color = "red"; break;
        }
    }
}