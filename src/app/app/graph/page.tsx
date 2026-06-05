'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { AppLayout } from '@/components/app-layout';
import { Badge } from '@/components/ui-components';

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'customer' | 'product' | 'campaign' | 'order' | 'segment' | 'agent';
  value: number;
  color: string;
  description?: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  label: string;
  weight: number;
}

const TYPE_CONFIG: Record<GraphNode['type'], { color: string; icon: string }> = {
  customer: { color: '#00E676', icon: '👤' },
  product: { color: '#3B82F6', icon: '📦' },
  campaign: { color: '#F59E0B', icon: '📣' },
  order: { color: '#8B5CF6', icon: '🛒' },
  segment: { color: '#06B6D4', icon: '🎯' },
  agent: { color: '#EC4899', icon: '🤖' },
};

const nodes: GraphNode[] = [
  // Customers
  { id: 'c1', label: 'Sarah Chen', type: 'customer', value: 48200, color: '#00E676', description: 'Enterprise · Champion' },
  { id: 'c2', label: 'Marcus W.', type: 'customer', value: 18600, color: '#00E676', description: 'Pro · At Risk' },
  { id: 'c3', label: 'Elena R.', type: 'customer', value: 124000, color: '#00E676', description: 'Enterprise · Champion' },
  { id: 'c4', label: 'James Park', type: 'customer', value: 4200, color: '#00E676', description: 'Starter · Churning' },
  { id: 'c5', label: 'Aisha O.', type: 'customer', value: 31800, color: '#00E676', description: 'Pro · Loyal' },
  // Products
  { id: 'p1', label: 'Enterprise Plan', type: 'product', value: 30, color: '#3B82F6', description: '30 active subscribers' },
  { id: 'p2', label: 'Pro Plan', type: 'product', value: 89, color: '#3B82F6', description: '89 active subscribers' },
  { id: 'p3', label: 'AI Add-on', type: 'product', value: 45, color: '#3B82F6', description: '45 active users' },
  // Campaigns
  { id: 'cam1', label: 'Q1 Churn Recovery', type: 'campaign', value: 2847, color: '#F59E0B', description: 'Email · Active' },
  { id: 'cam2', label: 'Enterprise Upsell', type: 'campaign', value: 486, color: '#F59E0B', description: 'Email · Completed' },
  { id: 'cam3', label: 'VIP Loyalty', type: 'campaign', value: 1247, color: '#F59E0B', description: 'WhatsApp · Active' },
  // Segments
  { id: 's1', label: 'High Churn Risk', type: 'segment', value: 1247, color: '#06B6D4', description: 'Score > 70' },
  { id: 's2', label: 'Champions', type: 'segment', value: 2847, color: '#06B6D4', description: 'Top 20% LTV' },
  // Agents
  { id: 'a1', label: 'Master Agent', type: 'agent', value: 47, color: '#EC4899', description: 'Orchestrator' },
  { id: 'a2', label: 'Campaign Agent', type: 'agent', value: 24, color: '#EC4899', description: 'Marketing AI' },
];

const links: GraphLink[] = [
  { source: 'c1', target: 'p1', label: 'subscribed', weight: 3 },
  { source: 'c1', target: 'p3', label: 'uses', weight: 2 },
  { source: 'c2', target: 'p2', label: 'subscribed', weight: 2 },
  { source: 'c3', target: 'p1', label: 'subscribed', weight: 3 },
  { source: 'c3', target: 'p3', label: 'uses', weight: 2 },
  { source: 'c4', target: 'p2', label: 'subscribed', weight: 1 },
  { source: 'c5', target: 'p2', label: 'subscribed', weight: 2 },
  { source: 'c2', target: 's1', label: 'in segment', weight: 1 },
  { source: 'c4', target: 's1', label: 'in segment', weight: 1 },
  { source: 'c1', target: 's2', label: 'in segment', weight: 2 },
  { source: 'c3', target: 's2', label: 'in segment', weight: 2 },
  { source: 'c5', target: 's2', label: 'in segment', weight: 1 },
  { source: 's1', target: 'cam1', label: 'targeted by', weight: 2 },
  { source: 's2', target: 'cam3', label: 'targeted by', weight: 2 },
  { source: 'p1', target: 'cam2', label: 'upsell target', weight: 2 },
  { source: 'a1', target: 'a2', label: 'orchestrates', weight: 3 },
  { source: 'a2', target: 'cam1', label: 'manages', weight: 2 },
  { source: 'a2', target: 'cam2', label: 'manages', weight: 2 },
  { source: 'a2', target: 'cam3', label: 'manages', weight: 2 },
  { source: 'a1', target: 's1', label: 'analyzes', weight: 2 },
];

