# Exchange-rate
Create a database containing the average monthly dollar exchange rate.

### Project construction:
- Backend in Node.js.
- Frontend in React.
- Docker Compose for full execution.
- Automated tests for frontend and backend.


### Running all containers - Backend, Frontend, tests:
```
docker-compose up --build
```

### Folder structure:
- backend/ -Server-side code + tests
- frontend/ -Client-side code + components and tests      
- docker-compose.yml -Compose file for running all containers


### Usage:
The database will be updated every 01 of the month for the previous month.

The information is updated from a connection to the Bank of Israel.

1. You can filter months and display forecasts.
2. The colors in the average table reflect high/low values.
3. Clicking the "Show Forecast Matrix" button will display the forecasts, differences, and multiples.
4. Average graph by months.


The web:


<video src="https://github.com/DvoryLichtshein/Exchange-rate/blob/main/video.mp4" controls width="700"></video>
