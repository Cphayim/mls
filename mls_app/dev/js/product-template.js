mui.plusReady(function() {
    let link = plus.webview.currentWebview().link;
    mui.init({
        subpages: [{
            url: link,
            id: 'web_page',
            styles: {
                top: '0px',
                bottom: '0px',
            }
        }]
    });
    let w = plus.nativeUI.showWaiting('正在加载...');
    setTimeout(function(){
    		w.close(); 
    },2000)
});