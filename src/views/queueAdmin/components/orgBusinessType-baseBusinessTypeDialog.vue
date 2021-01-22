<template>
    <el-dialog v-el-drag-dialog :title="$t('queue.queue.title.change_business')"  :visible="dialogTableVisible" width="80%"
               @close="dialogTableVisible = false"
               append-to-body top="20px">
        <el-form :inline="true" ref="searchInfo" :model="searchInfo" size="mini">
            <el-row>
                <el-form-item :label="$t('queue.queue.label.businessName')" prop="baseBusinessName">
                    <el-input type="text" v-model="searchInfo.baseBusinessName"
                              :placeholder="$t('queue.common.placeholder.input')"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="query" type="primary">{{$t("queue.common.button.query")}}</el-button>
                    <el-button @click="resetQuery" type="primary">{{$t("queue.common.button.reset")}}</el-button>
                </el-form-item>
            </el-row>
        </el-form>

        <el-table :data="tableData" highlight-current-row ref="table" height="300"
                  border center
                  size="mini"
                  v-loading="dataListLoading"
                  row-key="id"
                  @current-change="handleSelectionChange">
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
            <el-button @click="submitDialog()" type="primary">{{$t('queue.common.button.submit')}}</el-button>
            <el-button @click="dialogTableVisible = false">{{$t('queue.common.button.cancel')}}</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {queueManageAPI} from "../../../api/modules/queueManageAPI";


    export default {
        name: "orgBusinessTypeBaseBusinessTypeDialog",
        data() {
            return {
                // 搜索框的值
                searchInfo: {
                    orgId: '',
                    baseBusinessCode: '',
                    baseBusinessName: '',
                    pageNum: 1,
                    start: 0,
                    pageSize: 10,
                    total: 0,
                    orderBy: "base_business_name",
                    order: "asc"
                },
                tableData: [],
                dataListLoading: false,
                dialogTableVisible: false,

                selectData: {}, //单机选择行数据
            }
        },
        components: {},
        created() {
        },
        methods: {

            init(orgId) {
                this.searchInfo.baseBusinessName = undefined;
                this.searchInfo.orgId = orgId;
                this.selectData = {};
                this.dialogTableVisible = true;
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
                    }
                ).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    }
                )
            },
            resetQuery() {
                this.$refs["searchInfo"].resetFields();
            },
            // 翻页
            currentChange(val) {
                console.log('当前页:', val);
                this.searchInfo.pageNum = val;
                this.search();
            },


            // val表示选中的表格行数据
            handleSelectionChange(val) {
                this.selectData = val;
                console.log(this.selectData);
            },

            submitDialog() {
                this.$emit('submitComplete', this.selectData);
                this.dialogTableVisible = false;
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