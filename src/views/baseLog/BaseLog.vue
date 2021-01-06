<template>
    <div class="gwi-module-container">
        <div class="main-top">
            <el-form :inline="true" ref="searchInfo" :model="searchInfo" size="mini">
                <el-row>
                    <el-form-item prop="orgId" :label="$t('queue.queue.label.orgId')">
                        <single-select-org-tree v-model="searchInfo.orgId" :searchOrgInfo="searchOrgInfo"  style="width: 180px"
                                                @orgComplete="singleSelectComplete"
                                                size="mini"></single-select-org-tree>
                    </el-form-item>
                    <el-form-item prop="queueType" :label="$t('queue.queue.label.queueType')">
                        <el-select v-model="searchInfo.queueType" size="mini" type="primary" style="width: 180px">
                            <el-option :value="coupon.value" :label="coupon.name" v-for="coupon in queueType" :key="coupon.value"
                                       :placeholder="$t('queue.common.placeholder.selected')" filterable clearable></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('queue.queue.label.startTime')" prop="startTime">
                        <el-date-picker  style="width: 180px"
                                v-model="searchInfo.startTime"
                                type="date"
                                :editable="false" :clearable="false"
                                value-format="yyyy-MM-dd"
                                :placeholder="$t('queue.common.placeholder.selected')" >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item :label="$t('queue.queue.label.endTime')" prop="endTime">
                        <el-date-picker  value-format="yyyy-MM-dd"  style="width: 180px"
                                         v-model="searchInfo.endTime"
                                         type="date"
                                         :editable="false" :clearable="false"
                                         :placeholder="$t('queue.common.placeholder.selected')">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="query" type="primary">{{$t("queue.common.button.query")}}</el-button>
                        <el-button @click="resetQuery" type="primary">{{$t("queue.common.button.reset")}}</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </div>
        <div class="main-bottom">
            <!-- 列表 -->
            <div class="table-container">
                <el-table :data="tableData" border size="mini" v-loading="loading" :element-loading-text="$t('queue.queue.msg.load')">
                    <el-table-column type="index" :label="$t('queue.common.label.serialNumber')" :index="tableIndex" align="center" width="50">
                    </el-table-column>
                    <el-table-column prop="orgName" :label="$t('queue.queue.label.orgId')" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="queueNum" :label="$t('queue.queue.label.queueNum')" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="takeTime" :label="$t('queue.queue.label.takeTime')" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="customerName" :label="$t('queue.queue.label.customerName')" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="customerTypeName" :label="$t('queue.queue.label.customerType')" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="queueType" :label="$t('queue.queue.label.queueType')" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div v-if="scope.row.queueType=='1'">{{$t('queue.queue.label.jump')}}</div>
                            <div v-else>{{$t('queue.queue.label.adjustment')}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operatorName" :label="$t('queue.queue.label.operator')" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="operatorTime" :label="$t('queue.queue.label.operatorTime')" show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <div class="pagination-container">
                <el-pagination background layout="total, prev, pager, next,jumper" :page-size="searchInfo.pageSize" :total="searchInfo.total"
                               @current-change="currentChange" :current-page="searchInfo.pageNum">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import {queueManageAPI} from "../../../api/modules/queueManageAPI"; // API接口

    export default {
        name: "BaseLog",
        data() {
            return {
                // 搜索框的值
                searchInfo: {
                    orgId: this.store.getters.userInfo.orgId,
                    queueType:'',
                    startTime: '',
                    endTime: '',
                    pageNum: 1,
                    start: 0,
                    pageSize: 10,
                    total: 0
                },
                // 搜索机构树
                searchOrgInfo: {
                    downOrgId: [this.store.getters.userInfo.orgId]
                },
                // 列表的数据
                tableData: [],
                queueType:[
                    {value:1, name:this.$t('queue.queue.label.jump')},
                    {value:2, name:this.$t('queue.queue.label.adjustment')}
                ]
            }
        },
        created() {
            this.query();
        },
        /* 事件 */
        methods: {
            query() {
                this.searchInfo.pageNum = 1;
                this.search();
            },
            resetQuery(){
                this.searchInfo.orgId = this.store.getters.userInfo.orgId;
                this.searchInfo.queueType = undefined;
                this.searchInfo.startTime = undefined;
                this.searchInfo.endTime = undefined;
            },
            // 点击查询按钮
            search() {
                this.loading=true;
                if(!this.searchInfo.orgId){
                    this.searchInfo.orgId = this.store.getters.userInfo.orgId;
                }
                this.requestVO(this.searchInfo, queueManageAPI.selectLog).then(data => {
                        this.loading=false;
                        this.tableData = data.context.list;
                        this.searchInfo.total = data.context.total;
                    }
                ).catch(body => {
                        this.loading=false;
                        this.$msgInfoErrorCaller(body.stateMsg);
                    }
                );
            },
            // 翻页
            currentChange(val) {
                this.searchInfo.pageNum = val;
                this.search();
            },
            // 数据表序号
            tableIndex(index) {
                let page = this.searchInfo.pageNum;
                let limit = this.searchInfo.pageSize;
                return (page - 1) * limit + index + 1;
            },
            // 搜索框选择机构
            singleSelectComplete(val) {
                this.searchInfo.orgId = val.orgId;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .main-top /deep/ .el-form-item__label {
        font-size: 12px !important;
    }

    .main-bottom /deep/ .el-table--mini td, .el-table--mini th {
        padding: 3px 0;
    }

</style>