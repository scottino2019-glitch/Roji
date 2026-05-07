# Codice per integrare Roji nel tuo sito

Copia e incolla questo codice nella tua pagina HTML dove vuoi che appaia il panda.

```html
<!-- Container per il Panda -->
<div id="roji-container" style="position: fixed; bottom: 20px; right: 20px; width: 80px; height: 80px; z-index: 999999; transition: all 0.3s ease;">
  <iframe 
    id="roji-iframe"
    src="YOUR_PUBLISHED_URL" 
    style="width: 100%; height: 100%; border: none; overflow: hidden;"
    scrolling="no">
  </iframe>
</div>

<script>
  window.addEventListener('message', function(event) {
    // Riceviamo il messaggio dal Panda per ridimensionare l'iframe
    if (event.data && event.data.type === 'roji-toggle') {
      const container = document.getElementById('roji-container');
      if (event.data.isOpen) {
        // Quando è aperto lo ingrandiamo
        container.style.width = '380px';
        container.style.height = '600px';
      } else {
        // Quando è chiuso torna piccolo
        container.style.width = '80px';
        container.style.height = '80px';
      }
    }
  });
</script>
```

### Note IMPORTANTI:
1. **Sostituisci `YOUR_PUBLISHED_URL`**: Devi inserire l'URL che ottieni cliccando su "Share" -> "Publish Project".
2. **Niente pulsanti extra**: Ho rimosso tutto il sito della libreria. Ora l'app è solo il panda.
3. **Caricamento**: Se vedi errori di caricamento, assicurati di aver configurato la `GEMINI_API_KEY` nelle impostazioni (Settings).
