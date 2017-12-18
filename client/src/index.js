import ReactDOM from 'react-dom';
import { makeMainRoutes } from './routes';
import registerServiceWorker from './registerServiceWorker';

const mainRoutes = makeMainRoutes();

ReactDOM.render(
    mainRoutes,
    document.getElementById('root')
);

registerServiceWorker();
