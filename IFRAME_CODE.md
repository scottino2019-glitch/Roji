# Codice per integrare Roji nel tuo sito

Segui questi passaggi per aggiungere Roji al tuo sito web.

### 1. Requisito Fondamentale: API KEY
Per far funzionare Roji, devi assicurarti che la chiave API sia configurata:
1. Apri le impostazioni (**Settings**) qui in AI Studio.
2. Trova la voce **GEMINI_API_KEY**.
3. Assicurati che ci sia una chiave valida. Senza questa, il server darà un errore 500.

### 2. Codice HTML da incollare
Copia questo blocco nella tua pagina HTML. Sostituisci `URL_DELLA_TUA_APP` con l'indirizzo che ottieni cliccando su **Share** -> **Publish Project**.

```html
<!-- Container per Roji -->
<div id="roji-container" style="position: fixed; bottom: 20px; right: 20px; width: 80px; height: 80px; z-index: 999999; transition: all 0.3s ease;">
  <iframe 
    id="roji-iframe"
    src="URL_DELLA_TUA_APP" 
    style="width: 100%; height: 100%; border: none; overflow: hidden; background: transparent;"
    scrolling="no"
    allowtransparency="true">
  </iframe>
</div>

<script>
  window.addEventListener('message', function(event) {
    // Gestione ridimensionamento automatico
    if (event.data && event.data.type === 'roji-toggle') {
      const container = document.getElementById('roji-container');
      if (event.data.isOpen) {
        container.style.width = '380px';
        container.style.height = '600px';
      } else {
        container.style.width = '80px';
        container.style.height = '80px';
      }
    }
  });
</script>
```

### 3. Note
- **URL di Sviluppo vs Pubblicato**: Se usi l'URL di sviluppo (`ais-dev-...`), funzionerà solo finché la sessione è attiva. Per un sito reale, usa l'URL pubblico.
- **Trasparenza**: L'iframe è impostato per essere trasparente, così vedrai solo il panda sul tuo sito.
