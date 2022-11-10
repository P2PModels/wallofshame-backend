module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // Deploy CaseRegistry.sol from deployer, saved to deployments
  await deploy("CaseRegistry", {
    from: deployer,
    gasLimit: 4000000,
    // High gas price to avoid failling txs
    // gasPrice: 2000000000,
    args: [],
  });
};
