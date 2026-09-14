
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/publication/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/publication"
  },
  {
    "renderMode": 2,
    "route": "/publication/signin"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 11446, hash: '9eed8caef2b039273230994425e853e106fd1d56433b57056e7a4b8bb7fbc1a2', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 957, hash: '8738546bc07d206e3415556c4cf1133af4420f7269b7f4e638897a04f4f7226b', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 38170, hash: '1be24cba4441508b477458ff0168585af7f2ffbddad747d033795bbb75d8a8f2', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'signin/index.html': {size: 23759, hash: '2cbf206185ce756abcfdfba733516808be8d12702121bce00f6bc3c12ed03437', text: () => import('./assets-chunks/signin_index_html.mjs').then(m => m.default)},
    'styles-6KOOM4PH.css': {size: 14463, hash: 'IoTnyfmV1cc', text: () => import('./assets-chunks/styles-6KOOM4PH_css.mjs').then(m => m.default)}
  },
};
