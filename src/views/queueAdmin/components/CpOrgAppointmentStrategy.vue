<template>
    <div>
        <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane :label="$t('queue.queue.label.takeStrategy')" name="1">
                <div>
                    <el-form :inline="false" ref="dataForm" :model="dataForm" size="small" class="appoint_form"
                             :rules="rule">
                        <el-form-item :label="$t('queue.queue.label.takeLimitCount')" prop="takeCount">
                            <el-input v-model="dataForm.takeCount" maxlength="5"
                                      :placeholder="$t('queue.queue.msg.placeholder_input_take_limit')"></el-input>
                        </el-form-item>
                        <p class="appoint_tip">{{$t('queue.queue.msg.tips_take')}}</p>
                        <el-form-item>
                            <el-row>
                                <el-col :span="4">
                                    <el-button @click="save('dataForm')"
                                               type="primary"
                                               size="small"
                                    >{{$t('queue.common.button.save')}}
                                    </el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-form>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('queue.queue.label.appointStrategy')" name="2">
                <div>
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
                                    <el-form-item>
                                        <el-button size="mini" type="primary" icon="el-icon-plus" @click="addHandle" plain
                                                   style="margin-right:30px;">
                                            {{$t('queue.common.button.add')}}
                                        </el-button>
                                    </el-form-item>
                                    <el-select v-model="searchInfo.orgBusinessId" filterable
                                               size="mini"
                                               placeholder="请选择适用业务" style="width:200px">
                                        <el-option v-for="item in businessData" :key="item.id"
                                                   :label="item.orgBusinessName"
                                                   :value="item.id"></el-option>
                                    </el-select>
                            </el-form>
                            <template slot-scope="scope" slot="tableAction">
                                <gwi-ui-dropButton-group :actions="actions" :row-data="scope.row"
                                                         @action-click="actionClick" lang-url="queue.actions.actions">
                                </gwi-ui-dropButton-group>
                            </template>
                        </gwi-ui-table-view>
                    </gwi-ui-list-page-container>
                </div>
            </el-tab-pane>
        </el-tabs>

        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="search"></add-or-update>

        <!-- 详情 -->
        <detail-info v-show="DetailInfoVisible" ref="DetailInfo"></detail-info>
    </div>
</template>

