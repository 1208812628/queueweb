<template>
    <gwi-ui-list-page-container>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="toAdd" style="margin-left: 30px">
            新增
        </el-button>
        <gwi-ui-table-view :columns-define="fieldsDefine" :show-columns="showColumns" ref="Table"
                           lang-url="queue.evaluateLabel.columns" :column-res="fieldsI18nRes" :dict-res="dictI18nRes"
                           :api-handle="query"
                           :datas.sync="tableData" :params.sync="searchInfo" has-filter>\
            <el-form slot="filter" :inline="true" :model="searchInfo" size="small">
                <el-row>
                    <el-select-dict v-model="searchInfo.labelClassify" clearable
                                    placeholder="请选择标签分类"
                                    code="satisfied" app-id="manage-queue" ></el-select-dict>
                </el-row>

            </el-form>
            <template slot-scope="scope" slot="tableAction">
                <gwi-ui-dropButton-group :actions="actions" :row-data="scope.row"
                                         @action-click="actionClick" lang-url="queue.evaluateLabel.actions">
                </gwi-ui-dropButton-group>
            </template>
        </gwi-ui-table-view>

        <!-- 添加/修改 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="50%" @close="cancelDialog"
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
    </gwi-ui-list-page-container>
</template>

<script>
    import {queueManageAPI} from "../../../api/modules/queueManageAPI"; // API接口
    import cfgMixin from "../../mixin/cfgMixin";

    export default {
        name: "CpEvaluateLabel",
        mixins: [cfgMixin],
        props: {
            showColumns: {},
            formFieldsDefine: {},
            formShowColumns: {},
            actions: {},
        },
        data() {
            return {
                // 搜索框的值
                searchInfo: {
                    labelClassify:'',
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
            // this.query();
        },
        /* 事件 */
        methods: {
            actionClick({command, rowData}) {
                switch (command) {
                    case 'edit':
                        this.toModify(rowData.id);
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
            query() {
                return new Promise((resolve, reject) => {
                    this.requestVO(this.searchInfo, queueManageAPI.selectLabel).then(data => {
                            resolve(data.context);
                        }
                    ).catch(body => {
                            this.$msgInfoErrorCaller(body.stateMsg);
                        }
                    );
                })
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
        }
    }
</script>

<style scoped>
</style>