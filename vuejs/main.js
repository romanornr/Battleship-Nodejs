window.addEventListener('load', init);
window.addEventListener('resize', init);

function init() {
    var tds = document.getElementsByTagName('td');
    var tdWidth = tds[0].clientWidth;
    for (i = 0; i < tds.length; i++) {
        tds[i].style.height = tdWidth + 'px';
    }
}