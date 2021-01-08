<template>
    <div>
        <el-tabs v-model="activeName" type="border-card"  class="strategy_tab">
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
                                    >{{$t('queue.common.button.save')}}</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-form>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('queue.queue.label.appointStrategy')" name="2">
                <!-- 查询条件 -->
                <div class="main-top">
                    <el-form :inline="true" ref="searchInfo" :model="searchInfo" size="mini">
                        <el-row>
                            <el-form-item :label="$t('queue.queue.label.applyBusiness')" prop="orgBusinessId">
                                <el-select v-model="searchInfo.orgBusinessId" filterable clearable
                                           :placeholder="$t('queue.common.placeholder.selected')">
                                    <el-option v-for="item in businessData" :key="item.id"
                                               :label="item.orgBusinessName"
                                               :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="query" type="primary">{{$t("queue.common.button.query")}}
                                </el-button>
                                <el-button @click="resetQuery" type="primary">{{$t("queue.common.button.reset")}}
                                </el-button>
                            </el-form-item>
                        </el-row>
                    </el-form>
                </div>
                <div class="main-bottom">
                    <div class="btn-container">
                        <el-button size="mini" type="primary" icon="el-icon-plus" @click="addHandle" plain>
                            {{$t('queue.common.button.add')}}
                        </el-button>
                    </div>
                    <!-- 列表 -->
                    <div class="table-container">
                        <el-table :data="tableData" border size="mini" v-loading="dataListLoading">
                            <el-table-column type="index" :label="$t('queue.common.label.serialNumber')"
                                             align="center" width="50">
                                <template slot-scope="scope">
                                    {{(searchInfo.pageNum - 1) * searchInfo.pageSize + scope.$index + 1 }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="businessNameList"
                                             :label="$t('queue.queue.label.applyBusiness')"></el-table-column>
                            <el-table-column prop="startTime"
                                             :label="$t('queue.queue.label.strategyStart')"></el-table-column>
                            <el-table-column prop="endTime"
                                             :label="$t('queue.queue.label.strategyEnd')"></el-table-column>
                            <el-table-column prop="takeTimePeriod"
                                             :label="$t('queue.queue.label.takePeriod')" min-width="100px"></el-table-column>

                            <el-table-column :label="$t('queue.common.label.operation')" min-width="100px">
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" @click="updateHandle(scope.row.id)">
                                        {{$t('queue.common.button.edit')}}
                                    </el-button>
                                    <el-button type="text" size="small" @click="deleteHandle(scope.row)">
                                        {{$t('queue.common.button.delete')}}
                                    </el-button>
                                    <el-button type="text" size="small" @click="detailHandle(scope.row)">
                                        {{$t('queue.common.button.detail')}}
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <!-- 分页 -->
                    <div class="pagination-container">
                        <el-pagination background layout="total, prev, pager, next,jumper"
                                       :page-size="searchInfo.pageSize"
                                       :total="searchInfo.total" @current-change="currentChange"
                                       :current-page="searchInfo.pageNum">
                        </el-pagination>
                    </div>
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

    export default {
        name: "OrgAppointmentStrategy",

        data() {
            return {
                // 搜索框的值
                searchInfo: {
                    orgBusinessId: '',
                    startTime: '',
                    endTime: '',
                    pageNum: 1,
                    start: 0,
                    pageSize: 10,
                    total: 0
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
                        {pattern: /^(([0-9]*[1-9][0-9]*)|(0+))$/, message: this.$t('queue.queue.msg.validate_enNumber'), trigger: ['blur', 'change']},
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
        props: [
            'orgId'
        ],
        watch: {
            orgId(val) {
                if (val) {
                    this.searchInfo.orgId = val;
                    this.getLimitCount(val);
                    this.search();
                }
            }
        },
        created() {
            this.searchInfo.orgId = this.orgId;
            this.getLimitCount(this.orgId);
            this.loadInitData();
            this.search()
        },
        methods: {
            save(formName){
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        this.dataForm.orgId = this.orgId;
                        this.requestVO(this.dataForm,queueManageAPI.insertOrgLimit).then((data)=>{
                            if (data.success) {
                                this.$notify({
                                    title: this.$t('queue.common.title.success'),
                                    message:  this.$t('queue.common.msg.edit_success'),
                                    type: 'success'});
                            }
                        }).catch(body => {
                                this.$msgInfoErrorCaller(body.stateMsg);
                            }
                        );
                    }
                    else{
                        this.$msgInfoErrorCaller(this.$t('queue.common.msg.validate_error'));
                        return false;
                    }
                });
            },

            getLimitCount(orgId) {
                this.requestGet(orgId, queueManageAPI.getOrgLimitCount)
                    .then(data => {
                        if(data.context){
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
            updateHandle(id) {
                this.param.id = '';
                this.param.orgId = '';
                this.addOrUpdateVisible = true;
                this.$nextTick(() => {
                    this.param.id = id;
                    this.param.orgId = this.orgId
                    this.$refs.addOrUpdate.init(this.param);
                })
            },
            detailHandle(row) {
                this.DetailInfoVisible = true;
                this.$nextTick(() => {
                    this.$refs.DetailInfo.init(row.id);
                });
            },
            // 删除
            deleteHandle(row) {
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
            query() {
                this.searchInfo.pageNum = 1;
                this.search();
            },
            // 点击查询按钮
            search() {
                this.dataListLoading = true;
                this.requestVO(this.searchInfo, queueManageAPI.queryOrgAppointmentStrategyPage).then(data => {
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
        margin-left: 50px;
        width: 500px;

        .el-input {
            width: 300px;
        }

        .el-button {
            margin-top: 50px;
        }
    }

    .strategy_tab{
        height: auto;
        flex-direction: column;
        flex-grow: 1;
        box-sizing: border-box;
    }
</style>