<script>
    import {queueManageAPI} from "../../../api/modules/queueManageAPI";
    import AddOrUpdate from "./orgAppointmentStrategy-add-or-update";
    import DetailInfo from "./orgAppointmentStrategy-detail";
    import cfgMixin from '../../../mixin/cfgMixin';

    export default {
        name: "CpOrgAppointmentStrategy",
        mixins: [cfgMixin],
        props: {
            orgId: {},
            showColumns: {},
            formFieldsDefine: {},
            formShowColumns: {},
            actions: {},
        },
        data() {
            return {
                // 搜索框的值
                searchInfo: {
                    orgBusinessId: '',
                },

                param: {
                    id: '',
                    orgId: '',
                },

                dataForm: {
                    takeCount: "",
                },

                rule: {
                    takeCount: [
                        {required: true, message: this.$t('queue.queue.msg.validate_notBlank'), trigger: 'blur'}, // 非空验证
                        {
                            pattern: /^(([0-9]*[1-9][0-9]*)|(0+))$/,
                            message: this.$t('queue.queue.msg.validate_enNumber'),
                            trigger: ['blur', 'change']
                        },
                    ],
                },

                tableData: [],
                businessData: [],
                dataListLoading: false,
                OperaImportLogDialogVisible: false,
                addOrUpdateVisible: false,
                importVisible: false,
                DetailInfoVisible: false,
                activeName: "1",
            }
        },
        components: {
            AddOrUpdate,
            DetailInfo,
        },
        watch: {
            orgId(val) {
                if (val) {
                    this.getLimitCount(val);
                    this.search();
                }
            }
        },
        created() {
            this.getLimitCount(this.orgId);
            this.loadInitData();
            this.search()
        },
        methods: {
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dataForm.orgId = this.orgId;
                        this.requestVO(this.dataForm, queueManageAPI.insertOrgLimit).then((data) => {
                            if (data.success) {
                                this.$notify({
                                    title: this.$t('queue.common.title.success'),
                                    message: this.$t('queue.common.msg.edit_success'),
                                    type: 'success'
                                });
                            }
                        }).catch(body => {
                                this.$msgInfoErrorCaller(body.stateMsg);
                            }
                        );
                    } else {
                        this.$msgInfoErrorCaller(this.$t('queue.common.msg.validate_error'));
                        return false;
                    }
                });
            },

            getLimitCount(orgId) {
                this.requestGet(orgId, queueManageAPI.getOrgLimitCount)
                    .then(data => {
                        if (data.context) {
                            this.dataForm = {
                                takeCount: data.context.toString(),
                            };
                            this.$forceUpdate();
                        }
                    })
                    .catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    });
            },

            loadInitData() {
                let data = {
                    orgId: this.orgId
                };
                this.requestVO(data, queueManageAPI.listOrgBusinessType)
                    .then(data => {
                        this.businessData = data.context;
                        console.log('this.businessData:', this.businessData);
                    })
                    .catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    });


            },
            // 新增 / 修改
            addHandle() {
                this.param.id = '';
                this.param.orgId = '';
                this.addOrUpdateVisible = true;
                this.$nextTick(() => {
                    this.param.orgId = this.orgId;
                    this.$refs.addOrUpdate.init(this.param);
                })
            },
            actionClick({command, rowData}) {
                switch (command) {
                    case 'view':
                        this.toDetail(rowData);
                        break;
                    case 'edit':
                        this.toModify(rowData.id);
                        break;
                    case 'delete':
                        this.toDelete(rowData);
                        break;
                    default:
                        this.toDetail(rowData)
                }
            },
            toModify(id) {
                this.param.id = '';
                this.param.orgId = '';
                this.addOrUpdateVisible = true;
                this.$nextTick(() => {
                    this.param.id = id;
                    this.param.orgId = this.orgId
                    this.$refs.addOrUpdate.init(this.param);
                })
            },
            toDetail(row) {
                this.DetailInfoVisible = true;
                this.$nextTick(() => {
                    this.$refs.DetailInfo.init(row.id);
                });
            },
            // 删除
            toDelete(row) {
                this.$confirm(this.$t('queue.queue.msg.delete_business_confirm'), this.$t('queue.common.title.delete'), {
                    confirmButtonText: this.$t('queue.common.button.confirm'),
                    cancelButtonText: this.$t('queue.common.button.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.request(queueManageAPI.deleteOrgAppointmentStrategy + row.id, {}, "delete").then((data) => {
                        if (data && data.success) {
                            this.$message({
                                message: this.$t('queue.common.title.success'),
                                type: 'success',
                                duration: 1500,
                            });
                            this.search();
                        }
                    }).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    })
                })
            },
            search() {
                this.$refs.Table.refresh();
            },
            // 点击查询按钮
            query() {
                let param = JSON.parse(JSON.stringify(this.searchInfo));
                param.orgId = this.orgId;
                return new Promise((resolve, reject) => {
                    this.requestVO(param, queueManageAPI.queryOrgAppointmentStrategyPage).then(data => {
                            resolve(data.context);
                        }
                    ).catch(body => {
                            this.$msgInfoErrorCaller(body.stateMsg);
                            reject(body.stateMsg)
                        }
                    )
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .main-top {
        margin: 0 !important;
        border-bottom: #F2F6FC solid 1px;
    }

    .main-top ::v-deep .el-form-item__label {
        font-size: 12px !important;
    }

    .main-bottom ::v-deep .el-table--mini td, .el-table--mini th {
        padding: 3px 0;
    }

    .el-table .custom-row {
        background-color: #effaea;
    }

    .appoint_form {
        margin-top: 30px;
        margin-left: 50px;
        width: 500px;

        .el-input {
            width: 300px;
        }

        .el-button {
            margin-top: 50px;
        }
    }

    .strategy_tab {
        height: auto;
        flex-direction: column;
        flex-grow: 1;
        box-sizing: border-box;
    }
</style>