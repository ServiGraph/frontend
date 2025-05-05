# ServiGraph - Frontend

ServiGraph is a visualization tool for service communication data that provides interactive network graphs and Sankey diagrams to help analyze and monitor service interactions.
## Features

- **Network Graph**: This graph helps in interactive visualization of service communications with nodes representing services and directed edges representing calls between services
- **Sankey Graph**: This graph helps in flow visualization showing the volume and direction of service communications
- **Time-based Filtering**: We can select data from different time periods (5, 10, 20, 30, 40, or 50 minutes)
- **Interactive Elements**: We can hover over the nodes and edges for additional information
- **Detailed Modal Views**: We can also click on the edges to view detailed data about specific service interactions

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ServiGraph/frontend
   cd service-graph
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

By default, our application will try to connect to the backend service at `http://127.0.0.1:8090`. If your backend service is running on a different address, please update the API endpoint in the following files:
- `src/components/NetworkGraph.js`
- `src/components/SankeyGraph.js`

Please update the fetch URL if your backend is hosted elsewhere.


## Backend Integration

Our application requires a backend service that provides trace data through the following endpoint:
```
GET /v1/fetchTraceData/{timestamp}
```

Where `{timestamp}` is a Unix timestamp in seconds representing the start time for data retrieval.

The backend service should return JSON data in the following format:

```json
{
  "nodes": [
    {"id": "service1"},
    {"id": "service2"},
    "..."
  ],
  "links": [
    {"source": "service1", "target": "service2", "data": {"..."}},
    "..."
  ]
}
```
### No special hardware is needed other than ensuring backend service access.

## Troubleshooting

### Common Issues

1. **If no data appears in the visualization**
    - Verify your backend service is running
    - Check the console for any API error messages
    - Ensure the timestamp format is correct


2. **If graph is not rendering properly**
    - Try refreshing the page
    - Verify whether the data format from your backend matches the expected structure given above


3. **If you see performance issues with large datasets**
    - Try selecting a shorter time period to reduce the amount of data
    - Consider adding filtering options on the backend

## External Dependencies

- [React JS](https://reactjs.org/) - UI framework
- [D3.js](https://d3js.org/) - Data visualization library
- [React Modal](https://github.com/reactjs/react-modal) - Modal dialog component

## Contributing
If you would like to contribute, please follow the below steps

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/feature-name`)
3. Commit your changes (`git commit -m 'Add feature-name'`)
4. Push to the branch (`git push origin feature/feature-name`)
5. Open a Pull Request

We would love to see what you have for us!!

