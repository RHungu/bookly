const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());

//define the initial genres
let genres = [
    {gid: 1, gname:"Fiction"},
    {gid: 2, gname:"Christian"},
    {gid: 3, gname:"Self Help"},
    {gid: 4, gname:"Biography"},
    {gid: 5, gname:"Money and Finance"}
]

//define the application context
const appcontext = '/api';

/**
 * Display all the genres of books
 */
 app.get(appcontext + '/genres',(req, res)=>{
     res.send(genres);
 });

 //Query a specific genre of a book
 app.get(appcontext + '/genres/:gid', (req,res)=>{
     //

     let selectedGenre = genres.find((genre)=>{
        return genre.gid === parseInt(req.params.gid)
     });

     if(!selectedGenre){
         res.status(404).send('The requested genre cannot be found');
     } else {
         res.send(selectedGenre);
     }
 });


/**
 * Function to validate the input submitted. The input object is validated against a defined schema
 * @param {genres} genre 
 */ 

function validateGenre(genre){
    //define the schema that will be used in validating the input
    const schema = Joi.object({
        gname: Joi.string().required().min(3)  //Ensure that the name of a genre must be at least 3 characters long
    });
    return schema.validate(genre);
}


 //create a new genre
 app.post(appcontext + '/genres', (req, res)=>{
    const validationResult = validateGenre(req.body);
    if (validationResult.error) {
        res.status(400).send(validationResult.error.details[0].message);
        return;
    }

    //create the genre object that will be inserted in the list of genres

    const genre = {
        gid: genres.length + 1,
        gname: req.body.gname
    };

    genres.push(genre);
    res.send(genres);   //return the updated list of genres
 });


 //delete a genre
 app.delete(appcontext + '/genres/:gid', (req,res)=>{
    //

    let selectedGenre = genres.find((genre)=>{
       return genre.gid === parseInt(req.params.gid)
    });
    if(!selectedGenre){
        res.status(404).send('The requested genre cannot be found');
    } else {
        genres.splice(genres.indexOf(selectedGenre),1)
        res.send(genres);
    }
});

//Update an existing genre
app.put(appcontext + '/genres/:gid', (req,res)=>{
    //Start by validating the request data

    const validationResult = validateGenre(req.body);
    if (validationResult.error) {
        res.status(400).send(validationResult.error.details[0].message);
        return;
    }

    //Check if the requested genre exists in the list
    let selectedGenre = genres.find((genre)=>{
       return genre.gid === parseInt(req.params.gid)
    });

    if(!selectedGenre){
        res.status(404).send('The requested genre cannot be found');
    } else {
        genres[genres.indexOf(selectedGenre)].gname =  req.body.gname;
        res.send(genres); //return the updated list of genres
    }
});




 //Set an environment variable for the port that the application should start on
const appPort = process.env.appPort || 3001;

// const appPort = 2005;
 app.listen(appPort, ()=>{
     console.log(`Now listening on port ${appPort}`);
 })
