<template>
    <div class="gwi-module-container">
        <!-- 查询条件 -->
        <div class="main-top">
            <el-form :inline="true" ref="searchInfo" :model="searchInfo" size="mini">
                <el-row>
                    <el-form-item :label="$t('queue.queue.label.businessCode')" prop="baseBusinessCode">
                        <el-input type="text" v-model="searchInfo.baseBusinessCode" clearable
                                  :placeholder="$t('queue.common.placeholder.input')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('queue.queue.label.businessName')" prop="baseBusinessName">
                        <el-input type="text" v-model="searchInfo.baseBusinessName" clearable
                                  :placeholder="$t('queue.common.placeholder.input')"></el-input>
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
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="addHandle" plain>{{$t('queue.common.button.add')}}</el-button>
            </div>
            <!-- 列表 -->
            <div class="table-container">
                <el-table :data="tableData" border size="mini" v-loading="dataListLoading">
                    <el-table-column type="index" :label="$t('queue.common.label.serialNumber')" align="center" width="50">
                        <template slot-scope="scope">
                            {{(searchInfo.pageNum - 1) * searchInfo.pageSize + scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="baseBusinessName" :label="$t('queue.queue.label.businessName')"></el-table-column>
                    <el-table-column prop="baseBusinessNameList" :label="$t('queue.queue.label.otherBusinessName')"></el-table-column>
                    <el-table-column prop="baseBusinessCode" :label="$t('queue.queue.label.businessCode')"></el-table-column>
                    <el-table-column prop="businessInitialLetter" :label="$t('queue.queue.label.businessLetter')"></el-table-column>
                    <el-table-column prop="numberLength" :label="$t('queue.queue.label.numberLength')"></el-table-column>
                    <el-table-column prop="customerTypeShow" :label="$t('queue.queue.label.customerType')"></el-table-column>
                    <el-table-column :label="$t('queue.common.label.operation')" min-width="100px">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="updateHandle(scope.row.id)">{{$t('queue.common.button.edit')}}</el-button>
                            <el-button type="text" size="small" @click="deleteHandle(scope.row)">{{$t('queue.common.button.delete')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <div class="pagination-container">
                <el-pagination background layout="total, prev, pager, next,jumper" :page-size="searchInfo.pageSize" :total="searchInfo.total" @current-change="currentChange" :current-page="searchInfo.pageNum">
                </el-pagination>
            </div>
        </div>

        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="search" v-bind:update-flag="updateFlag"></add-or-update>

    </div>
</template>

<script>
    import {queueManageAPI} from "../../../api/modules/queueManageAPI";
    import AddOrUpdate from "./baseBusinessType-add-or-update";


    export default {
        name: "baseBusinessType",
        data() {
            return {
                // 搜索框的值
                searchInfo: {
                    baseBusinessCode: '',
                    baseBusinessName: '',
                    pageNum: 1,
                    start: 0,
                    pageSize: 10,
                    total: 0,
                    orderBy: "last_time",
                },
                tableData: [],
                dataListLoading: false,
                OperaImportLogDialogVisible: false,
                addOrUpdateVisible: false,
                importVisible: false,
                DetailInfoVisible: false,
                updateFlag:false,
            }
        },
        components: {
            AddOrUpdate,
        },
        created() {
            this.search()
        },
        methods: {
            // 新增 / 修改
            addHandle() {
                this.updateFlag = false;
                this.addOrUpdateVisible = true;
                this.$nextTick(() => {
                    this.$refs.addOrUpdate.init()
                })
            },
            updateHandle(id) {
                this.updateFlag = true;
                this.addOrUpdateVisible = true;
                this.$nextTick(() => {
                    this.$refs.addOrUpdate.init(id)
                })
            },
            // 删除
            deleteHandle(row) {
                this.$confirm(this.$t('queue.queue.msg.delete_business_confirm'), this.$t('queue.common.title.delete'), {
                    confirmButtonText: this.$t('queue.common.button.confirm'),
                    cancelButtonText: this.$t('queue.common.button.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.request(queueManageAPI.deleteBaseBusinessType + row.id, {}, "delete").then((data) => {
                        if (data && data.success) {
                            this.$message({
                                message: this.$t('queue.common.title.success'),
                                type: 'success',
                            });
                            this.search();
                        }
                    }).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    })
                })
            },
            query() {
                this.searchInfo.pageNum = 1;
                this.search();
            },
            // 点击查询按钮
            search() {
                this.dataListLoading = true;
                this.requestVO(this.searchInfo, queueManageAPI.queryBaseBusinessTypePage).then(data => {
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
                this.searchInfo.pageNum = val;
                this.search();
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