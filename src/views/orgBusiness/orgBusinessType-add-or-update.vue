<template>
    <el-dialog
            :title="!dataForm.id ?  $t('queue.queue.title.add_business') : $t('queue.queue.title.edit_business')"
            :close-on-click-modal="false"
            class="gwi-dialog"
            :visible.sync="visible"
            top="15px">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" size="mini"
                 label-width="160px">
            <div>
                <el-row>
                    <el-col :span="20" :offset="1">
                        <el-form-item :label="$t('queue.queue.label.businessName')" prop="orgBusinessName">
                            <el-input :placeholder="$t('queue.queue.msg.placeholder_select_business')"
                                      v-model="dataForm.orgBusinessName"
                                      class="input-with-select"
                                      readonly
                                      disabled
                                      name="orgBusinessName">
                                <el-button slot="append"
                                           type="primary"
                                           icon="el-icon-search"
                                           @click="selectBaseBusiness"
                                           :disabled="buttonDisabled">
                                    {{$t('queue.queue.button.select')}}
                                </el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-for="(language, index) in dataForm.languageTypeList" :key="language.key">
                    <el-col :span="9" :offset="1">
                        <el-form-item :label="$t('queue.queue.label.languageType')"
                                      :prop="'languageTypeList.' + index + '.languageType'"
                                      :rules="[{required: true, message: $t('queue.queue.msg.validate_business_languageType'),
                                       trigger: ['blur','change']}]">
                            <el-select-dict v-model="language.languageType" disabled
                                            :key="language.languageType"
                                            code="language"
                                            app-id="manage-queue"
                                            @change="changeLanguage"
                                            :placeholder="$t('queue.queue.msg.placeholder_select_language')">
                            </el-select-dict>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item :label="$t('queue.queue.label.businessName')"
                                      :prop="'languageTypeList.' + index + '.otherBusinessName'"
                                      :rules="[{required: true, message: $t('queue.queue.msg.validate_business_otherBusiness'),  trigger: 'blur'}]">
                            <el-input type="text" disabled
                                      v-model="language.otherBusinessName"
                                      @change="changeInput"
                                      @input="changeInput">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>


                <el-row>
                    <el-col :span="20" :offset="1">
                        <el-form-item :label="$t('queue.queue.label.customerLetter')" prop="customerTypeInitialLetter">
                            <el-input type="text"
                                      v-model="dataForm.customerTypeInitialLetter"
                                      :placeholder="$t('queue.common.placeholder.input')"
                                      :disabled="customerDisabled">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="20" :offset="1">
                        <el-form-item :label="$t('queue.queue.label.businessLetter')" prop="businessInitialLetter">
                            <el-input type="text"
                                      v-model="dataForm.businessInitialLetter"
                                      :placeholder="$t('queue.common.placeholder.input')"
                                      maxlength="1"
                                      @input="changeInput">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="20" :offset="1">
                        <el-form-item :label="$t('queue.queue.label.numberLength')" prop="numberLength">
                            <el-select
                                    v-model="dataForm.numberLength"
                                    :placeholder="$t('queue.common.placeholder.selected')"
                                    @change="changeInput"
                                    name = "numberLength">
                                <el-option :key="1"
                                           :label="1"
                                           :value="1">
                                </el-option>
                                <el-option :key="2"
                                           :label="2"
                                           :value="2">
                                </el-option>
                                <el-option :key="3"
                                           :label="3"
                                           :value="3">
                                </el-option>
                                <el-option :key="4"
                                           :label="4"
                                           :value="4">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="20" :offset="1">
                        <el-form-item :label="$t('queue.queue.label.customerType')" prop="customerType">
                            <el-select
                                    v-model="dataForm.customerType"
                                    filterable
                                    :placeholder="$t('queue.common.placeholder.selected')"
                                    :disabled="typeDisabled"
                                    name = "customerType">
                                <el-option v-for="item in customerData"
                                           :key="item.factorCode"
                                           :label="item.factorName"
                                           :value="item.factorCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="20" :offset="1">
                        <el-form-item :label="$t('queue.queue.label.isEnable')" prop="enableFlag">
                            <el-switch v-model="dataForm.enableFlag"
                                       active-color="#13ce66"
                                       inactive-color="#ff4949"
                                       active-value="1"
                                       inactive-value="0">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="20" :offset="1">
                        <el-form-item :label="$t('queue.queue.label.handleTime')">
                            <el-button-group>
                                <el-button :type="timeVisible?'info':'primary'" @click="change(0)">
                                    {{$t('queue.queue.label.unlimited')}}
                                </el-button>
                                <el-button :type="timeVisible?'primary':'info'" @click="change(1)">
                                    {{$t('queue.queue.label.part')}}
                                </el-button>
                            </el-button-group>
                        </el-form-item>
                    </el-col>

                </el-row>

                <el-row v-if="timeVisible">
                    <el-form-item>
                        <el-checkbox-group v-model="weeks" class="check">
                            <el-checkbox label="1">{{$t('queue.queue.label.monday')}}</el-checkbox>
                            <el-time-picker v-model="times_1"
                                            is-range style="width: 240px"
                                            range-separator="-"
                                            :start-placeholder="$t('queue.queue.label.startTime')"
                                            :end-placeholder="$t('queue.queue.label.endTime')"
                                            :placeholder="$t('queue.queue.msg.placeholder_select_date')">
                            </el-time-picker>
                            <br>

                            <el-checkbox label="2">{{$t('queue.queue.label.tuesday')}}</el-checkbox>
                            <el-time-picker v-model="times_2"
                                            is-range style="width: 240px"
                                            range-separator="-"
                                            :start-placeholder="$t('queue.queue.label.startTime')"
                                            :end-placeholder="$t('queue.queue.label.endTime')"
                                            :placeholder="$t('queue.queue.msg.placeholder_select_date')">
                            </el-time-picker>
                            <br>

                            <el-checkbox label="3">{{$t('queue.queue.label.wednesday')}}</el-checkbox>
                            <el-time-picker v-model="times_3"
                                            is-range style="width: 240px"
                                            range-separator="-"
                                            :start-placeholder="$t('queue.queue.label.startTime')"
                                            :end-placeholder="$t('queue.queue.label.endTime')"
                                            :placeholder="$t('queue.queue.msg.placeholder_select_date')">
                            </el-time-picker>
                            <br>

                            <el-checkbox label="4">{{$t('queue.queue.label.thursday')}}</el-checkbox>
                            <el-time-picker v-model="times_4"
                                            is-range style="width: 240px"
                                            range-separator="-"
                                            :start-placeholder="$t('queue.queue.label.startTime')"
                                            :end-placeholder="$t('queue.queue.label.endTime')"
                                            :placeholder="$t('queue.queue.msg.placeholder_select_date')">
                            </el-time-picker>
                            <br>

                            <el-checkbox label="5">{{$t('queue.queue.label.friday')}}</el-checkbox>
                            <el-time-picker v-model="times_5"
                                            is-range style="width: 240px"
                                            range-separator="-"
                                            :start-placeholder="$t('queue.queue.label.startTime')"
                                            :end-placeholder="$t('queue.queue.label.endTime')"
                                            :placeholder="$t('queue.queue.msg.placeholder_select_date')">
                            </el-time-picker>
                            <br>

                            <el-checkbox label="6">{{$t('queue.queue.label.saturday')}}</el-checkbox>
                            <el-time-picker v-model="times_6"
                                            is-range style="width: 240px"
                                            range-separator="-"
                                            :start-placeholder="$t('queue.queue.label.startTime')"
                                            :end-placeholder="$t('queue.queue.label.endTime')"
                                            :placeholder="$t('queue.queue.msg.placeholder_select_date')">
                            </el-time-picker>
                            <br>

                            <el-checkbox label="7" style="margin-right:30px !important;">
                                {{$t('queue.queue.label.sunday')}}
                            </el-checkbox>
                            <el-time-picker v-model="times_7"
                                            is-range style="width: 240px"
                                            range-separator="-"
                                            :start-placeholder="$t('queue.queue.label.startTime')"
                                            :end-placeholder="$t('queue.queue.label.endTime')"
                                            :placeholder="$t('queue.queue.msg.placeholder_select_date')">
                            </el-time-picker>
                            <br>

                        </el-checkbox-group>
                    </el-form-item>

                </el-row>

            </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="mini">{{$t('queue.common.button.cancel')}}</el-button>
      <el-button type="primary" :loading="loading" @click="dataFormSubmit()" size="mini">{{$t('queue.common.button.submit')}}</el-button>
    </span>

        <select-base-business-dialog ref="selectBaseBusinessDialog" v-if="selectBaseBusinessVisible"
                                     @submitComplete="submitBaseBusinessComplete">
        </select-base-business-dialog>
    </el-dialog>

