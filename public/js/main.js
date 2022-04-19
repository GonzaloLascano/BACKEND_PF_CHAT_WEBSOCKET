const socket = io.connect();

function sendMsg() {
    let message = {content: document.getElementById('content').value, date: Date(), user: document.getElementById('userMail').value}
    socket.emit('message', message)
}

function sendProduct(){
    let newProduct = { 
        title: document.getElementById('prodTitle').value, 
        price: document.getElementById('prodPrice').value,
        thumbnail: document.getElementById('prodThumb').value
    }
    socket.emit('newProd', newProduct)
}

function handleRenderer(productList){
    console.log(productList)
    if (productList.length > 0) {
        let tBody = document.getElementById('table_body')
        tBody.innerHTML = ''
        const template = Handlebars.compile(`
        <th scope="row">{{id}}</th>
        <td>{{title}}</td>
        <td>$ {{price}}</td>
        <td><img src={{img}}></td>
        `)
        
        for (product of productList) {
            console.log(product)
            const html = template({id: product.id, title: product.title, price: product.price, img: product.thumbnail})
            const tr = document.createElement('tr')
            tr.innerHTML = html
            tBody.appendChild(tr)
        }
    }
}

socket.on('refresh', (data) => {
    let msgContainer = document.getElementById('messageBox')
    msgContainer.innerHTML = ''
    for (message of data) { 
        let msg = document.createElement('p')
        msg.innerHTML = `
            <span class="mail fw-bold text-primary">${message.user} </span>
            <span class="date" style="color: brown;">${message.date} </span>
            <span class="user fst-italic text-success">${message.content} </span>
        `
        msgContainer.appendChild(msg)
    }

})

socket.on('refreshProds', (data) => {
    handleRenderer(data)
    console.log(data)
})

socket.on('warning', (data) => {
    console.log(data)
    let alertWarning = data
    alert(alertWarning)
})