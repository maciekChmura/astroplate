import { createKnowledgeHubProxy } from "./knowledgeHubProxyCore.js";

export default createKnowledgeHubProxy({
  originHost: "aibrandscan-knowledge-hub.pages.dev",
  publicOrigin: "https://aibrandscan.com",
  hubPath: "/knowledge-hub",
  assetPath: "/knowledge-hub-assets",
});