</template>

<script>
    import {queueManageAPI} from "../../../api/modules/queueManageAPI";
    import {regular} from "@/modules/backend";
    import SelectBaseBusinessDialog from "./orgBusinessType-baseBusinessTypeDialog";

    export default {
        name: "orgBusinessTypeAddOrUpdate",
        data() {
            return {
                tabModel: "first",

                dataForm: {
                    orgId: null,
                    orgBusinessCode: null,
                    orgBusinessName: null,
                    customerTypeInitialLetter: null,
                    businessInitialLetter: null,
                    numberLength: null,
                    enableFlag: '1',
                    customerType: null,
                    languageTypeList: [],
                    handleTimeList: [],
                },

                languageData: [],
                customerData: [],

                weeks: [],
                times_1: [new Date(2016, 9, 10, 8, 30), new Date(2016, 9, 10, 18, 0)],
                times_2: [new Date(2016, 9, 10, 8, 30), new Date(2016, 9, 10, 18, 0)],
                times_3: [new Date(2016, 9, 10, 8, 30), new Date(2016, 9, 10, 18, 0)],
                times_4: [new Date(2016, 9, 10, 8, 30), new Date(2016, 9, 10, 18, 0)],
                times_5: [new Date(2016, 9, 10, 8, 30), new Date(2016, 9, 10, 18, 0)],
                times_6: [new Date(2016, 9, 10, 8, 30), new Date(2016, 9, 10, 18, 0)],
                times_7: [new Date(2016, 9, 10, 8, 30), new Date(2016, 9, 10, 18, 0)],

                visible: false,
                loading: false,
                selectBaseBusinessVisible: false,
                timeVisible: false,
                typeDisabled: false,
                buttonDisabled: false,
                customerDisabled: false,

                dataRule: {

                    orgBusinessName: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'},
                        {min: 1, max: 20, message: this.$t('queue.queue.msg.validate_length2'), trigger: 'blur'},
                    ],
                    businessInitialLetter: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'},
                        {min: 1, max: 2, message: this.$t('queue.queue.msg.validate_length1'), trigger: 'blur'},
                        {pattern: /^[a-zA-Z]+$/, message: this.$t('queue.queue.msg.validate_bigLetter'), trigger: 'blur'}
                    ],
                    numberLength: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'},
                    ],
                    customerType: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'}
                    ],
                    enableFlag: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'}
                    ],
                },

                rowSeq: 0,
            }
        },
        components: {
            SelectBaseBusinessDialog,
        },
        created() {
            this.loadInitData();
        },
        watch:{
            visible(val) {
                if (this.$refs.dataForm != undefined){
                    this.$refs.dataForm.clearValidate();
                }
            },
        },

        /* 事件 */
        methods: {
            init(param) {
                console.log("param", param);
                this.dataForm.orgBusinessCode = null;
                this.dataForm.orgBusinessName = null;
                this.dataForm.customerTypeInitialLetter = null;
                this.dataForm.businessInitialLetter = null;
                this.dataForm.numberLength = null;
                this.dataForm.customerType = null;
                this.dataForm.id = param.id;
                this.dataForm.orgId = param.orgId;
                this.dataForm.languageTypeList = [];
                this.dataForm.handleTimeList = [];
                this.visible = true;
                this.timeVisible = false;
                this.typeDisabled = true;
                this.buttonDisabled = false;
                this.customerDisabled = true;
                this.weeks = [];
                this.times_1 = [new Date(2016, 9, 10, 8, 30), new Date(2016, 9, 10, 18, 0)];
                this.times_2 = [new Date(2016, 9, 10, 8, 30), new Date(2016, 9, 10, 18, 0)];
                this.times_3 = [new Date(2016, 9, 10, 8, 30), new Date(2016, 9, 10, 18, 0)];
                this.times_4 = [new Date(2016, 9, 10, 8, 30), new Date(2016, 9, 10, 18, 0)];
                this.times_5 = [new Date(2016, 9, 10, 8, 30), new Date(2016, 9, 10, 18, 0)];
                this.times_6 = [new Date(2016, 9, 10, 8, 30), new Date(2016, 9, 10, 18, 0)];
                this.times_7 = [new Date(2016, 9, 10, 8, 30), new Date(2016, 9, 10, 18, 0)];
                this.dataForm.enableFlag = "1";
                if (this.dataForm.id) {
                    this.request(queueManageAPI.getOrgBusinessType, {id: this.dataForm.id}, "post").then((data) => {
                        if (data && data.success) {
                            this.buttonDisabled = true;
                            this.dataForm = data.context;
                            console.log("this.dataForm", this.dataForm);
                            if (this.dataForm.languageTypeList == null) {
                                this.dataForm.languageTypeList = [];
                            }

                            if (this.dataForm.handleTimeList) {
                                this.timeVisible = true;
                                this.dataForm.handleTimeList.forEach(item => {
                                    this.weeks.push(item.week);
                                    switch (item.week) {
                                        case '1':
                                            this.times_1[0] = item.startTime;
                                            this.times_1[1] = item.endTime;
                                            break;
                                        case '2':
                                            this.times_2[0] = item.startTime;
                                            this.times_2[1] = item.endTime;
                                            break;
                                        case '3':
                                            this.times_3[0] = item.startTime;
                                            this.times_3[1] = item.endTime;
                                            break;
                                        case '4':
                                            this.times_4[0] = item.startTime;
                                            this.times_4[1] = item.endTime;
                                            break;
                                        case '5':
                                            this.times_5[0] = item.startTime;
                                            this.times_5[1] = item.endTime;
                                            break;
                                        case '6':
                                            this.times_6[0] = item.startTime;
                                            this.times_6[1] = item.endTime;
                                            break;
                                        case '7':
                                            this.times_7[0] = item.startTime;
                                            this.times_7[1] = item.endTime;
                                            break;
                                    }
                                });
                            }
                        }
                    }).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    })
                }
            },


            // 表单提交
            dataFormSubmit() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        if (!this.validateLanguage(this.dataForm.languageTypeList)) {
                            return;
                        }
                        if (this.timeVisible) {
                            console.log(this.weeks);
                            let data = [];
                            if(this.weeks.length===0){
                                this.$message({
                                    message: this.$t('queue.queue.msg.select_processing_time'),
                                    type: 'error',
                                });
                                return;
                            }
                            if (this.weeks != undefined) {
                                this.weeks.forEach(item => {
                                    let info = {};
                                    info.week = item;
                                    switch (item) {
                                        case '1':
                                            info.startTime = this.times_1[0];
                                            info.endTime = this.times_1[1];
                                            break;
                                        case '2':
                                            info.startTime = this.times_2[0];
                                            info.endTime = this.times_2[1];
                                            break;
                                        case '3':
                                            info.startTime = this.times_3[0];
                                            info.endTime = this.times_3[1];
                                            break;
                                        case '4':
                                            info.startTime = this.times_4[0];
                                            info.endTime = this.times_4[1];
                                            break;
                                        case '5':
                                            info.startTime = this.times_5[0];
                                            info.endTime = this.times_5[1];
                                            break;
                                        case '6':
                                            info.startTime = this.times_6[0];
                                            info.endTime = this.times_6[1];
                                            break;
                                        case '7':
                                            info.startTime = this.times_7[0];
                                            info.endTime = this.times_7[1];
                                            break;
                                    }
                                    data.push(info);
                                });
                                this.dataForm.handleTimeList = data;
                                console.log("data:", data);
                            }
                        } else {
                            this.dataForm.handleTimeList = [];
                        }

                        if (this.timeVisible) {
                            this.dataForm.enableTime = 'no';
                        } else {
                            this.dataForm.enableTime = 'yes';
                        }

                        console.log("this.dataForm:", this.dataForm);


                        var submitUrl = "";
                        if(!this.dataForm.businessInitialLetter){
                            this.$message({
                                message: this.$t('queue.queue.msg.validate_business_call_letter'),
                                type: 'error',
                            });
                            return;
                        }
                        let reg = /^[a-zA-Z]+$/;
                        if (reg.test(this.dataForm.businessInitialLetter) === false) {
                            this.$message({
                                message: this.$t('queue.queue.msg.validate_business_call_letter2'),
                                type: 'error',
                            });
                            return;
                        }
                        this.loading = true;
                        if (this.dataForm.id) {
                            submitUrl = queueManageAPI.updateOrgBusinessType;
                        } else {
                            submitUrl = queueManageAPI.addOrgBusinessType;
                        }
                        if(this.dataForm.businessInitialLetter){
                            this.dataForm.businessInitialLetter = this.dataForm.businessInitialLetter.toUpperCase();
                        }

                        this.request(submitUrl, this.dataForm, "post").then((data) => {
                            if (data && data.success) {
                                this.loading = false;
                                this.$message({
                                    message: this.$t('queue.common.title.success'),
                                    type: 'success',
                                });
                                this.visible = false;
                                this.$emit('refreshDataList')
                            }
                        }).catch(body => {
                            this.loading = false;
                            this.$msgInfoErrorCaller(body.stateMsg);
                        })
                    }
                })
            },

            validateLanguage(item) {
                if (item.length > 0) {
                    for (var i = 0; i < item.length; i++) {
                        let language = item[i];
                        for (var j = i + 1; j < item.length; j++) {
                            let language2 = item[j];
                            if (language["languageType"] == language2["languageType"]) {
                                this.$message({
                                    message: this.$t('queue.queue.msg.no') + (j + 1) + this.$t('queue.queue.msg.rowReply'),
                                    type: 'error',
                                });
                                return false;
                            }
                        }
                    }
                    return true;
                }
                return true;
            },


            selectBaseBusiness() {
                console.log("----selectBaseBusiness----selectBaseBusiness");
                this.selectBaseBusinessVisible = true;
                this.$nextTick(() => {
                    console.log(this.$refs.selectBaseBusinessDialog);
                    this.$refs.selectBaseBusinessDialog.init(this.dataForm.orgId);
                })
            },
            /* 弹出框提交后回调函数，需要在此处理关闭弹出框操作 */
            submitBaseBusinessComplete(val) {
                console.log("回调:", val);
                let data = val;
                this.dataForm.orgBusinessCode = data.baseBusinessCode;
                this.dataForm.orgBusinessName = data.baseBusinessName;
                if (data.customerTypeInitialLetter != '&') {
                    this.dataForm.customerTypeInitialLetter = data.customerTypeInitialLetter;
                }
                this.dataForm.businessInitialLetter = data.businessInitialLetter;
                this.dataForm.numberLength = data.numberLength;
                if(data.enableFlag){
                    this.dataForm.enableFlag = data.enableFlag;
                }
                this.dataForm.customerType = data.customerType;
                if (data.languageTypeList != null) {
                    this.dataForm.languageTypeList = data.languageTypeList;
                } else {
                    this.dataForm.languageTypeList = [];
                }
                this.$forceUpdate();
            },

            loadInitData() {
                // let codes = "languageCode";
                // //加载字典数据
                // this.requestGet(codes, systemSetting.listDictTypeAndItemByTypeCode).then(data => {
                //         let dictdata = data.context;
                //         this.languageData = dictdata["map"]["languageCode"]["items"];
                //     }
                // ).catch(body => {
                //         this.$msgInfoErrorCaller(body.stateMsg);
                //     }
                // );

                this.requestGet("", queueManageAPI.selectUserTypeList).then(data => {
                        this.customerData = data.context;
                        console.log("this.customerData:", this.customerData);
                    }
                ).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    }
                );
            },

            // addLanguage() {
            //     console.log("addLanguage");
            //     this.dataForm.languageTypeList.push({
            //         languageType: "",
            //         otherBusinessName: "",
            //         "key": this.rowSeq++
            //     });
            //     this.$forceUpdate();//一定要进行强制刷新，深克隆问题
            // },
            //
            // removeLanguage(item) {
            //     var index = this.dataForm.languageTypeList.indexOf(item);
            //     if (index !== -1) {
            //         this.dataForm.languageTypeList.splice(index, 1);
            //         this.$forceUpdate();//一定要进行强制刷新，深克隆问题
            //     }
            // },

            changeLanguage() {
                console.log("changeLanguage--------");
                this.$forceUpdate(); //一定要进行强制刷新，深克隆问题
            },
            changeInput() {
                console.log("changeInput--------");
                this.$forceUpdate();//一定要进行强制刷新，深克隆问题
            },
            change(timeVisible){
                this.timeVisible = timeVisible===1;
            }
        }
    }
</script>
<style lang="scss" scoped>
    .main-top /deep/ .el-form-item__label {
        font-size: 12px !important;
    }

    .main-bottom /deep/ .el-table--mini td, .el-table--mini th {
        padding: 3px 0;
    }

    .check /deep/ .el-checkbox{
        width: 100px;
    }
</style>
