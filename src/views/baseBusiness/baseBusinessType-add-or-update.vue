<template>
    <el-dialog
            :title="!dataForm.id ? $t('queue.queue.title.add_business') : $t('queue.queue.title.edit_business')"
            :close-on-click-modal="false"
            class="gwi-dialog"
            :visible.sync="visible"
            top="15px">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" size="mini"
                 label-width="145px">
            <div>
                <el-row>
                    <el-col :span = "20" :offset="1">
                        <el-form-item :label="$t('queue.queue.label.businessName')" prop="baseBusinessName">
                            <el-input v-model="dataForm.baseBusinessName"
                                    :placeholder="$t('queue.common.placeholder.input')" clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span = "20" :offset="1">
                        <el-form-item :label="$t('queue.queue.label.businessCode')" prop="baseBusinessCode">
                            <el-input type="text" clearable
                                      v-model="dataForm.baseBusinessCode"
                                      maxlength="50"
                                      minlength="1"
                                      :placeholder="$t('queue.queue.msg.placeholder_input_businessCode')"
                                      :disabled="codeDisabled">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-for="(language, index) in dataForm.languageTypeList" :key="index">
                    <el-col :span = "9" :offset="1">
                        <el-form-item :label="$t('queue.queue.label.languageType')"
                                      :key="'languageTypeList.' + index + '.languageType'"
                                      :prop="'languageTypeList.' + index + '.languageType'"
                                      :rules="[{required: true, message: $t('queue.queue.msg.validate_business_languageType'),
                                      trigger: ['blur','change']}]">
                            <el-select-dict v-model="language.languageType"
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
                                      :rules="[{required: true, message: $t('queue.queue.msg.validate_business_otherBusiness'), trigger: 'blur'}]">
                            <el-input type="text" clearable
                                      v-model="language.otherBusinessName"
                                      @change="changeInput"
                                      @input="changeInput"
                                      :placeholder="$t('queue.queue.msg.placeholder_select_otherBusiness')">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3" style="text-align: center;">
                        <el-button v-if="index === 0" @click="addLanguage" size="mini">{{$t('queue.common.button.add')}}</el-button>
                        <el-button v-if="index > 0" type="danger" @click.prevent="removeLanguage(language)"
                                   size="mini">{{$t('queue.common.button.delete')}}
                        </el-button>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span = "20" :offset="1">
                        <el-form-item :label="$t('queue.queue.label.businessLetter')" prop="businessInitialLetter">
                            <el-input type="text" clearable
                                      v-model="dataForm.businessInitialLetter"
                                      maxlength="1"
                                      :placeholder="$t('queue.common.placeholder.input')">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span = "20" :offset="1">
                        <el-form-item :label="$t('queue.queue.label.numberLength')" prop="numberLength">
                            <el-select clearable
                                    v-model="dataForm.numberLength"
                                       :placeholder="$t('queue.common.placeholder.selected')">
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
                    <el-col :span = "20" :offset="1">
                        <el-form-item :label="$t('queue.queue.label.customerType')" prop="customerTypeList">
                            <el-select
                                    v-model="dataForm.customerTypeList"
                                    filterable clearable multiple
                                    @change="setCustomerTypeInitialLetter"
                                    :placeholder="$t('queue.common.placeholder.selected')">
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
                    <el-col :span = "20" :offset="1">
                        <el-form-item :label="$t('queue.queue.label.noMediaSupport')" prop="noMediaSupport">
                            <el-switch v-model="dataForm.noMediaSupport" :active-value=1 :inactive-value=0>
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <p class="appoint_tip">{{$t('queue.queue.msg.tips_appoint')}}</p>
            </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="mini">{{$t('queue.common.button.cancel')}}</el-button>
      <el-button type="primary" :loading="loading" @click="dataFormSubmit()" size="mini">{{$t('queue.common.button.submit')}}</el-button>
    </span>
    </el-dialog>

</template>

