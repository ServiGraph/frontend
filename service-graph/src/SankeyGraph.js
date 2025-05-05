import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyCenter } from 'd3-sankey';
import Modal from 'react-modal';


Modal.setAppElement('#root');


const SankeyGraph = () => {
 const svgRef = useRef();
 const [selectedMinutes, setSelectedMinutes] = useState(5);
 const [fromTime, setFromTime] = useState(null);
 const [isLoading, setIsLoading] = useState(false);
 const [modalIsOpen, setModalIsOpen] = useState(false);
 const [modalContent, setModalContent] = useState({ heading: '', data: null });


 const width = 800;
 const height = 600;


 const fetchAndRenderSankey = async () => {
   setIsLoading(true);
   const now = Math.floor(Date.now() / 1000);
   const fromTimestamp = now - selectedMinutes * 60;
   setFromTime(new Date(fromTimestamp * 1000));


   const svg = d3.select(svgRef.current);
   svg.selectAll('*').remove();


   try {
     console.log('Fetching data from:', fromTimestamp);


     // 🟡 Replace with real API fetch
    //  const response = await fetch(`http://127.0.0.1:8090/v1/fetchTraceData/${fromTimestamp}`);
    //  const json = await response.json() ;


     const json = {
       nodes: [
         { id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }
       ],
       links: [
         { source: 'A', target: 'B', value: 10, data: { duration: 20 } },
         { source: 'A', target: 'C', value: 5, data: { duration: 5 } },
         { source: 'B', target: 'D', value: 15, data: { duration: 30 } },
         { source: 'C', target: 'D', value: 5, data: { duration: 10 } },
       ]
     };


     const sankeyGenerator = sankey()
         .nodeId(d => d.id)
         .nodeAlign(sankeyCenter)
         .nodeWidth(15)
         .nodePadding(10)
         .extent([[1, 1], [width - 1, height - 61]]);


     const { nodes, links } = sankeyGenerator(json);


     svg
         .attr('width', '100%')
         .attr('height', height)
         .attr('viewBox', `0 0 ${width} ${height}`);


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
         .style('cursor', 'pointer')
         .on('click', (event, d) => {
           setModalContent({
             heading: `${d.source.id} → ${d.target.id}`,
             data: d.data
           });
           setModalIsOpen(true);
         })
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


   } catch (error) {
     console.error("Error fetching Sankey data:", error);
   } finally {
     setIsLoading(false);
   }
 };


 useEffect(() => {
   fetchAndRenderSankey();
 }, []); // Initial fetch


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
             onClick={fetchAndRenderSankey}
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


       <Modal
           className="modal-content"
           isOpen={modalIsOpen}
           onRequestClose={() => setModalIsOpen(false)}
           contentLabel="Link Details"
       >
         <h2>{modalContent.heading}</h2>
         <p>Data: {modalContent.data ? JSON.stringify(modalContent.data, null, 2) : 'N/A'}</p>
         <button onClick={() => setModalIsOpen(false)}>Close</button>
       </Modal>
     </div>
 );
};


export default SankeyGraph;