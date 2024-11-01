import * as i18n from 'i18next';
const Backend = require('i18next-fs-backend');

i18n.use(Backend).init(
  {
    initImmediate: false,
    fallbackLng: 'en',
    preload: ['en', 'es', 'vi', 'fr'],
    backend: {
      loadPath: './src/i18n/{{lng}}.json',
    },
  },
  (err, t) => {
    if (err) {
      console.error('Error initializing i18next:', err);
    } else {
      console.log('i18next initialized successfully.');
    }
  },
);

export default i18n;
