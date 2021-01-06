<template>
    <div class="gwi-module-container">
        <div class="main-top">
            <el-form :inline="true" ref="searchInfo" :model="searchInfo" size="mini">
                <el-row>
                    <el-form-item :label="$t('queue.queue.label.typeCode')" prop="factorCode">
                        <el-input v-model="searchInfo.factorCode" clearable></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('queue.queue.label.typeName')"  prop="factorName">
                        <el-input v-model="searchInfo.factorName" clearable></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button @click="query" type="primary">{{$t("queue.common.button.query")}}</el-button>
                        <el-button @click="resetQuery" type="primary">{{$t("queue.common.button.reset")}}</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </div>
        <div class="main-bottom">
            <div class="btn-container">
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="toAdd" plain>{{$t('queue.common.button.add')}}</el-button>
            </div>
            <!-- 列表 -->
            <div class="table-container">
                <el-table :data="tableData" border size="mini" v-loading="loading" :element-loading-text="$t('queue.queue.msg.load')">
                    <el-table-column type="index" :label="$t('queue.common.label.serialNumber')" :index="tableIndex" align="center" width="50">
                    </el-table-column>
                    <el-table-column prop="factorCode" :label="$t('queue.queue.label.typeCode')" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="factorName" :label="$t('queue.queue.label.typeName')" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="numberPrefix" :label="$t('queue.queue.label.numberPrefix')" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="priority" :label="$t('queue.queue.label.priority')" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="overTime" :label="$t('queue.queue.label.overTime')" show-overflow-tooltip></el-table-column>
