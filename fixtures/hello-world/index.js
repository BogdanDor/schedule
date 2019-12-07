import App from '/App.js';
import React from '/node_modules/schedule/src/React.js';
import Schedule from '/node_modules/schedule/src/index.js';

Schedule.render({type: App, props: {children: []} }, document.getElementById('app'));
