import { createKnowledgeHubProxy } from "./knowledgeHubProxyCore.js";

export default createKnowledgeHubProxy({
  originHost: "astroplate-wq8.pages.dev",
  publicOrigin: "https://quickarchviz.com",
  publicPrefix: "/pl",
  hubPath: "/pl/knowledge-hub",
  assetPath: "/pl/knowledge-hub-assets",
  legacyRedirects: [
    {
      from: "/prompts/example-prompt",
      to: "/prompts/meeting-notes-action-checklist-for-architects",
    },
  ],
});
