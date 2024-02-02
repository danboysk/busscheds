// To make live requests get your app_id and app_key by signing up at https://developer.transportapi.com/signup
// and filling them here
const appId       = 'ee05f247';
const appKey      = '378c2b4e057a94b33f164928591a1543';
const fetchButton = document.getElementById('getBusInfo');

// Name: fetchButton
// Description: fetchButton event listener, responds on click 

fetchButton.addEventListener('click', () => {
  const stopATCOCodeField = document.getElementById('stopATCOCode');
   
  // Debug information on the Stop: 450024834
  console.log(`Button clicked: ${stopATCOCodeField.value} `);

  // Check the field has a value
  if (stopATCOCodeField.value != '') {
    // Call the function to generate stop information
    fetchDepartureInformation(stopATCOCodeField.value);
  }

});


// Name: fetchDepartureInformation
// Description: Fetch information from transportapi

function fetchDepartureInformation(busCode){

  const url = (appId === '' || appKey === '')
    ? 'https://storage.googleapis.com/roselabs-poc-images/arcade-hero/response.json'
    : `https://transportapi.com/v3/uk/bus/stop_timetables/${busCode}.json?app_id=${appId}&app_key=${appKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const departures = data.departures;
      const rows = Object.keys(departures)
        .filter(line => departures[line].length > 0)
        .slice(0,5) // Present first 5 routes
        .map(line => {
          const service = departures[line][0];
          return `
            <br>
            <tr>
              <td>${service.aimed_departure_time}</td>
              <td>${service.line_name}</td>
              <td>${service.direction}</td>
            </tr>
          `;
        })
        .join('\n');
      const html = `
        <table>
          <tr>
            <th>Time</th>
            <th>Line</th>
            <th>Destination</th>
          </tr>
          ${rows}
        </table>
      `;
      const appElement = document.getElementById('app');
      appElement.innerHTML = html;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}
