let routes = {};
window.addEventListener('hashchange', onHashchange);

export function router(newRoutes, context) {
  Object.entries(newRoutes).forEach(([key, val]) => {
    routes[key] = context ? val.bind(context) : val;
  });
  if (newRoutes[getPath()]) onHashchange();
}

function onHashchange() {
  const routeFn = routes[getPath()];
  if (routeFn) routeFn();
}

function getPath() {
  return location.hash.substr(1) || '/';
}
