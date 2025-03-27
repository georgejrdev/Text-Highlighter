/* 
    CSS Classes names and HTML buttons ID of possible actions of emphasis.

    To add more actions you need to create a new class that defines the applied style and a button with the 
    same id as the class it will apply to. Example: To add a button that defines a highlight with the color orange, 
    then you would need to create the .orange class, a button with the id #orange, and insert this "orange" in this 
    list.
*/
const emphasisAction = ["yellow-emphasis","blue-emphasis","green-emphasis","red-underline"]

var stackTextState = []

var stackPopTextState = []

// Set initial text state
if (stackTextState.length == 0) {
    stackTextState.push(document.getElementById("text").innerHTML.trim())
}

// Add event listeners to emphasis buttons to set action
emphasisAction.forEach(action => {
    document.getElementById(action).addEventListener("click", () => {
        // Define which action to use
        localStorage.setItem("action", action)
    })
})

// Add event listener to clear action
document.getElementById("normal-select").addEventListener("click", () => {
    localStorage.removeItem("action")
})

// Add event listeners to delete emphasis selection
document.getElementById("delete").addEventListener("click", () => {
    localStorage.setItem("action", "delete")
})

// Add event listeners to undo and redo buttons
document.getElementById("undo").addEventListener("click", () => {
    undo()
})

document.getElementById("redo").addEventListener("click", () => {
    redo()
})

// Add event listener to execute action in the text
document.addEventListener("mouseup", () => {
    const selection = window.getSelection()
    if (!selection.rangeCount) return

    const range = selection.getRangeAt(0)
    if (range.collapsed) return 

    const span = document.createElement("span")
    const spanClass = localStorage.getItem("action")

    if (spanClass === null || spanClass === undefined || !emphasisAction.includes(spanClass)) return

    span.classList.add(spanClass)

    try {
        range.surroundContents(span)
    } catch (e) {

        const fragment = range.extractContents()
        span.appendChild(fragment)
        range.insertNode(span)
    }

    selection.removeAllRanges()
    stackTextState.push(document.getElementById("text").innerHTML.trim())

    /* 
        Add here actions that you want to happen after applying the selection. 
        To access the current text you can use const currentText = stackTextState[stackTextState.length -1] 
    */
})

// Add event listener to undo and redo with ctrl+z and ctrl+y
document.addEventListener("keydown", (e)=> {
    if (e.ctrlKey && e.key === "z") {
        undo()
    }

    if (e.ctrlKey && e.key === "y") {
        redo()
    }
})

// Add event listener to delete emphasis
document.getElementById("text").addEventListener("click", (event) => {
    if (localStorage.getItem("action") === "delete") {
        const span = event.target
        if (span.tagName === "SPAN" && emphasisAction.includes(span.className)) {
            const parent = span.parentNode
            while (span.firstChild) {
                parent.insertBefore(span.firstChild, span)
            }
            span.remove()
            stackTextState.push(document.getElementById("text").innerHTML.trim())
        }
    }
})

function undo(){
    if (stackTextState.length == 1) return

    stackPopTextState.push(stackTextState[stackTextState.length - 1])
    stackTextState.pop()
    document.getElementById("text").innerHTML = stackTextState[stackTextState.length - 1]
}

function redo(){
    if (stackPopTextState.length == 0) return
    
    stackTextState.push(stackPopTextState[stackPopTextState.length - 1])
    stackPopTextState.pop()
    document.getElementById("text").innerHTML = stackTextState[stackTextState.length - 1]
}