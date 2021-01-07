<template>
    <div class="gwi-module-container">
        <div class="main-top">
            <el-form :inline="true" ref="searchInfo" :model="searchInfo" size="mini">
                <el-row>
                    <el-form-item :label="$t('queue.queue.label.labelClassify')" prop="labelClassify">
                        <el-select-dict v-model="searchInfo.labelClassify" clearable
                                        :placeholder="$t('queue.common.placeholder.selected')"
                                        code="satisfied" app-id="manage-queue" ></el-select-dict>
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
                    <el-table-column prop="labelName" :label="$t('queue.queue.label.labelName')" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-tag type="info">{{scope.row.labelName}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="labelClassify" :label="$t('queue.queue.label.labelClassify')" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.labelClassify==='1'" type="success">{{$t('queue.queue.label.satisfied')}}</el-tag>
                            <el-tag v-else type="danger">{{$t('queue.queue.label.dissatisfied')}}</el-tag>
                        </template>
                    </el-table-column>
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
                     :status-icon="true" :inline-message="true" label-position="right" label-width="150px"
                     size="mini" class="dialog-form">
                <el-form-item :label="$t('queue.queue.label.labelName')" prop="labelName">
                    <el-input type="text" v-model="dialogFormInfo.labelName" maxlength="10" minlength="1" clearable
                              :placeholder="$t('queue.common.placeholder.input')">
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('queue.queue.label.labelClassify')" prop="labelClassify">
                    <el-select-dict v-model="dialogFormInfo.labelClassify" clearable
                                    :placeholder="$t('queue.common.placeholder.selected')"
                                    code="satisfied" app-id="manage-queue" ></el-select-dict>
                </el-form-item>
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

    export default {
        name: "BaseLabel",
        data() {
            return {
                // 搜索框的值
                searchInfo: {
                    labelClassify:'',
                    labelName:'',
                    pageNum: 1,
                    start: 0,
                    pageSize: 10,
                    total: 0
                },
                // 弹出框的表单对象
                dialogFormInfo: {},
                // 弹出窗口的标题
                dialogTitle: '',
                dialogUpdateFlag: true, // 弹出框是编辑操作还是修改操作(true:修改 false:添加角色操作)
                dialogFormVisible: false, // 是否显示和隐藏弹出框
                // 列表的数据
                tableData: [],
                dialogRules: { // 表单规则验证规则
                    labelName: [
                        {required: true, message: this.$t('queue.queue.msg.validate_label_labelName'), trigger: 'blur'}, // 非空验证
                    ],
                    labelClassify: [
                        {required: true, message: this.$t('queue.queue.msg.validate_label_labelClassify'), trigger: 'blur'}, // 非空验证
                    ],
                },
                loading:false,
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
                this.searchInfo.labelName = undefined;
                this.searchInfo.labelClassify = undefined;
            },
            // 点击查询按钮
            search() {
                this.loading=true;
                this.requestVO(this.searchInfo, queueManageAPI.selectLabel).then(data => {
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
            // 添加标签
            toAdd() {
                this.dialogUpdateFlag = false;
                this.dialogFormVisible = true;
                this.dialogTitle = this.$t('queue.queue.title.add_label');
            },

            // 编辑标签
            toModify(id) {
                this.dialogTitle = this.$t('queue.queue.title.edit_label');
                this.dialogFormVisible = true;
                this.dialogUpdateFlag = true;
                this.requestGet(id, queueManageAPI.getLabelDetail).then(data => {
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
                        if (this.dialogUpdateFlag) {
                            this.requestVO(this.dialogFormInfo, queueManageAPI.updateLabel).then(body => {
                                this.hideLoading();
                                this.$notify({
                                    title: this.$t('queue.common.title.success'),
                                    message:  this.$t('queue.common.msg.edit_success'),
                                    type: 'success'});
                                this.dialogFormInfo = {};
                                this.dialogFormVisible = false;
                                this.search();
                            }).catch(body => {
                                this.hideLoading();
                                this.$msgInfoErrorCaller(body.stateMsg);
                            })
                        } else {
                            this.requestVO(this.dialogFormInfo, queueManageAPI.insertLabel).then(body => {
                                this.hideLoading();
                                this.$notify({
                                    title: this.$t('queue.common.title.success'),
                                    message:  this.$t('queue.common.msg.add_success'),
                                    type: 'success'});
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
                this.$confirm(this.$t('queue.queue.msg.delete_label_confirm'), this.$t('queue.common.title.delete'), {
                    confirmButtonText: this.$t('queue.common.button.confirm'),
                    cancelButtonText: this.$t('queue.common.button.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.requestGet(row.id, queueManageAPI.deleteLabel).then(body => {
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