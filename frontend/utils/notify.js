function notify(message){
    notification.innerHTML = `${message}`;
    setTimeout(() => {
        notification.innerHTML = '';
    }, 3500)
}