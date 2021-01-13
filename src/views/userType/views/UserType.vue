<template>
    <gwi-ui-list-page-container>
        <gwi-ui-table-view :columns-define="fieldsDefine" :show-columns="dShowColumns"
                           lang-url="queue.userType.columns" :column-res="fieldsI18nRes" :dict-res="dictI18nRes"
                           :datas="tableData" @link-click="linkClick" :params.sync="productQueryParams" has-filter>
            <div slot="filter">
                <el-input v-model="productQueryParams.factorName" placeholder="请输入客户名" style="width:200px;"/>
            </div>
            <template slot-scope="scope" slot="tableAction">
                <permission-buttons :actions="actions" :row-data="scope.row" size="small"
                                    lang-url="queue.userType.actions" @action-click="actionClick">
                </permission-buttons>
            </template>
        </gwi-ui-table-view>
    </gwi-ui-list-page-container>
</template>

<script>
    import {queueManageAPI} from "../../../api/modules/queueManageAPI"; // API接口
    import {regular} from "@gwi/bi-common";
    import userType from '../cfg/userType.js';

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
                    factorCode: '',
                    factorName: '',
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
                loading: false,
                showSwitch: true,
                productQueryParams: {
                    factorName: null
                },
                actions: [].concat(userType.Table_Actions),
                dShowColumns: [].concat(userType.DEFAULT_SHOW_COLUMN),
                fieldsDefine: userType.TABLE_COLUMNS_DEFINE,
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
            this.query();
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
                this.$emit('action-click', {command, rowData});
            },
            query() {
                this.searchInfo.pageNum = 1;
                this.search();
            },
            resetQuery() {
                this.searchInfo.factorCode = undefined;
                this.searchInfo.factorName = undefined;
            },
            // 点击查询按钮
            search() {
                this.loading = true;
                this.requestVO(this.searchInfo, queueManageAPI.selectUserType).then(data => {
                        this.loading = false;
                        this.tableData = data.context.list;
                        this.searchInfo.total = data.context.total;
                    }
                ).catch(body => {
                        this.loading = false;
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

            // 启用
            toStart(id) {
                let param = {
                    'id': id,
                    'disabled': '0'
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
    .main-top ::v-deep .el-form-item__label {
        font-size: 12px !important;
    }

    .main-bottom ::v-deep .el-table--mini td, .el-table--mini th {
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

        .el-select--mini {
            width: 90%;
        }

        .el-textarea {
            width: 90%;
        }
    }

</style>