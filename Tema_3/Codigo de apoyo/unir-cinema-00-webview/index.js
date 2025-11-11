import { registerRootComponent } from 'expo';

import AppWithNavigation from './AppWithNavigation';
import EmptyApp from "./EmptyApp";
import AppWithPullToRefresh from "./AppWithPullToRefresh";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(AppWithNavigation);
