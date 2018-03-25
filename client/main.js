import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/client/routes.js';
import 'semantic-ui-css/semantic.min.css';


 
 

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('render-target'));
});
