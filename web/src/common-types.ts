import { CalculatedStats } from './models/calculated-stats.model'

export type FuncMasteryFetch = (apiUrl: string, summonerId: string, defaultTotalMastery?: number) => Promise<number>

export type FuncStatsFetch = (
	apiUrl: string,
	summonerId: string,
	defaultCalculatedStats?: CalculatedStats,
	numToFetch?: number) => Promise<CalculatedStats>

export type FuncUserInfoFetch = (apiUrl: string) => Promise<Record<string, unknown>>
