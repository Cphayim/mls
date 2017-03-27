/*
 * home 页数据加载，交互逻辑
 * @Author: Cphayim 
 * @Date: 2017-03-23 13:43:38 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-03-26 23:50:58
 */

// 组件初始化
mui.init({
    pullRefresh: {
        auto: true,
        container: '#pullrefresh',
        down: {
            callback: pulldownRefresh
        },
        up: {
            contentrefresh: '正在加载...',
            callback: pullupRefresh
        }
    }
});
// webview 设置
mui.plusReady(function () {
    plus.webview.currentWebview().setStyle({
        // 在打开子视图后维持该 webview 的渲染
        render: 'always'
    });
});
// 下拉刷新
function pulldownRefresh() {
    setTimeout(() => {
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    }, 500);
}
// collocation 块请求索引标记
let collocationIndex = 2;
// 上拉加载
function pullupRefresh() {
    setTimeout(() => {
        // 数据加载
        collocationLoad(collocationIndex);
        mui('#pullrefresh').pullRefresh().endPullupToRefresh(collocationIndex > 4); //参数为true代表没有更多数据了。
        collocationIndex++;
        // 数据循环
        if (collocationIndex > 4) {
            collocationIndex = 1; // 重置索引
        }
    }, 500);
}

// 进入页面自动下拉刷新
if (mui.os.plus) {
    mui.plusReady(() => {
        setTimeout(() => {
            mui('#pullrefresh').pullRefresh().pulldownLoading();
        }, 100);
    });
} else {
    mui.ready(() => {
        setTimeout(() => {
            mui('#pullrefresh').pullRefresh().pulldownLoading();
        }, 100);
    });
}

