import { Node } from "./nodes";

/**
 * Transition hace referencia a las transiciones que puede tener cada Node.
 * Así como su regla, que está representado como expresión regular
 */
export default class Transition {
    /**
     * 
     * @param {Node} from 
     * @param {Node} to 
     * @param {string} rule 
     * @param {CanvasRenderingContext2D} context 
     */
    constructor(from, to, rule, context) {
        this.from = from
        this.to = to
        // Convierte un string a una expresión regular, por ejemplo [a-zA-Z], lo cual implementa
        // métodos como .test() para la validaciones de que usará posteriormente
        this.rule = new RegExp(rule);
        this.context = context
        this.target_x = 0
        this.target_y = 0
        // La regla, pero conservada como string para que se muestre en el renderizado
        this.ruleString = rule
        this.fontSize = 13
        this.color = "rgb(222, 222, 222)"
    }

    /**
     * Renderiza las transiciones como una línea que conecta el Node salida, con el Node destino
     */
    render() {
        /*
         * Las operaciones siguiente, se hacen para que en caso de mover un Node, la transición una
        los Nodes conectados, en el angulo correcto, es decir, que la línea siga la direccion de los
        dos Nodes para evitar que traspase la línea a los nodes
         */
        const fromAngle = Math.atan2(this.to.y - (this.from.y + this.from.radius / 2), this.to.x - (this.from.x + this.from.radius / 2)) + 1.5708
        const fromAxisRelatives = [
            this.from.x + (this.from.radius) * Math.sin(fromAngle),
            this.from.y + (this.from.radius) * Math.cos(fromAngle - 2 * (90 * Math.PI / 180))
        ]

        const toAngle = Math.atan2(this.from.y - (this.to.y + this.to.radius / 2), this.from.x - (this.to.x + this.to.radius / 2)) + 1.5708
        const toAxisRelatives = [
            this.to.x + (this.to.radius) * Math.sin(toAngle),
            this.to.y + (this.to.radius) * Math.cos(toAngle - 2 * (90 * Math.PI / 180))
        ]

        this.context.save()
        this.context.strokeStyle = this.color
        this.context.beginPath()
        this.context.moveTo(fromAxisRelatives[0], fromAxisRelatives[1])
        this.context.lineTo(toAxisRelatives[0], toAxisRelatives[1])
        this.context.stroke()
        this.context.strokeStyle = 'rgb(23, 23, 23)';
        this.context.font = `normal ${this.fontSize}px monospace`
        this.context.lineWidth = 3;
        this.context.strokeText(this.ruleString, (
            (fromAxisRelatives[0] + toAxisRelatives[0]) / 2) - (this.context.measureText(this.ruleString).width / 2),
            ((fromAxisRelatives[1] + toAxisRelatives[1]) / 2))
        this.context.fillStyle = this.color
        // La formulita es la punto medio, es para poner la regla de la transicion justo en medio de la linea dibujada.
        this.context.fillText(this.ruleString, (
            (fromAxisRelatives[0] + toAxisRelatives[0]) / 2) - (this.context.measureText(this.ruleString).width / 2),
            ((fromAxisRelatives[1] + toAxisRelatives[1]) / 2))
        this.context.closePath()
        this.context.restore()
        this.context.save()
        this.context.lineWidth = 1
        this.context.fillStyle = "rgb(65, 65, 65)"
        this.context.font = `normal 15px monospace`
        this.context.fillText("Adolfo G. Juárez - 213358 | 7A", 10, 500)
        this.context.strokeStyle = 'rgb(23, 23, 23)';
        this.context.lineWidth = 0.5;
        this.context.strokeText("Adolfo G. Juárez - 213358 | 7A", 10, 500)
        this.context.restore()
    }

    /**
     * Cambia el color de la Transicion y de la letra del identificador según la situacion
     * @param {string} mood - Color del Node y de la letra
     */
    changeStatus(mood = "Active" || "Inactive" || "Passed") {
        switch (mood) {
            case "Active": this.color = "rgb(222, 222, 222)"; break;
            case "Inactive": this.color = "rgb(94, 94, 94)"; break;
            case "Passed": this.color = "blue"; break;
            case "Wrong": this.color = "red"; break;
            default: this.color = "red"; break;
        }
    }
}
