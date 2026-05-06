import { siteConfig } from "@/lib/siteConfig";
import { DiscussionEmbed } from "disqus-react";
import React from "react";

const Disqus = ({ className }: { className?: string }) => {
  const { disqus } = siteConfig;
  return (
    <div className={className}>
      {disqus.enable && (
        <DiscussionEmbed
          shortname={disqus.shortname}
          config={disqus.settings}
        />
      )}
    </div>
  );
};

export default Disqus;
