<script src="../index.js"></script>
<template>
    <div class="gwi-module-container">
        <!-- 查询条件 -->
        <div class="main-top">
            <el-form :inline="true" ref="searchInfo" :model="dataForm" size="mini">
                <el-form-item :label="$t('workorder.workorder.label.orgId')" prop="orgId">
                    <single-select-org-tree v-model="dataForm.orgId" :value="dataForm.orgId" :accordion="true"/>
                </el-form-item>
                <el-form-item :label="$t('queue.queue.label.year')" prop="customerType">
                    <el-select style="width: 80px" v-model="dataForm.year" :placeholder="$t('queue.common.placeholder.selected')">
                        <el-option v-for="item in dataForm.yearList" :key="item.itemCode" :label="item.itemName" :value="item.itemCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop="">
                    <el-radio-group v-model="dataForm.radioFlag" @change="radioChange">
                        <el-radio-button label="1">{{$t('queue.queue.label.quarter')}}</el-radio-button>
                        <el-radio-button label="2">{{$t('queue.queue.label.month')}}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="" prop="" v-if="undefined!=dataForm.radioFlag">
                    <el-select style="width: 85px" v-if="1==dataForm.radioFlag" v-model="dataForm.quarter" :placeholder="$t('queue.common.placeholder.selected')">
                        <el-option v-for="item in dataForm.quarterList" :key="item.itemCode" :label="item.itemName" :value="item.itemCode">
                        </el-option>
                    </el-select>
                    <el-select v-else style="width: 85px" v-model="dataForm.month" :placeholder="$t('queue.common.placeholder.selected')">
                        <el-option v-for="item in dataForm.monthList" :key="item.itemCode" :label="item.itemName" :value="item.itemCode">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button @click="query" type="primary">{{$t("queue.common.button.query")}}</el-button>
                    <el-button @click="reset" type="primary">{{$t("queue.common.button.reset")}}</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div style="margin-left: 6px;">
            <div style="width: 100%;height: 100%; padding-bottom:40px;">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <div class="report-box" @click="toBusinessAnalysisSumDes">
                            <img src="../../../assets/images/report-yw.png"/>
                            <ul>
                                <div :class="businessAnalysisTom> 0 ? 'report-ss':'report-xj'">
                                    <img v-if="businessAnalysisTom> 0" src="../../../assets/images/ss2x.png">
                                    <img v-if="businessAnalysisTom< 0" src="../../../assets/images/xj2x.png">
                                    {{businessAnalysisTom}}%
                                </div>
                                <li class="report-nb">{{businessAnalysisSum}}<span>笔</span></li>
                                <li class="report-mr">总办理业务数</li>
                            </ul>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="report-box" @click="toBusinessHandleTimeSumDes">
                            <img src="../../../assets/images/report-bl.png"/>
                            <ul>
                                <div :class="businessHandleTimeTom> 0 ? 'report-ss':'report-xj'">
                                    <img v-if="businessHandleTimeTom> 0" src="../../../assets/images/ss2x.png">
                                    <img v-if="businessHandleTimeTom< 0" src="../../../assets/images/xj2x.png">
                                    {{businessHandleTimeTom}}%
                                </div>
                                <li class="report-nb">{{businessHandleTimeSum}}<span>分钟</span></li>
                                <li class="report-mr">业务平均办理时长</li>
                            </ul>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="report-box" @click="toBusinessWaitTimeDes">
                            <img src="../../../assets/images/report-dd.png"/>
                            <ul>
                                <div :class="businessWaitTimeTom> 0 ? 'report-ss':'report-xj'">
                                    <img v-if="businessWaitTimeTom> 0" src="../../../assets/images/ss2x.png">
                                    <img v-if="businessWaitTimeTom< 0" src="../../../assets/images/xj2x.png">
                                    {{businessWaitTimeTom}}%
                                </div>
                                <li class="report-nb">{{businessWaitTimeSum}}<span>分钟</span></li>
                                <li class="report-mr">业务平均等待时长</li>
                            </ul>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="report-box">
                            <div style="width: 80%; margin: auto;">
                                <div style="padding: 10px 0px; overflow: hidden;">
                                    <div class="report-ioc"></div>
                                    <span style="font-size:14px; color: #666;">预约占比</span>
                                </div>
                                <el-progress v-if="0!=yuyue" :text-inside="true" :stroke-width="20" :percentage="(yuyue/(yuyue+xianc)*100).toFixed(2)"></el-progress>
                                <el-progress v-else :text-inside="true" :stroke-width="20" :percentage="0"></el-progress>
                                <div style="padding: 10px 0px; overflow: hidden;">
                                    <div class="report-yy">预约{{yuyue}}笔</div>
                                    <div class="report-xc">现场{{xianc}}笔</div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div id="businessAnalysis" class="report-echs12"></div>
                    </el-col>
                    <el-col :span="12">
                        <div id="businessHandleTime" class="report-echs12"></div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="16">
                        <div id="customerTraffic" class="report-echs12"></div>
                    </el-col>
                    <el-col :span="8">
                        <div id="customerExperience" class="report-echs12"></div>
                    </el-col>
                </el-row>
            </div>
        </div>

        <!--业务量分析总数详情-->
        <el-dialog :visible.sync="dialogBusinessAnalysisSumDes">
            <div id="businessAnalysisSumDes" class="report-echs12" style="margin-top: 0px;"></div>
        </el-dialog>
        <!--业务排行详情-->
        <el-dialog :visible.sync="dialogBusinessAnalysisDes">
            <div id="businessAnalysisDes" class="report-echs12" style="margin-top: 0px;"></div>
        </el-dialog>
        <!--业务办理时长详情-->
        <el-dialog :visible.sync="dialogBusinessHandleTimeDes">
            <div id="businessHandleTimeDes" class="report-echs12" style="margin-top: 0px;"></div>
        </el-dialog>
        <!--业务办理总时长详情-->
        <el-dialog :visible.sync="dialogBusinessHandleTimeSumDes">
            <div id="businessHandleTimeSumDes" class="report-echs12" style="margin-top: 0px;"></div>
        </el-dialog>
        <!--业务等待总时长详情-->
        <el-dialog :visible.sync="dialogBusinessWaitTimeDes">
            <div id="businessWaitTimeDes" class="report-echs12" style="margin-top: 0px;"></div>
        </el-dialog>
        <!--客户体验分析详情-->
        <el-dialog title="客户体验分析详情" :visible.sync="dialogCustomerExperienceDes" @close="customerExperienceVal=0">
            <div id="customerExperienceDes" class="report-echs12" style="height: auto;margin:0px;overflow: hidden">
                <div v-for="item in customerExperienceData" style="overflow: hidden; margin-bottom: 10px;">
                    <div class="hLeft" v-if="0!=customerExperienceVal">{{item.orgName}}<p>({{(item.takeCount/customerExperienceVal*100).toFixed(2) }}%)</p></div>
                    <div class="hLeft" v-else>{{item.orgName}}<p>({{item.takeCount}})</p></div>
                    <div class="hRight" style="display: inline;white-space: nowrap; overflow-x:auto;float:left;overflow-y:hidden">
                        <div v-for="temp in item.userTypeList">
                            <div style="display:inline-block;margin-left: 4px;">
                                <div v-if="0!=item.takeCount" class="report-nub">{{temp.userTypeName}}({{(temp.takeCount/item.takeCount*100).toFixed(2) }}%)</div>
                            </div>
                            <div v-for="tom in temp.labelList" style="display:inline-block;margin-left: 4px;">
                                <div v-if="0!=temp.takeCount" class="report-nub report-bk">{{tom.labelName}}({{(tom.takeCount/temp.takeCount*100).toFixed(2) }}%)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {systemSetting} from "../../../api/modules/systemSetting"; // API接口
    import topic from "../../../api/modules/topic";
    import {dateFormat} from "@/modules/backend"; // 工具类
    import store from '@/store';

    export default {
        name: "index",
        data() {
            return {
                param: {
                    orgClassify: ""
                },
                dataForm: {
                    orgId: store.getters.userInfo.orgId,
                    radioFlag: undefined,
                    year: dateFormat("yyyy", new Date()),
                    yearList: [
                        {itemCode: dateFormat("yyyy", new Date()) - 2, itemName: dateFormat("yyyy", new Date()) - 2},// 前年
                        {itemCode: dateFormat("yyyy", new Date()) - 1, itemName: dateFormat("yyyy", new Date()) - 1},// 去年
                        {itemCode: dateFormat("yyyy", new Date()), itemName: dateFormat("yyyy", new Date())}         // 当年
                    ],
                    quarter: 1,
                    quarterList: [
                        {itemCode: 1, itemName: "1"},// 1 季度
                        {itemCode: 2, itemName: "2"},// 2 季度
                        {itemCode: 3, itemName: "3"},// 3 季度
                        {itemCode: 4, itemName: "4"} // 4 季度
                    ],
                    month: 1,
                    monthList: [
                        {itemCode: 1, itemName: "1"},
                        {itemCode: 2, itemName: "2"},
                        {itemCode: 3, itemName: "3"},
                        {itemCode: 4, itemName: "4"},
                        {itemCode: 5, itemName: "5"},
                        {itemCode: 6, itemName: "6"},
                        {itemCode: 7, itemName: "7"},
                        {itemCode: 8, itemName: "8"},
                        {itemCode: 9, itemName: "9"},
                        {itemCode: 10, itemName: "10"},
                        {itemCode: 11, itemName: "11"},
                        {itemCode: 12, itemName: "12"}
                    ]
                },
                yuyue: 0, // 预约占比-预约
                xianc: 0, // 预约占比-现场
                tellerEvaluationData: [], // 柜员服务评价分析
                businessAnalysisSum: 0, // 业务量分析-总笔数
                businessAnalysisTom: 0, // 业务量分析-同比
                businessWaitTimeSum: 0, // 业务等待总时长
                businessWaitTimeTom: 0, // 业务等待总时长-同比
                businessHandleTimeSum: 0, // 业务办理时长
                businessHandleTimeTom: 0, // 业务办理时长-同比
                dialogBusinessAnalysisSumDes: false, // 业务量分析总数详情
                dialogBusinessAnalysisDes: false, // 业务排行详情
                dialogBusinessWaitTimeDes: false, // 业务等待总时长详情
                dialogBusinessHandleTimeDes: false, // 业务办理时长详情
                dialogBusinessHandleTimeSumDes: false, // 业务办理总时长详情
                dialogCustomerExperienceDes: false, // 客户体验分析详情
                customerExperienceData: [], // 客户体验分析详情数据
                customerExperienceVal: 0 // 客户体验分析评价总数
            }
        },
        created() {
            let that = this;
            var param = {
                "downOrgId": [this.store.getters.userInfo.orgId],
                "orgClassify": 4
            }

            this.requestGet(this.dataForm.orgId, systemSetting.getOrg).then(data => {
                this.param.orgClassify = data.context.orgClassify;
                this.query();
            }).catch(body => {
                this.$msgInfoErrorCaller(body.cause || body.stateMsg);
            })
        },
        methods: {
            radioChange(str) {
                if ("1" == str) {
                    this.dataForm.radioFlag = 1;
                    this.dataForm.quarter = 1;
                }
                if ("2" == str) {
                    this.dataForm.radioFlag = 2;
                    this.dataForm.month = 1;
                }
            },

            // 打开业务量分析总数详情
            toBusinessAnalysisSumDes() {
                this.dialogBusinessAnalysisSumDes = true;
                let that = this;
                that.requestVO(this.param, topic.manageQueue + "/queueReportBase/businessAnalysisSumDes").then(data => {
                        console.log("业务量分析详情", JSON.stringify(data));
                        var title = {text: '业务量分析详情', top: '2%', textStyle: {fontSize: 14, color: '#666'}};
                        var xAxis = {type: 'category'};
                        var yAxis = {
                            name: '数量/笔'
                        };
                        var dataset = {source: []};
                        var series = [];
                        document.getElementById("businessAnalysisSumDes").removeAttribute("_echarts_instance_");
                        let myChart = that.$echarts.init(document.getElementById('businessAnalysisSumDes'));
                        var json = data.context;
                        var businessMap = new Map();
                        var orgMap = new Map();
                        if (json.length) {
                            var legend = ['product'];
                            for (var i = 0; i < json.length; i++) {
                                var temp = {type: 'bar', barMaxWidth: 30};
                                if (!businessMap.get(json[i].businessCode)) {
                                    series.push(temp);
                                    businessMap.set(json[i].businessCode, json[i].businessName);
                                    legend.push(json[i].businessName);
                                }
                                if (!orgMap.get(json[i].orgId)) {
                                    orgMap.set(json[i].orgId, json[i].orgName);
                                }
                            }
                            dataset.source.push(legend);
                            console.log("-------------->", legend);
                            orgMap.forEach(function (orgVal, orgKey) {
                                var val = [];
                                console.log(orgKey, orgVal);
                                val.push(orgVal);
                                businessMap.forEach(function (businessVal, businessKey) {
                                    console.log(businessKey, businessVal);
                                    for (var j = 0; j < json.length; j++) {
                                        if (businessKey === json[j].businessCode && orgKey === json[j].orgId) {
                                            val.push(json[j].takeCount);
                                        }
                                    }
                                })
                                dataset.source.push(val);
                            })
                            console.log("-------------->", JSON.stringify(dataset.source));
                            myChart.setOption({
                                legend: {},
                                tooltip: {},
                                title: title,
                                color: ['#00a0e9', '#80c269', '#ffa922'],
                                xAxis: xAxis,
                                yAxis: yAxis,
                                series: series,
                                dataset: dataset
                            }, true);
                            myChart.resize();
                        } else {
                            document.getElementById('businessAnalysisSumDes').innerHTML = "<div style='text-align: center;'><div style='color: #666;line-height: 80px;text-align: left;margin-left: 20px;'>业务量分析</div><br><h1 style='color: #999;'>暂无数据</h1></div>";
                        }
                    }
                ).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    }
                )
            },

            // 打开业务办理总时长详情
            toBusinessHandleTimeSumDes() {
                this.dialogBusinessHandleTimeSumDes = true;
                let that = this;
                that.requestVO(this.param, topic.manageQueue + "/queueReportBase/businessHandleTimeSumDes").then(data => {
                        var title = {text: '业务办理时长分析详情', top: '2%', textStyle: {fontSize: 14, color: '#666'}};
                        var xAxis = {type: 'category'};
                        var series = [];
                        var yAxis = {
                            name: '时长/分钟'
                        };
                        var dataset = {source: []};
                        document.getElementById("businessHandleTimeSumDes").removeAttribute("_echarts_instance_");
                        let myChart = that.$echarts.init(document.getElementById('businessHandleTimeSumDes'));
                        var json = data.context;
                        var businessMap = new Map();
                        var orgMap = new Map();
                        if (json.length) {
                            var legend = ['product'];
                            for (var i = 0; i < json.length; i++) {
                                var temp = {type: 'bar', barMaxWidth: 30};
                                if (!businessMap.get(json[i].businessCode)) {
                                    series.push(temp);
                                    businessMap.set(json[i].businessCode, json[i].businessName);
                                    legend.push(json[i].businessName);
                                }
                                if (!orgMap.get(json[i].orgId)) {
                                    orgMap.set(json[i].orgId, json[i].orgName);
                                }
                            }
                            dataset.source.push(legend);
                            console.log("-------------->", legend);
                            orgMap.forEach(function (orgVal, orgKey) {
                                var val = [];
                                console.log(orgKey, orgVal);
                                val.push(orgVal);
                                businessMap.forEach(function (businessVal, businessKey) {
                                    console.log(businessKey, businessVal);
                                    for (var j = 0; j < json.length; j++) {
                                        if (businessKey === json[j].businessCode && orgKey === json[j].orgId) {
                                            val.push(json[j].inHandleTime);
                                        }
                                    }
                                })
                                dataset.source.push(val);
                            })
                            console.log("-------------->", JSON.stringify(dataset.source));
                            myChart.setOption({
                                legend: {},
                                tooltip: {},
                                title: title,
                                color: ['#00a0e9', '#80c269', '#ffa922'],
                                xAxis: xAxis,
                                yAxis: yAxis,
                                series: series,
                                dataset: dataset
                            }, true);
                            myChart.resize();
                        } else {
                            document.getElementById('businessHandleTimeSumDes').innerHTML = "<div style='text-align: center;'><div style='color: #666;line-height: 80px;text-align: left;margin-left: 20px;'>业务办理时长分析详情</div><br><h1 style='color: #999;'>暂无数据</h1></div>";
                        }
                    }
                ).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    }
                )
            },

            // 打开业务办理时长详情
            toBusinessHandleTimeDes() {
                this.dialogBusinessHandleTimeDes = true;
                let that = this;
                that.requestVO(this.param, topic.manageQueue + "/queueReportBase/businessHandleTimeDes").then(data => {
                        console.log("业务办理时长详情", JSON.stringify(data));
                        var title = {text: '业务办理时长分析详情', top: '2%', textStyle: {fontSize: 14, color: '#666'}};
                        var xAxis = {type: 'category'};
                        var series = [];
                        var yAxis = {
                            name: '时长/分钟'
                        };
                        var dataset = {source: []};
                        document.getElementById("businessHandleTimeDes").removeAttribute("_echarts_instance_");
                        let myChart = that.$echarts.init(document.getElementById('businessHandleTimeDes'));
                        var json = data.context;
                        if (json.length) {
                            var legend = ['product'];
                            for (var i = 0; i < json.length; i++) {
                                var temp = {type: 'bar', barMaxWidth: 30}
                                series.push(temp);
                                legend.push(json[i].businessName);
                            }
                            dataset.source.push(legend);
                            var val = [];
                            for (var i = 0; i < json.length; i++) {
                                val.push(json[i].orgName);
                                for (var j = 0; j < json.length; j++) {
                                    val.push(json[j].inHandleTime);
                                }
                                dataset.source.push(val);
                            }
                            myChart.setOption({
                                legend: {},
                                tooltip: {},
                                title: title,
                                color: ['#00a0e9', '#80c269', '#ffa922', '#ec6877', '#cfa972',],
                                xAxis: xAxis,
                                yAxis: yAxis,
                                series: series,
                                dataset: dataset
                            }, true);
                            myChart.resize();
                        } else {
                            document.getElementById('businessHandleTimeDes').innerHTML = "<div style='text-align: center;'><div style='color: #666;line-height: 80px;text-align: left;margin-left: 20px;'>业务办理时长分析详情</div><br><h1 style='color: #999;'>暂无数据</h1></div>";
                        }
                    }
                ).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    }
                )
            },

            // 打开业务等待总时长详情
            toBusinessWaitTimeDes() {
                this.dialogBusinessWaitTimeDes = true;
                let that = this;
                that.requestVO(this.param, topic.manageQueue + "/queueReportBase/businessWaitTimeDes").then(data => {
                        console.log("业务等待总时长详情", JSON.stringify(data));
                        var title = {text: '业务等待总时长分析详情', top: '2%', textStyle: {fontSize: 14, color: '#666'}};
                        var xAxis = {type: 'category'};
                        var series = [];
                        var yAxis = {
                            name: '时长/分钟'
                        };
                        var dataset = {source: []};
                        document.getElementById("businessWaitTimeDes").removeAttribute("_echarts_instance_");
                        let myChart = that.$echarts.init(document.getElementById('businessWaitTimeDes'));
                        var json = data.context;
                        var businessMap = new Map();
                        var orgMap = new Map();
                        if (json.length) {
                            var legend = ['product'];
                            for (var i = 0; i < json.length; i++) {
                                var temp = {type: 'bar', barMaxWidth: 30};
                                if (!businessMap.get(json[i].businessCode)) {
                                    series.push(temp);
                                    businessMap.set(json[i].businessCode, json[i].businessName);
                                    legend.push(json[i].businessName);
                                }
                                if (!orgMap.get(json[i].orgId)) {
                                    orgMap.set(json[i].orgId, json[i].orgName);
                                }
                            }
                            dataset.source.push(legend);
                            console.log("-------------->", legend);
                            orgMap.forEach(function (orgVal, orgKey) {
                                var val = [];
                                console.log(orgKey, orgVal);
                                val.push(orgVal);
                                businessMap.forEach(function (businessVal, businessKey) {
                                    console.log(businessKey, businessVal);
                                    for (var j = 0; j < json.length; j++) {
                                        if (businessKey === json[j].businessCode && orgKey === json[j].orgId) {
                                            val.push(json[j].waitTime);
                                        }
                                    }
                                })
                                dataset.source.push(val);
                            })
                            console.log("-------------->", JSON.stringify(dataset.source));
                            myChart.setOption({
                                legend: {},
                                tooltip: {},
                                title: title,
                                color: ['#00a0e9', '#80c269', '#ffa922'],
                                xAxis: xAxis,
                                yAxis: yAxis,
                                series: series,
                                dataset: dataset
                            }, true);
                            myChart.resize();
                        } else {
                            document.getElementById('businessWaitTimeDes').innerHTML = "<div style='text-align: center;'><div style='color: #666;line-height: 80px;text-align: left;margin-left: 20px;'>业务等待总时长分析详情</div><br><h1 style='color: #999;'>暂无数据</h1></div>";
                        }
                    }
                ).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    }
                )
            },

            // 打开客户体验分析详情
            toCustomerExperienceDes(nom) {
                let that = this;
                this.param.evaluateFlag = nom;
                that.requestVO(this.param, topic.manageQueue + "/queueReportEvaluate/customerExperienceDes").then(data => {
                        console.log("打开客户体验分析详情", JSON.stringify(data));
                        console.log("--前--------------->" + that.customerExperienceVal);
                        var temp = 0;
                        if (data.context.length) {
                            for (var i = 0; i < data.context.length; i++) {
                                temp += data.context[i].takeCount;
                            }
                        }
                        that.customerExperienceVal = temp;
                        that.customerExperienceData = data.context;
                        that.dialogCustomerExperienceDes = true;
                        console.log("--后--------------->" + that.customerExperienceVal);
                    }
                ).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    }
                )
            },

            // 点击查询按钮
            query() {
                if ("" != this.dataForm.orgId) {
                    this.param.orgId = this.dataForm.orgId;
                    this.param.takeYear = this.dataForm.year;
                    if (undefined != this.dataForm.radioFlag) {
                        if (1 == this.dataForm.radioFlag) {
                            this.param.takeQuarter = this.dataForm.quarter;
                        } else {
                            this.param.takeMonth = this.dataForm.month;
                        }
                    }
                    console.log("查询条件：" + JSON.stringify(this.param));
                    let that = this;
                    // 业务量排行【类型】
                    this.requestVO(this.param, topic.manageQueue + "/queueReportBase/businessAnalysis").then(data => {
                            console.log("业务量排行【类型】", JSON.stringify(data));
                            that.businessAnalysis(data.context);
                        }
                    ).catch(body => {
                            this.$msgInfoErrorCaller(body.stateMsg);
                        }
                    )
                    // 业务量分析-总笔数
                    this.requestVO(this.param, topic.manageQueue + "/queueReportBase/businessAnalysisSum").then(data => {
                            console.log("业务量分析-总笔数", JSON.stringify(data));
                            that.businessAnalysisSum = data.context[0].takeCount;
                            that.businessAnalysisTom = data.context[0].takeCountOld;
                        }
                    ).catch(body => {
                            this.$msgInfoErrorCaller(body.stateMsg);
                        }
                    )
                    // 业务等待总时长
                    this.requestVO(this.param, topic.manageQueue + "/queueReportBase/businessWaitTime").then(data => {
                            console.log("业务等待总时长", JSON.stringify(data));
                            that.businessWaitTimeSum = data.context[0].waitTime;
                            that.businessWaitTimeTom = data.context[0].waitTimeOld;
                        }
                    ).catch(body => {
                            this.$msgInfoErrorCaller(body.stateMsg);
                        }
                    )

                    // 业务办理总时长
                    this.requestVO(this.param, topic.manageQueue + "/queueReportBase/businessHandleTimeSum").then(data => {
                            console.log("业务办理总时长", JSON.stringify(data));
                            that.businessHandleTimeSum = data.context[0].inHandleTime;
                            that.businessHandleTimeTom = data.context[0].inHandleTimeOld;
                        }
                    ).catch(body => {
                            this.$msgInfoErrorCaller(body.stateMsg);
                        }
                    )
                    // 业务办理时长
                    this.requestVO(this.param, topic.manageQueue + "/queueReportBase/businessHandleTime").then(data => {
                            console.log("业务办理时长", JSON.stringify(data));
                            that.businessHandleTime(data.context);
                        }
                    ).catch(body => {
                            this.$msgInfoErrorCaller(body.stateMsg);
                        }
                    )
                    // 预约占比
                    this.requestVO(this.param, topic.manageQueue + "/queueReportBase/businessSubscribe").then(data => {
                            console.log("预约占比", JSON.stringify(data));
                            if (null !== data.context[0]) {
                                this.yuyue = data.context[0].yyzb;
                                this.xianc = data.context[0].xczb;
                            } else {
                                this.yuyue = 0;
                                this.xianc = 0;
                            }
                        }
                    ).catch(body => {
                            this.$msgInfoErrorCaller(body.stateMsg);
                        }
                    )
                    // 客户流量分析
                    this.requestVO(this.param, topic.manageQueue + "/queueReportBase/customerTraffic").then(data => {
                            console.log("客户流量分析", JSON.stringify(data));
                            that.customerTraffic(data.context);
                        }
                    ).catch(body => {
                            this.$msgInfoErrorCaller(body.stateMsg);
                        }
                    )
                    // 客户体验分析
                    this.requestVO(this.param, topic.manageQueue + "/queueReportEvaluate/customerExperience").then(data => {
                            console.log("客户体验分析", JSON.stringify(data));
                            that.customerExperience(data.context);
                        }
                    ).catch(body => {
                            this.$msgInfoErrorCaller(body.stateMsg);
                        }
                    )
                } else {
                    this.$msgInfoErrorCaller(this.$t('queue.queue.msg.select_organization'));
                }
            },

            // 清空查询条件
            reset() {
                this.dataForm.orgId = "";
                this.dataForm.radioFlag = undefined;
                this.param = {orgClassify: ""};
            },

            // 业务量排行详情
            makeBusinessAnalysisDes(typeName) {
                this.param.businessName = typeName;
                let that = this;
                that.requestVO(this.param, topic.manageQueue + "/queueReportBase/businessAnalysisDes").then(data => {
                        console.log("业务量排行详情", JSON.stringify(data));
                        var xAxis = {
                            type: 'category',
                            data: []
                        };
                        var yAxis = {
                            type: 'value',
                            name: '数量/笔'
                        };
                        var series = [{
                            type: 'bar',
                            showBackground: true,
                            backgroundStyle: {
                                color: 'rgba(220, 220, 220, 0.8)'
                            },
                            barMaxWidth: 30,
                            data: []
                        }];
                        document.getElementById("businessAnalysisDes").removeAttribute("_echarts_instance_");
                        let myChart = that.$echarts.init(document.getElementById('businessAnalysisDes'));
                        var json = data.context;
                        if (json.length) {
                            for (var i = 0; i < json.length; i++) {
                                xAxis.data.push(json[i].orgName);
                                series[0].data.push(json[i].takeCount);
                            }
                            myChart.setOption({
                                title: {
                                    text: typeName + '排行详情',
                                    top: '2%',
                                    textStyle: {
                                        fontSize: 14,
                                        color: '#666'
                                    }
                                },
                                xAxis: xAxis,
                                tooltip: {},
                                color: ['#00a0e9', '#80c269', '#ffa922', '#ec6877', '#cfa972',],
                                yAxis: yAxis,
                                series: series
                            }, true);
                            myChart.resize();
                        } else {
                            document.getElementById('businessAnalysisDes').innerHTML = "<div style='text-align: center;'><div style='color: #666;line-height: 80px;text-align: left;margin-left: 20px;'>业务量分析</div><br><h1 style='color: #999;'>暂无数据</h1></div>";
                        }
                    }
                ).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    }
                )
            },

            // 业务办理时长详情
            makeBusinessHandleTimeDes(typeName) {
                this.param.businessName = typeName;
                let that = this;
                that.requestVO(this.param, topic.manageQueue + "/queueReportBase/businessHandleTimeDes").then(data => {
                        console.log("业务办理时长详情", JSON.stringify(data));
                        var xAxis = {
                            type: 'category',
                            data: []
                        };
                        var yAxis = {
                            type: 'value',
                            name: '数量/笔'
                        };
                        var series = [{
                            type: 'bar',
                            showBackground: true,
                            backgroundStyle: {
                                color: 'rgba(220, 220, 220, 0.8)'
                            },
                            barMaxWidth: 30,
                            data: []
                        }];
                        document.getElementById("businessHandleTimeDes").removeAttribute("_echarts_instance_");
                        let myChart = that.$echarts.init(document.getElementById('businessHandleTimeDes'));
                        var json = data.context;
                        if (json.length) {
                            for (var i = 0; i < json.length; i++) {
                                xAxis.data.push(json[i].orgName);
                                series[0].data.push(json[i].inHandleTime);
                            }
                            myChart.setOption({
                                title: {
                                    text: typeName + '平均办理耗时',
                                    top: '2%',
                                    textStyle: {
                                        fontSize: 14,
                                        color: '#666'
                                    }
                                },
                                tooltip: {},
                                xAxis: xAxis,
                                color: ['#00a0e9', '#80c269', '#ffa922', '#ec6877', '#cfa972',],
                                yAxis: yAxis,
                                series: series
                            }, true);
                            myChart.resize();
                        } else {
                            document.getElementById('businessHandleTimeDes').innerHTML = "<div style='text-align: center;'><div style='color: #666;line-height: 80px;text-align: left;margin-left: 20px;'>业务平均办理时长详情</div><br><h1 style='color: #999;'>暂无数据</h1></div>";
                        }
                    }
                ).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    }
                )
            },

            // 业务量排行
            businessAnalysis(data) {
                let that = this;
                var xAxis = {
                    name: '数量/笔'
                };
                var yAxis = {data: []};
                var series = [{type: 'bar', color: '#4a8ff7', barMaxWidth: 30, label: {show: true, position: 'insideRight', color: '#fff'}, data: []}];
                document.getElementById("businessAnalysis").removeAttribute("_echarts_instance_");
                let myChart = this.$echarts.init(document.getElementById('businessAnalysis'));
                myChart.on('click', function (params) {
                    var name = params.name;
                    var seriesType = params.seriesType;
                    console.log("打开业务量排行详情【类型】" + params);
                    that.dialogBusinessAnalysisDes = true;
                    that.makeBusinessAnalysisDes(name);
                })
                if (data.length) {
                    for (var i = 0; i < data.length; i++) {
                        yAxis.data.push(data[i].businessName);
                        series[0].data.push(data[i].takeCount);
                    }
                    myChart.setOption({
                        title: {
                            text: '业务量排行',
                            top: '2%',
                            textStyle: {
                                fontSize: 14,
                                color: '#666'
                            },
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        xAxis: xAxis,
                        legend: {},
                        grid: {
                            top: '15%',
                            left: '3%',
                            right: '12%',
                            bottom: '3%',
                            containLabel: true
                        },
                        color: ['#00a0e9'],
                        yAxis: yAxis,
                        series: series
                    }, true);
                    myChart.resize();
                } else {
                    document.getElementById('businessAnalysis').innerHTML = "<div style='text-align: center;'><div style='color: #666;line-height: 80px;text-align: left;margin-left: 20px;'>业务量分析</div><br><h1 style='color: #999;'>暂无数据</h1></div>";
                }
            },

            // 业务办理时长
            businessHandleTime(data) {
                let that = this;
                var xAxis = {
                    name: '时长/分钟'
                };
                var yAxis = {data: []};
                var series = [{type: 'bar', color: '#4a8ff7', barMaxWidth: 30, label: {show: true, position: 'insideRight', color: '#fff'}, data: []}];
                document.getElementById("businessHandleTime").removeAttribute("_echarts_instance_");
                let myChart = this.$echarts.init(document.getElementById('businessHandleTime'));
                myChart.on('click', function (params) {
                    var name = params.name;
                    var seriesType = params.seriesType;
                    console.log("业务办理时长详情" + params);
                    that.dialogBusinessHandleTimeDes = true;
                    that.makeBusinessHandleTimeDes(name);
                })
                if (data.length) {
                    for (var i = 0; i < data.length; i++) {
                        yAxis.data.push(data[i].businessName);
                        series[0].data.push(data[i].inHandleTime);
                    }
                    myChart.setOption({
                        title: {
                            text: '业务平均办理耗时',
                            top: '2%',
                            textStyle: {
                                fontSize: 14,
                                color: '#666'
                            },
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        xAxis: xAxis,
                        legend: {},
                        grid: {
                            top: '15%',
                            left: '3%',
                            right: '12%',
                            bottom: '3%',
                            containLabel: true
                        },
                        color: ['#00a0e9'],
                        yAxis: yAxis,
                        series: series
                    }, true);
                    myChart.resize();
                } else {
                    document.getElementById('businessHandleTime').innerHTML = "<div style='text-align: center;'><div style='color: #666;line-height: 80px;text-align: left;margin-left: 20px;'>业务平均办理耗时</div><br><h1 style='color: #999;'>暂无数据</h1></div>";
                }
            },

            // 客户流量分析
            customerTraffic(data) {
                var xAxis = [{
                    type: 'category',
                    boundaryGap: false,
                    data: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
                }];

                var yAxis = [{
                    type: 'value',
                    name: '数量/笔'
                }]

                var legend = {
                    orient: 'horizontal', // 'vertical'
                    y: "bottom",
                    data: []
                };
                var series = [];
                if (data.length) {
                    for (var i = 0; i < data.length; i++) {
                        legend.data.push(data[i].userTypeName);
                        var temp = {
                            type: 'line',
                            areaStyle: {},
                            data: []
                        };
                        temp.name = data[i].userTypeName;
                        temp.data.push(data[i].time8);
                        temp.data.push(data[i].time9);
                        temp.data.push(data[i].time10);
                        temp.data.push(data[i].time11);
                        temp.data.push(data[i].time12);
                        temp.data.push(data[i].time13);
                        temp.data.push(data[i].time14);
                        temp.data.push(data[i].time15);
                        temp.data.push(data[i].time16);
                        temp.data.push(data[i].time17);
                        series.push(temp);
                    }
                    document.getElementById("customerTraffic").removeAttribute("_echarts_instance_");
                    let myChart = this.$echarts.init(document.getElementById('customerTraffic'));
                    myChart.setOption({
                        title: {
                            text: '客峰流量分析',
                            top: '2%',
                            textStyle: {
                                fontSize: 14,
                                color: '#666'
                            },
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                label: {
                                    backgroundColor: '#6a7985'
                                }
                            }
                        },
                        grid: {
                            top: '22%',
                            left: '3%',
                            right: '4%',
                            bottom: '10%',
                            containLabel: true
                        },
                        color: ['#00a0e9', '#80c269', '#ffa922'],
                        legend: legend,
                        xAxis: xAxis,
                        yAxis: yAxis,
                        series: series
                    }, true);
                    myChart.resize();
                } else {
                    document.getElementById('customerTraffic').innerHTML = "<div style='text-align: center;'><div style='color: #666;line-height: 80px;text-align: left;margin-left: 20px;'>客户流量分析</div><br><h1 style='color: #999;'>暂无数据</h1></div>";
                }
            },

            // 客户体验分析
            customerExperience(data) {
                let that = this;
                var series = [{
                    name: '评价',
                    type: 'pie',
                    radius: ['25%', '40%'],
                    color: ['#00a0e9', '#80c269', '#ffa922',],
                    label: {
                        formatter: '{b|{b}：}{per|{d}%}  ',
                        rich: {

                            b: {
                                fontSize: 12,
                                lineHeight: 33,
                                color: '#333',
                            },
                            per: {
                                color: '#333',
                                padding: [2, 4],
                                borderRadius: 2
                            }
                        }
                    },
                    data: []
                }]
                if (data.length) {
                    for (var i = 0; i < data.length; i++) {
                        var temp = {
                            value: data[i].takeCount,
                            name: data[i].evaluateFlag
                        };
                        series[0].data.push(temp);
                    }
                    document.getElementById("customerExperience").removeAttribute("_echarts_instance_");
                    let myChart = this.$echarts.init(document.getElementById('customerExperience'));
                    myChart.on('click', function (params) {
                        var seriesType = params.seriesType;
                        var name = params.name;
                        if ("满意" == name) {
                            that.toCustomerExperienceDes(1);
                        } else {
                            that.toCustomerExperienceDes(2);
                        }
                    })
                    myChart.setOption({
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b}: {c} ({d}%)'
                        },
                        title: {
                            text: '客户体验分析',
                            top: '2%',
                            textStyle: {
                                fontSize: 14,
                                color: '#666'
                            },
                        },
                        series: series
                    }, true);
                    myChart.resize();
                } else {
                    document.getElementById('customerExperience').innerHTML = "<div style='text-align: center;'><div style='color: #666;line-height: 80px;text-align: left;margin-left: 20px;'>客户体验分析</div><br><h1 style='color: #999;'>暂无数据</h1></div>";
                }
            }
        }
    }
