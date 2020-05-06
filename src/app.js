const express = require("express");
const db = require("./db");

const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `📡 [${method.toUpperCase()}] ${url}`;

  console.time(logLabel);
  
  next();

  console.timeEnd(logLabel);
}

app.use(logRequests);

/* Lista todas as estações meteorológicas disponíveis. */
app.get("/weather-stations", (request, response) => {

  const sql = 'SELECT * FROM weather_stations';

  db.query(sql, (err, results) => {
    if(err) throw err;
      return response.status(200).json(results);
  });
});

/* Lista as informações de uma estação meteorológica, através de seu identificador definido por :id.
Deve retornar um array JSON e status 200. Se a estação não for encontrada, deve retornar status 404. */
app.get("/weather-stations/:id", (request, response) => {
  
  const { id } = request.params;

  const sql = 'SELECT * FROM weather_stations WHERE id='+id;

  db.query(sql, (err, results) => {
    if(err) {
      return response.status(404).json({ error: 'Erro find Station'});
    } else {
      if (results.length == 0)
        return response.status(404).send();
      return response.status(200).json(results);
    } 
  });
});

/* criação de uma nova estação meterológica */
app.post("/weather-stations", (request, response) => {
  const { id, name, timezone, latitude, longitude, altitude } = request.body;

  const sql = 'SELECT * FROM weather_stations WHERE id='+id;

  db.query(sql, (err, results) => {
    if(err) {
      return response.status(400).json({ error: 'Error BD!'});
    } else {
      if(results.length > 0) {
        return response.status(400).json({ error: 'id already exists'});
      } else {
        let sql = "INSERT INTO weather_stations (id, name, timezone, latitude, longitude, altitude) VALUES ('"+id+"','"+name+"','"+timezone+"','"+latitude+"','"+longitude+"','"+altitude +"')";
        
        db.query(sql, (err, results) => {
          if(err) {
            return response.status(400).json({ error: 'Error BD!'});
          } else {
            return response.status(201).send();
          }
        });

      }
    }
  });
});

app.post("/weather-data/:id", (request, response) => {
  const { id } =  request.params;
  const { air_temperature, air_humidity, wind_speed, rainfall, moment } = request.body;

  const sql = 'SELECT * FROM weather_data_'+id;

  db.query(sql, (err, results) => {
    if(err) {
      return response.status(404).send(err);
    } else {
      const date1 = new Date(results[0].moment);
      const date2 = new Date(moment);
      console.log(date1 + " " + date2);
      if(date1.getTime() === date2.getTime()) {
        return response.status(409).send();
      } else {
        let sql = "INSERT INTO weather_data_"+id+" (id, air_temperature, air_humidity, wind_speed, rainfall, moment) VALUES ('"+id+"','"+air_temperature+"','"+air_humidity+"','"+wind_speed+"','"+rainfall+"','"+moment+"')";
        
        db.query(sql, (err, results) => {
          if(err) {
            return response.status(500).send(err);
          } else {
            return response.status(201).send();
          }
        });
      }
    }
  })
});

app.get("/weather-data/:id", (request, response) => {
  
  const { id } = request.params;
  
  const sql = 'SELECT * FROM weather_data_'+id;

  db.query(sql, (err, results) => {
    if(err) {
      return response.status(404).send();
    } else {
      if(results.length == 0) {
        return response.status(404).send();
      } else {
        return response.status(200).json(results);
      }
    }
  });
});


module.exports = app;
