/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import RojiAssistant from './components/RojiAssistant';

type MainTab = 'lettura' | 'grammatica' | 'esercizi';

export default function App() {
  return (
    <div className="min-h-screen bg-transparent select-none">
      <RojiAssistant />
    </div>
  );
}


