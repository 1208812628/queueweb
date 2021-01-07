<template>
    <div class="horizontal">
            <div>
                <img src="../../../assets/images/take-slip.png" class="horizontal-image">
            </div>
            <div class="horizontal-content">
                <p class="demonstration">{{$t('queue.queue.label.slipContent')}}
                    <el-button @click="addLanguage" size="mini" type="primary">
                        {{$t('queue.queue.button.addLanguage')}}</el-button>
                </p>
                <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
                         size="mini"
                         label-width="80px" @submit.native.prevent>
                    <div class="horizontal-list">
                        <el-row>
                            <el-col :span="4">
                                <p style="font-size: 14px;margin-left: 5px">{{$t('queue.queue.label.madeContent')}}</p>
                            </el-col>
                            <el-col :span="17">
                                <el-input type="textarea" size="small"
                                          v-model="dataForm.content"
                                          rows="3"
                                          maxlength="200"
                                          :placeholder="$t('queue.common.placeholder.input')">
                                </el-input>
                            </el-col>
                        </el-row>

                        <el-row v-for="(language, index) in dataForm.orgTakeLanguageList" :key="language.key">
                            <el-col :span="4">
                                <el-select-dict v-model="language.languageType"
                                           :key="language.languageType"
                                           filterable code="language"
                                           app-id="manage-queue"
                                           @change="changeLanguage"
                                           :placeholder="$t('queue.common.placeholder.select')"
                                           size="mini">
                                </el-select-dict>
                            </el-col>
                            <el-col :span="17">
                                <el-input type="textarea"
                                          size="small"
                                          v-model="language.otherContent"
                                          @change="changeInput"
                                          @input="changeInput"
                                          rows="3"
                                          maxlength="200"
                                          :placeholder="$t('queue.queue.msg.placeholder_input_made_content')">
                                </el-input>
                            </el-col>
                            <el-col :span="2" :offset="1">
                                <el-button type="danger" icon="el-icon-delete" @click.prevent="removeLanguage(language)"
                                           size="mini" circle>
                                </el-button>
                            </el-col>
                        </el-row>

                    </div>
                </el-form>
                <div class="content-bottom">
                    <el-button type="primary" :loading="loading" @click="dataFormSubmit()" size="mini">
                        {{$t('queue.common.button.save')}}</el-button>
                </div>

            </div>
    </div>
</template>

<script>
    import {queueManageAPI} from "../../../api/modules/queueManageAPI";


    export default {
        name: "orgTakeSlip",
        data() {
            return {

                dataForm: {
                    orgId: '',
                    content: '',
                    orgTakeLanguageList: [],
                },

                src: '../../../assets/images/take-slip.png',
                loading: false,
                dataRule: {
                    content: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'}, // 非空验证
                        {min: 1, max: 255, message: this.$t('queue.queue.msg.validate_length4'), trigger: 'blur'},
                    ],

                },

                rowSeq: 0,
            }


        },
        props: [
            'orgId'
        ],
        watch: {
            orgId(val) {
                if (val) {
                    console.log("this.orgId:", this.orgId);
                    this.search();
                }
            }
        },

        created() {
            this.search();
        },
        /* 事件 */
        methods: {
            search() {
                if (this.orgId) {
                    this.requestVO({orgId: this.orgId}, queueManageAPI.getOrgTakeSlip).then(data => {
                            if (data && data.success) {
                                this.dataForm = data.context;
                                console.log('this.dataForm', this.dataForm);
                                if (this.dataForm.orgTakeLanguageList == null) {
                                    this.dataForm.orgTakeLanguageList = [];
                                    this.addLanguage();
                                }
                                else{
                                    if(this.dataForm.orgTakeLanguageList.length === 0){
                                        this.addLanguage();
                                    }
                                }
                            }
                        }
                    ).catch(body => {
                            this.$msgInfoErrorCaller(body.stateMsg);
                        }
                    );
                }
            },

            addLanguage() {
                console.log("addLanguage")
                this.dataForm.orgTakeLanguageList.push({
                    languageType: "",
                    otherContent: "",
                    "key": this.rowSeq++
                });
                this.$forceUpdate();//一定要进行强制刷新，深克隆问题
            },

            removeLanguage(item) {
                var index = this.dataForm.orgTakeLanguageList.indexOf(item)
                if (index !== -1) {
                    this.dataForm.orgTakeLanguageList.splice(index, 1)
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
                console.log("this.orgId:", this.orgId);
                if (this.orgId == '' && this.orgId == undefined) {
                    this.$msgInfoErrorCaller(this.$t('queue.queue.msg.validate_org_notBlank'),);
                    return;
                }
                this.dataForm.orgId = this.orgId;
                console.log("this.dataForm:", this.dataForm);

                if (!this.validateLanguage(this.dataForm.orgTakeLanguageList)) {
                    return;
                }

                let submitUrl = "";
                if (this.dataForm.id) {
                    submitUrl = queueManageAPI.updateOrgTakeSlip;
                } else {
                    submitUrl = queueManageAPI.addOrgTakeSlip;
                }

                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.request(submitUrl, this.dataForm, "post").then((data) => {
                            if (data && data.success) {
                                this.loading = false;
                                this.$message({
                                    message: this.$t('queue.common.title.success'),
                                    type: 'success',
                                    duration: 1500,
                                    onClose: () => {
                                    }
                                })
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
                        if (!language["languageType"]){
                            this.$message({
                                message: this.$t('queue.queue.msg.no') + (j + 1) + this.$t('queue.queue.msg.noSelect'),
                                type: 'error',
                            });
                            return false;
                        }
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
            },
        }
    }
</script>

<style lang="scss" scoped>
    .main-top /deep/ .el-form-item__label {
        font-size: 12px !important;
    }

    .horizontal {
        background-color: transparent;
        width: 100%;
        height: auto;
        box-shadow: 0 0 0 rgba(0, 0, 0, 0), 0 0 0 rgba(0, 0, 0, 0);
        margin: 0;
    }

    .horizontal-image {
        float: left;
        box-sizing: border-box;
        width: 46%;
        height: 480px;
        margin: 10px 10px 20px 10px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    }

    .horizontal-content {
        background-color: #EBEEF5;
        box-sizing: border-box;
        float: left;
        width: 48%;
        height: 480px;
        margin: 10px 10px 20px 10px;
        border: #F2F6FC solid 1px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    }

    .horizontal-content .el-row {
        margin-bottom: 10px;
    }

    .demonstration {
        margin: 10px 0 25px 10px;

        .el-button {
            float: right;
            margin-right: 10px;
        }
    }

    .content-bottom {
        float: bottom;
        text-align: center;
        margin-bottom: 20px;
    }

    /deep/ .el-input__inner {
        padding: 0 0 0 10px !important;
    }
</style>