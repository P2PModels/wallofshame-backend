const { expect } = require("chai");

describe("CaseRegistry contract", function () {
  let owner;
  let not_owner;

  let companyName = "Endesa";
  let caseType = "Maltrato";
  let description =
    "Trabajo muchas más horas de las estipuladas por mi contrato. Pido que se me paguen esas horas y recibo silencio por parte de mis jefes. He recurrido al sindicato pero me dicen que no hay mucho que hacer.";
  let region = "Madrid";
  let profession = "Diseñador gráfico";
  let gender = "No binario";
  let ageRange = "25-35";
  let experience = "5 años o más";

  let caseRegistryContract;
  let caseRegistryDeploy;
  let caseRegistryInstance;

  before(async function () {
    // Save account addresses once to use in each test
    const accounts = await ethers.getSigners();
    owner = accounts[0];
    not_owner = accounts[1];

    // Badge info to use
    caseToReport = {
      id: 0,
      companyName: companyName,
      caseType: caseType,
      description: description,
      region: region,
      profession: profession,
      gender: gender,
      ageRange: ageRange,
      experience: experience,
    };
  });

  beforeEach(async function () {
    // Deploy fresh contract before each test
    caseRegistryContract = await ethers.getContractFactory("CaseRegistry");
    caseRegistryDeploy = await caseRegistryContract.deploy();
    await caseRegistryDeploy.deployed();

    // Conect to an account
    caseRegistryInstance = await caseRegistryDeploy.connect(owner);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await caseRegistryInstance.owner()).to.equal(owner.address);
    });
  });

  describe("Reporting", function () {
    it("Should emit a case reported event", async function () {
      await expect(
        caseRegistryInstance.report(
          caseToReport.companyName,
          caseToReport.caseType,
          caseToReport.description,
          caseToReport.region,
          caseToReport.profession,
          caseToReport.gender,
          caseToReport.ageRange,
          caseToReport.experience
        )
      )
        .to.emit(caseRegistryInstance, "CaseReported")
        .withArgs(
          caseToReport.id,
          caseToReport.companyName,
          caseToReport.caseType,
          caseToReport.description,
          caseToReport.region,
          caseToReport.profession,
          caseToReport.gender,
          caseToReport.ageRange,
          caseToReport.experience
        );
    });

    it("Should return the reported case", async function () {
      await caseRegistryInstance.report(
        caseToReport.companyName,
        caseToReport.caseType,
        caseToReport.description,
        caseToReport.region,
        caseToReport.profession,
        caseToReport.gender,
        caseToReport.ageRange,
        caseToReport.experience
      );

      const reportedCase = await caseRegistryInstance.casesById(
        caseToReport.id
      );

      expect(reportedCase["id"]).to.equal(caseToReport.id);
      expect(reportedCase["companyName"]).to.equal(caseToReport.companyName);
      expect(reportedCase["caseType"]).to.equal(caseToReport.caseType);
      expect(reportedCase["description"]).to.equal(caseToReport.description);
      expect(reportedCase["region"]).to.equal(caseToReport.region);
      expect(reportedCase["profession"]).to.equal(caseToReport.profession);
      expect(reportedCase["gender"]).to.equal(caseToReport.gender);
      expect(reportedCase["ageRange"]).to.equal(caseToReport.ageRange);
      expect(reportedCase["experience"]).to.equal(caseToReport.experience);
    });
  });

  describe("Restart", function () {
    // it("Should only allow the owner to execute the function", async function () {
    //   caseRegistryInstance = await caseRegistryDeploy.connect(not_owner);
    //   expect(caseRegistryInstance.restart())
    //   .to.be.revertedWith('USER_IS_NOT_OWNER');
    // });
    let currentId = 2
    it("Should emit event", async function () {
      expect(caseRegistryInstance.restart())
      .to.emit(caseRegistryInstance, "CaseResgistryRestarted")
      .withArgs(
        currentId
      );
    });
  })
});
