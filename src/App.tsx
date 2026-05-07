/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import RojiAssistant from './components/RojiAssistant';

export default function App() {
  const isIframe = window.parent !== window;

  return (
    <div className="min-h-screen bg-transparent">
      <RojiAssistant />
    </div>
  );
}


