const {createServer} = require("http");
const fs = require("fs");

function contentType(extension){
    switch(extension){
        case "html": return "text/html";
        case "css": return "text/css";
        case "js": return "text/javascript";
        case "jpg": return "image/jpg";
        case "png": return "image/png";
        case "json": return "application/json";
        default: return "text/plain";
    }
}

function servirFichero(respuesta, ruta,tipo,status){
    respuesta.writeHead(status, { "Content-type" : tipo });
    
    let fichero = fs.createReadStream(ruta);

    fichero.pipe(respuesta);

    fichero.on("end", () => {
        respuesta.end();
    });
}

const servidor = createServer((peticion, respuesta) => {
    if(peticion.url == "/"){
        servirFichero(respuesta,"./estaticos/index.html","text/html",200);
    }else{
        let ruta = "./estaticos" + peticion.url;
        fs.stat(ruta, (error,datos) => {
            if(!error && datos.isFile()){
                return servirFichero(respuesta,ruta,contentType(ruta.split(".").pop()),200);
            }
            servirFichero(respuesta,"./404.html","text/html",404);
        });
       
    }
    
});

servidor.listen(process.env.PORT || 3000);