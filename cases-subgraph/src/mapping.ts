import {
  CaseReported,
} from "../generated/CaseRegistry/CaseRegistry"
import { Case } from "../generated/schema";

export function handleCaseReported(event: CaseReported): void {

  // Create new entity from id
  let entity = new Case(
    event.params.id.toString(),
  );

  entity.companyName = event.params.companyName
  entity.caseType = event.params.caseType
  entity.description = event.params.description
  entity.region = event.params.region
  entity.profession = event.params.profession
  entity.gender = event.params.gender
  entity.ageRange = event.params.ageRange
  entity.experience = event.params.experience

  entity.save()

}
