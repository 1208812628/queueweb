<template>
    <div class="gwi-module-container">
        <div class="main-top">
            <el-form :inline="true" ref="dataForm" :model="dataForm" size="mini">
                <el-form-item :label="$t('queue.queue.label.appointFunction')" prop="enable">
                    <el-switch v-model="dataForm.enable" :active-value="1" :inactive-value="0" @change="change">
                    </el-switch>

                </el-form-item>
                <p class="appoint_tip">{{$t('queue.queue.msg.tips_enable_appoint')}}</p>
            </el-form>
        </div>
        <div class="main-bottom">
            <h4>{{$t('queue.queue.title.appoint_set')}}</h4>
            <div>
                <el-form :inline="false" ref="dataForm" :model="dataForm" size="mini" class="appoint_form"
                         :rules="rule" :disabled = "this.dataForm.enable=='0'" label-width="200px" label-position="right">
                    <el-form-item :label="$t('queue.queue.label.appointNumber')" prop="numberPrefix">
                        <el-input v-model="dataForm.numberPrefix" clearable maxlength="1"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('queue.queue.label.appointPrefix')" prop="priority">
                        <el-input v-model="dataForm.priority" clearable maxlength="1"></el-input>
                    </el-form-item>
                    <p class="appoint_tip">{{$t('queue.queue.msg.description')}}</p>
                    <el-form-item :label="$t('queue.queue.label.appointSpan')" prop="spanDays">
                        <el-input v-model="dataForm.spanDays" clearable maxlength="2"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-row>
                            <el-col :span="4" :offset="6">
                                <el-button @click="save('dataForm')" type="primary">{{$t('queue.common.button.save')}}</el-button>
                            </el-col>

                            <el-col :span="4">
                                <el-button @click="reset" type="primary">{{$t('queue.common.button.reset')}}</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import {queueManageAPI} from "../../../api/modules/queueManageAPI"; // API接口

    export default {
        name: "QueueAppoint",
        data() {
            const checkBigEnglish = (rule, value, callback) => {
                const pattern = /^[a-zA-Z]+$/
                if (value) {
                    if (!pattern.test(value)) {
                        callback(new Error(this.$t('queue.queue.msg.validate_bigLetter')))
                    }
                }
                callback()
            };
            return {
                dataForm: {},
                rule: {
                    numberPrefix: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'}, // 非空验证
                        {validator: checkBigEnglish, message: this.$t('queue.queue.msg.validate_user_bigLetter'), trigger: ['blur', 'change']},
                    ],
                    priority: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'}, // 非空验证
                        {pattern: /^(([0-9]*[1-9][0-9]*)|(0+))$/, message: this.$t('queue.queue.msg.validate_enNumber'), trigger: ['blur', 'change']},
                    ],
                    spanDays: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'}, // 非空验证
                        {pattern: /^(([0-9]*[1-9][0-9]*)|(0+))$/, message: this.$t('queue.queue.msg.validate_enNumber'), trigger: ['blur', 'change']},
                    ],
                }
            }
        },
        created() {
            this.search();
        },
        methods: {
            search() {
                this.requestGet(null, queueManageAPI.getBaseAppointDetail).then(data => {
                    if (data.success) {
                        if (!data.context) {
                            this.dataForm = {
                                enable: 1,
                                numberPrefix: "Y",
                                priority: 1,
                                spanDays: 7
                            };
                            this.requestVO(this.dataForm, queueManageAPI.updateBaseAppoint).then(data => {
                            }).catch(body => {
                                    this.$msgInfoErrorCaller(body.stateMsg);
                                }
                            );
                        } else {
                            this.dataForm = data.context;
                        }
                    }
                }).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    }
                );
            },
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.requestVO(this.dataForm, queueManageAPI.updateBaseAppoint).then(data => {
                            if (data.success) {
                                this.$notify({
                                    title: this.$t('queue.common.title.success'),
                                    message:  this.$t('queue.common.msg.edit_success'),
                                    type: 'success'});
                            }
                        }).catch(body => {
                                this.$msgInfoErrorCaller(body.stateMsg);
                            }
                        );
                    } else {
                        this.$msgInfoErrorCaller(this.$t('queue.common.msg.validate_error'));
                        return false;
                    }
                });
            },
            reset() {
                this.requestGet(null, queueManageAPI.getBaseAppointDetail).then(data => {
                    if (data.success) {
                        if (!data.context) {
                            this.dataForm.numberPrefix = "Y";
                            this.dataForm.priority = 1;
                            this.dataForm.spanDays = 7;
                        } else {
                            this.dataForm.numberPrefix = data.context.numberPrefix;
                            this.dataForm.priority = data.context.priority;
                            this.dataForm.spanDays = data.context.spanDays.toString();
                        }
                    }
                }).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    }
                );
            },
            change() {
                this.requestGet(this.dataForm.enable, queueManageAPI.enableAppointParam).then(data => {
                    if (data.success) {
                        this.$notify({
                            title: this.$t('queue.common.title.success'),
                            message: this.$t('queue.common.msg.opateSuccess'),
                            type: 'success'
                        });
                    }
                }).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    }
                );
            }
        }
    }
</script>

<style lang="scss" scoped>
    .main-top ::v-deep .el-form-item__label {
        font-size: 12px !important;
    }

    .appoint_tip {
        margin-left: 20px;
        font-size: 12px !important;
    }

    .main-bottom ::v-deep .el-table--mini td, .el-table--mini th {
        padding: 3px 0;
    }

    .appoint_form {
        margin-left: 50px;
        width: 500px;

        .el-input {
            width: 300px;
        }
    }
</style>