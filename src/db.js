const mysql = require('mysql');

const connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'nene1987',
	database:'irriga'
});

connection.connect(error => {
  if (error) throw error;
    console.log("Sucessfully connected to the database");
});

module.exports = connection;