init();
// 初始化数据加载
function init() {
    initLoad();
    collocationLoad(1);
}
// 首屏初始化
function initLoad() {
    // 轮播图 数据加载
    mui.ajax(SERVER_URL + "/home/banner", {
        type: 'get',
        success: (resData) => {
            if (!resData.status.code) {
                console.log(resData.status.msg);
                return;
            }
            const data = resData.result.list;
            const oGroup = document.querySelector('#j-slider .mui-slider-group'),
                oIndicator = document.querySelector('#j-slider .mui-slider-indicator');
            let groupItemStr = '',
                indicatorItemStr = '';
            for (let i = 0; i < data.length; i++) {
                // 首
                if (i === 0) {
                    groupItemStr += `<div class="mui-slider-item mui-slider-item-duplicate"><a class="web-template" data-title="${data[data.length - 1].title}" data-link="${data[data.length - 1].link}"><img src="${data[data.length - 1].image}" alt="${data[data.length - 1].title}"></a></div>`;
                    indicatorItemStr += `<div class="mui-indicator mui-active"></div>`;
                } else {
                    indicatorItemStr += `<div class="mui-indicator"></div>`;
                }
                groupItemStr += `<div class="mui-slider-item"><a class="web-template" data-title="${data[i].title}" data-link="${data[i].link}"><img src="${data[i].image}" alt="${data[i].title}"></a></div>`;
                // 尾
                if (i === data.length - 1) {
                    groupItemStr += `<div class="mui-slider-item mui-slider-item-duplicate"><a class="web-template" data-title="${data[0].title}" data-link="${data[0].link}"><img src="${data[0].image}" alt="${data[0].title}"></a></div>`;
                }
            }
            oGroup.innerHTML = groupItemStr;
            oIndicator.innerHTML = indicatorItemStr;

            // 启动轮播组件
            mui('#j-banner').slider({
                interval: 3500
            });
        },
        error: (err) => {
            mui.toast('网络异常，连接失败');
        }
    });

    // home-nav 数据加载
    mui.ajax(SERVER_URL + "/home/nav", {
        type: 'get',
        success: (resData) => {
            if (!resData.status.code) {
                console.log(resData.status.msg);
                return;
            }
            const data = resData.result.list;
            const container = document.querySelector('.m-home-nav .mui-scroll');
            let str = '';
            for (let item of data) {
                str += `<a class="item tips" data-link="${item.link}" data-title="${item.title}"><img src="${item.image}" alt="${item.title}" /><div>${item.title}</div></a>`;
            }
            container.innerHTML = str;
        },
        error: (err) => {
            mui.toast('网络异常，连接失败');
        }
    });

    // 活动版块 数据加载
    mui.ajax(SERVER_URL + "/home/act", {
        type: 'get',
        success: (resData) => {
            if (!resData.status.code) {
                console.log(resData.status.msg);
                return;
            }
            const result = resData.result;
            const container = document.querySelector('.m-activity');
            // 活动封面
            if (result.cover && result.cover.length > 0) {
                for (let item of result.cover) {
                    const activity = document.createElement('div');
                    activity.className = 'activity';
                    activity.innerHTML = `<a class="web-template" data-link="${item.link}" data-title="${item.title}"><img src="${item.image}" alt="${item.title}" /></a>`;
                    container.appendChild(activity);
                }
            }
            // 活动列表
            if (result.list && result.list.length > 0) {
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-cate mui-clearfix';
                let str = '';
                for (let item of result.list) {
                    str += `<a class="item" data-title="${item.title}" data-link="${item.link}"><img src="${item.image}" alt="${item.title}" /></a>`;
                }
                activityItem.innerHTML = str;
                container.appendChild(activityItem);
            }
        },
        error: (err) => {
            mui.toast('网络异常，连接失败');
        }
    });
    // 正在流行 数据加载
    mui.ajax(SERVER_URL + "/home/popular", {
        type: 'get',
        success: (resData) => {
            if (!resData.status.code) {
                console.log(resData.status.msg);
                return;
            }
            const list = resData.result.list;
            // 外围容器
            const container = document.querySelector('.m-popular .mui-slider .mui-slider-group');
            // 一列竖排两项，四列一屏
            // 列数组
            let colArr = [];
            for (let i = 0; i < list.length; i += 2) {
                // 生成列(两个项)
                const col = document.createElement('div');
                col.className = 'col';
                col.innerHTML = `<a class="item tips" data-title="${list[i].title}" data-link="${list[i].link}"><img src="${list[i].image}" alt="${list[i].title}"/><span>${list[i].title}</span></a>`;
                if (!!list[i + 1]) {
                    col.innerHTML += `<a class="item tips" data-title="${list[i+1].title}" data-link="${list[i+1].link}"><img src="${list[i+1].image}" alt="${list[i+1].title}"/><span>${list[i+1].title}</span></a>`;
                }
                // 存到列数组中
                colArr.push(col);
            }
            // 列数
            let num = colArr.length;
            // 每屏几列
            let screenColNum = 4;
            // 计算有几屏
            let screenNum = num % screenColNum ? parseInt(num / screenColNum) + 1 : parseInt(num / screenColNum);
            let cureentScreen = 0; // 当前第几屏

            for (let i = 0; i < screenNum; i++) {
                const screen = document.createElement('div');
                // screen.style.width = '25%';
                screen.className = 'mui-slider-item';
                let count = 0;
                for (let j = cureentScreen * screenColNum; j < colArr.length; j++) {
                    screen.appendChild(colArr[j]);
                    if (++count === screenColNum) {
                        break;
                    }
                }
                container.appendChild(screen);
                cureentScreen++;
            }
            mui('#j-popular').slider();
        },
        error: (err) => {
            mui.toast('网络异常，连接失败');
        }
    });
}

/**
 * collocation 数据加载
 * @param {Object} index 发送的数据库查询索引参数
 */
