<template>
    <div class="gwi-module-container">
        <!-- 查询条件 -->
        <div class="main-top">
            <el-form :inline="true" ref="searchInfo" :model="searchInfo" size="mini">
                <el-form-item :label="$t('queue.queue.label.customerCode')" prop="customerCode">
                    <el-input type="text" v-model="searchInfo.customerCode" name="customerCode" maxlength="30" minlength="1"
                              :placeholder="$t('queue.common.placeholder.input')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('queue.queue.label.customerName')" prop="customerName">
                    <el-input type="text" v-model="searchInfo.customerName" name="customerName" maxlength="30" minlength="1"
                              :placeholder="$t('queue.common.placeholder.input')"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="query" type="primary">{{$t("queue.common.button.query")}}</el-button>
                    <el-button @click="resetQuery" type="primary">{{$t("queue.common.button.reset")}}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="main-bottom">
            <div class="btn-container">
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="toAdd" plain>{{$t('queue.common.button.add')}}</el-button>
<!--                <el-button size="mini" type="primary" icon="el-icon-plus" @click="toDown" plain>{{$t('queue.common.button.template')}}</el-button>-->
<!--                <el-button size="mini" type="primary" icon="el-icon-plus" @click="toImport" plain>{{$t('queue.common.button.import')}}</el-button>-->
            </div>
            <!-- 列表 -->
            <div class="table-container">
                <el-table :data="tableData" border size="mini" v-loading="loading" :element-loading-text="$t('queue.queue.msg.load')">
                    <el-table-column type="index" :label="$t('queue.common.label.serialNumber')" :index="tableIndex" align="center" width="50">
                    </el-table-column>
                    <el-table-column prop="customerCode" :label="$t('queue.queue.label.customerCode')" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerName" :label="$t('queue.queue.label.customerName')" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerTypeName" :label="$t('queue.queue.label.customerType')" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="accountManager" :label="$t('queue.queue.label.accountManager')" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="accountManagerPhone" :label="$t('queue.queue.label.accountManagerPhone')" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createrText" :label="$t('queue.queue.label.importPeople')" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createTime" :label="$t('queue.queue.label.importTime')" show-overflow-tooltip></el-table-column>
                    <el-table-column :label="$t('queue.common.label.operation')" fixed="right" width="120">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="toModify(scope.row.id)" >{{$t('queue.common.button.edit')}}</el-button>
                            <el-button type="text" size="small" @click="doDelete(scope.row, scope.$index)" >{{$t('queue.common.button.delete')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <div class="pagination-container">
                <el-pagination background layout="total, prev, pager, next,jumper" :page-size="searchInfo.pageSize"
                               :total="searchInfo.total"
                               @current-change="currentChange" :current-page="searchInfo.pageNum">
                </el-pagination>
            </div>
        </div>

        <el-dialog
                :title="$t('queue.queue.title.customer_import')"
                :close-on-click-modal="false"
                :append-to-body="true"
                class="gwi-dialog"
                :visible.sync="importFormVisible">
            <el-form size="mini" label-width="120px">
                <el-form-item :label="$t('queue.common.label.upload')">
                    <gwi-upload
                            :action="uploadUrl"
                            :auto-upload="false"
                            :down-url="downUrl"
                            :headers="heads"
                            :file-list="fileList"
                            ref="upload"
                            :size="10"
                            :limit="1"
                            path="version"
                            accept=".xlsx,.xls"
                            @uploadComplete="uploadComplete">
                    </gwi-upload>
                </el-form-item>
                <div>{{$t("queue.queue.msg.import")}}</div>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="dialogImportClose">{{$t("queue.common.button.cancel")}}</el-button>
              <el-button size="mini" type="primary" @click="submitUpload">{{$t("queue.common.button.submit")}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="50%" @close="dialogClose"
                   class="gwi-dialog" center v-el-drag-dialog :close-on-click-modal="false" :append-to-body="true">
            <el-form :inline="false" :model="dialogFormInfo" ref="dialogFormInfo" :rules="dialogRules"
                     :status-icon="true" :inline-message="true" label-position="right" label-width="145px"
                     size="mini" class="dialog-form">
                <el-form-item :label="$t('queue.queue.label.customerCode')" prop="customerCode">
                    <el-input type="text" v-model="dialogFormInfo.customerCode"
                              name="customerCode" maxlength="30" minlength="1" clearable
                              :placeholder="$t('queue.common.placeholder.input')"
                              :disabled="dialogUpdateFlag"></el-input>
                </el-form-item>
                <el-form-item :label="$t('queue.queue.label.customerName')" prop="customerName">
                    <el-input type="text" v-model="dialogFormInfo.customerName"
                              name="customerName" maxlength="30" minlength="1" clearable
                              :placeholder="$t('queue.common.placeholder.input')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('queue.queue.label.customerType')" prop="customerTypeCode">
                    <el-select v-model="dialogFormInfo.customerTypeCode"
                            filterable clearable
                            :placeholder="$t('queue.common.placeholder.selected')">
                        <el-option v-for="item in customerList"
                                   :key="item.factorCode"
                                   :label="item.factorName"
                                   :value="item.factorCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('queue.queue.label.accountManager')" prop="accountManager">
                    <el-input type="text" v-model="dialogFormInfo.accountManager"
                              name="accountManager" maxlength="30" minlength="1" clearable
                              :placeholder="$t('queue.common.placeholder.input')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('queue.queue.label.accountManagerPhone')" prop="accountManagerPhone">
                    <el-input type="text" v-model="dialogFormInfo.accountManagerPhone"
                              name="accountManagerPhone" maxlength="30" minlength="1" clearable
                              :placeholder="$t('queue.common.placeholder.input')"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogClose">{{$t('queue.common.button.cancel')}}</el-button>
                <el-button @click="submitDialog('dialogFormInfo')" type="primary">{{$t('queue.common.button.submit')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    // import OperaImportLogDialog from "../../systemSetting/base/operaBaseImportlog-dialog";
    import {queueManageAPI} from "../../../api/modules/queueManageAPI"; // API接口
    import store from "@/store";
    // import i18nMgr from '../../../api/system/common/i18n.js';

    export default {
        name: "CustomerInfo",
        // components: {
        //     OperaImportLogDialog
        // },
        data() {
            return {
                // curLang:i18nMgr.getCurLang(),
                // 搜索框的值
                searchInfo: {
                    customerCode: null,
                    customerName: null,
                    pageNum: 1,
                    start: 0,
                    pageSize: 10,
                    total: 0
                },
                dataForm: {},
                // 列表的数据
                tableData: [],
                customerList: [],
                fileList: [],
                loading: false,
                dialogUpdateFlag: false,
                importFormVisible:false,
                importLogDialogVisible:false,
                downUrl: this.serverConfig().apiUrl + queueManageAPI.downTemplate,
                uploadUrl: this.serverConfig().apiUrl + queueManageAPI.importCustomer,
                heads: {// 文件上传头部
                    "Authorization": "Bearer " + store.getters.token.access_token,
                    "Content-Type": "application/json",
                    // "locale": i18nMgr.getCurLang(),
                },
                dialogFormVisible: false, // 是否显示和隐藏弹出框
                dialogFormInfo:{},
                dialogTitle: '',
                dialogRules: { // 表单规则验证规则
                    customerCode: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'}, // 非空验证
                    ],
                    customerName: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'}, // 非空验证
                    ],
                    customerTypeCode: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'change'}, // 非空验证
                    ],
                    // accountManager: [
                    //     {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'},
                    // ],
                    accountManagerPhone: [
                        // {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'},
                        {pattern: /^[0-9]+$/, message: this.$t('queue.queue.msg.validate_enNumber'), trigger: 'blur'}
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
            }
        },
        created() {
            this.query();
            this.loadInitData();
        },
        /* 事件 */
        methods: {
            loadInitData() {
                this.requestGet("", queueManageAPI.selectUserTypeList).then(data => {
                        this.customerList = data.context;
                    }
                ).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    }
                );
            },
            query() {
                this.searchInfo.pageNum = 1;
                this.search();
            },
            // 点击查询按钮
            search() {
                this.loading = true;
                this.requestVO(this.searchInfo, queueManageAPI.queryCustomerLevelPage).then(data => {
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
            // 重置按钮
            resetQuery() {
                this.searchInfo.customerCode = undefined;
                this.searchInfo.customerName = undefined;
            },
            // 导入模板下载
            toDown(){
                let url = this.serverConfig().apiUrl + queueManageAPI.downTemplate;
                this.downloadExcel(url, undefined, this.$t('queue.queue.title.customer_import')+".xls",);
            },
            // 导入
            toImport(){
                this.importFormVisible = true;
            },
            // 新增
            toAdd(){
                this.dialogFormInfo = {};
                this.dialogTitle = this.$t('queue.queue.title.add_customer');
                this.dialogUpdateFlag = false;
                this.dialogFormVisible=true;
            },
            // 编辑
            toModify(id) {
                this.dialogTitle = this.$t('queue.queue.title.edit_customer');
                this.dialogFormVisible = true;
                this.dialogUpdateFlag = true;
                this.requestGet(id, queueManageAPI.getCustomerLevelDetail).then(data => {
                    this.dialogFormInfo = data.context;
                }).catch(body => {
                    this.$msgInfoErrorCaller(body.stateMsg);
                })
            },
            // 删除
            doDelete(row, index) {
                this.$confirm(this.$t('queue.queue.msg.delete_customer_confirm'), this.$t('queue.common.title.delete'), {
                    confirmButtonText: this.$t('queue.common.button.confirm'),
                    cancelButtonText: this.$t('queue.common.button.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.requestGet(row.id, queueManageAPI.deleteCustomerLevel).then(body => {
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
            // 提交申请
            submitDialog(form){
                this.$refs[form].validate((valid)=>{
                    if(valid){
                        let url = this.dialogUpdateFlag?queueManageAPI.updateCustomerLevel:queueManageAPI.insertCustomerLevel;
                        this.showLoading();
                        this.requestVO(this.dialogFormInfo,url).then(body=>{
                            this.hideLoading();
                            this.$notify({
                                title: this.$t('queue.common.title.success'),
                                message:  this.$t('queue.common.msg.submit_success'),
                                type: 'success'});
                            this.dialogFormInfo = {};
                            this.dialogFormVisible = false;
                            this.search();
                        }).catch(body => {
                            this.hideLoading();
                            this.$msgInfoErrorCaller(body.stateMsg);
                        })
                    }
                })
            },
            // 导入
            uploadComplete(obj) {
                console.log(obj);
                if(!obj){
                    this.$message({
                        message: this.$t('queue.common.msg.fileSelect'),
                        type: 'warning',
                        duration: 3000,
                    });
                    return;
                }
                if(obj.uploadFiles){
                    if(obj.uploadFiles.length<1){
                        this.$message({
                            message: this.$t('queue.common.msg.fileSelect'),
                            type: 'warning',
                            duration: 3000,
                        })
                    }
                    return;
                }
                let res = obj.file.response;
                if (!res) { //文件上传组件存在bug，单个上传会返回两次
                    return;
                }

                if (res.success) {
                    this.$message({
                        message: this.$t('queue.common.msg.upload_success'),
                        type: 'success',
                        duration: 3000,
                        onClose: () => {
                            this.search();
                            this.$refs.upload.clearFiles();
                        }
                    })
                } else {
                    this.$message({
                        message: res.stateMsg,
                        type: 'warning'
                    });
                    setTimeout(() => {
                    }, 2000);
                }
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            dialogClose( ){
                this.fileList = [];
                this.dialogFormVisible = false;
            },
            dialogImportClose () {
                this.fileList = [];
                this.importFormVisible = false;
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

    .main-bottom ::v-deep .demo-table-expand {
        font-size: 0;
    }

    .main-bottom ::v-deep .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .main-bottom ::v-deep .demo-table-expand .el-form-item {
        padding-left: 10px;
        margin-right: 0;
        margin-bottom: 0;
        width: 25%;
    }

    .gwi-dialog {
        .el-dialog__title {
            color: #fff;
        }

        .el-form-item--mini {
            width: 100%;
        }

        .el-input--mini {
            width: 90%;
        }

        .el-select--mini {
            width: 90%;
        }
    }
</style>