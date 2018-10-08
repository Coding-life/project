window.onload = function () {
    // 动画函数
    function animate(element, json, fn) {
        clearInterval(element.timeId);
        element.timeId = setInterval(function () {
            let flag = true; //默认,假设,全部到达目标
            for (let attr in json) {
                let current;
                let target;
                let step;
                if (attr === "opacity") { // 判断是否为opacity
                    //获取元素这个属性的当前的值
                    current = getStyle(element, attr) * 100; // 实际值值乘100转化为整数
                    //当前的属性对应的目标值
                    target = json[attr] * 100; // 目标值乘100转化为整数
                    //移动的步数
                    step = 10;
                    step = step > 0 ? Math.ceil(step) : Math.floor(step);
                    current += step; //移动后的值
                    element.style[attr] = current / 100;
                } else if (attr === "zIndex") { // 判断是否为zIndex
                    element.style[attr] = json[attr];
                } else { // 一般情况
                    //获取元素这个属性的当前的值
                    current = parseInt(getStyle(element, attr));
                    //当前的属性对应的目标值
                    target = json[attr];
                    //移动的步数
                    step = (target - current) / 10;
                    step = step > 0 ? Math.ceil(step) : Math.floor(step);
                    current += step; //移动后的值
                    element.style[attr] = current + "px";
                }
                if (current !== target) {
                    flag = false;
                }
            }
            if (flag) {
                //清理定时器
                clearInterval(element.timeId);
                if (fn) {
                    fn();
                }
            }
            //测试代码
            // console.log("目标:" + target + ",当前:" + current + ",每次的移动步数:" + step);
        }, 20);
    }

    // 轮播图模块
    {
        // bug1:重复进入同一个索引按钮，会导致图片重新显示
        /*功能：依次实现
        1、按钮的排他功能
        2、翻页箭头的隐藏显示
        3、箭头翻页的实现
        4、实现翻页的无缝连接
        5、箭头与小按钮同步
        6、自动翻页
        思路：
        1、获取所需元素
        2、创建小按钮
        3、实现排他功能的显示
        4、实现小按钮的翻页
        5、实现箭头的翻页
        6、实现箭头与小按钮同步（技巧：将小按钮那边的索引值设置为全局变量，让左右箭头共用这个索引，达到同步变化的目的）
        7、为左右箭头点击，额外添加排他功能，来与小按钮实现同步
        8、自动翻页，设置定时器调用 点击右箭头函数
        9、在鼠标放上大盒子的时候停止自动翻页，离开时继续翻页
        */
        // 图片ul
        let bannerUl = document.getElementById("imgMid");
        // 索引值
        // 6 实现箭头与小按钮同步（技巧：将小按钮那边的索引值设置为全局变量，让左右箭头共用这个索引，达到同步变化的目的）
        let index = 0;
        // 1 获取所需元素 图片li
        let bannerLi = bannerUl.children;
        // 2 创建小按钮
        // 获取ol标签
        let bol = document.getElementsByClassName("b-index")[0];
        // 创建按钮
        for (let i = 0; i < bannerLi.length; i++) {
            let liIndex = document.createElement("li");
            liIndex.setAttribute("index", i);
            bol.appendChild(liIndex);
        }
        //获取ol中的li标签
        let bindex = bol.children;
        // 设置默认选中项
        bannerLi[0].className = "current";
        bindex[0].className = "current";
        // 3 排他功能
        for (let i = 0; i < bannerLi.length; i++) {
            bindex[i].onmouseover = function () {
                for (let i = 0; i < bannerLi.length; i++) {
                    bindex[i].className = "";
                }
                this.className = "current";
                // 4 实现小按钮的翻页
                index = this.getAttribute("index");
                // 将所有图片变透明
                for (let i = 0; i < bannerLi.length; i++) {
                    bannerLi[i].style.opacity = "0";
                }
                // 如果索引值和之前不一样，则变化
                // 获取上一次操作的索引
                animate(bannerLi[index], {"opacity": 1});
            };
        }
        // 5 实现箭头的翻页
        // 获取箭头
        let arrowL = document.getElementById("arrowL");
        let arrowR = document.getElementById("arrowR");
        arrowL.onclick = function () {
            // 点击翻页
            // index 为当前小按钮显示的索引值
            if (index === 0) {
                index = bannerLi.length;
            }
            index--;
            console.log(index);
            // 将所有图片透明
            for (let i = 0; i < bannerLi.length; i++) {
                bannerLi[i].style.opacity = "0";
                bindex[i].className = "";
            }
            animate(bannerLi[index], {"opacity": 1});
            // 点击以后，小按钮切换
            bindex[index].className = "current";
        };

        arrowR.onclick = autoClick;

        function autoClick() {
            // 点击翻页
            // index 为当前小按钮显示的索引值
            if (index === bannerLi.length - 1) {
                index = -1;
            }
            index++;
            // 将所有图片透明
            // 7 为左右箭头点击，额外添加排他功能，来与小按钮实现同步
            for (let i = 0; i < bannerLi.length; i++) {
                bannerLi[i].style.opacity = "0";
                bindex[i].className = "";
            }
            animate(bannerLi[index], {"opacity": 1});
            // 点击以后，小按钮切换
            bindex[index].className = "current";
        };

        // 8 自动翻页，设置定时器调用 点击右箭头函数
        let myTime = setInterval(autoClick, 3000);

        // 当鼠标在图片上时，停止翻页（清除定时器）
        //获取b-mid
        let stopArea = document.getElementById("box").children[0];
        stopArea.onmouseover = function () {
            clearInterval(myTime);
        };
        stopArea.onmouseleave = function () {
            myTime = setInterval(autoClick, 3000);
        }

        // 缩放图片 class 样式  scaleB
        let scaleB = document.getElementsByClassName("scaleB");
        for (let i = 0; i < scaleB.length; i++) {
            let img = scaleB[i].children[0].children[0];
            scaleB[i].onmouseover = function () {
                img.style.transform = "scale(1.04)";
            };
            scaleB[i].onmouseleave = function () {
                img.style.transform = "";
            };
        }
    }


    // 动态创建nav下拉栏
    /*
    * 获取nav中的几个元素
    * 根据获取的数组，来确定宽高，确定盒子大小
    * 宽度：列数*宽度 + （列数-1）*间距 + 外边距
    * 高度：标题高 + 内容个数*高度(最多5个)
    *
    * 生成ul = myJson1 中的几个子元素数量
    * 生产li = 子元素中的内容数量
    * 丛第二个开始的 li 元素内，生成img，span，"inner"
    *
    * 当鼠标移动到当前的内容，i标签显示
    *
    * <li><a href="javascript:void(0)">居家</a>  <i>箭头</i><span>内容</span>   </li>
    * */

    let data = document.getElementById("navDetail");
    // 内容框上的小箭头
    let topArrow = data.getElementsByTagName("i");
    // nav栏外框
    let dataParent = data.parentNode;
    // 获取有下拉菜单的li标签
    let dataLi = data.children;
    // 1 ~ dataLi.length - 3 响应范围
    // for (let i = 1; i < dataLi.length; i++)
    // div块中的内容
    let navData = document.getElementsByClassName("navData");

    // 获取数据，添加内容
    function writeData(jsonData, a) {
        // 自适应宽高
        // 获取 json 中的 数据的个数
        // div的内padding + 内容间的margin：（ul个数+1）*30 + ul个数*140
        let count = 0;
        for (let j in jsonData) {count++;}
        // console.log(arrLength);
        navData[a-1].style.width = 20 + (count + 1) * 30 + count * 140 + "px";

        // 写入内容
        let navDataString = "";
        for (let i in jsonData) {
            // 创建 i 个 ul
            navDataString += "<ul>";
            // 将第一个title 加到 ul 后
            navDataString += "<li>" + jsonData[i][0].title + "</li>";
            for (let j = 1; j < jsonData[i].length; j++) {
                // 添加inner中的内容
                navDataString += "<li><img src=" + jsonData[i][j].imgUrl + "><span>" + jsonData[i][j].inner + "</span></li>";
            }
            navDataString += "</ul>";
        }
        // 将数据追加到块中
        navData[a - 1].innerHTML = navDataString;
    }

    writeData(myJson1, 1);
    writeData(myJson2, 2);
    writeData(myJson3, 3);
    writeData(myJson4, 4);
    writeData(myJson5, 5);
    writeData(myJson6, 6);
    writeData(myJson7, 7);
    writeData(myJson8, 8);
    writeData(myJson9, 9);
    writeData(myJson10, 10);

    {
        //排他功能，全部隐藏，mouse over的显示
        for (let i = 1; i < dataLi.length - 2; i++) {
            dataLi[i].setAttribute("index", i);
            dataLi[i].onmouseover = function () {
                for (let j = 0; j < dataLi.length - 3; j++) {
                    navData[j].style.display = "none";
                    // dataLi[j].children[1].style.display = "block";
                    topArrow[j].style.display = "none";
                }
                navData[this.getAttribute("index") - 1].style.display = "block";
                // 显示小箭头
                this.children[1].style.display = "block";
            };
        }
        // 鼠标离开nav栏，内容消失
        dataParent.onmouseleave = function () {
            for (let j = 0; j < dataLi.length - 3; j++) {
                navData[j].style.display = "none";
                topArrow[j].style.display = "none";
            }
        };
    }


};

