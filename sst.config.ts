/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "we-have-agents-at-home",
      removal: input?.stage === "prod" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const ANTHROPIC_API_KEY = new sst.Secret("ANTHROPIC_API_KEY");
    const TAVILY_API_KEY = new sst.Secret("TAVILY_API_KEY");

    const ResponseCache = new sst.aws.Dynamo(
      `${toPascalCase($app.name)}ResponseCache`,
      {
        fields: {
          cacheKey: "string",
        },
        primaryIndex: { hashKey: "cacheKey" },
      },
    );

    new sst.aws.Function("Hono", {
      url: true,
      handler: "main.handler",
      link: [TAVILY_API_KEY, ANTHROPIC_API_KEY, ResponseCache],
      timeout: "60 seconds",
    });
  },
});

function toPascalCase(str: string): string {
  return str
    .split(/[\s_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}
