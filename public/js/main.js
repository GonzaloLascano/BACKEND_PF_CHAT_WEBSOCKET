const socket = io.connect();

function sendMsg() {
    let message = {body: document.getElementById('content').value, email: document.getElementById('userMail').value}
    socket.emit('message', message)
}

function assistMe(){
    let enviarBtn = document.getElementById('enviar-btn') 
    enviarBtn.className = "my-4 btn-dark btn-lg w-50 mx-auto"
    let message = {body: 'hola! necesito asistencia!', email: document.getElementById('userMail').value}
    socket.emit('assistMe', message)
}

socket.on('refresh', (data) => {
    let msgContainer = document.getElementById('messageBox')
    msgContainer.innerHTML = ''
    for (message of data) { 
        let msg = document.createElement('p')
        msg.innerHTML = `
            <span class="mail fw-bold text-primary">${message.email} </span>
            <span class="date" style="color: brown;">${message.createdAt} </span>
            <span class="user fst-italic text-success">${message.body} </span>
        `
        msgContainer.appendChild(msg)
    }

})

socket.on('warning', (data) => {
    console.log(data)
    let alertWarning = data.error
    alert(alertWarning)
})