import {
  CaseReported,
} from "../generated/CaseRegistry/CaseRegistry"
import { Case, Stat } from "../generated/schema";

function regionToId(r: string): string {
  // Switch statement not supported  with strings yet: https://github.com/AssemblyScript/assemblyscript/issues/1643
  if(r == 'spain'){
    return '0'
  } else if(r == 'madrid'){
    return '1'
  } else if(r == 'barcelona'){
    return '2'
  } else if(r == 'sevilla'){
    return '3'
  } else {
    return '-1'
  }
}

function initStat(stat: Stat, region: string): Stat {
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
function incrementValByLabel( label: string, array: Array<i32>, labels: string[] ): Array<i32> {
  // Switch statement not supported  with strings yet: https://github.com/AssemblyScript/assemblyscript/issues/1643
  for(let i = 0; i < labels.length; i++){
    if(label == labels[i]){
      array[i]++
      break
    }
  }
  return array
}

export function handleCaseReported(event: CaseReported): void {

  // Create new entity from id
  let reportedCase = new Case(
    event.params.id.toString(),
  );

  reportedCase.companyName = event.params.companyName
  reportedCase.caseType = event.params.caseType
  reportedCase.description = event.params.description
  reportedCase.region = event.params.region
  reportedCase.profession = event.params.profession
  reportedCase.gender = event.params.gender
  reportedCase.ageRange = event.params.ageRange
  reportedCase.experience = event.params.experience

  reportedCase.save()

  // Stats labels
  let types: Array<string> = ['maltrato', 'retraso', 'impago']
  let professions: Array<string> = ['artes_escenicas', 'diseño_arquitectura', 'fotografia', 'artes_plasticas', 'traduccion', 'gestion_cultural']
  let genders: Array<string> = ['femenino', 'masculino', 'no_binario']
  let ageRanges: Array<string> = ['r18_20', 'r21_29', 'r30_39', 'r40_49', 'r50_59', 'r60_plus']

  // Load country lvl stats
  let spainStat = Stat.load(regionToId('spain'))
  // Create new stat entity if no previous stat exist
  if (!spainStat) {
    spainStat = new Stat(regionToId('spain'))
    spainStat = initStat(<Stat>spainStat, 'spain')
  } 

  // Update stats
  spainStat.casesByRegion++
  spainStat.casesByType = incrementValByLabel(reportedCase.caseType,spainStat.casesByType as Array<i32>, types)
  spainStat.casesByProfession = incrementValByLabel(reportedCase.profession,spainStat.casesByProfession as Array<i32>, professions)
  spainStat.casesByGender = incrementValByLabel(reportedCase.gender,spainStat.casesByGender as Array<i32>, genders)
  spainStat.casesByAgeRange = incrementValByLabel(reportedCase.ageRange,spainStat.casesByAgeRange as Array<i32>, ageRanges)
  spainStat.save()

  // Load region lvl stats
  let regionStat = Stat.load(regionToId(reportedCase.region))
  // Create new stat entity if no previous stat exist
  if (!regionStat) {
    regionStat = new Stat(regionToId(reportedCase.region))
    regionStat = initStat(<Stat>regionStat, reportedCase.region)
  }
  // Update stat
  regionStat.casesByRegion++
  regionStat.casesByType = incrementValByLabel(reportedCase.caseType,regionStat.casesByType as Array<i32>, types)
  regionStat.casesByProfession = incrementValByLabel(reportedCase.profession,regionStat.casesByProfession as Array<i32>, professions)
  regionStat.casesByGender = incrementValByLabel(reportedCase.gender,regionStat.casesByGender as Array<i32>, genders)
  regionStat.casesByAgeRange = incrementValByLabel(reportedCase.ageRange,regionStat.casesByAgeRange as Array<i32>, ageRanges)
  regionStat.save()

}
