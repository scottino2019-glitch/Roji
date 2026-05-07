# Come usare Roji sul tuo sito

Roji è ora un assistente leggero che puoi integrare ovunque.

### 1. Configurazione della Chiave API
In AI Studio, Roji utilizza la chiave configurata nelle **Settings** (icona ingranaggio). 
- Assicurati che `GEMINI_API_KEY` sia presente.
- Ho spostato la logica sul lato client per una maggiore velocità e semplicità.

### 2. Codice per l'integrazione (Iframe)
Copia e incolla questo codice nel tuo sito web.

```html
<!-- Assistente Roji -->
<div id="roji-container" style="position: fixed; bottom: 20px; right: 20px; width: 80px; height: 80px; z-index: 999999; border-radius: 50%;">
  <iframe 
    id="roji-iframe"
    src="URL_PUBBLICATO_DA_SHARE" 
    style="width: 100%; height: 100%; border: none; overflow: hidden; background: transparent;"
    scrolling="no"
    allowtransparency="true">
  </iframe>
</div>

<script>
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'roji-toggle') {
      const container = document.getElementById('roji-container');
      if (event.data.isOpen) {
        container.style.width = '350px';
        container.style.height = '550px';
      } else {
        container.style.width = '80px';
        container.style.height = '80px';
      }
    }
  });
</script>
```

### 3. Note
- **URL**: Usa l'URL che ottieni da `Share` -> `Publish`. L'URL `ais-dev-...` è solo temporaneo per lo sviluppo.
- **Vercel**: Se vuoi portarlo su Vercel, basta caricare questi file. Ho rimosso le funzioni serverless complicate per usare direttamente il client.