<!--                    <el-table-column prop="numberLength" label="叫号长度" show-overflow-tooltip></el-table-column>-->
<!--                    <el-table-column prop="disabledText" label="启用状态" show-overflow-tooltip></el-table-column>-->
                    <el-table-column :label="$t('queue.common.label.operation')" fixed="right" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="toModify(scope.row.id)" >{{$t('queue.common.button.edit')}}</el-button>
                            <el-button type="text" size="small" @click="doDelete(scope.row, scope.$index)" >{{$t('queue.common.button.delete')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <div class="pagination-container">
                <el-pagination background layout="total, prev, pager, next,jumper" :page-size="searchInfo.pageSize" :total="searchInfo.total"
                               @current-change="currentChange" :current-page="searchInfo.pageNum">
                </el-pagination>
            </div>
        </div>

        <!-- 添加/修改 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="50%" @close="dialogClose"
                   class="gwi-dialog" center v-el-drag-dialog :close-on-click-modal="false" :append-to-body="true" top="20px">
            <el-form :inline="false" :model="dialogFormInfo" ref="dialogFormInfo" :rules="dialogRules"
                     :status-icon="true" :inline-message="true" label-position="right" label-width="140px"
                     size="mini" class="dialog-form">
                <el-form-item :label="$t('queue.queue.label.typeCode')" prop="factorCode">
                    <el-input type="text" v-model="dialogFormInfo.factorCode" maxlength="30" minlength="1" clearable
                              :placeholder="$t('queue.common.placeholder.input')" :readonly="this.dialogUpdateFlag" :disabled = "this.dialogUpdateFlag">
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('queue.queue.label.typeName')" prop="factorName">
                    <el-input type="text" v-model="dialogFormInfo.factorName" maxlength="30" minlength="1"
                              :placeholder="$t('queue.common.placeholder.input')" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('queue.queue.label.priority')" prop="priority">
                    <el-select size="mini" v-model="dialogFormInfo.priority"
                              :placeholder="$t('queue.queue.msg.priority')" clearable>
                        <el-option v-for="item in priorityList" :key="item.value" :value="item.value" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('queue.queue.label.numberPrefix')" prop="numberPrefix">
                    <el-input type="text" size="mini" v-model="dialogFormInfo.numberPrefix" maxlength="1"
                              :placeholder="$t('queue.common.placeholder.input')" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('queue.queue.label.overTime')" prop="overTime">
                    <el-select size="mini" v-model="dialogFormInfo.overTime"
                               :placeholder="$t('queue.queue.msg.overTime')" clearable>
                        <el-option v-for="item in overTimeList" :key="item.value" :value="item.value" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>

<!--                <el-form-item label="叫号长度：" prop="numberLength">-->
<!--                    <el-input type="text" size="mini" v-model="dialogFormInfo.numberLength" maxlength="1"-->
<!--                              :placeholder="$t('placeholder.input')">-->
<!--                    </el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="启用状态：" prop="disabled" v-if="!this.dialogUpdateFlag">-->
<!--                    <el-select-dict code="isDisabled" v-model="dialogFormInfo.disabled" :clearable="false"-->
<!--                                    :placeholder="$t('placeholder.selected')" filterable>-->
<!--                    </el-select-dict>-->
<!--                </el-form-item>-->
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="cancelDialog">{{$t('queue.common.button.cancel')}}</el-button>
                <el-button @click="submitDialog('dialogFormInfo')" type="primary">{{$t('queue.common.button.submit')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {queueManageAPI} from "../../../api/modules/queueManageAPI"; // API接口
    import {regular} from "@/modules/backend";

    export default {
        name: "UserType",
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
                // 搜索框的值
                searchInfo: {
                    factorCode:'',
                    factorName:'',
                    pageNum: 1,
                    start: 0,
                    pageSize: 10,
                    total: 0
                },
                // 弹出框的表单对象
                english: /^[A-Z]+$/,
                dialogFormInfo: {},
                // 弹出窗口的标题
                dialogTitle: '',
                dialogUpdateFlag: true, // 弹出框是编辑操作还是修改操作(true:修改 false:添加角色操作)
                dialogFormVisible: false, // 是否显示和隐藏弹出框
                // 列表的数据
                tableData: [],
                dialogRules: { // 表单规则验证规则
                    factorCode: [
                        {required: true, message: this.$t('queue.queue.msg.validate_user_factorCode'), trigger: 'blur'}, // 非空验证
                        {pattern: regular.enNumberLine, message: regular.enNumberLineMsg, trigger: ['blur', 'change']},
                    ],
                    factorName: [
                        {required: true, message: this.$t('queue.queue.msg.validate_user_factorName'), trigger: 'blur'}, // 非空验证
                    ],
                    priority: [
                        {required: true, message: this.$t('queue.queue.msg.validate_user_priority'), trigger: 'blur'}, // 非空验证
                        {
                            pattern: regular.naturalNumber,
                            message: regular.naturalNumberMsg,
                            trigger: ['blur', 'change']
                        },
                    ],
                    numberPrefix: [
                        {required: false},
                        {validator: checkBigEnglish, message: this.$t('queue.queue.msg.validate_bigLetter'), trigger: ['blur', 'change']},
                    ],
                },
                priorityList: [
                    {value: '1', name: '1'},
                    {value: '2', name: '2'},
                    {value: '3', name: '3'},
                    {value: '4', name: '4'},
                    {value: '5', name: '5'},
                    {value: '6', name: '6'},
                    {value: '7', name: '7'},
                    {value: '8', name: '8'},
                    {value: '9', name: '9'},
                ],
                overTimeList: [
                    {value: 10, name: '10'+this.$t('queue.common.label.minute')},
                    {value: 20, name: '20'+this.$t('queue.common.label.minute')},
                    {value: 30, name: '30'+this.$t('queue.common.label.minute')},
                    {value: 40, name: '40'+this.$t('queue.common.label.minute')} ,
                    {value: 50, name: '50'+this.$t('queue.common.label.minute')}  ,
                    {value: 60, name: '60'+this.$t('queue.common.label.minute')}  ,
                    {value: 70, name: '70'+this.$t('queue.common.label.minute')}  ,
                    {value: 80, name: '80'+this.$t('queue.common.label.minute')}  ,
                    {value: 90, name: '90'+this.$t('queue.common.label.minute')}  ,
                ],
                loading:false,
                showSwitch:true,
            }
        },
        watch: {
            /* 清空表单 */
            dialogFormVisible(val) {
                if (this.$refs.dialogFormInfo != undefined){
                    this.$refs.dialogFormInfo.clearValidate();
                }
            },
        },
        created() {
            this.query();
        },
        /* 事件 */
        methods: {
            query() {
                this.searchInfo.pageNum = 1;
                this.search();
            },
            resetQuery(){
                this.searchInfo.factorCode = undefined;
                this.searchInfo.factorName = undefined;
            },
            // 点击查询按钮
            search() {
                this.loading=true;
                this.requestVO(this.searchInfo, queueManageAPI.selectUserType).then(data => {
                        this.loading=false;
                        this.tableData = data.context.list;
                        this.searchInfo.total = data.context.total;
                    }
                ).catch(body => {
                        this.loading=false;
                        this.$msgInfoErrorCaller(body.stateMsg);
                    }
                );
            },
            // 翻页
            currentChange(val) {
                this.searchInfo.pageNum = val;
                this.search();
            },
            // 数据表序号
            tableIndex(index) {
                let page = this.searchInfo.pageNum;
                let limit = this.searchInfo.pageSize;
                return (page - 1) * limit + index + 1;
            },
            // 添加用户
            toAdd() {
                this.dialogUpdateFlag = false;
                this.dialogFormVisible = true;
                this.dialogTitle = this.$t('queue.queue.title.add_userType');
            },

            // 编辑用户
            toModify(id) {
                this.dialogTitle = this.$t('queue.queue.title.edit_userType');
                this.dialogFormVisible = true;
                this.dialogUpdateFlag = true;
                this.requestGet(id, queueManageAPI.selectUserTypeDetail).then(data => {
                    this.dialogFormInfo = data.context;
                }).catch(body => {
                    this.$msgInfoErrorCaller(body.stateMsg);
                })
            },
            // 关闭弹出框
            dialogClose() {
                this.dialogFormInfo = {};
                this.dialogFormVisible = false;
            },
            // 弹出框取消按钮
            cancelDialog() {
                this.dialogFormInfo = {};
                this.dialogFormVisible = false;
            },
            // 弹出框提交
            submitDialog(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.showLoading();
                        if(this.dialogFormInfo.numberPrefix){
                            this.dialogFormInfo.numberPrefix = this.dialogFormInfo.numberPrefix.toUpperCase();
                        }
                        if (this.dialogUpdateFlag) {
                            this.requestVO(this.dialogFormInfo, queueManageAPI.updateUserType).then(body => {
                                this.hideLoading();
                                this.$notify({title: this.$t('queue.common.title.success'), message:  this.$t('queue.common.msg.edit_success'), type: 'success'});
                                this.dialogFormInfo = {};
                                this.dialogFormVisible = false;
                                this.search();
                            }).catch(body => {
                                this.hideLoading();
                                this.$msgInfoErrorCaller(body.stateMsg);
                            })
                        } else {
                            this.requestVO(this.dialogFormInfo, queueManageAPI.addUserType).then(body => {
                                this.hideLoading();
                                this.$notify({title: this.$t('queue.common.title.success'), message:  this.$t('queue.common.msg.add_success'), type: 'success'});
                                this.dialogFormInfo = {};
                                this.dialogFormVisible = false;
                                this.search();
                            }).catch(body => {
                                this.hideLoading();
                                this.$msgInfoErrorCaller(body.stateMsg);
                            })
                        }
                    } else {
                        this.$msgInfoErrorCaller(this.$t('queue.common.msg.validate_error'));
                        return false;
                    }
                });
            },

            // 删除一个用户
            doDelete(row, index) {
                this.$confirm(this.$t('queue.queue.msg.delete_user_confirm'), this.$t('queue.common.title.delete'), {
                    confirmButtonText: this.$t('queue.common.button.confirm'),
                    cancelButtonText: this.$t('queue.common.button.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.requestGet(row.id, queueManageAPI.deleteUserType).then(body => {
                        this.$message({
                            type: 'success',
                            message: this.$t('queue.common.msg.delete_success')
                        });
                        if (this.searchInfo.pageNum !== 1) {
                            // 删除的是某页的第一条数据
                            let tmp = (index + 1) % this.searchInfo.pageSize;
                            if (tmp === 1) {
                                this.searchInfo.pageNum --;
                            }
                        }
                        this.search();
                    }).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('queue.common.msg.cancel_delete')
                    });
                });
            },

            // 启用
            toStart(id){
                let param = {
                    'id':id,
                    'disabled':'0'
                };
                this.requestVO(param, queueManageAPI.updateUserType).then(body => {
                    this.$notify({title: this.$t('queue.common.title.success'), message: '启用成功', type: 'success'});
                    this.search();
                }).catch(body => {
                    this.$msgInfoErrorCaller(body.stateMsg);
                })
            },

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

        .el-form-item--mini {
            width: 100%;
            margin-left: 15px;
        }

        .el-form-item__label {
            padding: 0 !important;
        }

        .el-input--mini {
            width: 90%;
        }

        .el-select--mini{
            width: 90%;
        }

        .el-textarea {
            width: 90%;
        }
    }

</style>