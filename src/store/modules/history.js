const SET_TABSVIEW = 'SET_TABSVIEW'
const DEL_TABSVIEW = 'DEL_TABSVIEW'
const RESET_TABSVIEW = 'RESET-TABSVIEW'
const OTHER_TABSVIEW = 'OTHER_TABSVIEW'
export default {
    state: {
        visitedTabsView: [
            {
                name: "系统首页",
                path: "/home"
            }
        ],
    },
    mutations: {
        [SET_TABSVIEW](state, view) {
            if (state.visitedTabsView.find((n) => n.path === view.path)) {
                return
            }
            state.visitedTabsView.push({ name: view.meta.name, path: view.path })
        },
        [DEL_TABSVIEW](state, view) {
            state.visitedTabsView.forEach((item, index) => {
                if (item.name === view.name && item.path === view.path) state.visitedTabsView.splice(index, 1)
            })
        },
        [RESET_TABSVIEW](state) {
            state.visitedTabsView = [
                {
                    name: "系统首页",
                    path: "/home"
                }
            ]
        },
        [OTHER_TABSVIEW](state, view) {
            state.visitedTabsView = view;
        }
    },
    actions: {
        // 添加一个新的tabsView
        addVisitedTabsView({ commit }, view) {
            commit(SET_TABSVIEW, view)
        },
        // 关闭一个tabsView
        delVisitedTabsView({ commit, state }, view) {
            return new Promise((resolve, reject) => {
                commit(DEL_TABSVIEW, view)
                resolve([...state.visitedTabsView])
            })
        },
        // 重置tabsView
        resetTabsView({ commit }) {
            commit(RESET_TABSVIEW)
        },
        // 页面中 关闭其他标签的事件
        otherTabsView({ commit }, view) {
            commit(OTHER_TABSVIEW, view)
        }
    },
    getters: {
        visitedTabsView: (state) => state.visitedTabsView
    }
}