<template>
    <div>
        <div style="margin-bottom: 20px;">
            <el-alert title="这是我学vue的第一个弄的玩意，这朴素的语法回头看挺好玩。" type="success">
            </el-alert>
        </div>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-table :data="tableData" height="100%">
                    <el-table-column v-for="(item) in tableColumn" :key="item" :prop="item" :label="item">
                    </el-table-column>
                </el-table>
                <div>
                    <h3>切片选择器</h3>
                    <div style="width:100px">
                        <button v-for="(value, key) in f" :key="key"
                            :class="{ 'selected': value == true, 'ubselected': value == false }" @click="toggleStyle"
                            style="width: 80px; margin-bottom: 5px; text-align: center;" block>{{ key }}</button>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <linkage-echarts :source="source" title="图" v-if="source.length > 0"></linkage-echarts>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import LinkageEcharts from '@/components/echarts/LinkageEcharts.vue';


export default {
    components: { LinkageEcharts },
    data() {
        return {
            source1: [
                ['产品', '2012', '2013', '2014', '2015', '2016', '2017'],
                ['A', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
                ['B', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
                ['C', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
                ['D', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
            ],
            f: { 'A': true, 'B': true, 'C': true, 'D': true },
            source: []
            // tableData: [],
            // tableColumn: []
        }
    },
    computed: {
        // source:function(){
        //     return this.source1;
        // },
        tableData: {
            get: function () {
                return this.source.slice(1).map((item) => {
                    let ob = {};
                    this.tableColumn.map((it, ind) => {
                        ob[it] = item[ind]
                    })
                    return ob;
                })

            },
            set: function () {

            }
        },
        tableColumn: {
            get: function () {
                return this.source[0];
            },
            set: function () {

            }
        }
    },
    mounted() {
        this.restoreSource();
        //this.updataTableData();
    },
    methods: {
        restoreSource() {
            this.source = [...this.source1];
        },
        updataTableData() {
            this.tableColumn = this.source[0];
            this.tableData = this.source.slice(1).map((item) => {
                let ob = {};
                this.tableColumn.map((it, ind) => {
                    ob[it] = item[ind]
                })
                return ob;
            })
        },
        toggleStyle(e) {
            if (this.f[e.target.innerText]) {
                this.f[e.target.innerText] = false;

            } else {
                this.f[e.target.innerText] = true;

            }

            // this.source = [...this.source1];
            let arr = Object.entries(this.f).map((value, index) => {
                if (value[1]) { return this.source1[index + 1] } else { return [] }
            })
            this.source = [this.source1[0], ...(arr && arr.filter((value) => value.length > 0))];

            // console.log(this.source);
        }
    }
}
</script>

<style scoped>
.el-table th,
.el-table td {
    font-size: 10px;
}

.el-table::before {
    height: 0px;
}

.selected {
    background-color: #08c4f3;
}

.unselected {
    background-color: #b7b9b9;
}
</style>