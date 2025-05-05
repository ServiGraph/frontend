import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const NetworkGraph = () => {
    // Refs and state management
    const svgRef = useRef();
    const tooltipRef = useRef();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ heading: '', data: null });
    const [selectedMinutes, setSelectedMinutes] = useState(5);
    const [fromTime, setFromTime] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Graph dimensions
    const width = 1200;
    const height = 600;

    // Main function to get data and render the graph
    const fetchAndRenderGraph = async () => {
        setIsLoading(true);
        const now = Math.floor(Date.now() / 1000);
        const fromTimestamp = now - selectedMinutes * 60;
        setFromTime(new Date(fromTimestamp * 1000));

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        // Setup tooltip for hover info
        const tooltip = d3.select(tooltipRef.current)
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('background-color', 'white')
            .style('border', '1px solid #ccc')
            .style('padding', '5px')
            .style('border-radius', '3px')
            .style('pointer-events', 'none');

        try {
            // Get trace data from API
            const response = await fetch(`http://127.0.0.1:8090/v1/fetchTraceData/${fromTimestamp}`);
            const json = await response.json();

            // Make sure links have weights
            json.links.forEach(link => {
                link.weight = link.data !== null ? link.data : 1;
            });

            const data = json;

            // Setup SVG container
            svg.attr('width', '100%').attr('height', '600px')
                .attr('viewBox', `0 0 ${width} ${height}`);

            // Add arrow markers for the links
            svg.append('defs').selectAll('marker')
                .data(['end'])
                .enter().append('marker')
                .attr('id', 'arrowhead')
                .attr('viewBox', '0 -3 8 6')
                .attr('refX', 21)
                .attr('refY', 0)
                .attr('markerWidth', 4)
                .attr('markerHeight', 4)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M0,-3L8,0L0,3L2,0Z')
                .attr('fill', '#000')
                .attr('stroke', '#333')
                .attr('stroke-width', 0.3);

            // Setup force simulation
            const simulation = d3.forceSimulation(data.nodes)
                .force('link', d3.forceLink(data.links).id(d => d.id).distance(200))
                .force('charge', d3.forceManyBody().strength(-500))
                .force('center', d3.forceCenter(width / 2, height / 2));

            // Create the links
            const link = svg.append('g')
                .selectAll('line')
                .data(data.links)
                .enter().append('line')
                .attr('stroke', '#999')
                .attr('stroke-width', 4)
                .attr('marker-end', 'url(#arrowhead)');

            // Create the nodes
            const node = svg.append('g')
                .selectAll('g')
                .data(data.nodes)
                .enter().append('g');

            node.append('circle')
                .attr('r', 20)
                .attr('fill', '#69b3a2')
                .call(drag(simulation));

            // Add labels to nodes
            node.append('text')
                .attr('dy', -30)
                .attr('text-anchor', 'middle')
                .text(d => d.id);

            // Update positions on each tick
            simulation.on('tick', () => {
                // Keep nodes within bounds
                const topSafeZone = 50;
                const padding = 20;

                data.nodes.forEach(d => {
                    if (d.x < padding) {
                        d.x = padding;
                        d.vx = -d.vx;
                    }
                    if (d.x > width - padding) {
                        d.x = width - padding;
                        d.vx = -d.vx;
                    }
                    if (d.y < topSafeZone) {
                        d.y = topSafeZone;
                        d.vy = -d.vy;
                    }
                    if (d.y > height - padding) {
                        d.y = height - padding;
                        d.vy = -d.vy;
                    }
                });

                link
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y);

                node.attr('transform', d => `translate(${d.x},${d.y})`);
            });

            // Link interactions
            link
                .on('mouseover', function (event, d) {
                    d3.select(this)
                        .attr('stroke', 'blue')
                        .style('cursor', 'pointer');

                    svg.select('#arrowhead path')
                        .attr('fill', 'blue')
                        .attr('stroke', '#000');

                    tooltip
                        .style('visibility', 'visible')
                        .html(`<strong>${d.source.id} → ${d.target.id}</strong>`);
                })
                .on('mousemove', function (event) {
                    tooltip
                        .style('top', (event.pageY - 10) + 'px')
                        .style('left', (event.pageX + 10) + 'px');
                })
                .on('mouseout', function () {
                    d3.select(this)
                        .attr('stroke', '#999');

                    svg.select('#arrowhead path')
                        .attr('fill', '#000')
                        .attr('stroke', '#333');

                    tooltip.style('visibility', 'hidden');
                })
                .on('click', function (event, d) {
                    setModalContent({ heading: `${d.source.id} → ${d.target.id}`, data: d.data });
                    setModalIsOpen(true);
                });

            // Node interactions
            node
                .on('mouseover', function (event, d) {
                    tooltip.style('visibility', 'visible').text(d.id);
                })
                .on('mousemove', function (event) {
                    tooltip
                        .style('top', (event.pageY - 10) + 'px')
                        .style('left', (event.pageX + 10) + 'px');
                })
                .on('mouseout', function () {
                    tooltip.style('visibility', 'hidden');
                });

            // Drag handler for nodes
            function drag(simulation) {
                function dragstarted(event, d) {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                }

                function dragged(event, d) {
                    d.fx = event.x;
                    d.fy = event.y;
                }

                function dragended(event, d) {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }

                return d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial data fetch on component mount
    useEffect(() => {
        fetchAndRenderGraph();
    }, []);

    return (
        <div>
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="interval">Show data from past: </label>
                <select
                    id="interval"
                    value={selectedMinutes}
                    onChange={(e) => setSelectedMinutes(Number(e.target.value))}
                >
                    {[5, 10, 20, 30, 40, 50].map(min => (
                        <option key={min} value={min}>{min} min</option>
                    ))}
                </select>
                <button
                    className="refresh-button"
                    onClick={fetchAndRenderGraph}
                    style={{ marginLeft: '10px' }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Fetch Data'}
                </button>
            </div>

            {fromTime && (
                <p style={{ fontStyle: 'italic', color: '#555' }}>
                    Showing data from: {fromTime.toLocaleString()}
                </p>
            )}

            <svg ref={svgRef}></svg>
            <div ref={tooltipRef}></div>

            <Modal
                className="modal-content"
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Edge Details"
            >
                <h2>{modalContent.heading}</h2>
                <p>Data: {modalContent.data !== null ? JSON.stringify(modalContent.data, null, 2) : 'N/A'}</p>
                <button onClick={() => setModalIsOpen(false)}>Close</button>
            </Modal>
        </div>
    );
};

export default NetworkGraph;