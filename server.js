const express= require('express');
const PORT= process.env.PORT || 3001;
const fs= require('fs');
const { clear } = require('node:console');
const { type } = require('node:os');
const path= require('path');
const { setFlagsFromString } = require('v8');

const app= express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const { animals }= require('./data/animals.json');

function findById(id, animalsArray) {
    const result= animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray= [];
    let filteredResults= animalsArray;

    if (query.personalityTraits) {

        if ( typeof query.personalityTraits === 'string') {
            personalityTraitsArray= [query.personalityTraits];
        }
        else {
            personalityTraitsArray= query.personalityTraits;
        }
    personalityTraitsArray.forEach(traits => {

        filteredResults= filteredResults.filter(animal => animal.personalityTraits.indexOf(traits) !== -1);
    });
    }

    if (query.diet) {
        filteredResults= filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults= filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults= filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function createNewAnimal(body, animalsArray) {
    const animal= body;
    animalsArray.push(animal);

    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({animals: animalsArray}, null, 2)
    );
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || typeof animal.personalityTraits !== 'string') {
        return false;
    }
    return true;
}

app.get('/api/animals', (req, res) => {
    let results= animals;
    if (req.query) {
        results= filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    const result= findById(req.params.id, animals);
    res.json(result);
});

app.post('/api/animals', (req, res) => {
    // console.log(req.body);
    req.body.id= animals.length.toString();

    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    }
    else {
        const animal= createNewAnimal(req.body, animals);
        res.json(animal);
    }  
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
