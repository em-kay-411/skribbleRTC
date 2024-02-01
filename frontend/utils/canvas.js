let cursorX, cursorY;
let prevCursorX, prevCursorY;
let strokeWidth = 2;
let color;
let leftMouseDown = false;

function onMouseDown(event) {
    if (event.button == 0) {
        leftMouseDown = true;
    }
    cursorX = event.pageX;
    cursorY = event.pageY;
    prevCursorX = event.pageX;
    prevCursorY = event.pageY;
}

function onMouseMove(event) {
    cursorX = event.pageX;
    cursorY = event.pageY;

    if (leftMouseDown && writing) {
        drawLine(prevCursorX, prevCursorY, cursorX, cursorY);
    }

    prevCursorX = cursorX;
    prevCursorY = cursorY;
}

function onMouseUp() {
    leftMouseDown = false;
}

function drawLine(x0, y0, x1, y1) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
}