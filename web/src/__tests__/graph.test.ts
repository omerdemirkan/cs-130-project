import { processFusekiExpansionQueryResults } from '../client/store/graph';
import type { GraphNode, GraphEdge } from '../client/store/graph';
import type {FusekiExpansionQueryResults } from '../utils/fuseki';
import '@testing-library/jest-dom'

it('combines the results of an expansion query with existing nodes.', () => {
    const originalNodes: GraphNode[] = [
        { id: 'id1', label: 'l1', fusekiObjectType: 'bnode' }, 
        { id: 'id2', label: 'l2', fusekiObjectType: 'literal' }, 
        { id: 'id3', label: 'l3', fusekiObjectType: 'uri' }, 
    ]

    const originalEdges: GraphEdge[] = [
        { source: 's1', target: 't1', id: 'id1', label: 'l1' }, 
        { source: 's2', target: 't2', id: 'id2', label: 'l2' }, 
        { source: 's3', target: 't3', id: 'id3', label: 'l3' }, 
    ]

    const fusekiQueryResult: FusekiExpansionQueryResults = {
        head: { vars: [ 'v1', 'v2', ] },
        results: { bindings: [
            { 
                subject:   { type: 'bnode',   value: 'n1', datatype: 'd1' }, 
                predicate: { type: 'bnode',   value: 'n2', datatype: 'd2' },
                object:    { type: 'literal', value: 'l1', datatype: 'd3' },
            },
            { 
                subject:   { type: 'bnode', value: 'n3', }, 
                predicate: { type: 'bnode', value: 'n4', },
                object:    { type: 'uri',   value: 'u1', },
            },     
        ]},
    }

    const output = processFusekiExpansionQueryResults({
        fusekiQueryResult: fusekiQueryResult,
        existingNodes: originalNodes,
        existingEdges: originalEdges,
    });

    expect(output).toEqual({
        newNodes: [
            { id: 'id1', label: 'l1', fusekiObjectType: 'bnode'   },
            { id: 'id2', label: 'l2', fusekiObjectType: 'literal' },
            { id: 'id3', label: 'l3', fusekiObjectType: 'uri'     },
            { id: 'n1',  label: 'n1', fusekiObjectType: 'bnode'   },
            { id: 'l1',  label: 'l1', fusekiObjectType: 'literal' },
            { id: 'n3',  label: 'n3', fusekiObjectType: 'bnode'   },
            { id: 'u1',  label: 'u1', fusekiObjectType: 'uri'     }
        ],
        newEdges: [
            { source: 's1', target: 't1', id: 'id1',      label: 'l1', },
            { source: 's2', target: 't2', id: 'id2',      label: 'l2', },
            { source: 's3', target: 't3', id: 'id3',      label: 'l3', },
            { source: 'n1', target: 'l1', id: 'n2:n1_l1', label: 'n2', },
            { source: 'n3', target: 'u1', id: 'n4:n3_u1', label: 'n4', }
        ]}
    )
})