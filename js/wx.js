export default {
    name: "Scroll",
    data() {
        return {
            scrollHeight: 0, // 屏幕的可视区域高度
            renderList: [], // 要渲染的的列表
            listAll: [], // 总列表
            scrollTop: 0, // 滚动了多少距离
            listHeight: 0, // 容器内占位的高度计算
        };
    },
    // 搭建成了组件 外部传入的数据
    props: {
        //数据列表
        datas: {
            default: () => {
                return [];
            },
            type: Array,
        },
        //计算默认高度
        defHeight: {
            default: 50,
            type: Number,
        },
    },
    computed: {
        // 容器内占位的高度计算
        listHeight() {
            let height = 0;
            this.listAll.forEach((i) => {
                height += i.infiniteScrollHeight;
            });
            return height;
        },
    },
    
    watch: {
        // 传入的数据变化重新获取列表
        datas(v) {
            this.init();
        },
    },
    mounted() {
        this.getInfiniteScrollHeight();
        this.init();
    },
    methods: {
        // 获取可见区的高度
        getInfiniteScrollHeight() {
            if (document.querySelector(".InfiniteScrollContainer")) {
                this.scrollHeight = document.querySelector(".InfiniteScrollContainer").offsetHeight;
            }
        },
        init() {
            if (this.datas.length > 0) {
                this.listAll = JSON.parse(JSON.stringify(this.datas));
                let height = 0;
                this.listAll.forEach((i, index) => {
                    i.infiniteScrollId = index; // 存入当前行的下标
                    i.infiniteScrollKey = Date.parse(new Date()); // vue-for循环使用的唯一值
                    i.infiniteScrollTop = index === 0 ? 0 : this.listAll[index - 1].infiniteScrollTop + this.listAll[index - 1].infiniteScrollHeight; // 当前的行的距离列表顶部的距离
                    i.infiniteScrollHeight = this.defHeight; // 单行的高度
                    height += this.defHeight;
                });
                this.listHeight = height; // 列表总高
                this.renderList = this.listAll.slice(0, 30); // 获取初始渲染的列表
            }
        },
        scrollTops(e) {
            // 滚动超出多少距离进行计算
            if (Math.abs(e.target.scrollTop - this.scrollTop) > this.defHeight) {
                this.scrollTop = e.target.scrollTop;
                this.getRenderList();
            }
        },
        getRenderList() {
            let start = Math.floor((this.scrollTop - 300 > 0 ? this.scrollTop - 300 : 0) / this.defHeight); // 计算渲染的开始位置  滚动区域小于300不进行预渲染
            let count = start + Math.ceil((this.scrollHeight + 600) / this.defHeight); // 添加了上下偏移的格300像素作为预渲染
            this.renderList = this.listAll.slice(start, Math.min(count, this.listAll.length)); // 获取渲染的列表
        },
        // 插件修改后获取数据
        getAllList() {
            let list = [];
            this.listAll.forEach((e) => {
                let i = Object.assign({}, e);
                delete i.infiniteScrollId;
                delete i.infiniteScrollKey;
                delete i.infiniteScrollTop;
                delete i.infiniteScrollHeight;
                list.push(i);
            });
            return list;
        },
    },
};
