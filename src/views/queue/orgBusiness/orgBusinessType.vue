<template>
    <div>
        <!-- 查询条件 -->
        <div class="main-top">
            <el-form :inline="true" ref="searchInfo" :model="searchInfo" size="mini" @submit.native.prevent>
                <el-row>
                    <el-form-item :label="$t('queue.queue.label.businessName')" prop="orgBusinessName">
                        <el-input type="text" v-model="searchInfo.orgBusinessName" clearable
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
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="sync" plain>{{$t('queue.common.button.sync')}}</el-button>
            </div>
            <!-- 列表 -->
            <div class="table-container">
                <el-table :data="tableData" border size="mini" v-loading="dataListLoading">
                    <el-table-column type="index" :label="$t('queue.common.label.serialNumber')" align="center" width="50">
                        <template slot-scope="scope">
                            {{(searchInfo.pageNum - 1) * searchInfo.pageSize + scope.$index + 1 }}
                        </template>
                    </el-table-column>
<!--                    <el-table-column prop="orgName" :label="$t('queue.queue.label.org')"></el-table-column>-->
                    <el-table-column prop="orgBusinessName" :label="$t('queue.queue.label.businessName')"></el-table-column>
                    <el-table-column prop="orgBusinessNameList" :label="$t('queue.queue.label.otherBusinessName')"></el-table-column>
                    <el-table-column prop="initialLetter" :label="$t('queue.queue.label.initialLetterList')"></el-table-column>
                    <el-table-column prop="numberLength" :label="$t('queue.queue.label.numberLength')"></el-table-column>
                    <el-table-column prop="customerTypeShow" :label="$t('queue.queue.label.customerType')"></el-table-column>
                    <el-table-column align="center" :label="$t('queue.queue.label.handleTime')" width="105">
                        <template slot-scope="scope">
                            <div v-if="scope.row.enableTime == 'yes'">
                                <el-popover placement="right" trigger="click" >
                                    <el-table :data="scope.row.handleTimeList">
                                        <el-table-column property="week" :label="$t('queue.queue.label.week')"></el-table-column>
                                        <el-table-column property="startTime" :label="$t('queue.queue.label.startTime')" :formatter="formatDate"></el-table-column>
                                        <el-table-column property="endTime" :label="$t('queue.queue.label.endTime')" :formatter="formatDate"></el-table-column>
                                    </el-table>
                                    <el-button slot="reference" size="mini">{{$t('queue.queue.label.part')}}</el-button>
                                </el-popover>
                            </div>
                            <div v-else="scope.row.enableTime == 'no'">
                                <el-button slot="reference" size="mini">{{$t('queue.queue.label.unlimited')}}</el-button>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="enableFlag" :label="$t('queue.queue.label.isEnable')" align="center" width="80">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.enableFlag == '1'" type="success">{{$t('queue.queue.label.yes')}}</el-tag>
                            <el-tag v-else="scope.row.enableFlag == '0'" type="warning">{{$t('queue.queue.label.no')}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('queue.common.label.operation')" width="120px">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="updateHandle(scope.row.id)">{{$t('queue.common.button.edit')}}</el-button>
                            <el-button type="text" size="small" @click="deleteHandle(scope.row)">{{$t('queue.common.button.delete')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <div class="pagination-container">
                <el-pagination background layout="total, prev, pager, next,jumper" :page-size="searchInfo.pageSize"
                               :total="searchInfo.total" @current-change="currentChange"
                               :current-page="searchInfo.pageNum">
                </el-pagination>
            </div>
        </div>

        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update ref="addOrUpdate" @refreshDataList="search"></add-or-update>
        <business-sync ref="BusinessSync" @refreshDataList = "search"></business-sync>
    </div>
</template>

<script>
    import {queueManageAPI} from "../../../api/modules/queueManageAPI";
    import {util} from "@gwi/bi-common";
    import AddOrUpdate from "./orgBusinessType-add-or-update";
    import BusinessSync from "./orgBusinessType-sync"

    export default {
        name: "orgBusinessType",
        data() {
            return {
                // 搜索框的值
                searchInfo: {
                    orgBusinessName: '',
                    pageNum: 1,
                    start: 0,
                    pageSize: 10,
                    total: 0
                },

                param:{
                    id:'',
                    orgId:'',
                },

                tableData: [],
                dataListLoading: false,
            }
        },
        components: {
            AddOrUpdate,
            BusinessSync
        },
        props:[
            'orgId'
        ],
        watch:{
            orgId(val){
                if(val){
                    this.searchInfo.orgId = val;
                    this.search();
                }
            }
        },
        created() {
            this.searchInfo.orgId = this.orgId;
            this.search();
        },
        methods: {
            // 新增 / 修改
            addHandle() {
                this.param.id='';
                this.param.orgId='';
                this.$nextTick(() => {
                    this.param.orgId=this.orgId;
                    console.log(this.param,"param1")
                    this.$refs.addOrUpdate.init(this.param);
                })
            },
            // 同步
            sync(){
                this.$refs.BusinessSync.init(this.orgId);
            },
            updateHandle(id) {
                this.param.id='';
                this.param.orgId='';
                this.$nextTick(() => {
                    this.param.id = id;
                    this.param.orgId=this.orgId;
                    console.log(this.param,"param1")
                    this.$refs.addOrUpdate.init(this.param);
                })
            },
            // 删除
            deleteHandle(row) {
                this.$confirm(this.$t('queue.queue.msg.delete_business_confirm'), this.$t('queue.common.title.delete'), {
                    confirmButtonText: this.$t('queue.common.button.confirm'),
                    cancelButtonText: this.$t('queue.common.button.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.request(queueManageAPI.deleteOrgBusinessType + row.id, {}, "delete").then((data) => {
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
                this.requestVO(this.searchInfo, queueManageAPI.queryOrgBusinessTypePage).then(data => {
                        this.tableData = data.context.list;
                        this.searchInfo.total = data.context.total;
                        this.dataListLoading = false;
                    }
                ).catch(body => {
                        this.dataListLoading = false;
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

            // 格式化日期
            formatDate(row, column, cellValue, index) {
                cellValue = new Date(cellValue);
                return util.dateFormat('HH:mm:ss', cellValue);
            },
        }

    }
</script>

<style lang="scss" scoped>
    .main-top{
        margin: 0 !important;
        border-bottom: #F2F6FC solid 1px;
    }
    .main-top /deep/ .el-form-item__label {
        font-size: 12px !important;
    }
    .main-bottom /deep/ .el-table--mini td, .el-table--mini th {
        padding: 3px 0;
    }
    /deep/.el-table{
        WORD-WRAP: break-word;
        TABLE-LAYOUT: fixed;
        word-break:break-all
    }

</style>
