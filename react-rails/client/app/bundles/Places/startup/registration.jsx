import ReactOnRails from 'react-on-rails';

import Place from '../components/Place';
import Map from '../components/Map';

// This is how react_on_rails can see the HelloWorld in the browser.
ReactOnRails.register({
  Place, Map,
});
