<!-- todo 历史记录标签，后续新增 在标签上右击实现 关闭左侧/关闭右侧/关闭全部 的功能 -->
<template>
    <div class="tabs-view-container" style="height: 36px;
    display: inline-block;
    width: 95%;
    overflow-x: wrap;
    align-items: left;
    margin-left: 15px;
    margin-right: 15px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-bottom-width: 1px;
    ">
        <router-link class="tags-view-item" :class="isActive(tag) ? 'active' : ''" v-for="(tag, index) in visitedTabsView"
            :to="tag.path" :key="index">
            <el-tag size="medium" :type="isActive(tag) ? 'success' : 'info'" v-if="tag.name === '系统首页'" :disable-transitions="false"
                @close.prevent.stop="handleClose(tag)" @contextmenu.prevent.native="openRightMenu($event, tag, index)"
                effect="light">
                {{ tag.name }}
            </el-tag>
            <el-tag size="medium" v-else :type="isActive(tag) ? 'success' : 'info'" :closable="true" :disable-transitions="false"
                @close.prevent.stop="handleClose(tag)" @contextmenu.prevent.native="openRightMenu($event, tag, index)"
                effect="light">
                {{ tag.name }}
            </el-tag>
        </router-link>
        <div class="right-menu" id="menu" style="display:none">
            <div class="right-menu-box" style="border-top: none" @click="closeLeft">关闭左侧</div>
            <div class="right-menu-box" @click="closeRight">关闭右侧</div>
            <div class="right-menu-box" @click="closeAll">关闭全部</div>
            <div class="right-menu-box" @click="closeOther">关闭其他</div>
        </div>
    </div>
</template>
 
<script>
import { mapActions, mapGetters } from "vuex";

export default {
    name: "HistoryTag",
    data() {
        return {
            tagObj: {
                allList: [], // 所有的Tags数组
                willDelTag: {}, // 当前右击的Tag
                tagIndex: 0, // 右击的标签在数组中的位置
            },
        };
    },
    created() {
        this.addTabsView();
    },
    computed: {
        ...mapGetters(["visitedTabsView"])
    },
    methods: {
        ...mapActions(["addVisitedTabsView", "delVisitedTabsView", "resetTabsView", "otherTabsView"]),
        addTabsView() {
            const route = this.generateRoute();
            if (!route) {
                return false;
            }
            this.addVisitedTabsView(this.generateRoute());
            this.tagObj.allList = this.visitedTabsView;
        },
        generateRoute() {
            if (this.$route.name) {
                return this.$route;
            }
            return false;
        },
        isActive(route) {
            return route.path === this.$route.path || route.name === this.$route.name;
        },
        handleClose(tag) {
            this.delVisitedTabsView(tag).then(tags => {
                // 如果关闭的是当前显示的页面，就去到前一个 tab-view 页面
                if (this.isActive(tag)) {
                    const lastTag = tags.slice(-1)[0];
                    // 前一个 tab-view 页面存在，就跳；不存在就到首页
                    if (lastTag) {
                        this.$router.push(lastTag.path);
                    } else {
                        this.$router.push("/home");
                    }
                }
            });
            this.tagObj.allList = this.visitedTabsView;
        },
        openRightMenu(event, tag, index) {
            // console.log(event, tag, index)
            this.tagObj.willDelTag = tag;
            this.tagObj.tagIndex = index;
            let menu = document.querySelector('#menu');
            document.addEventListener('click', this.unShowMenu);
            menu.style.display = "block";
            menu.style.left = event.clientX - 0 + 'px';
            menu.style.top = event.clientY - 0 + 'px';
        },
        unShowMenu() {
            let menu = document.querySelector('#menu')
            menu.style.display = "none";
        },
        closeLeft() {
            if (this.tagObj.tagIndex === 1) {
                this.$message.error('必须固定首页在最左侧嗷！')
                return false
            }
            if (this.tagObj.tagIndex === 0) {
                this.$message.error('左侧已经没有标签了嗷！')
                return false
            }
            this.tagObj.allList.splice(1, this.tagObj.tagIndex - 1);
            // 可能this.tagObj.allList指向的是this.$store.state.history.visitedTabsView的地址
            // 以下这一步是为了判断是否在亮起的tag标签上点击的删除
            if (this.$route.path !== this.tagObj.willDelTag.path) {
                this.$router.push(this.tagObj.willDelTag.path)
            }
        },
        closeRight() {
            // console.log(this.tagObj)
            if (this.tagObj.tagIndex === this.tagObj.allList.length - 1) {
                // 是最后一项
                this.$message.error('右侧已经没有标签了嗷！')
                return false
            }
            this.tagObj.allList.splice(this.tagObj.tagIndex + 1, this.tagObj.allList.length - 1)
            // 以下这一步是为了判断是否在亮起的tag标签上点击的删除
            if (this.$route.path !== this.tagObj.willDelTag.path) {
                this.$router.push(this.tagObj.willDelTag.path)
            }
        },
        closeAll() {
            if (this.tagObj.allList.length === 1) {
                // 只有一项
                this.$message.error('必须保留一个首页标签嗷！')
                return false
            }
            this.resetTabsView()
            if (this.$route.name !== '系统首页') {
                this.$router.push('/home')
            }
        },
        closeOther() {
            console.log(this.tagObj)
            if (this.tagObj.allList.length === 1) {
                // 只有一项
                this.$message.error('必须保留一个首页标签嗷！')
                return false
            }
            if (this.tagObj.allList.length === 2 && this.tagObj.willDelTag.name !== '系统首页') {
                // 只有两项且点击的不是首页标签
                this.$message.error('没有其他标签可以删除了！')
                return false
            }
            if (this.tagObj.allList.length === 2 && this.tagObj.willDelTag.name === '系统首页') {
                // 只有两项且点击的是首页标签
                this.resetTabsView()
                if (this.$route.name !== '系统首页') {
                    this.$router.push('/home')
                }
            }
            let arr = [{
                name: "系统首页",
                path: "/home"
            }]
            if (this.tagObj.willDelTag.name !== '系统首页') arr.push(this.tagObj.willDelTag)
            this.otherTabsView(arr)
            // 以下这一步是为了判断是否在亮起的tag标签上点击的删除
            if (this.$route.path !== this.tagObj.willDelTag.path) {
                this.$router.push(this.tagObj.willDelTag.path)
            }
        },
    },
    watch: {
        $route() {
            this.addTabsView();
        }
    }
};
</script>

<style scoped>
.right-menu {
    position: absolute;
    width: 120px;
    display: flex;
    flex-direction: column;
    text-align: center;
    background-color: white;
    box-shadow: 1px 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    z-index: 9999;
}

.right-menu-box {
    font-size: 12px;
    padding: 6px 0;
    border-top: 1px solid #eee;
}

.right-menu-box:hover {
    background-color: #f5f5f5;
}
.el-tag {
    margin-left: 4px;
}
</style>
 