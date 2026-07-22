import { createApp } from 'vue';

import App from './App.vue';

// CSS stays a consumer import (ADR 0001 §7) — never bundled by the package.
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-transitions.css';

createApp(App).mount('#app');
