let http = require('http'),
    httpProxy = require('http-proxy'),
    Client = require('./client'),
    ipaddr = require('ipaddr.js');

//
// Create a proxy server with custom application logic
//
let proxy = httpProxy.createProxyServer({});
let clients = [];

let server = http.createServer(function(req, res) { // Proxy api
    // You can define here your custom logic to handle the request
    // and then proxy the request.

    const clientIP = req.connection.remoteAddress;

    const alreadyKnownClient = clients.find(client => clientIP === client.getIP() );
    let client = alreadyKnownClient;

    if( !alreadyKnownClient ) {
        client = new Client(clientIP);
        clients.push(client);
    }

    if(client.canHaveAccess()) { // Llamamos a la verdadera api si validamos que el cliente tiene acceso
        client.addRequest();
        proxy.web(req, res, {
            target: 'http://www.google.com',
            changeOrigin: true
        });
    } else {
        res.write("Ya no dispone de acceso al sitio", 500);
        res.end();
    }


});

console.log("proxy listening on port 3030");

server.listen(3030);
