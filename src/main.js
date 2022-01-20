const $siteList = $('.sitelist') // 查找
const $lastLi = $siteList.find('li.last')
const x = localStorage.getItem('x');
const xObject = JSON.parse(x)
const hashMap = xObject || [
    {logo: 'A', url: 'https://www.apple.com'},
    {logo: 'B', url: 'https://www.bilibili.com'},
]

const simplifyUrl = (url) => {
    return url.replace("https://", '')
        .replace("http://", '')
        .replace("www.", '')
        .replace(/\/.*/,'') // 删除url中/开头的部分
}
const render = () => {
    $siteList.find('li:not(.last)').remove();
    hashMap.forEach((node,index) => {
        const $li = $(`
         <li>
            <div class="site">
                <div class="logo">${node.logo[0]}</div>
                <div class="link">${simplifyUrl(node.url)}</div>
                <div class="remove">
                    <svg class="icon">
                        <use xlink:href="#icon-remove"></use>
                    </svg>
                </div>
            </div>
        </li>
    `).insertBefore($lastLi);
        $li.on('click',(e)=>{
            window.open(node.url)
        })
        $li.on('click','.remove',(e)=>{
            e.stopPropagation() // 阻止冒泡
            hashMap.splice(index,1)
            render() // 重新渲染
        })
    })
}
render();

$('.addButton')
    .on('click', () => {
        let url = window.prompt('请问您要添加的网址是？');
        if (url.indexOf('http') !== 0) {
            url = 'https://' + url;
        }
        hashMap.push({
            logo: simplifyUrl(url)[0].toUpperCase(),
            url: url
        })
        render();
    });
// 页面关闭事件
window.onbeforeunload = () => {
    /*
    * localStorage 被删的情况
    * 1、用户手动清除cookie及其他网站数据项，localStorage 被清空
    * 2、用户磁盘满了，一定概率被浏览器删除
    * 3、隐私模式访问，无痕窗口
    * */
    const str = JSON.stringify(hashMap); //localStorage只能存字符串，对象转字符串
    localStorage.setItem('x', str)
}

$(document).on('keypress',(e)=>{
    const {key} = e
    for (let i = 0; i < hashMap.length; i++) {
        if (hashMap[i].logo.toLowerCase() === key){
            window.open(hashMap[i].url)
        }
    }
})
$(".searchForm").on('keypress',(e)=>{
    e.stopPropagation() // 阻止冒泡,解决输入时候的BUG
})