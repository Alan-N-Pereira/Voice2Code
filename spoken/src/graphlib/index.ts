import GraphlibType from 'graphlib';
import * as graphlib from './graphlib.js';

export type Graph = {
    graph: () => Record<string, string>;
} & GraphlibType.Graph;

export const Graph: Graph = graphlib.Graph;

export const alg = graphlib.alg;
export const json = graphlib.json;