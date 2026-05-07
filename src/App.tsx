/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import RojiAssistant from './components/RojiAssistant';

export default function App() {
  return (
    <div className="min-h-screen bg-transparent pointer-events-none">
      {/* 
          Roji è configurato con "fixed bottom-6 right-6", 
          quindi rimarrà sempre visibile nell'angolo in basso a destra.
      */}
      <div className="pointer-events-auto">
        <RojiAssistant />
      </div>
    </div>
  );
}