function collocationLoad(index) {
    mui.ajax(SERVER_URL + "/home/collocation", {
        type: 'get',
        data: {
            index
        },
        success: (resData) => {
            if (!resData.status.code) {
                console.log(resData.status.msg);
                return;
            }
            const list = resData.result.list;
            const collocationWrap = document.querySelector('.m-collocation .collocation-wrap');
            // 创建 coll 块
            const collocationItem = document.createElement('div');
            collocationItem.className = 'collocation-item';
            // 模板拼接
            collocationItem.innerHTML =
                `<!-- 块上半部 -->
<div id="${list[0].id}" class="collocation-item-top mui-clearfix">
	<div class="mui-clearfix">
		<!-- 左侧大图 -->
		<div class="mui-col-xs-8 mui-pull-left">
			<a id="${list[0].goodsList[0].id}" class="web-template" data-title="${list[0].title}" data-link="${list[0].goodsList[0].detailUrl}">
                <img src="${list[0].goodsList[0].image}" alt="${list[0].description}"/>
            </a>
		</div>
		<!-- 右侧小图 -->
		<div class="mui-col-xs-4 mui-pull-left">
			<a id="${list[0].goodsList[1].id}" class="product-template" data-title="${list[0].goodsList[1].title}" data-link="${list[0].goodsList[1].wapGoodUrl}" >
                <img src="${list[0].goodsList[1].image}" alt="${list[0].goodsList[1].title}"/>
                <span>￥${list[0].goodsList[1].price}</span>
			</a>
			<a id="${list[0].goodsList[2].id}" class="product-template" data-title="${list[0].goodsList[2].title}" data-link="${list[0].goodsList[2].wapGoodUrl}" >
                <img src="${list[0].goodsList[2].image}" alt="${list[0].goodsList[2].title}"/>
                <span>￥${list[0].goodsList[2].price}</span>
			</a>
			<a id="${list[0].goodsList[3].id}" class="product-template" data-title="${list[0].goodsList[3].title}" data-link="${list[0].goodsList[3].wapGoodUrl}" >
                <img src="${list[0].goodsList[3].image}" alt="${list[0].goodsList[3].title}"/>
                <span>￥${list[0].goodsList[3].price}</span>
			</a>
		</div>
	</div>
	<!-- 简介 -->
	<div class="brief" data-deail="${list[0].description}">
		<h4>${list[0].title}</h4>
		<p>${list[0].subTitle}</p>
	</div>
</div>
<!-- /块上半部 -->
<!-- 块下半部 -->
<div id="${list[1].id}" class="collocation-item-bot">
    <div class="banner">
        <a class="web-template" data-title="${list[1].title}" data-link="${list[1].originUrl}">
            <img src="${list[1].image}" alt="${list[1].description}"/>
            <div class="overlay">
                <h4>${list[1].title}</h4>
                <p>${list[1].subtitle}</p>
                <span>get 新品</span>
            </div>
        </a>
    </div>
    <div class="grid mui-clearfix">
        <a id="${list[1].goodsList[0].id}" class="product-template" data-title="${list[1].goodsList[0].title}" data-link="${list[1].goodsList[0].wapGoodUrl}">
            <img src="${list[1].goodsList[0].image}" alt="${list[1].goodsList[0].title}" />
            <span>￥${list[1].goodsList[0].price}</span>
        </a>
        <a id="${list[1].goodsList[1].id}" class="product-template" data-title="${list[1].goodsList[1].title}" data-link="${list[1].goodsList[1].wapGoodUrl}">
            <img src="${list[1].goodsList[1].image}" alt="${list[1].goodsList[1].title}" />
            <span>￥${list[1].goodsList[1].price}</span>
        </a>
        <a id="${list[1].goodsList[2].id}" class="product-template" data-title="${list[1].goodsList[2].title}" data-link="${list[1].goodsList[2].wapGoodUrl}">
            <img src="${list[1].goodsList[2].image}" alt="${list[1].goodsList[2].title}" />
            <span>￥${list[1].goodsList[2].price}</span>
        </a>
        <a id="${list[1].goodsList[3].id}" class="product-template" data-title="${list[1].goodsList[3].title}" data-link="${list[1].goodsList[3].wapGoodUrl}">
            <img src="${list[1].goodsList[3].image}" alt="${list[1].goodsList[3].title}" />
            <span>￥${list[1].goodsList[3].price}</span>
        </a>
    </div>
</div>`;
            collocationWrap.appendChild(collocationItem);
        },
        error: (err) => {
            mui.toast('网络异常，连接失败');
        }
    });
}

// 事件监听
mui('body').on('tap', '.web-template', function () {
    const extras = {
        link: this.dataset.link,
        title: this.dataset.title
    };
    mui.openWindow('web-template.html', 'web-template', {
        extras
    });
    //  mui.alert('美女，你可能安装了假的美丽说\n这里没有活动哦^0^', '来自丑陋说的提示');
}).on('tap', '.product-template', function () {
    const extras = {
        link: this.dataset.link,
    };
    mui.openWindow('product-template.html', 'product-template', {
        extras
    });
}).on('tap', '.tips', function () {
    mui.toast('本App仅供学习使用\n如需参与活动请下载美丽说官方原版App');
});