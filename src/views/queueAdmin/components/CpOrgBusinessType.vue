<template>
    <gwi-ui-list-page-container>
        <gwi-ui-table-view :columns-define="fieldsDefine"
                           :show-columns="showColumns"
                           :column-res="fieldsI18nRes"
                           :dict-res="dictI18nRes"
                           :api-handle="query"
                           :datas.sync="tableData"
                           :params.sync="searchInfo"
                           has-filter
                           ref="Table">
            <el-form slot="filter" :inline="true" :model="searchInfo" size="small">
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="addHandle" plain>
                    {{$t('queue.common.button.add')}}
                </el-button>
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="sync" plain
                           style="margin-right:20px;">
                    {{$t('queue.common.button.sync')}}
                </el-button>
                <el-input v-model="searchInfo.orgBusinessName" placeholder="请输入业务名称" style="width:200px;"/>
            </el-form>
            <template slot-scope="scope" slot="tableAction">
                <gwi-ui-dropButton-group :actions="actions" :row-data="scope.row"
                                         @action-click="actionClick" lang-url="queue.actions.actions">
                </gwi-ui-dropButton-group>
            </template>
        </gwi-ui-table-view>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update ref="addOrUpdate" @refreshDataList="search"></add-or-update>
        <business-sync ref="BusinessSync" @refreshDataList="search"></business-sync>
    </gwi-ui-list-page-container>
</template>

<script>
    import {queueManageAPI} from "../../../api/modules/queueManageAPI";
    import {util} from "@gwi/bi-common";
    import AddOrUpdate from "./orgBusinessType-add-or-update";
    import BusinessSync from "./orgBusinessType-sync";
    import cfgMixin from '../../../mixin/cfgMixin';

    export default {
        name: "orgBusinessType",
        mixins: [cfgMixin],
        props: {
            orgId: {},
            showColumns: {},
            formFieldsDefine: {},
            formShowColumns: {},
            actions: {},
        },
        components: {
            AddOrUpdate,
            BusinessSync
        },
        data() {
            return {
                // 搜索框的值
                searchInfo: {
                    orgBusinessName: '',
                },

                param: {
                    id: '',
                    orgId: '',
                },

                tableData: [],
            }
        },
        watch: {
            orgId(val) {
                if (val) {
                    this.search();
                }
            }
        },
        created() {
        },
        methods: {
            // 新增 / 修改
            addHandle() {
                this.param.id = '';
                this.param.orgId = '';
                this.$nextTick(() => {
                    this.param.orgId = this.orgId;
                    this.$refs.addOrUpdate.init(this.param);
                })
            },
            // 同步
            sync() {
                this.$refs.BusinessSync.init(this.orgId);
            },
            search() {
                this.$refs.Table.refresh();
            },
            // 点击查询按钮
            query() {
                return new Promise((resolve, reject) => {
                    let param = JSON.parse(JSON.stringify(this.searchInfo));
                    param.orgId = this.orgId;
                    this.requestVO(param, queueManageAPI.queryOrgBusinessTypePage).then(data => {
                            console.log("查询结果", data.context);
                            resolve(data.context)
                        }
                    ).catch(body => {
                            this.$msgInfoErrorCaller(body.stateMsg);
                            reject(body.stateMsg);
                        }
                    )
                })
            },
            actionClick({command, rowData}) {
                switch (command) {
                    case 'edit':
                        this.toModify(rowData.id);
                        break;
                    case 'delete':
                        this.toDelete(rowData);
                        break;
                    default:
                        this.toModify(rowData.id)
                }
            },
            // 编辑
            toModify(id) {
                this.param.id = '';
                this.param.orgId = '';
                this.$nextTick(() => {
                    this.param.id = id;
                    this.param.orgId = this.orgId;
                    this.$refs.addOrUpdate.init(this.param);
                })
            },
            // 删除
            toDelete(row) {
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
            // 格式化日期
            formatDate(row, column, cellValue, index) {
                cellValue = new Date(cellValue);
                return util.dateFormat('HH:mm:ss', cellValue);
            },
        }
    }
</script>

<style lang="scss" scoped>
</style>
