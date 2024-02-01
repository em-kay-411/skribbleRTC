function startTimer(drawtime) {
    let timeLeft = drawtime;

    function updateTimer(){
        timer.innerHTML = `<i class="fa fa-clock-o"></i>${timeLeft}`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            writing = false;
            console.log('disabled writing');
            socket.emit('switch-turn');
        }
    }

    const timerInterval = setInterval(() => {
        updateTimer();
    }, 1000);
}

