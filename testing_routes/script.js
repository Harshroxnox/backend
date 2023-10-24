const axios = require('axios');

// Define the API endpoint URL
const apiUrl = 'http://localhost:3000/tournament_rankings';

// teamArray should be the strings of all teams ids
const teamArray = ['value1', 'value2', 'value3'];
const teamStringValue = teamArray.join(',');

async function fetchData() {

    try {
      const response = await axios.get(apiUrl, { params: { team_ids: teamStringValue } });
      console.log(response.data);
    } catch (error) {
      console.error('An error occurred:', error);
    }
}

fetchData();