import { Animator } from "./animator"

const inputView = document.getElementById("input")

const animator = new Animator(document.getElementById("diagram"))

function validateAndCreateButton() {
  if (document.getElementById('coolBtn') != undefined) return

  const btn = document.createElement('button')
  btn.textContent = "Validar"
  btn.id = "coolBtn"
  btn.onclick = (e) => btnHandler(e)
  document.getElementById("cool").appendChild(btn)
}

function btnHandler(e) {
  e.target.disabled = true
  for (let i = 0; i < animator.nodes.length; i++) {
    animator.nodes[i].changeStatus("Inactive")
  }
  for (let i = 0; i < animator.transitions.length; i++) {
    animator.transitions[i].changeStatus("Inactive")
  }
  animator.startValidation(inputView)
}


document.addEventListener('keypress', (e) => {
  if (e.key === "Enter" && inputView.textContent.length >= 9) {
      document.getElementById("coolBtn").click()
  }
  if (!inputView || e.key === "Enter" || e.key.trim() == "") return;
  if (inputView.textContent.length == 8) {
    validateAndCreateButton()
  }
  if (inputView.textContent.length >= 9) {
    return
  }

  inputView.textContent += e.key.toUpperCase()
})

document.addEventListener('keydown', (e) => {
  if (e.key !== "Backspace") return;
  if (inputView.textContent.length === 9) {
    const btnToRemove = document.getElementById("coolBtn")
    document.getElementById("cool").removeChild(btnToRemove)
  }
  inputView.textContent = inputView.textContent.slice(0, inputView.textContent.length - 1);
})

function loop() {
  animator.render()
  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)