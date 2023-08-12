import * as Sentry from "@sentry/vue";

export default defineNuxtPlugin((nuxtApp) => {
  const { vueApp, $config } = nuxtApp;

  Sentry.init({
    app: [vueApp],
    dsn: $config.public.sentryDsn,
    environment: $config.public.nodeEnv,
    integrations: [
      new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: $config.public.sentryTracesSampleRate, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });

  vueApp.mixin(Sentry.createTracingMixins({ trackComponents: true, timeout: 2000, hooks: ['activate', 'mount', 'update'] }));
  Sentry.attachErrorHandler(vueApp, { logErrors: false, attachProps: true, trackComponents: true, timeout: 2000, hooks: ['activate', 'mount', 'update'] });

  return {
    provide: {
      sentrySetContext: Sentry.setContext,
      sentrySetUser: Sentry.setUser,
      sentrySetTag: Sentry.setTag,
      sentryAddBreadcrumb: Sentry.addBreadcrumb,
      sentryCaptureException: Sentry.captureException
    }
  };
});