export default function KnowledgeGraphPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [nodeCount, setNodeCount] = useState({ total: nodes.length, links: links.length });

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create zoom container
    const container = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => container.attr('transform', event.transform));

    svg.call(zoom);

    // Filter nodes
    const filteredNodes = activeFilter === 'all' ? nodes : nodes.filter(n => n.type === activeFilter);
    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = links.filter(l => filteredNodeIds.has(String(l.source)) && filteredNodeIds.has(String(l.target)));

    // Simulation
    const simulation = d3.forceSimulation<GraphNode>(filteredNodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(filteredLinks).id(d => d.id).distance(100).strength(0.3))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(45));

    // Defs
    const defs = container.append('defs');
    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -4 8 8')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L8,0L0,4')
      .attr('fill', 'rgba(255,255,255,0.15)');

    // Links
    const link = container.append('g').selectAll('line')
      .data(filteredLinks).join('line')
      .attr('stroke', 'rgba(255,255,255,0.1)')
      .attr('stroke-width', d => d.weight * 0.7)
      .attr('marker-end', 'url(#arrow)');

    // Link labels
    const linkLabel = container.append('g').selectAll('text')
      .data(filteredLinks).join('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', 9)
      .attr('fill', '#4B5563')
      .attr('font-family', 'Inter, sans-serif')
      .text(d => d.label);

    // Node groups
    const node = container.append('g').selectAll<SVGGElement, GraphNode>('g')
      .data(filteredNodes).join('g')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(prev => prev?.id === d.id ? null : d);
        // Highlight connected
        const connected = new Set([d.id]);
        filteredLinks.forEach(l => {
          if (String((l.source as GraphNode).id) === d.id) connected.add(String((l.target as GraphNode).id));
          if (String((l.target as GraphNode).id) === d.id) connected.add(String((l.source as GraphNode).id));
        });
        node.style('opacity', n => connected.has(n.id) ? 1 : 0.2);
        link.style('opacity', l => {
          const src = String((l.source as GraphNode).id);
          const tgt = String((l.target as GraphNode).id);
          return src === d.id || tgt === d.id ? 1 : 0.05;
        });
      });

    svg.on('click', () => {
      setSelectedNode(null);
      node.style('opacity', 1);
      link.style('opacity', 1);
    });

    // Add glow filter
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', 3).attr('result', 'coloredBlur');
    const merge = filter.append('feMerge');
    merge.append('feMergeNode').attr('in', 'coloredBlur');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Node circles (outer glow)
    node.append('circle')
      .attr('r', d => 20 + Math.log(d.value + 1) * 2)
      .attr('fill', d => `${d.color}10`)
      .attr('stroke', d => `${d.color}30`)
      .attr('stroke-width', 1);

    // Node circles (main)
    node.append('circle')
      .attr('r', d => 16 + Math.log(d.value + 1))
      .attr('fill', d => `${d.color}20`)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 1.5)
      .style('filter', 'url(#glow)');

    // Node labels
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 36)
      .attr('font-size', 10)
      .attr('font-weight', '600')
      .attr('fill', '#D1D5DB')
      .attr('font-family', 'Inter, sans-serif')
      .text(d => d.label);

    // Node type icons
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 6)
      .attr('font-size', 14)
      .text(d => TYPE_CONFIG[d.type].icon);

    // Drag
    const drag = d3.drag<SVGGElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x; d.fy = d.y;
      })
      .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null; d.fy = null;
      });

    node.call(drag);

    // Tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x!)
        .attr('y1', d => (d.source as GraphNode).y!)
        .attr('x2', d => (d.target as GraphNode).x!)
        .attr('y2', d => (d.target as GraphNode).y!);

      linkLabel
        .attr('x', d => ((d.source as GraphNode).x! + (d.target as GraphNode).x!) / 2)
        .attr('y', d => ((d.source as GraphNode).y! + (d.target as GraphNode).y!) / 2 - 5);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => { simulation.stop(); };
  }, [activeFilter]);

  const filters: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '🌐' },
    { id: 'customer', label: 'Customers', icon: '👤' },
    { id: 'product', label: 'Products', icon: '📦' },
    { id: 'campaign', label: 'Campaigns', icon: '📣' },
    { id: 'segment', label: 'Segments', icon: '🎯' },
    { id: 'agent', label: 'Agents', icon: '🤖' },
  ];

  return (
    <AppLayout title="Knowledge Graph" subtitle="Interactive entity relationship visualization" actions={
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Badge variant="info">{nodes.length} nodes</Badge>
        <Badge variant="purple">{links.length} edges</Badge>
        <button className="btn-ghost">Export Graph</button>
      </div>
    }>
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)' }}>
        {/* Controls */}
        <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginRight: '0.25rem', fontWeight: 600 }}>FILTER:</span>
          {filters.map(f => (
            <button key={f.id} onClick={() => setActiveFilter(f.id)} style={{
              padding: '0.35rem 0.75rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.15s',
              background: activeFilter === f.id ? 'rgba(0,230,118,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeFilter === f.id ? 'rgba(0,230,118,0.3)' : 'rgba(255,255,255,0.08)'}`,
              color: activeFilter === f.id ? 'var(--color-primary)' : 'var(--color-muted)',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
            }}>
              <span>{f.icon}</span> {f.label}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', fontSize: '0.72rem', color: 'var(--color-muted)' }}>
            <span>🖱️ Click to select · Drag to reposition · Scroll to zoom</span>
          </div>
        </div>

        {/* Graph Area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <div className="grid-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />
          {/* Radial background */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(ellipse at center, rgba(0,230,118,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
          
          <svg ref={svgRef} width="100%" height="100%" style={{ display: 'block' }} />

          {/* Legend */}
          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(17,24,39,0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.875rem 1rem' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Legend</div>
            {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', textTransform: 'capitalize' }}>{type}</span>
              </div>
            ))}
          </div>

          {/* Selected node panel */}
          {selectedNode && (
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '260px', background: 'rgba(17,24,39,0.95)', backdropFilter: 'blur(12px)', border: `1px solid ${TYPE_CONFIG[selectedNode.type].color}40`, borderRadius: '12px', padding: '1.25rem', animation: 'fadeIn 0.2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${TYPE_CONFIG[selectedNode.type].color}18`, border: `1px solid ${TYPE_CONFIG[selectedNode.type].color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                  {TYPE_CONFIG[selectedNode.type].icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{selectedNode.label}</div>
                  <div style={{ fontSize: '0.72rem', color: TYPE_CONFIG[selectedNode.type].color, textTransform: 'capitalize' }}>{selectedNode.type}</div>
                </div>
              </div>
              {selectedNode.description && (
                <div style={{ fontSize: '0.83rem', color: 'var(--color-muted)', marginBottom: '0.875rem', lineHeight: 1.5 }}>{selectedNode.description}</div>
              )}
              <div style={{ padding: '0.625rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--color-muted)' }}>Value</span>
                  <span style={{ fontWeight: 700 }}>{selectedNode.value.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-muted)' }}>Connections</span>
                  <span style={{ fontWeight: 700 }}>{links.filter(l => String(l.source) === selectedNode.id || String(l.target) === selectedNode.id || String((l.source as GraphNode).id) === selectedNode.id || String((l.target as GraphNode).id) === selectedNode.id).length}</span>
                </div>
              </div>
              <button onClick={() => setSelectedNode(null)} style={{ marginTop: '0.75rem', width: '100%', padding: '0.375rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--color-muted)' }}>Close</button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
