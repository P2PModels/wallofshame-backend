import { Stat } from "../generated/schema";
import { regions } from "./dictionary";

export function regionToId(region: string): string {
    for(let i = 0; i< regions.length; i++){
        if(regions[i] == region){
            return i.toString()
        }
    }
    return "-1"
}

export function initStat(stat: Stat, region: string): Stat {
    stat.regionName = region
    stat.casesByRegion = 0
    if(stat.casesByType == null) stat.casesByType = [0,0,0]
    if(stat.casesByProfession == null) stat.casesByProfession = [0,0,0,0,0,0]
    if(stat.casesByGender == null) stat.casesByGender = [0,0,0]
    if(stat.casesByAgeRange == null) stat.casesByAgeRange = [0,0,0,0,0,0]
    return stat
}

// Adds one to the array position that matches the position of the provided label list with the provided label
// Parameters:
// - label (string): label of the array position to increment
// - array (Array<i32>): array of values
// - labels (Array<string>): labels representing the keys of the array
export function incrementValByLabel( label: string, array: Array<i32>, labels: string[] ): Array<i32> {
// Switch statement not supported  with strings yet: https://github.com/AssemblyScript/assemblyscript/issues/1643
for(let i = 0; i < labels.length; i++){
    if(label == labels[i]){
    array[i]++
    break
    }
}
return array
}
