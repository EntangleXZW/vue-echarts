<template>
    <div>
        <div ref="main" :style="{ height: height, width: '100%' }"></div>
        <div ref="tip" v-html="tip.html" :style="{ left: tip.left + 'px', top: tip.top + 'px', display: tip.display }"
            class="tip">

        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    data() {
        return {
            tip: {
                html: '',
                left: '',
                top: '',
                display: '',
            },
            option: {
                title: {
                    text: '',
                    left: 'center',
                    top: '5%'
                },
                legend: {
                    type: 'scroll',
                    show: true,
                    top: '12%'
                },
                grid: {
                    top: '20%',
                    left: '5%',
                    right: '5%',
                },
                tooltip: {
                    trigger: 'axis'
                },
                // dataset: {
                //     source: []
                // },
                toolbox: {
                    show: true,
                    showTitle: true, // 隐藏默认文字，否则两者位置会重叠
                    feature: {
                        saveAsImage: {
                            show: true,
                            title: 'Save As Image'
                        },
                        dataView: {
                            show: true,
                            title: 'Data View',
                            // optionToContent: function (opt) {
                            //     var source = opt.dataset[0].source;
                            //     // console.log(opt);
                            //     var table = '<table style="text-align:center;border:1px soild #fff"><tbody><tr>';
                            //     for (var i = 0, l = source.length; i < l; i++) {
                            //         table += '<th>' + source[i][0] + '</th>'
                            //     };
                            //     table += '</tr>';
                            //     for (var i = 1, l = source[0].length; i < l; i++) {
                            //         table += '<tr>';
                            //         for (var j = 0, ll = source.length; j < ll; j++) {
                            //             table += '<td>' + source[j][i] + '</td>'
                            //         };
                            //         table += '</tr>';
                            //     };
                            //     table += '</tbody></table>';
                            //     return table;
                            // }
                        },
                    }
                },
                brush: {
                    toolbox: ['rect', 'lineX', 'lineY', 'clear'],
                    xAxisIndex: 0,
                    // throttleType: 'debounce',//开启选中延迟后调用回调延迟
                    // throttleDelay: 600,//选中延迟后调用回调延迟时间
                },
                xAxis: {
                    name: 'xlabel',
                    nameGap: 25,
                    nameLocation: 'middle',
                    data: [],
                    nameTextStyle: {
                        fontWeight: 'bold',
                        fontSize: 14
                    },
                    // type: 'value',
                    type: 'category',
                    minorTick: {
                        show: true
                    }
                },
                yAxis: {
                    name: 'ylabel',
                    nameGap: 30,
                    nameLocation: 'middle',
                    nameTextStyle: {
                        fontWeight: 'bold',
                        fontSize: 14
                    }
                },
                series: [],
                dataZoom: [
                    // {
                    //     show: true,
                    //     start: 0,
                    //     end: 100,
                    //     xAxisIndex: [0, 1],
                    //     bottom: '10%'
                    // },
                    {
                        type: 'inside',
                        start: 0,
                        end: 100,
                        xAxisIndex: [0, 1]
                    },
                    {
                        yAxisIndex: [0, 1],
                        left: '2%'
                    }
                ]
            }
        }
    },
    props: {
        height: {
            type: String,
            default: '300px'
        },
        title: {
            type: String,
            default: ''
        },
        source: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    watch: {
        source() {
            this.observeSource();
            // console.log(this.option.yAxis);
            this.setMyOption();
        },
        title() {
            this.option.title.text = this.title;
            this.option.yAxis.name = this.title;
            this.setMyOption();
        }
    },
    mounted() {
        this.option.title.text = this.title;
        this.observeSource();
        this.setMyOption();
        window.addEventListener('resize', this.resizeChart);
        this.myChart.off('brushSelected');
        this.myChart.dispatchAction({
            type: 'takeGlobalCursor',
            key: 'brush',
            brushOption: {
                brushType: 'rect'
            }
        });
        this.myChart.on('brushSelected', (params) => { // brushSelected
            // 柱状图  params.batch[0].selected[0].dataIndex
            var brushed = [];
            var brushComponent = params.batch[0];
            for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
                var rawIndices = brushComponent.selected[sIdx].dataIndex;
                var rawdata = this.option.series[sIdx].data.filter((v, i) => { return rawIndices.indexOf(i) >= 0 });
                brushed.push('[ ' + this.option.series[sIdx].name + '] ' + rawdata.join(', '));
            }
            if (params.batch[0].areas.length > 0) {
                var coordinateX = null;
                var coordinateY = null;
                if (params.batch[0].areas[0].brushType == 'rect'){
                    coordinateX = params.batch[0].areas[0].range[0][1];
                    coordinateY = params.batch[0].areas[0].range[1][0];
                }else if (params.batch[0].areas[0].brushType == 'lineX'){
                    coordinateX = params.batch[0].areas[0].range[1];
                    coordinateY = this.$refs.main.offsetTop + this.$refs.main.offsetHeight / 2;
                }else if (params.batch[0].areas[0].brushType == 'lineY'){
                    coordinateX = this.$refs.main.offsetLeft + this.$refs.main.offsetWidth / 2;
                    coordinateY = params.batch[0].areas[0].range[1];
                }  
                this.tip.html = brushed.join('</br>');
                this.tip.left = this.$refs.main.offsetLeft + coordinateX;
                this.tip.top = this.$refs.main.offsetTop + coordinateY;
                this.tip.display = '';
            } else {
                this.tip.display = 'none';
            }

            // this.$notify({
            //     title: '选择数据',
            //     dangerouslyUseHTMLString: true,
            //     message: brushed.join('</br>')
            // })
            // ------------------------
            // 折线图  像素范围 params.batch[0].Range
            //        点的像素 this.myChart._chartsMap[0]._points
            //  对于折线图 range 和 coordRange 都与 刷选框 有偏差， 无法利用
            // var brushed = [];
            // if (params.batch[0].areas.length > 0 && params.batch[0].areas[0].brushType == 'rect') {
            //     var xRange = params.batch[0].areas[0].coordRange[0];
            //     var yRange = params.batch[0].areas[0].coordRange[1];
            //     for (var i = 0; i < this.option.series.length; i++) {
            //         var rawdata = this.option.series[i].data.slice(xRange[0], xRange[1]).filter((v) => {
            //             return v > yRange[0] && v <br yRange[1];
            //         })
            //         brushed.push('[ ' + this.option.series[i].name + '] ' + rawdata.join(', '));
            //     }
            // }
            // var range = params.batch[0].areas[0].range;
            // var pos = [
            //     [range[0][0], range[1][0]],
            //     [range[0][0], range[1][1]],
            //     [range[0][1], range[1][0]],
            //     [range[0][1], range[1][1]]
            // ];
            // console.log(this.myChart.convertFromPixel({gridIndex: 0}, pos[0]));
            // console.log(this.myChart);
            // console.log(brushed);
        });
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeChart);
    },
    methods: {
        setMyOption() {
            this.myChart = echarts.getInstanceByDom(this.$refs.main);
            if (this.myChart == null) {
                this.myChart = echarts.init(this.$refs.main);
                this.myChart.group = 'mygroup';
                echarts.connect('mygroup');
            }
            this.myChart.clear();
            this.myChart.setOption(this.option);
        },
        resizeChart() {
            const width = this.$refs.main.offsetWidth;
            const height = this.$refs.main.offsetHeight;
            this.myChart.resize({ width, height });
        },
        observeSource() {
            // this.option.dataset.source = this.source;
            this.option.series = [];
            this.option.xAxis.data = this.source[0].slice(1);
            this.source.slice(1).forEach((v, index) => {
                // this.option.series.push({ name: v[0], type: 'line', seriesLayoutBy: 'row', encode: { x: 0, y: index + 1 } });
                this.option.series.push({ name: v[0], type: 'bar', data: v.slice(1) });
                let tonum = v.slice(1).map((s) => { return Number(s) });
                if (index == 0) {
                    this.option.yAxis.min = Math.min(...tonum);
                    this.option.yAxis.max = Math.max(...tonum);
                } else {
                    this.option.yAxis.min = Math.min(...tonum, this.option.yAxis.min);
                    this.option.yAxis.max = Math.max(...tonum, this.option.yAxis.max);
                }
            });
            this.option.yAxis.max = Math.round((this.option.yAxis.max + 0.03) * 1000) / 1000;
            this.option.yAxis.min = Math.round((this.option.yAxis.min - 0.03) * 1000) / 1000;
        }
    }
}
</script>

<style>
.tip {
    background-color: #d3e0eca4;
    position: absolute;
    font: 1em sans-serif;
}
</style>