<template>
    <gwi-ui-list-page-container>
        <gwi-ui-table-view :columns-define="fieldsDefine"
                           :show-columns="showColumns"
                           lang-url="queue.userType.columns"
                           :column-res="fieldsI18nRes"
                           :dict-res="dictI18nRes"
                           :api-handle="query"
                           :datas.sync="tableData"
                           :params.sync="searchInfo"
                           has-filter>
            <el-form slot="filter" :inline="true" :model="searchInfo" size="small">
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="addHandle" plain style="margin-right:50px;">
                    {{$t('queue.common.button.add')}}</el-button>
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="sync" plain style="margin-right:50px;">
                    {{$t('queue.common.button.sync')}}</el-button>
                <el-input v-model="searchInfo.orgBusinessName" placeholder="请输入业务名称" style="width:200px;"/>
            </el-form>
            <template slot-scope="scope" slot="tableAction">
                <gwi-ui-dropButton-group :actions="actions" :row-data="scope.row"
                                         @action-click="actionClick" lang-url="queue.userType.actions">
                </gwi-ui-dropButton-group>
            </template>
        </gwi-ui-table-view>
        <!-- 弹窗, 新增 / 修改 -->
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update ref="addOrUpdate" @refreshDataList="search"></add-or-update>
        <business-sync ref="BusinessSync" @refreshDataList = "search"></business-sync>
    </gwi-ui-list-page-container>
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
    .main-top ::v-deep .el-form-item__label {
        font-size: 12px !important;
    }
    .main-bottom ::v-deep .el-table--mini td, .el-table--mini th {
        padding: 3px 0;
    }
    ::v-deep .el-table{
        WORD-WRAP: break-word;
        TABLE-LAYOUT: fixed;
        word-break:break-all
    }

</style>
