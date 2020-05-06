const APIKEY=process.env.APIKEY             //cria var com a chave da API
const axios = require('axios')
const express = require('express')
const app = express()
const fetch = require("node-fetch");
app.use(express.json())

const local_url = `/weather-stations`

const var_json = []
var api_url = []

//função que irá enviar para o back as informações obtidas.. o endereço de post é calculado baseado no id da estação
function send_data (id, temp){
    //console.log(temp)
    fetch('/weather-data/' + id,{                              //monta a o endereço de post
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                    'Accept' :      "application/json"
                },
                body: JSON.stringify(                                                       //transforma o json em string para o envio
                    temp
                )
            }).then(res => res.json()).then(data => {                                       //printa o retorno do post
                console.log(data) })
    
}

//função responsavel por pegar a URL da API darsky e solicitar os dados de clima, para então chamar a função de enviar os dados para o back-end
function get_data (url, id){
    
    axios.get(url).then((response) => {
        for (i = 0; i < response.data.hourly.data.length ; i++){                            //um laço para montar json com todos os dados da darksky
        var temp_date = new Date('1970-01-01T00:00:00')
        temp_date.setSeconds(temp_date.getSeconds() + `${response.data.hourly.data[i].time}`)
            const temp = {                                                                      //montando a estrutura da json
                'moment':             '' +temp_date, 
                'air_temperature':    '' +response.data.hourly.data[i].temperature, 
                'air_humidity':       '' +response.data.hourly.data[i].humidity, 
                'wind_speed':         '' +response.data.hourly.data[i].windSpeed, 
                'rainfall':           '' +response.data.hourly.data[i].precipIntensity 
                    }
        send_data(id, temp)                                                                 //envia o json e a id da estaçao para a função de enviar dados                                                                                
        }  
    })
}

//através da latitude e longitude presente dentro da API back-end é criada uma URL para solicitar informações do tempo na API daksky
axios.get(local_url).then((res) => {
    
    for (i = 0; i<res.data.length; i++){
        console.log(res.data[i].latitude)           //printa latitude obtida    
        console.log(res.data[i].longitude)          //printa longitude obtida
        api_url.push(`https://api.darksky.net/forecast/cc57eded744c264838f0f10fec22fca4/${res.data[i].latitude},${res.data[i].longitude}?units=auto`)
        console.log(api_url[i])                     //printa a URL da api
        get_data(api_url[i], res.data[i].id)        //chama a função para pegar os dados da darksky
    }
    
});





    
