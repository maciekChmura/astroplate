import { createKnowledgeHubProxy } from "./knowledgeHubProxyCore.js";

export default createKnowledgeHubProxy({
  originHost: "quickarchviz-knowledge-hub-en.pages.dev",
  publicOrigin: "https://quickarchviz.com",
  hubPath: "/knowledge-hub",
  assetPath: "/knowledge-hub-assets",
  legacyRedirects: [
    {
      from: "/prompts/example-prompt",
      to: "/prompts/meeting-notes-action-checklist-for-architects",
    },
  ],
});
