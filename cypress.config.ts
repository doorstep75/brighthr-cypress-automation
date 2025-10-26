import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'https://sandbox-app.brighthr.com',
        setupNodeEvents(on, config) {
            // anything else in here
        },
    },
});
