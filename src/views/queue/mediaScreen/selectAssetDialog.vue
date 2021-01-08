<template>
    <el-dialog v-el-drag-dialog :title="$t('queue.queue.title.change_asset')"
               :visible="dialogTableVisible" width="80%"
               @close="dialogTableVisible = false" append-to-body top="20px">
        <div class="main-top">
            <el-form :inline="true" ref="searchInfo" :model="searchInfo" size="mini" @submit.native.prevent>
                <el-row>
                    <el-form-item :label="$t('queue.queue.label.deviceType')" prop="typeId">
                        <el-select v-model="searchInfo.typeId" clearable
                                  :placeholder="$t('queue.common.placeholder.selected')">
                            <el-option v-for="item in typeList" :key="item.id" :label="item.typeName"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="query" type="primary">{{$t("queue.common.button.query")}}</el-button>
                        <el-button @click="resetQuery" type="primary">{{$t("queue.common.button.reset")}}</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </div>
        <div class="table-container">
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
                <el-table-column prop="assetNo" :label="$t('queue.queue.label.deviceId')"></el-table-column>
                <el-table-column prop="typeName" :label="$t('queue.queue.label.deviceType')"></el-table-column>
                <el-table-column prop="modelName" :label="$t('queue.queue.label.deviceModel')"></el-table-column>
                <el-table-column prop="brandName" :label="$t('queue.queue.label.deviceBrand')"></el-table-column>
                <el-table-column prop="orgName" :label="$t('queue.queue.label.org')"></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="pagination-container">
                <el-pagination background layout="total, prev, pager, next,jumper" :page-size="searchInfo.pageSize"
                               :total="searchInfo.total" @current-change="currentChange"
                               :current-page="searchInfo.pageNum">
                </el-pagination>
            </div>
            <div class="dialog-footer" slot="footer">
                <el-button @click="submitDialog()" type="primary">{{$t('queue.common.button.submit')}}</el-button>
                <el-button @click="dialogTableVisible = false">{{$t('queue.common.button.cancel')}}</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import {termManageAPI} from "../../../api/modules/termManageAPI";
    import {assetAttrAPI} from "../../../api/modules/assetAttrAPI"; // API接口

    export default {
        name: "selectAssetDialog",
        data() {
            return {
                // 搜索框的值
                searchInfo: {
                    pageNum: 1,
                    start: 0,
                    pageSize: 10,
                    total: 0,
                    typeId: "",
                    adminOrg: "",
                },
                tableData: [],
                typeList: [],
                dataListLoading: false,
                dialogTableVisible: true,
                selectData: {}, //单机选择行数据
            }
        },
        created() {
            this.listType();
        },
        methods: {
            init(orgId) {
                this.dialogTableVisible = true;
                this.searchInfo.adminOrg = orgId;
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
                this.requestVO(this.searchInfo, termManageAPI.queryTermPage).then(data => {
                    this.tableData = data.context.list;
                    this.searchInfo.total = data.context.total;
                    this.dataListLoading = false;
                }).catch(body => {
                    this.$msgInfoErrorCaller(body.stateMsg);
                });
            },
            resetQuery(){
                this.searchInfo.typeId = undefined;
            },
            listType() {
                this.requestPost("-1", assetAttrAPI.listAssetType).then(data => {
                    this.typeList = data.context;
                }).catch(body => {
                    this.$msgInfoErrorCaller(body.stateMsg);
                })
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
            }
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