<script>
    import {queueManageAPI} from "../../../api/modules/queueManageAPI";
    import {regular} from "@/modules/backend";

    export default {
        name: "baseBusinessTypeAddOrUpdate",
        props:[
            'updateFlag'
        ],
        data() {
            return {
                tabModel: "first",

                dataForm: {
                    baseBusinessCode: '',
                    baseBusinessName: '',
                    customerTypeInitialLetter: '',
                    businessInitialLetter: '',
                    numberLength: '',
                    noMediaSupport: 1,
                    enableFlag: '1',
                    customerType: '',
                    languageTypeList: [],
                },

                languageData: [],
                customerData: [],
                baseBusinessList: [],
                allCustomerList: [],


                visible: false,
                loading: false,
                codeDisabled: false,
                customerDisabled: false,

                dataRule: {
                    baseBusinessCode: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'}, // 非空验证
                        {min: 1, max: 20, message: this.$t('queue.queue.msg.validate_length2'), trigger: 'blur'}, // 长度验证
                    ],
                    baseBusinessName: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'change'},
                        {min: 1, max: 20, message: this.$t('queue.queue.msg.validate_length2'), trigger: 'change'},
                    ],
                    businessInitialLetter: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'},
                        {min: 1, max: 1, message: this.$t('queue.queue.msg.validate_length1'), trigger: 'blur'},
                        {pattern: /^[a-zA-Z]+$/, message: this.$t('queue.queue.msg.validate_bigLetter'), trigger: 'blur'}
                    ],
                    numberLength: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'},
                    ],
                    customerTypeList: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'}
                    ],
                    noMediaSupport: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'}
                    ],
                },


                rowSeq: 0,
            }
        },
        components: {},
        created() {
            this.loadInitData();
        },

        /* 事件 */
        methods: {
            init(id) {
                // this.getBusinessList();
                this.dataForm.id = id || '';
                this.visible = true;
                this.codeDisabled = false;
                this.customerDisabled = true;
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields();
                    this.dataForm.languageTypeList = [];
                    if (this.dataForm.languageTypeList <= 0) {
                        this.addLanguage();
                    }
                    if (this.dataForm.id) {
                        this.codeDisabled = true;
                        this.request(queueManageAPI.getBaseBusinessType, {id: this.dataForm.id}, "post").then((data) => {
                            if (data && data.success) {
                                this.dataForm = data.context;
                                console.log("this.dataForm", this.dataForm);
                                if (this.dataForm.languageTypeList == null) {
                                    this.dataForm.languageTypeList = [];
                                    this.addLanguage();
                                }
                            }
                        }).catch(body => {
                            this.$msgInfoErrorCaller(body.stateMsg);
                        })
                    }
                    else{
                        this.dataForm.customerTypeList = this.allCustomerList;
                        this.dataForm.numberLength = "4"
                    }
                })
            },

            getOtherLanguageList(businessCode){
                this.requestGet(businessCode, queueManageAPI.getOtherLanguageList).then((data)=>{
                    this.dataForm.languageTypeList = data.context;
                }).catch(body => {
                    this.$msgInfoErrorCaller(body.stateMsg);
                });
            },

            querySearch(queryString, cb) {
                let restaurants = this.baseBusinessList;
                let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },

            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.indexOf(queryString) === 0);
                };
            },

            handleSelect(item) {
                this.dataForm.baseBusinessCode = item.key;
                this.dataForm.baseBusinessName = item.value;
                this.getOtherLanguageList(item.key);
                console.log(this.dataForm.languageTypeList);
                this.$forceUpdate();
            },

            loadInitData() {
                this.requestGet("", queueManageAPI.selectUserTypeList).then(data => {
                        this.customerData = data.context;
                        if(this.customerData.length>0){
                            this.customerData.forEach(item=>{
                                this.allCustomerList.push(item.factorCode);
                            })
                        }
                    }
                ).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    }
                );
            },

            setCustomerTypeInitialLetter(value) {
                console.log("setCustomerTypeInitialLetter:" + value);
                this.customerData.forEach(item => {
                    if (item.factorCode == value) {
                        this.dataForm.customerTypeInitialLetter = item.numberPrefix;
                    }
                });
            },

            addLanguage() {
                console.log("addLanguage")
                this.dataForm.languageTypeList.push({
                    languageType: "",
                    otherBusinessName: "",
                    "key": this.rowSeq++
                });
                this.$forceUpdate();//一定要进行强制刷新，深克隆问题
            },

            removeLanguage(item) {
                var index = this.dataForm.languageTypeList.indexOf(item)
                if (index !== -1) {
                    this.dataForm.languageTypeList.splice(index, 1)
                    this.$forceUpdate();//一定要进行强制刷新，深克隆问题
                }
            },

            changeLanguage() {
                console.log("changeLanguage--------")
                this.$forceUpdate(); //一定要进行强制刷新，深克隆问题
            },
            changeInput() {
                console.log("changeInput--------")
                this.$forceUpdate();//一定要进行强制刷新，深克隆问题
            },

            // 表单提交
            dataFormSubmit() {
                this.dataForm.enableFlag = "1";
                console.log("this.dataForm:", this.dataForm);

                if (!this.validateLanguage(this.dataForm.languageTypeList)) {
                    return;
                }

                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        var submitUrl = "";
                        this.loading = true;
                        if (this.dataForm.id) {
                            submitUrl = queueManageAPI.updateBaseBusinessType;
                        } else {
                            submitUrl = queueManageAPI.addBaseBusinessType;
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
                                    message: this.$t('queue.queue.msg.no') + (j + 1) +  this.$t('queue.queue.msg.rowReply'),
                                    type: 'error',
                                });
                                return false;
                            }
                        }
                    }
                    return true;
                }
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

    .gwi-dialog {
        .el-dialog__title {
            color: #fff;
        }

        .el-autocomplete {
            width: 100%;
        }
    }

    .appoint_tip {
        margin-left: 100px;
        font-size: 12px !important;
    }
</style>
