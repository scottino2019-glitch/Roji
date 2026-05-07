# Come usare Roji sul tuo sito

Roji è ora un assistente leggero e modernizzato che utilizza l'ultimo modello **Gemini 3 Flash**.

### 1. Configurazione
In AI Studio, Roji utilizza la chiave configurata nelle **Settings** (icona ingranaggio a sinistra).
- Assicurati che sia presente `GEMINI_API_KEY`.
- L'app ora gestisce le richieste direttamente dal browser per la massima velocità.

### 2. Codice per l'integrazione (Iframe)
Copia e incolla questo codice nel tuo sito web per aggiungere il panda.

```html
<!-- Assistente Roji -->
<div id="roji-container" style="position: fixed; bottom: 20px; right: 20px; width: 80px; height: 80px; z-index: 999999; transition: all 0.2s ease-out;">
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
    // Gestione ridimensionamento automatico quando si apre/chiude la chat
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

### 3. Note Tecniche
- **Modello**: Utilizza `gemini-3-flash-preview` per risposte istantanee.
- **Trasparenza**: L'iframe è configurato per essere trasparente, così vedrai solo l'icona del panda fluttuante sul tuo sito.
- **Pubblicazione**: Sostituisci `URL_PUBBLICATO_DA_SHARE` con l'indirizzo che trovi su **Share** -> **Publish Project**.
