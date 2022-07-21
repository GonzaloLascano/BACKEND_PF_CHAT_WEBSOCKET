const socket = io.connect();

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

socket.on('mocks', (data) => {
    handleRenderer(data);
})
