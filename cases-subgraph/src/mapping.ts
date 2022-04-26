import { store } from '@graphprotocol/graph-ts'
import {
  CaseReported,
  CaseRegistryRestarted
} from "../generated/CaseRegistry/CaseRegistry"
import { types, professions, regions, ageRanges, genders } from "./dictionary"
import { regionToId, incrementValByLabel, initStat } from './helpers';
import { Case, Stat } from "../generated/schema";

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

export function handleCaseRegistryRestarted(event: CaseRegistryRestarted): void {

  for(var i = 0; i < event.params.currentId.toI32(); i++){
    store.remove('Case', i.toString())
  }

  store.remove('Stat', "spain")

  for(i = 0; i < regions.length; i++ ){
    store.remove('Stat', regions[i])
  }
}
