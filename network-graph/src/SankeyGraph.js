import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyCenter } from 'd3-sankey';

const SankeyGraph = () => {
  const svgRef = useRef();

  useEffect(() => {
    const data = {
      nodes: [
        { id: 'A' },
        { id: 'B' },
        { id: 'C' },
        { id: 'D' },
      ],
      links: [
        { source: 'A', target: 'B', value: 10 },
      //  { source: 'B', target: 'A', value: 10 },
        { source: 'A', target: 'C', value: 5 },
        { source: 'B', target: 'D', value: 15 },
        { source: 'C', target: 'D', value: 5 },
      ]
    };

    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const sankeyGenerator = sankey()
      .nodeId(d => d.id)
      .nodeAlign(sankeyCenter)
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 61]]);

    const { nodes, links } = sankeyGenerator(data);

    svg.append('g')
      .selectAll('rect')
      .data(nodes)
      .enter().append('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', '#69b3a2')
      .append('title')
      .text(d => `${d.id}\n${d.value}`);

    svg.append('g')
      .attr('fill', 'none')
      .selectAll('path')
      .data(links)
      .enter().append('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', '#000')
      .attr('stroke-width', d => Math.max(1, d.width))
      .attr('stroke-opacity', 0.5)
      .append('title')
      .text(d => `${d.source.id} → ${d.target.id}\n${d.value}`);

    svg.append('g')
      .style('font', '10px sans-serif')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .attr('x', d => d.x0 - 6)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .text(d => d.id)
      .filter(d => d.x0 < width / 2)
      .attr('x', d => d.x1 + 6)
      .attr('text-anchor', 'start');
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default SankeyGraph;