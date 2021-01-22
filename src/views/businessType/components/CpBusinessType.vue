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
                           has-filter
                           ref="Table">
            <el-form slot="filter" :inline="true" :model="searchInfo" size="small">
                <el-button size="small" type="primary" icon="el-icon-plus" @click="addHandle" style="margin-right: 20px">
                    新增
                </el-button>
                <el-input v-model="searchInfo.baseBusinessCode" placeholder="请输入业务编号" style="width:200px;"/>
                <el-input v-model="searchInfo.baseBusinessName" placeholder="请输入业务名称" style="width:200px;"/>
            </el-form>
            <template slot-scope="scope" slot="tableAction">
                <gwi-ui-dropButton-group :actions="actions" :row-data="scope.row"
                                         @action-click="actionClick" lang-url="queue.userType.actions">
                </gwi-ui-dropButton-group>
            </template>
        </gwi-ui-table-view>
        <!-- 弹窗, 新增 / 修改 -->
        <cp-business-type-dialog v-if="addOrUpdateVisible" ref="addOrUpdate"
                                 @refreshDataList="search" v-bind:update-flag="updateFlag"/>
    </gwi-ui-list-page-container>
</template>

<script>
    import {queueManageAPI} from "../../../api/modules/queueManageAPI";
    import CpBusinessTypeDialog from "./CpBusinessTypeDialog";
    import cfgMixin from "../../mixin/cfgMixin";


    export default {
        name: "baseBusinessType",
        mixins: [cfgMixin],
        props: {
            showColumns: {},
            formFieldsDefine: {},
            formShowColumns: {},
            actions: {},
        },
        components: {
            CpBusinessTypeDialog,
        },
        data() {
            return {
                // 搜索框的值
                searchInfo: {
                    baseBusinessCode: '',
                    baseBusinessName: '',
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
        created() {
            // this.search()
        },
        methods: {
            actionClick({command, rowData}) {
                switch (command) {
                    case 'edit':
                        this.updateHandle(rowData.id);
                        break;
                    case 'delete':
                        this.deleteHandle(rowData);
                        break;
                    default:
                        this.updateHandle(rowData.id)
                }
            },
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
                return new Promise(((resolve, reject) => {
                    this.requestVO(this.searchInfo, queueManageAPI.queryBaseBusinessTypePage).then(data => {
                            resolve(data.context)
                        }
                    ).catch(body => {
                            this.$msgInfoErrorCaller(body.stateMsg);
                        }
                    )
                }))
            },
            search(){
                this.$refs.Table.refresh();
            },
        }

    }
</script>