// controllers/locationController.js
const State = require('../../model/admin/state');
const City = require('../../model/admin/city');
const { Country, State: CSCState, City: CSCCity } = require('country-state-city');

const addStatesAndCities = async (req, res) => {
  try {
    const countryCode = 'IN';

    // Fetch country information
    const country = Country.getCountryByCode(countryCode);

    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }

    // Fetch states from the country-state-city module
    const states = CSCState.getStatesOfCountry(countryCode);

    // Save states to the database
    const savedStates = await Promise.all(states.map(async (state) => {
      const newState = new State({
        name: state.name, // Save state name
        isoCode: state.isoCode, // Save state code
        countryCode: state.countryCode,
        countryName: country.name // Save country name
      });
      return await newState.save();
    }));

    // Fetch and save cities for each state
    const savedCities = await Promise.all(savedStates.map(async (state) => {
      const cities = CSCCity.getCitiesOfState(countryCode, state.isoCode);
      return await Promise.all(cities.map(async (city) => {
        const newCity = new City({
          name: city.name, // Save city name
          stateName: state.name, // Save state name
          countryCode: city.countryCode
        });
        return await newCity.save();
      }));
    }));

    res.status(201).json({ message: 'States and cities added successfully', states: savedStates, cities: savedCities });
  } catch (error) {
    console.error('Error adding states and cities:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { addStatesAndCities };
