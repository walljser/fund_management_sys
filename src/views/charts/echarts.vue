<template>
    <section class="chart-container">
        <el-row>
            <el-col :span="24">
                <div id="chartPie" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="24">
                <div id="chartPie2" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartColumn" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartColumn2" style="width:100%; height:400px;"></div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
import echarts from 'echarts'
import { all as getFundRecordList } from '@/services/trans'
import storage from '@/utils/storage'
import { get as getRateRecord } from '@/services/rate'
export default {
  data() {
      return {
        chartColumn: null,
        chartBar: null,
        chartLine: null,
        chartPie: null,
        loading: false,
        currentPage: 1,
        fundRecords: [],
        analysisData: []
      }
    },
    methods: {
      drawColumnChart() {
        this.chartColumn = echarts.init(document.getElementById('chartColumn'));
        let name = []
        let chartData = []
        this.analysisData.map((item) => {
          name.push(item.fundName)
          let obj = {
            name: '',
            value: ''
          }
          obj.name = item.fundName
          obj.value = item.applyTimes
          chartData.push(obj)
        })
        this.chartColumn.setOption({
          title: {
            text: '基金申购次数条形统计图'
          },
          tooltip: {},
          xAxis: {
            data: name
          },
          yAxis: {},
          series: [{
            name: '基金申购字数',
            type: 'bar',
            data: chartData
          }]
        });
      },
      drawColumnChart2() {
        this.chartColumn = echarts.init(document.getElementById('chartColumn2'));
        let name = []
        let chartData = []
        this.analysisData.map((item) => {
          name.push(item.fundName)
          let obj = {
            name: '',
            value: ''
          }
          obj.name = item.fundName
          obj.value = item.redeemTimes
          chartData.push(obj)
        })
        this.chartColumn.setOption({
          title: {
            text: '基金赎回次数条形统计图'
          },
          tooltip: {},
          xAxis: {
            data: name
          },
          yAxis: {},
          series: [{
            name: '基金赎回次数',
            type: 'bar',
            data: chartData
          }]
        });
      },
      drawPieChart() {
        this.chartPie = echarts.init(document.getElementById('chartPie'));
        let name = []
        let chartData = []
        this.analysisData.map((item) => {
          name.push(item.fundName)
          let obj = {
            name: '',
            value: ''
          }
          obj.name = item.fundName
          obj.value = item.applyTimes
          chartData.push(obj)
        })
        this.chartPie.setOption({
          title: {
            text: '基金申购率统计图',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: name
          },
          toolbox: {
            show : true,
            feature : {
              mark : {show: true},
              dataView : {show: true, readOnly: false},
              magicType : {
                show: true,
                type: ['pie', 'funnel']
              },
              restore : {show: true},
              saveAsImage : {show: true}
            }
          },
          calculable : true,
          series: [{
            name: '基金申购次数',
            type: 'pie',
            radius: [20, 110],
            center: ['50%', '60%'],
            // roseType : 'radius',
            data: chartData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        });
      },
      drawPieChart2() {
        this.chartPie = echarts.init(document.getElementById('chartPie2'));
        let name = []
        let chartData = []
        this.analysisData.map((item) => {
          name.push(item.fundName)
          let obj = {
            name: '',
            value: ''
          }
          obj.name = item.fundName
          obj.value = item.redeemTimes
          chartData.push(obj)
        })
        this.chartPie.setOption({
          title: {
            text: '基金赎回率统计图',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: name
          },
          series: [{
            name: '基金赎回次数',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: chartData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        })
      },
      drawCharts() {
        this.drawColumnChart()
        this.drawColumnChart2()
        this.drawPieChart()
        this.drawPieChart2()
      },
      async getFundRecords () {
        this.loading = true
        const token = storage.getSession('token')
        const adminId = storage.getSession('userNo')
        const res = await getFundRecordList({
          token,
          adminId
        })
        if (res.resultcode === 0) {
          this.loading = false
          this.fundRecords = res.data.FundTranInfos
          this.analysis()
        }
      },
      analysis() {
        this.analysisData = []
        let fundNoGroup = []
        let records = this.fundRecords
        // this.analysisData = []
        for (let i = 0; i < records.length; i++) {
          let exists = false
          let fund = {
            fundName: '',
            fundNo: '',
            applyTimes: 0,
            redeemTimes: 0,
            fundTypeId: '',
            fundTypeName: ''
          }
          for (let j = 0;j < fundNoGroup.length; j++) {
            if (fundNoGroup[j].fundNo === records[i].fundNo) {
              console.log('相同了')
              exists = true
              break
            }
          }
          if (!exists) {
            fund.fundName = records[i].fund.fundName
            fund.fundNo = records[i].fundNo
            fund.fundTypeId = records[i].fund.fundType.fundTypeId
            fund.fundTypeName = records[i].fund.fundType.fundTypeName
            fundNoGroup.push(fund)
          }
        }
        console.log(fundNoGroup)
        fundNoGroup = fundNoGroup.map((item, index) => {
          records.map((record) => {
            if (record.fundNo === item.fundNo) {
              if (record.transType === '申购')
                item.applyTimes++
              else if (record.transType === '赎回')
                item.redeemTimes++
            }
          })
          return item
        })
        this.analysisData = fundNoGroup
        this.drawCharts()
      }
    },
    mounted: function() {
      this.getFundRecords()
    },
    updated: function() {
      this.getFundRecords()
    }
}
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 30px 20px;
    }
</style>
