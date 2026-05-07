/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import RojiAssistant from './components/RojiAssistant';

export default function App() {
  const isIframe = window.parent !== window;

  return (
    <div className={`min-h-screen ${isIframe ? 'bg-transparent' : 'bg-orange-50 flex items-center justify-center'}`}>
      {!isIframe && (
        <div className="absolute top-10 text-center">
          <h1 className="text-3xl font-black text-orange-600 mb-2">Benvenuto nell'Assistente Roji</h1>
          <p className="text-stone-500">Clicca sul panda in basso a destra per iniziare!</p>
        </div>
      )}
      <RojiAssistant />
    </div>
  );
}


