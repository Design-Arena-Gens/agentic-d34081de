import "dotenv/config";
import { runAgentCycle } from "../src/lib/agent/pipeline";

const main = async () => {
  console.log(
    `[${new Date().toISOString()}] Starting agent cycle from CLI runner`,
  );
  const results = await runAgentCycle();
  console.log(
    `[${new Date().toISOString()}] Completed agent cycle with ${results.length} videos`,
  );
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
