<template>
    <gwi-ui-list-page-container>
        <gwi-ui-table-view :columns-define="fieldsDefine" :show-columns="showColumns" ref="Table"
                           lang-url="queue.userType.columns" :column-res="fieldsI18nRes" :dict-res="dictI18nRes"
                           @link-click="linkClick" :api-handle="query"
                           :datas.sync="tableData" :params.sync="searchInfo" has-filter>
            <el-form slot="filter" :inline="true" :model="searchInfo" size="small">
                <el-button size="small" type="primary" icon="el-icon-plus" @click="toAdd" style="margin-right: 20px">
                    新增
                </el-button>
                <el-input v-model="searchInfo.factorCode" placeholder="请输入客户编号" style="width:200px;"/>
                <el-input v-model="searchInfo.factorName" placeholder="请输入客户名" style="width:200px;"/>
            </el-form>
            <template slot-scope="scope" slot="tableAction">
                <gwi-ui-dropButton-group :actions="actions" :row-data="scope.row"
                                         @action-click="actionClick" lang-url="queue.userType.actions">
                </gwi-ui-dropButton-group>
            </template>
        </gwi-ui-table-view>
        <!-- 添加/修改 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="50%" @close="dialogClose"
                   class="gwi-dialog" center v-el-drag-dialog :close-on-click-modal="false" :append-to-body="true"
                   top="20px">
            <el-form :inline="false" :model="dialogFormInfo" ref="dialogFormInfo" :rules="dialogRules"
                     :status-icon="true" :inline-message="true" label-position="right" label-width="140px"
                     size="mini" class="dialog-form">
                <el-form-item :label="$t('queue.queue.label.typeCode')" prop="factorCode">
                    <el-input type="text" v-model="dialogFormInfo.factorCode" maxlength="30" minlength="1" clearable
                              :placeholder="$t('queue.common.placeholder.input')" :readonly="this.dialogUpdateFlag"
                              :disabled="this.dialogUpdateFlag">
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
                        <el-option v-for="item in priorityList" :key="item.value" :value="item.value"
                                   :label="item.name"></el-option>
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
                        <el-option v-for="item in overTimeList" :key="item.value" :value="item.value"
                                   :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="cancelDialog">{{$t('queue.common.button.cancel')}}</el-button>
                <el-button @click="submitDialog('dialogFormInfo')" type="primary">{{$t('queue.common.button.submit')}}
                </el-button>
            </div>
        </el-dialog>
    </gwi-ui-list-page-container>
</template>

<script>
    import {queueManageAPI} from "../../../api/modules/queueManageAPI"; // API接口
    import {regular} from "@gwi/bi-common";
    import cfgMixin from '../../mixin/cfgMixin';

    export default {
        mixins: [cfgMixin],
        name: "UserType",
        props: {
            showColumns: {},
            formFieldsDefine: {},
            formShowColumns: {},
            actions: {},
        },
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
                    factorCode: '',
                    factorName: '',
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
                        {
                            validator: checkBigEnglish,
                            message: this.$t('queue.queue.msg.validate_bigLetter'),
                            trigger: ['blur', 'change']
                        },
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
                    {value: 10, name: '10' + this.$t('queue.common.label.minute')},
                    {value: 20, name: '20' + this.$t('queue.common.label.minute')},
                    {value: 30, name: '30' + this.$t('queue.common.label.minute')},
                    {value: 40, name: '40' + this.$t('queue.common.label.minute')},
                    {value: 50, name: '50' + this.$t('queue.common.label.minute')},
                    {value: 60, name: '60' + this.$t('queue.common.label.minute')},
                    {value: 70, name: '70' + this.$t('queue.common.label.minute')},
                    {value: 80, name: '80' + this.$t('queue.common.label.minute')},
                    {value: 90, name: '90' + this.$t('queue.common.label.minute')},
                ],
            }
        },
        watch: {
            /* 清空表单 */
            dialogFormVisible(val) {
                if (this.$refs.dialogFormInfo != undefined) {
                    this.$refs.dialogFormInfo.clearValidate();
                }
            },
        },
        created() {
            // this.query();
        },
        /* 事件 */
        methods: {
            linkClick(row) {
                // console.log(row);
                this.$message({
                    message: row,
                    duration: 0,
                    type: 'success',
                    showClose: true
                });
            },
            actionClick({command, rowData}) {
                switch (command) {
                    case 'edit':
                        this.toModify();
                        break;
                    case 'delete':
                        this.doDelete(rowData, 2);
                        break;
                    default:
                        this.toModify(rowData.id)
                }
            },
            search(){
                this.$refs.Table.refresh();
            },
            // 点击查询按钮
            query() {
                return new Promise((resolve, reject) => {
                    this.requestVO(this.searchInfo, queueManageAPI.selectUserType).then(data => {
                            resolve(data.context)
                        }
                    ).catch(body => {
                            this.$msgInfoErrorCaller(body.stateMsg);
                            reject(body.stateMsg);
                        }
                    );
                })
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
                                this.searchInfo.pageNum--;
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
                        if (this.dialogFormInfo.numberPrefix) {
                            this.dialogFormInfo.numberPrefix = this.dialogFormInfo.numberPrefix.toUpperCase();
                        }
                        if (this.dialogUpdateFlag) {
                            this.requestVO(this.dialogFormInfo, queueManageAPI.updateUserType).then(body => {
                                this.hideLoading();
                                this.$notify({
                                    title: this.$t('queue.common.title.success'),
                                    message: this.$t('queue.common.msg.edit_success'),
                                    type: 'success'
                                });
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
                                this.$notify({
                                    title: this.$t('queue.common.title.success'),
                                    message: this.$t('queue.common.msg.add_success'),
                                    type: 'success'
                                });
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
        }
    }
</script>