<template>
    <el-dialog :title="!dataForm.id ?  $t('queue.queue.title.add_strategy') : $t('queue.queue.title.edit_strategy')"
               :close-on-click-modal="false"
               class="gwi-dialog"
               :visible.sync="visible"
               top="15px"
               width="65%">
        <el-form :model="dataForm" ref="dataForm" :rules="dataRule" @keyup.enter.native="dataFormSubmit()" size="mini"
                 label-width="100px" :inline="false">
            <el-row>
                <el-col :span="7">
                    <el-form-item :label="$t('queue.queue.label.applyBusiness')" prop="orgBusinessId" v-if="strategyDisabled">
                        <el-select v-model="dataForm.orgBusinessId" filterable :disabled="true"
                                   :placeholder="$t('queue.common.placeholder.selected')">
                            <el-option v-for="item in businessData" :key="item.id" :label="item.orgBusinessName"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('queue.queue.label.applyBusiness')" prop="orgBusinessIdList" v-if="!strategyDisabled">
                        <el-select v-model="dataForm.orgBusinessIdList" filterable multiple
                                   :placeholder="$t('queue.common.placeholder.selected')">
                            <el-option v-for="item in noStrategyBusinessList" :key="item.id" :label="item.orgBusinessName"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
<!--            <el-divider content-position="left">{{$t('queue.queue.title.take_strategy')}}</el-divider>-->
<!--            <el-row v-for="(item,index) in dataForm.takeRuleList">-->
<!--                <el-col :span="7">-->
<!--                    <el-form-item :label="$t('queue.queue.label.startTime')"-->
<!--                                  :prop="'takeRuleList.' + index + '.startTime'"-->
<!--                                  :rules="[{required: true, message: $t('queue.queue.msg.validate_notBlank'),  trigger: 'blur'}]">-->
<!--                        <el-time-select-->
<!--                                :placeholder="$t('queue.queue.label.startTime')"-->
<!--                                v-model="item.startTime"-->
<!--                                :picker-options="{-->
<!--													start: '08:00',-->
<!--													step: '00:30',-->
<!--													end: '18:30'}">-->
<!--                        </el-time-select>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--                <el-col :span="7">-->
<!--                    <el-form-item :label="$t('queue.queue.label.endTime')"-->
<!--                                  :prop="'takeRuleList.' + index + '.endTime'"-->
<!--                                  :rules="[{required: true, message: $t('queue.queue.msg.validate_notBlank'),  trigger: 'blur'}]">-->
<!--                        <el-time-select-->
<!--                                :placeholder="$t('queue.queue.label.endTime')"-->
<!--                                v-model="item.endTime"-->
<!--                                :picker-options="{-->
<!--													start: '08:00',-->
<!--													step: '00:30',-->
<!--													end: '18:30',-->
<!--													minTime: item.startTime}">-->
<!--                        </el-time-select>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--                <el-col :span="7">-->
<!--                    <el-form-item :label="$t('queue.queue.label.takeLimitPeople')"-->
<!--                                  :prop="'takeRuleList.' + index + '.limitPeople'"-->
<!--                                  :rules="[{required: true, message: $t('queue.queue.msg.validate_notBlank'),  trigger: 'blur'},-->
<!--                                  {pattern: enNumber, message: enNumberMsg, trigger: 'blur'}]">-->
<!--                        <el-input-->
<!--                                type="text"-->
<!--                                v-model="item.limitPeople"-->
<!--                                maxlength="5"-->
<!--                                minlength="1"-->
<!--                                :placeholder="$t('queue.queue.label.takeLimitPeople')"-->
<!--                        ></el-input>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--            </el-row>-->

            <el-divider content-position="left">{{$t('queue.queue.title.appoint_strategy')}}</el-divider>

            <el-row>
                <el-col :span="7">
                    <el-form-item :label="$t('queue.queue.label.startTime')" prop="startTime">
                        <el-time-select @change="toGenerate"
                                :placeholder="$t('queue.queue.label.startTime')"
                                v-model="dataForm.startTime"
                                :picker-options="{
													start: '08:00',
													step: '00:30',
													end: '18:30',
													maxTime: dataForm.endTime}"
                        ></el-time-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item :label="$t('queue.queue.label.endTime')" prop="endTime">
                        <el-time-select @change="toGenerate"
                                :placeholder="$t('queue.queue.label.endTime')"
                                v-model="dataForm.endTime"
                                :picker-options="{
													start: '08:00',
													step: '00:30',
													end: '18:30',
													minTime: dataForm.startTime}"
                        ></el-time-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="7">
                    <el-form-item :label="$t('queue.queue.label.takePeriod')" prop="takeTimePeriod">
                        <el-select v-model="dataForm.takeTimePeriod" @change="generate()"
                                   :placeholder="$t('queue.queue.label.takePeriod')">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item :label="$t('queue.queue.label.appointLimitPeople')" prop="appointLimitPeople">
                        <el-input
                                type="text"
                                v-model="dataForm.appointLimitPeople"
                                maxlength="5"
                                minlength="1"
                                :placeholder="$t('queue.queue.label.appointLimitPeople')"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :offset="1" :span="4">
                    <el-button size="mini" @click="generate()" type="primary">{{$t('queue.queue.button.generate')}}</el-button>
                </el-col>
            </el-row>


            <el-row v-for="(item,index) in dataForm.appointRuleList">
                <el-col :span="7">
                    <el-form-item :label="$t('queue.queue.label.startTime')"
                                  :prop="'appointRuleList.' + index + '.startTime'"
                                  :rules="[{required: true, message: $t('queue.queue.msg.validate_notBlank'),  trigger: 'blur'}]">
                        <el-input
                                type="text"
                                :disabled="true"
                                v-model="item.startTime"
                                minlength="1"
                                :placeholder="$t('queue.queue.label.startTime')"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item :label="$t('queue.queue.label.endTime')"
                                  :prop="'appointRuleList.' + index + '.endTime'"
                                  :rules="[{required: true, message: $t('queue.queue.msg.validate_notBlank'),  trigger: 'blur'}]">
                        <el-input
                                type="text"
                                :disabled="true"
                                v-model="item.endTime"
                                minlength="1"
                                :placeholder="$t('queue.queue.label.endTime')"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item :label="$t('queue.queue.label.appointLimitPeople')"
                                  :prop="'appointRuleList.' + index + '.limitPeople'"
                                  :rules="[{required: true, message: $t('queue.queue.msg.validate_notBlank'),  trigger: 'blur'},
                                  {pattern: enNumber, message: enNumberMsg, trigger: 'blur'}]">
                        <el-input
                                type="text"
                                v-model="item.limitPeople"
                                maxlength="5"
                                minlength="1"
                                :placeholder="$t('queue.queue.label.appointLimitPeople')"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
			<el-button @click="visible = false" size="mini">{{$t('queue.common.button.cancel')}}</el-button>
			<el-button type="primary" :loading="loading" @click="dataFormSubmit()" size="mini">{{$t('queue.common.button.submit')}}</el-button>
		</span>
    </el-dialog>
