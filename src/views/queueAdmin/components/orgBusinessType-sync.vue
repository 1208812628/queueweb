<template>
    <el-dialog v-el-drag-dialog :title="$t('queue.queue.title.change_business')"  :visible="dialogTableVisible" width="80%"
               @close="cancelDialog"
               append-to-body top="20px">
        <el-table :data="tableData" highlight-current-row ref="multipleTable" height="300"
                  border center
                  size="mini"
                  v-loading="dataListLoading"
                  row-key="id"
                  @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column type="index" :label="$t('queue.common.label.serialNumber')" align="center" width="50">
                <template slot-scope="scope">
                    {{(searchInfo.pageNum - 1) * searchInfo.pageSize + scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="baseBusinessName" :label="$t('queue.queue.label.otherBusinessName')" show-overflow-tooltip></el-table-column>
            <el-table-column prop="customerTypeShow" :label="$t('queue.queue.label.customerType')" show-overflow-tooltip></el-table-column>
            <el-table-column prop="baseBusinessNameList" :label="$t('queue.queue.label.businessName')" show-overflow-tooltip></el-table-column>
            <el-table-column prop="baseBusinessCode" :label="$t('queue.queue.label.businessCode')" show-overflow-tooltip></el-table-column>
            <el-table-column prop="businessInitialLetter" :label="$t('queue.queue.label.businessLetter')" show-overflow-tooltip></el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
            <el-pagination background layout="total, prev, pager, next,jumper" :page-size="searchInfo.pageSize"
                           :total="searchInfo.total" @current-change="currentChange" :current-page="searchInfo.pageNum">
            </el-pagination>
        </div>
        <div class="dialog-footer" slot="footer">
            <el-button @click="submitDialog" type="primary">{{$t('queue.common.button.submit')}}</el-button>
            <el-button @click="cancelDialog">{{$t('queue.common.button.cancel')}}</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {queueManageAPI} from "../../../api/modules/queueManageAPI";

    export default {
        name: "orgBusinessTypeSync",
        data() {
            return {
                // 搜索框的值
                searchInfo: {
                    orgId: '',
                    baseBusinessName: '',
                    pageNum: 1,
                    start: 0,
                    pageSize: 10,
                    total: 0,
                },
                tableData: [],
                dataListLoading: false,
                dialogTableVisible: false,

                multipleSelection: [], //单机选择行数据
            }
        },
        created() {
        },
        methods: {
            init(orgId) {
                this.dialogTableVisible = true;
                this.searchInfo.orgId = orgId;
                this.$nextTick(() => {
                    this.search();
                });
            },

            query() {
                this.searchInfo.pageNum = 1;
                this.search();
            },
            // 点击查询按钮
            search() {
                this.dataListLoading = true;
                this.requestVO(this.searchInfo, queueManageAPI.selectBaseBusinessTypePage).then(data => {
                        this.tableData = data.context.list;
                        this.searchInfo.total = data.context.total;
                        this.dataListLoading = false;
                        if(this.tableData.length>0){
                            this.$refs.multipleTable.toggleAllSelection();
                        }
                    }
                ).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    }
                )
            },
            // 翻页
            currentChange(val) {
                this.searchInfo.pageNum = val;
                this.search();
            },

            // 提交
            submitDialog() {
                this.$confirm(this.$t('queue.queue.msg.add_business_selection'), this.$t('queue.common.title.tip'), {
                    confirmButtonText: this.$t('queue.common.button.confirm'),
                    cancelButtonText: this.$t('queue.common.button.cancel'),
                    type: 'warning'
                }).then(() => {
                    if(this.multipleSelection.length<1){
                        this.$alert(this.$t('queue.queue.msg.validate_select_business'), this.$t('queue.common.title.tip'), {
                            confirmButtonText: this.$t('queue.common.button.confirm'),
                            type:'warning'
                        });
                        return
                    }
                    let selectList = [];
                    this.multipleSelection.forEach((item)=>{
                        selectList.push(item.id);
                    });
                    let data = {
                        'orgId' : this.searchInfo.orgId,
                        'ids': selectList
                    };
                    this.requestVO(data, queueManageAPI.syncOrgBusinessType).then(body => {
                        this.$message({
                            type: 'success',
                            message: this.$t('queue.common.msg.opateSuccess')
                        });
                        this.$emit('refreshDataList');
                        this.cancelDialog();
                    }).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    });
                }).catch(() => {
                    this.$msgInfoErrorCaller(body.stateMsg);
                });
            },

            cancelDialog(){
                this.dialogTableVisible = false;
                this.$refs.multipleTable.clearSelection();
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
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
</style>

<style>
    .el-table .custom-row {
        background-color: #effaea;
    }
</style>