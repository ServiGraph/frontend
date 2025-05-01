import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyCenter } from 'd3-sankey';

const GraphContainer = () => {
  return (
    <div>
      <button className = {"refresh-button"} onClick={fetchAndRenderGraph}>Refresh</button>
                  {lastUpdated && (
                      <p style={{ fontStyle: 'italic', color: '#555' }}>
                          Last updated: {lastUpdated.toLocaleString()}
                      </p>
                  )}
    </div>
  );
};

export default GraphContainer;