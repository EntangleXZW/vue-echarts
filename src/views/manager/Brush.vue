<template>
    <el-main>
        <div style="margin-bottom: 20px;">
            <el-alert title="echarts brush" description="经验证折线图不能使用，无论是range或者coordRange都不能正确转换出刷选框的范围，等待以后某个开发者的pull-request通过吧。" type="success">
            </el-alert>
        </div>
        <el-row :gutter="20">
            <el-col :span="16">
                <brush-echarts height="500px" :source="source" :title="title"></brush-echarts>
            </el-col>
        </el-row>
    </el-main>
</template>

<script>
import BrushEcharts from '@/components/echarts/BrushEcharts.vue'
export default {
    components: { BrushEcharts },
    data() {
        return {
            source: [],
            title: 'brush application'
        }
    },
    created() {
        this.source = (function (length, dim) {
            let arr = [];
            let xarr = ['varx'];
            for (let j = 0; j < dim; j++) {
                arr.push([`var${j + 1}`]);
            }
            for (let i = 0; i < length; i++) {
                xarr.push(`${i + 1}`);
                for (let j = 0; j < dim; j++) {
                    arr[j].push(Math.floor(Math.random() * 100));
                }
            }
            return [xarr, ...arr];
        })(30, 3);
    }
}
</script>