</template>

<script>
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    import {queueManageAPI} from '../../../api/modules/queueManageAPI';

    export default {
        name: 'orgAppointmentStrategyAddOrUpdate',
        data() {
            return {
                enNumber: /^(([0-9]*[1-9][0-9]*)|(0+))$/,
                enNumberMsg: this.$t('queue.queue.msg.validate_enNumber'),

                tabModel: 'first',
                options: [{
                    value: '30',
                    label: '30' + this.$t('queue.common.label.minute'),
                }, {
                    value: '60',
                    label: '60' + this.$t('queue.common.label.minute'),
                }],

                dataForm: {
                    orgId: '',
                    startTime: '',
                    endTime: '',
                    takeTimePeriod: '',
                    appointLimitPeople: '',
                    orgBusinessId: '',
                    orgBusinessIdList: [],
                    takeRuleList: [],
                    appointRuleList: [],
                },

                searchOrgBusiness: {
                    enableFlag: ''
                },

                businessData: [],
                noStrategyBusinessList: [],

                visible: false,
                loading: false,
                strategyDisabled: false,

                dataRule: {
                    orgBusinessId: [{
                        required: false,
                        message: this.$t('queue.queue.msg.validate_notBlank'),
                        trigger: 'blur'
                    }],
                    orgBusinessIdList: [{
                        required: false,
                        message: this.$t('queue.queue.msg.validate_notBlank'),
                        trigger: 'blur'
                    }],
                    startTime: [{
                        required: true,
                        message: this.$t('queue.queue.msg.validate_notBlank'),
                        trigger: 'blur'
                    }],
                    endTime: [{required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'}],
                    takeTimePeriod: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'},
                    ],
                }
            };
        },
        components: {},
        created() {

        },

        /* 事件 */
        methods: {
            init(param) {
                this.dataForm.id = param.id || '';
                this.dataForm.orgId = param.orgId;
                this.loadNoStrategyBusinessData();
                // this.loadInitData();
                this.visible = true;
                this.dataForm.appointRuleList = [];
                this.dataForm.orgBusinessIdList = [];
                this.strategyDisabled = false;
                this.dataRule.orgBusinessId[0].required = false;
                this.dataRule.orgBusinessIdList[0].required = true;

                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields();
                    if (this.dataForm.id) {
                        this.loadInitData();
                        this.dataRule.orgBusinessId[0].required = true;
                        this.dataRule.orgBusinessIdList[0].required = false;
                        this.request(queueManageAPI.getOrgAppointmentStrategy, {id: this.dataForm.id}, 'post').then(data => {
                                if (data && data.success) {
                                    this.strategyDisabled = true;
                                    this.dataForm = data.context;
                                    console.log('this.dataForm', this.dataForm);
                                }
                            })
                            .catch(body => {
                                this.$msgInfoErrorCaller(body.stateMsg);
                            });
                    } else {
                        this.dataForm.takeRuleList = [{
                            startTime: "",
                            endTime: "",
                            limitPeople: null,
                        }]
                    }
                });
            },

            loadInitData() {
                this.searchOrgBusiness.orgId = this.dataForm.orgId;
                this.requestVO(this.searchOrgBusiness, queueManageAPI.listOrgBusinessType)
                    .then(data => {
                        this.businessData = data.context;
                        console.log('this.businessData:', this.businessData);
                    })
                    .catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    });
            },

            loadNoStrategyBusinessData(){
                this.requestGet(this.dataForm.orgId, queueManageAPI.listNoStrategyBusiness)
                    .then(data => {
                        this.noStrategyBusinessList = data.context;
                    })
                    .catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    });
            },

            toGenerate() {
                if(this.dataForm.startTime&&this.dataForm.endTime&&this.dataForm.takeTimePeriod){
                    this.generate();
                }
            },

            generate() {
                let startTime = this.dataForm.startTime;
                if (!startTime) {
                    this.$message({
                        message: this.$t('queue.queue.msg.validate_startTime'),
                        type: 'error',
                        duration: 1500
                    });
                    return;
                }
                let endTime = this.dataForm.endTime;
                if (!endTime) {
                    this.$message({
                        message: this.$t('queue.queue.msg.validate_endTime'),
                        type: 'error',
                        duration: 1500
                    });
                    return;
                }
                let takeTimePeriod = this.dataForm.takeTimePeriod;
                if (!takeTimePeriod) {
                    this.$message({
                        message: this.$t('queue.queue.msg.validate_timeLength'),
                        type: 'error',
                        duration: 1500
                    });
                    return;
                }

                this.dataForm.appointRuleList = [];

                let startDate = new Date("1970-01-01 " + startTime + ":00")
                let endDate = new Date("1970-01-01 " + endTime + ":00")

                while (true) {
                    let start = startDate.format("HH:mm");
                    let addMinuteDate = new Date(startDate.getTime() + takeTimePeriod * 60 * 1000);
                    let end = "";
                    if (addMinuteDate.getTime() > endDate.getTime()) {
                        end = endDate.format("HH:mm");
                    } else {
                        end = addMinuteDate.format("HH:mm");
                    }

                    let json = {
                        "id": this.generateUUID(),
                        "startTime": start,
                        "endTime": end,
                        "limitPeople": this.dataForm.appointLimitPeople,
                    };
                    this.dataForm.appointRuleList.push(json);

                    if (addMinuteDate.getTime() >= endDate.getTime()) {
                        break;
                    } else {
                        startDate = addMinuteDate;
                    }
                }
            },

            generateUUID() {
                var d = new Date().getTime();
                if (window.performance && typeof window.performance.now === "function") {
                    d += performance.now(); //use high-precision timer if available
                }
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
                return uuid;
            },

            // 表单提交
            dataFormSubmit() {
                console.log('this.dataForm:', this.dataForm);
                this.$refs['dataForm'].validate(valid => {
                    if (valid) {
                        var submitUrl = '';
                        this.loading = true;
                        if (this.dataForm.id) {
                            submitUrl = queueManageAPI.updateOrgAppointmentStrategy;
                        } else {
                            submitUrl = queueManageAPI.addOrgAppointmentStrategy;
                        }

                        this.request(submitUrl, this.dataForm, 'post')
                            .then(data => {
                                if (data && data.success) {
                                    this.loading = false;
                                    this.$message({
                                        message: this.$t('queue.common.title.success'),
                                        type: 'success',
                                    });
                                    this.visible = false;
                                    this.$emit('refreshDataList');
                                }
                            })
                            .catch(body => {
                                this.loading = false;
                                this.$msgInfoErrorCaller(body.stateMsg);
                            });
                    }
                });
            }
        }
    };

</script>
<style lang="scss" scoped>
    .main-top ::v-deep .el-form-item__label {
        font-size: 12px !important;
    }

    .el-form-item {
        margin-left: 15px;
        width: 100%;
        .el-select{
            width: 100%;
        }
        .el-input{
            width: 100%;
        }
    }

    .main-bottom ::v-deep .el-table--mini td,
    .el-table--mini th {
        padding: 3px 0;
    }
</style>
