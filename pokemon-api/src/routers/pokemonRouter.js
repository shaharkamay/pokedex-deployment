const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Pokedex = require('pokedex-promise-v2');
const pokedex = new Pokedex();



router.get('/get/:id', async (req, res, next) => {
    const id = req.params.id;
    if(isNaN(id) || id <= 0) {
        next({ status: 400, message: "id must be of type number and bigger than 0" });
    } else {
        try {
            const pokemonData = minimizePokemonObj(await pokedex.getPokemonByName(id));
            res.status(200).json(pokemonData);
            res.end();
        } catch (err) {
            next({ status: 404, message: "pokemon doesnt exist" });
        }
    }
})

router.get("/query", async (req, res, next) => {
    const name = req.query.name;
    if(!name) {
        next({ status: 400, message: "name querystring doesnt exist!" });
    } else {
        try {
            const pokemonData = minimizePokemonObj(await pokedex.getPokemonByName(name));
            res.status(200).json(pokemonData);
        } catch (err) {
            next({ status: 404, message: "pokemon doesnt exist" });
        }
    }
})

router.put('/catch/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        if(isNaN(id) || id <= 0) {
            next({ status: 400, message: "id must be of type number or bigger than 0" });
        } else {
            const pokemonData = minimizePokemonObj(await pokedex.getPokemonByName(id));
            const username = req.username;
            const filePath = path.resolve(path.join('./src/static-files/users', username, `${id}.json`));
            if(fs.existsSync(filePath)) {
                next({ status: 403, message: "you already have this pokemon!" });
            } else {
                fs.writeFileSync(filePath, JSON.stringify(pokemonData));
                res.status(200).json(pokemonData);
                res.end();
            }
        }
    } catch (err) {
        console.log("Something went wrong with your request");
        next({status: 500 , message: "internal server error"});
    }
})


router.delete("/release/:id", (req, res, next) => {
    const id = req.params.id;
    const username = req.username;
    try {
        const filePath = path.resolve(path.join('./src/static-files/users', username, `${id}.json`));
        if(fs.existsSync(filePath)) {
            fs.rmSync(filePath);
            res.status(200).json(`pokemon with id ${id} has been released successfully`);
            res.end();
        } else {
            next({ status: 403, message: "you cannot release a pokemon you do not have!" });
        }
    } catch (err) {
        console.log("Something went wrong with your request");
        next({status: 500 , message: "internal server error"});
    }
});

router.get("/", (req, res, next) => {
    const username = req.username;
    const userPath = path.resolve(path.join("./src/static-files/users", username));
    const pokemons = [];
    try {
        if(fs.existsSync(userPath)) {
            const pokeJsons = fs.readdirSync(userPath);
            if(pokeJsons.length > 0) {
                for(const pokejson of pokeJsons) {
                    const userPokemon =JSON.parse(fs.readFileSync(`${userPath}/${pokejson}`));
                    pokemons.push(userPokemon);
                }
                res.status(200).json(pokemons);
                res.end();
            } else { next({ status: 409, message: "user didnt catch any pokemons yet!" }); }
        }
    } catch (err) {
        console.log("Something went wrong with your request");
        next({status: 500 , message: "internal server error"});
    }
});














function minimizePokemonObj(pokemon) {
    return {
        id: pokemon.id,
        name: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,
        types: pokemon.types.map(({ type }) => type),
        front_pic: pokemon.sprites.front_default,
        back_pic: pokemon.sprites.back_default,
        abilities: pokemon.abilities.map(({ ability }) => ability),
    };
}

module.exports = router;