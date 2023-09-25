import { Node } from "./nodes";

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
        this.rule = new RegExp(rule);
        this.context = context
        this.target_x = 0
        this.target_y = 0
        this.ruleString = rule
        this.fontSize = 13
        this.color = "rgb(222, 222, 222)"
    }

    render() {
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
