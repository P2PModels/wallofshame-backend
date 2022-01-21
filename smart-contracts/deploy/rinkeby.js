module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // Deploy CaseRegistry.sol from deployer in Rinkeby, saved to deployments->rinkeby
  await deploy("CaseRegistry", {
    from: deployer,
    gasLimit: 4000000,
    args: [],
  });
};
