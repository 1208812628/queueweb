<template>
    <el-dialog :title="$t('queue.queue.title.detail_strategy')" :close-on-click-modal="false" class="gwi-dialog"
               :visible.sync="visible" top="15px"
               width="65%">
        <el-form :model="dataForm" ref="dataForm" size="mini"
                 label-width="100px" :inline="false">
            <el-row>
                <el-col :span="7">
                    <el-form-item :label="$t('queue.queue.label.applyBusiness')" prop="orgBusinessId">
                        <el-select v-model="dataForm.orgBusinessId" disabled
                                   :placeholder="$t('queue.common.placeholder.selected')">
                            <el-option v-for="item in businessData" :key="item.id" :label="item.orgBusinessName"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
<!--            <el-divider content-position="left">{{$t('queue.queue.title.take_strategy')}}</el-divider>-->
<!--            <el-row v-for="(item,index) in dataForm.takeRuleList">-->
<!--                <el-col :span="7">-->
<!--                    <el-form-item :label="$t('queue.queue.label.startTime')" disabled-->
<!--                                  :prop="'takeRuleList.' + index + '.startTime'">-->
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
<!--                    <el-form-item :label="$t('queue.queue.label.endTime')" disabled-->
<!--                                  :prop="'takeRuleList.' + index + '.endTime'">-->
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
<!--                    <el-form-item :label="$t('queue.queue.label.takeLimitPeople')" disabled-->
<!--                                  :prop="'takeRuleList.' + index + '.limitPeople'">-->
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
                        <el-time-select disabled
                                :placeholder="$t('queue.queue.label.startTime')"
                                v-model="dataForm.startTime"
                                :picker-options="{
													start: '08:00',
													step: '00:30',
													end: '18:30'}"
                        ></el-time-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item :label="$t('queue.queue.label.endTime')" prop="endTime">
                        <el-time-select disabled
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
                        <el-select v-model="dataForm.takeTimePeriod" disabled
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
                        <el-input disabled
                                type="text"
                                v-model="dataForm.appointLimitPeople"
                                maxlength="5"
                                minlength="1"
                                :placeholder="$t('queue.queue.label.appointLimitPeople')"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>


            <el-row v-for="(item,index) in dataForm.appointRuleList">
                <el-col :span="7">
                    <el-form-item :label="$t('queue.queue.label.startTime')"
                                  :prop="'appointRuleList.' + index + '.startTime'">
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
                                  :prop="'appointRuleList.' + index + '.endTime'">
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
                                  :prop="'appointRuleList.' + index + '.limitPeople'">
                        <el-input disabled
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
        name: "orgAppointmentStrategy-detail",
        data() {
            return {
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
                    takeRuleList: [],
                    appointRuleList: [],
                },

                businessData: [],

                visible: false,
                loading: false,


            };
        },
        components: {},
        created() {
            this.loadInitData();
        },

        /* 事件 */
        methods: {
            init(id) {
                this.dataForm.id = id || '';
                this.visible = true;

                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields();
                    if (this.dataForm.id) {
                        this.request(queueManageAPI.getOrgAppointmentStrategy, {id: this.dataForm.id}, 'post')
                            .then(data => {
                                if (data && data.success) {
                                    this.dataForm = data.context;
                                    console.log('this.dataForm', this.dataForm);
                                    this.loadInitData();
                                }
                            })
                            .catch(body => {
                                this.$msgInfoErrorCaller(body.stateMsg);
                            });
                    }
                });
            },

            loadInitData() {
                let data = {};
                this.requestVO(data, queueManageAPI.listOrgBusinessType)
                    .then(data => {
                        this.businessData = data.context;
                        console.log('this.businessData:', this.businessData);
                    })
                    .catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    });
            },


        }
    };

</script>
<style lang="scss" scoped>
    .main-top ::v-deep .el-form-item__label {
        font-size: 12px !important;
    }

    .main-bottom ::v-deep .el-table--mini td,
    .el-table--mini th {
        padding: 3px 0;
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
</style>