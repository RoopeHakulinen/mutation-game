# MutationGame

## Snippet for adding the iframe embedding
```javascript
document.addEventListener("DOMContentLoaded", function(event) {
    var iframe = document.createElement('iframe');
    iframe.scrolling = 'no';
    iframe.style.width = "100%";
    iframe.style['min-height'] = "1040px";
    iframe.style.border = "none";
    iframe.src = 'https://roopehakulinen.github.io/mutation-game/';

    var aTags = document.getElementsByTagName("h2");
    var searchText = "Mutation Game App";
    var found;

    for (var i = 0; i < aTags.length; i++) {
        if (aTags[i].textContent == searchText) {
            found = aTags[i];
            break;
        }
    }
    found.parentElement.appendChild(iframe);
});
```
