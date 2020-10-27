const Arborist = require("@npmcli/arborist");

async function main() {
  const tree = await new Arborist().loadActual();
  for (const [name, edge] of tree.edgesOut.entries()) {
    if (edge.type === "workspace") {
      console.log(name, edge.to.realpath);
    }
  }
}

main();
