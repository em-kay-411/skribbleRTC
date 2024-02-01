function mountCanvas() {
    const canvas = document.createElement('canvas');
    canvasContainer.append(canvas);
    const context = canvas.getContext("2d");
    document.oncontextmenu = function () {
        return false;
    }

    let cursorX;
    let cursorY;
    let prevCursorX;
    let prevCursorY;
    let color = 'black';

    function redrawCanvas() {
        canvas.width = canvasContainer.clientWidth;
        canvas.height = canvasContainer.clientHeight;

        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    redrawCanvas();

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', onMouseMove, false);


    let leftMouseDown = false;
    function onMouseDown(event) {

        if (event.button == 0) {
            leftMouseDown = true;
        }

        cursorX = event.clientX - canvas.getBoundingClientRect().left;
        cursorY = event.clientY - canvas.getBoundingClientRect().top;
        prevCursorX = event.clientX - canvas.getBoundingClientRect().left;
        prevCursorY = event.clientY - canvas.getBoundingClientRect().top;
    }
    function onMouseMove(event) {
        cursorX = event.clientX - canvas.getBoundingClientRect().left;
        cursorY = event.clientY - canvas.getBoundingClientRect().top;

        if (leftMouseDown && writing) {
            drawLine(prevCursorX, prevCursorY, cursorX, cursorY);
            socket.emit('drawLine', ({prevCursorX, prevCursorY, cursorX, cursorY}));
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

    socket.on('drawLine', (coordinates)=>{
        drawLine(coordinates.prevCursorX, coordinates.prevCursorY, coordinates.cursorX, coordinates.cursorY);
    })
}

function cleanCanvas(){
    const canvas = document.getElementsByTagName('canvas')[0];
    const context = canvas.getContext("2d");

    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
}