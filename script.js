// Función que envía al servicio de Custom Vision
function sendToAzure() {
    //Obtener la URL del campo de texto
    const url = document.getElementById("url").value;
    // Imprimir en console la url obtenida para corroborar que se obtuvo
    console.log(url);
    // Se inicia la función en segundo plano para enviar la data
    $.ajax({
        // Aquí pones la URL que te da Custom Vision
        url: "https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/674770b0-0b54-4637-91a8-63c1447953fc/classify/iterations/Iteration2/url",
        // Aquí mandamos los headers necesarios 
        beforeSend: function(xhrObj){
            // Headers
            xhrObj.setRequestHeader("Content-Type","application/json");
            //Aquí pones el Prediction-Key que te da Custom Vision
            xhrObj.setRequestHeader("Prediction-key","f1ab9a2c964942c3aa21c8771fa6b2a3");
        },
        // Esta petición se manda por POST ya que lo pide la API y se debe mandar así
        // Por cuestiones de seguridad
        type: "POST",
        // Request body
        data: '{"Url":"' + url + '"}',
    })
    // Si todo sale bien entra aquí
    .done(function(data) {
        // Este algortimo obtiene la predicción mayor de todos los tags
        var majorElement = "";
        var majorPrediction = 0;
        data.predictions.forEach(element => {
            if (majorPrediction < element.probability) {
                majorPrediction = element.probability
                majorElement = element.tagName
            }
        });

        // Redondear la predicción resultante
        const prediction = round(majorPrediction * 100)

        // Aquí se decide si es perro o gato la mayor predicción
        //Cambia cada CASE por el TAg que hayas puesto
        switch(majorElement) {
            case "WARIO":
                document.getElementById("result_space").innerHTML = "La foto es de Wario con una probabilidad de " + prediction + " %"
                break
            case "Wario Chavez":
                document.getElementById("result_space").innerHTML = "La foto es de Wario Chavez con una probabilidad de " + prediction + "%"
                break
            default:
                document.getElementById("result_space").innerHTML = "No se que sea"
        }
    })
    // Si la petición a la API de producción no funciona cae aquí
    .fail(function() {
        alert("error");
    });
}

// Función para redondear el número brindado
function round(num, decimales = 2) {
    var signo = (num >= 0 ? 1 : -1);
    num = num * signo;
    if (decimales === 0) //con 0 decimales
        return signo * Math.round(num);
    // round(x * 10 ^ decimales)
    num = num.toString().split('e');
    num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + decimales) : decimales)));
    // x * 10 ^ (-decimales)
    num = num.toString().split('e');
    return signo * (num[0] + 'e' + (num[1] ? (+num[1] - decimales) : -decimales));
}