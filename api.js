var key= '0825b0d32e9998d08d819d9d75d705b3';

$(function () {
    //funcion a ejecutar para la previsión
    $('#prevision').click(function () {
        var nombreCiudad = $("#nombreCiudad").val();
        $("#cambia").append("<img id='loader' src='AJAX_loader.gif'>");
        //llamada a la api para obtener coordenadas
        $.ajax({
            url: `http://api.openweathermap.org/geo/1.0/direct?q=${nombreCiudad}&limit=1&appid=${key}`,
            type: "GET",
            dataType: "json",
            // Si se produce correctamente
            success: function (datos_devueltos) {
                $('#loader').remove();
                var lon = datos_devueltos[0].lon;
                var lat = datos_devueltos[0].lat;
                //llamada a la api para obtener los datos
                $.ajax({
                    url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=sp`,
                    type: "GET",
                    dataType: "json",
                    // Si se produce correctamente
                    success: function (datos_devueltos) {
                        //representar datos en el html
                        console.log(datos_devueltos);
                        $('#loader').remove();
                        var nombre = datos_devueltos.name;
                        $("#ciudad").append(`<h1 id='nombre'>${nombre}</h1>`);
                        $("#temperaturas").append("<h3 id='temp'>Temp  <br />" + Math.trunc(datos_devueltos.main.temp) + "° <br /></h3>");
                        $("#temperaturas").append("<h3 id='term'>S. Térm. <br /> " + Math.trunc(datos_devueltos.main.feels_like) + "° <br /></h3>");
                        if (datos_devueltos.wind) {
                            $("#temperaturas").append("<h3 id='viento'>Viento <br />" + datos_devueltos.wind.speed + " km/h <br /></h3>");
                            if (datos_devueltos.wind.deg > 0 && datos_devueltos.wind.deg < 90) {
                                $("#temperaturas").append("<h3 id='direccion'>Dirección <br /> Norte <br /></h3>");
                            } else if (datos_devueltos.wind.deg > 90 && datos_devueltos.wind.deg < 180) {
                                $("#temperaturas").append("<h3 id='direccion'>Dirección <br /> Este <br /></h3>");
                            } else if (datos_devueltos.wind.deg > 180 && datos_devueltos.wind.deg < 270) {
                                $("#temperaturas").append("<h3 id='direccion'>Dirección <br /> Sur <br /></h3>");
                            } else {
                                $("#temperaturas").append("<h3 id='direccion'>Dirección <br /> Oeste <br /></h3>");
                            }  
                        }
                        var icon = "https://openweathermap.org/img/wn/" + datos_devueltos.weather[0].icon + "@2x.png";
                        $("#estado").append("<h3 id='tiempo'>" + datos_devueltos.weather[0].main + `<br /><img src=${icon} ></br>` + datos_devueltos.weather[0].description + "  <br /></h3>");
                        
                        if (datos_devueltos.rain) {
                            var lluvia = datos_devueltos.rain["1h"];
                            $("#estado").append("<h3 id='lluvia'>Lluvia  <br />" + lluvia + " mm/hora  <br />");
                        }
                        $("#datos").append("<h3 id='visibilidad'>Visibilidad <br />" + datos_devueltos.visibility/1000 + " km <br />");
                        var atardecer = new Date ((3600 + datos_devueltos.sys.sunset)*1000).toUTCString();
                        var amanecer = new Date ((3600 + datos_devueltos.sys.sunrise)*1000).toUTCString(); 
                        $("#datos").append("<h3 id='amanecer'>Amanecer <br />" + amanecer+ "</br>");
                        $("#datos").append("<h3 id='ataardecer'>Atardecer <br />" + " " +atardecer+ "</br>");
                    },
                    // Si la petición falla
                    error: function (xhr, estado, error_producido) {
                        console.log("Error producido: " + error_producido);
                        console.log("Estado: " + estado);
        
                    },
                    //Tanto si falla como si funciona como sino funciona.
                    complete: function (xhr, estado) {
                        console.log("Petición completa");
                    }
                });
                //llamada a la api para obtener la prevision de 5 días
                $.ajax({
                    url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&lang=sp`,
                    type: "GET",
                    dataType: "json",
                    // Si se produce correctamente
                    success: function (datos_devueltos) {
                        console.log(datos_devueltos);
                        for (let i = 0; i < datos_devueltos.list.length; i++) {
                            if (i === 0 || i === 8 || i === 16 || i === 24 || i === 32) {
                                //$("#prev").append(datos_devueltos.list[i].dt_txt + " ");
                                var icon = "https://openweathermap.org/img/wn/" + datos_devueltos.list[i].weather[0].icon + "@2x.png";
                                $("#prev").append("<h3 class='dias'>" + datos_devueltos.list[i].dt_txt + " <br /> " + datos_devueltos.list[i].weather[0].main + `<br /><img src=${icon} ><br />` + datos_devueltos.list[i].weather[0].description + "  <br /></h3>");                        
                            }                            
                        }                       
                    },
                    // Si la petición falla
                    error: function (xhr, estado, error_producido) {
                        console.log("Error producido: " + error_producido);
                        console.log("Estado: " + estado);       
                    },
                    //Tanto si falla como si funciona como sino funciona.
                    complete: function (xhr, estado) {
                        console.log("Petición completa");
                    }
                });
            },
            // Si la petición falla
            error: function (xhr, estado, error_producido) {
                console.log("Error producido: " + error_producido);
                console.log("Estado: " + estado);

            },
            //Tanto si falla como si funciona como sino funciona.
            complete: function (xhr, estado) {
                console.log("Petición completa");
            }
        });
    })

    //funcion a ejecutar para la contaminación
    $('#contaminacion').click(function () {
        var nombreCiudad = $("#nombreCiudad").val();
        $("#conta").html("<img id='loader' src='AJAX_loader.gif'>");
        //llamada a la api para obtener coordenadas
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${nombreCiudad}&limit=1&appid=${key}`)
        .then(data => {
            return data.json();
        })
        .then(dataJson => {
            if(dataJson.cod === '404'){
                $('#conta').append('Ciudad no encontrada');
            } else {
                var lon = dataJson[0].lon;
                var lat = dataJson[0].lat;
                //llamada a la api para obtener los datos
                fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`)
                .then(data => {
                    return data.json();
                })
                .then(dataJson => {
                    //representación de los datos en el html
                    console.log(dataJson);
                    $('#loader').remove();
                    $('#conta').append('<h3>CO: ' + dataJson.list[0].components.co +'</br></h3>');
                    $('#conta').append('<h3>NO: ' + dataJson.list[0].components.no +'</br></h3>');
                    $('#conta').append('<h3>NO2: ' + dataJson.list[0].components.no2 +'</br></h3>');
                    $('#conta').append('<h3>O3: ' + dataJson.list[0].components.o3 +'</br></h3>');
                })
            }
        })
    })
})