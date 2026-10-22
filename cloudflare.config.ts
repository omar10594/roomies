import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  accountId: "d892c10479122ea3f1c4258392f9770f",
  worker: defineWorker({
    name: "roomies",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-22",
    compatibilityFlags: ["nodejs_compat"],
    domains: ["roomies.lopezlopez.com.mx"],
    workersDev: false,
    previewUrls: false,
    limits: { cpuMs: 100, subrequests: 20 },
    observability: {
      enabled: true,
      redactQueryString: true,
      logs: { enabled: true, invocationLogs: false, headSamplingRate: 1 },
      traces: { enabled: false },
    },
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      DB: bindings.d1({ name: "roomies", id: "3b20cf4e-5e82-4564-8d82-0a0c8d109ba7" }),
    },
  }),
});
