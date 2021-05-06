const fs= require('fs');
const {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal,
  } = require("../lib/animals.js");
const { animals }= require('../data/animals.json');

jest.mock('fs');

test("creates an animal object", () => {
    const animal= createNewAnimal({name: "Darlene", id: "sfsdfs9"}, animals);

    expect(animal.name).toBe("Darlene");
    expect(animal.id).toBe("sfsdfs9");
});

test("filter by query", () => {
    const startingAnimals= [
        {
            id: "3",
            name: "Erica",
            species: "gorilla",
            diet: "omnivore",
            personalityTraits: ["quirky", "rash"],
        },
        {
            id: "4",
            name: "Noel",
            species: "bear",
            diet: "omnivore",
            personalityTraits: ["impish", "sassy", "brave"],
        },
    ];

    const updatedAnimals= filterByQuery({species: "gorilla"}, startingAnimals);

    expect(updatedAnimals.length).toEqual(1);
});

test("finds by id", () => {
    const startingAnimals= [
        {
            id: "3",
            name: "Erica",
            species: "gorilla",
            diet: "omnivore",
            personalityTraits: ["quirky", "rash"],
        },
        {
            id: "4",
            name: "Noel",
            species: "bear",
            diet: "omnivore",
            personalityTraits: ["impish", "sassy", "brave"],
        },
    ];

    const result= findById("3", startingAnimals);

    expect(result.name).toBe("Erica");
});

test("validates personality traits", () => {
    const animal = {
        id: "3",
        name: "Erica",
        species: "gorilla",
        diet: "omnivore",
        personalityTraits: ["quirky", "rash"],
      };

      const invalidAnimal = {
        id: "3",
        name: "Erica",
        species: "gorilla",
        diet: "omnivore",
      };

      const result1= validateAnimal(animal);
      const result2= validateAnimal(invalidAnimal);

      expect(result1).toBe(true);
      expect(result2).toBe(false);
});