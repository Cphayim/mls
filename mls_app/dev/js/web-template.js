
mui.plusReady(function() {
    let link = plus.webview.currentWebview().link;
    document.querySelector('.mui-title').innerHTML = plus.webview.currentWebview().title;
    mui.init({
        subpages: [{
            url: link,
            id: 'web_page',
            styles: {
                top: '45px',
                bottom: '0px',
            }
        }]
    });
    let w = plus.nativeUI.showWaiting('正在加载...');
    setTimeout(function(){
    		w.close(); 
    },2000)
});