</script>

<style scoped>
    .report-box {
        width: 100%;
        height: 100px;
        background-color: #FFFFFF;
        border-radius: 6px;
        box-shadow: 0px 0px 10px rgba(70, 70, 70, .2);
    }

    .report-box img {
        width: 20%;
        margin: 20px 5%;
        float: left;
    }

    .report-box ul, .report-box li {
        margin: 0px;
        padding: 0px;
        list-style: none;
    }

    .report-box ul {
        float: left;
        margin-top: 20px;
        width: 68%;
    }

    .report-nb {
        font-size: 24px;
        color: #333333;
    }

    .report-nb span {
        font-size: 14px;
    }

    .report-mr {
        font-size: 14px;
        color: #999999;
    }

    .report-ioc {
        width: 15px;
        height: 15px;
        border-radius: 15px;
        background-color: #0A70E9;
        float: left;
        margin: 4px 4px 4px 0px;
    }

    .report-yy {
        font-size: 14px;
        color: #666;
        float: left;
    }

    .report-xc {
        font-size: 14px;
        color: #666;
        float: right;
    }

    .report-box /deep/ .el-progress-bar__outer {
        background-color: #52d997 !important;
    }

    .report-echs12 {
        width: 100%;
        height: 240px;
        margin-top: 20px;
        box-shadow: 0px 0px 10px rgba(70, 70, 70, .2);
    }

    .hLeft {
        width: 12%;
        padding: 10px;
        box-shadow: 0px 0px 10px rgba(70, 70, 70, .2);
        font-size: 14px;
        color: #666666;
        float: left;
        text-align: center;
        margin: 10px;
        border-radius: 10px;
    }

    .hLeft p {
        margin: 0px;
    }

    .hRight {
        float: left;
        margin: 10px 0px;
        width: 80%;
    }

    .report-ss {
        float: right;
        font-size: 14px;
        color: red;
        margin-top: 10px;
    }

    .report-ss img {
        width: 18px;
        height: 18px;
        margin: 0px;
    }

    .report-xj {
        float: right;
        font-size: 14px;
        color: #0ad923;
        margin-top: 10px;
    }

    .report-xj img {
        width: 18px;
        height: 18px;
        margin: 0px;
    }

    .report-nub {
        width: auto;
        padding: 4px;
        font-size: 12px;
        color: #FFFFFF;
        background-color: #0A70E9;
        text-align: center;
        border-radius: 30px;
        margin-top: 4px;
    }

    .report-bk {
        color: #666;
        background-color: #DEE3E9;
    }
</style>