let myJson1 = {
    "first": [
        {"title": "家具1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发4"}
    ],
    "second": [
        {"title": "家具2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发4"},
        {"imgUrl": "images/sofa.png", "inner": "沙发5"},
        {"imgUrl": "images/sofa.png", "inner": "沙发6"}
    ]
};
let myJson2 = {
    "first": [
        {"title": "服装1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"}
    ],
    "second": [
        {"title": "服装2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发4"}
    ],
    "third": [
        {"title": "服装3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发4"},
        {"imgUrl": "images/sofa.png", "inner": "沙发5"}
    ]
};
let myJson3 = {
    "first": [
        {"title": "生活用品1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发4"},
        {"imgUrl": "images/sofa.png", "inner": "沙发5"}
    ],
    "second": [
        {"title": "生活用品2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发4"}
    ]
};
let myJson4 = {
    "first": [
        {"title": "家具1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"}
    ],
    "second": [
        {"title": "家具2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发4"}
    ],
    "third": [
        {"title": "家具3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"}
    ],
    "forth": [
        {"title": "家具4"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发4"}
    ]
};
let myJson5 = {
    "first": [
        {"title": "家具1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"}
    ],
    "second": [
        {"title": "家具2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"}
    ],
    "third": [
        {"title": "家具3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发4"}
    ]
};
let myJson6 = {
    "first": [
        {"title": "家具1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"}
    ],
    "second": [
        {"title": "家具2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发4"}
    ],
    "third": [
        {"title": "家具3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发4"},
        {"imgUrl": "images/sofa.png", "inner": "沙发5"}
    ]
};
let myJson7 = {
    "first": [
        {"title": "家具1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"}
    ],
    "second": [
        {"title": "家具2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发4"}
    ],
    "third": [
        {"title": "家具3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发4"},
        {"imgUrl": "images/sofa.png", "inner": "沙发5"}
    ]
};
let myJson8 = {
    "first": [
        {"title": "家具1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"}
    ],
    "second": [
        {"title": "家具2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发4"}
    ],
    "third": [
        {"title": "家具3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发4"},
        {"imgUrl": "images/sofa.png", "inner": "沙发5"}
    ]
};
let myJson9 = {
    "first": [
        {"title": "家具1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"}
    ],
    "second": [
        {"title": "家具2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发4"}
    ],
    "third": [
        {"title": "家具3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发4"},
        {"imgUrl": "images/sofa.png", "inner": "沙发5"}
    ]
};
let myJson10 = {
    "first": [
        {"title": "家具1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"}
    ],
    "second": [
        {"title": "家具2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发1"},
        {"imgUrl": "images/sofa.png", "inner": "沙发2"},
        {"imgUrl": "images/sofa.png", "inner": "沙发3"},
        {"imgUrl": "images/sofa.png", "inner": "沙发4"}
    ]
};
// console.log(myJson1.first[1].imgUrl);
// for (var i in myJson1) {
//     // console.log(myJson1[i]);
//     for (var j in myJson1[i]) {
//         console.log(myJson1[i][j].inner);
//     }
// }

