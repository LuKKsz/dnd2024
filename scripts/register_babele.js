Hooks.once('init', () => {
    if (typeof Babele !== 'undefined') {
        Babele.get().register({
            module: 'dnd2024',
            lang: 'pt-BR',
            dir: 'babele'
        });
    }
});
