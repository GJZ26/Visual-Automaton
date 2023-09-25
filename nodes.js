import Transition from "./Transitions";

export class Node {

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {Array<Transition>} previous 
     * @param {Array<Transition>} next 
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

    setTag(identified) {
        this.context.save()
        this.context.fillStyle = this.color
        this.context.font = `normal ${this.radius - 4}px monospace`
        const text = `Q${identified}`
        const textSize = this.context.measureText(text)
        this.context.fillText(text, this.x - (textSize.width / 2), this.y + (this.radius / 4))
        this.context.restore()
    }

    render() {
        this.context.save()
        this.context.strokeStyle = this.color
        this.context.beginPath()
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        this.context.stroke()
        this.context.closePath()
        if (this.isFinal) {
            this.context.beginPath()
            this.context.arc(this.x, this.y, this.radius - 5, 0, Math.PI * 2)
            this.context.stroke()
            this.context.closePath()
        }
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