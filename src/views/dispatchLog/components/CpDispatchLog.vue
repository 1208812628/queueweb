<template>
    <gwi-ui-list-page-container>
        <gwi-ui-table-view :columns-define="fieldsDefine" :show-columns="showColumns"
                           lang-url="queue.dispatchLog.columns" :column-res="fieldsI18nRes" :dict-res="dictI18nRes"
                           :api-handle="query"
                           :datas.sync="tableData" :params.sync="searchInfo" has-filter :has-action="false">
            <el-form slot="filter" :inline="true" :model="searchInfo" size="small">
            </el-form>
            <el-form slot="extendQuery" :inline="true" :model="searchInfo" size="small">
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
                <el-form-item prop="startTime" :label="$t('queue.queue.label.startTime')">
                    <el-date-picker  style="width: 180px"
                                     v-model="searchInfo.startTime"
                                     type="date"
                                     :editable="false" :clearable="false"
                                     value-format="yyyy-MM-dd"
                                     :placeholder="$t('queue.common.placeholder.selected')" >
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="endTime" :label="$t('queue.queue.label.endTime')">
                    <el-date-picker  value-format="yyyy-MM-dd"  style="width: 180px"
                                     v-model="searchInfo.endTime"
                                     type="date"
                                     :editable="false" :clearable="false"
                                     :placeholder="$t('queue.common.placeholder.selected')">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </gwi-ui-table-view>
    </gwi-ui-list-page-container>
</template>

<script>
    import {queueManageAPI} from "../../../api/modules/queueManageAPI"; // API接口
    import store from "@/store"
    import cfgMixin from "../../../mixin/cfgMixin";

    export default {
        name: "CpDispatchLog",
        mixins: [cfgMixin],
        props: {
            showColumns: {},
            formFieldsDefine: {},
            formShowColumns: {},
            actions: {},
        },
        data() {
            return {
                // 搜索框的值
                searchInfo: {
                    orgId: store.getters.userInfo.orgId,
                    startTime: '',
                    endTime: '',
                },
                // 搜索机构树
                searchOrgInfo: {
                    downOrgId: [store.getters.userInfo.orgId]
                },
                // 列表的数据
                tableData: [],
                queueType: [
                    {value: 1, name: this.$t('queue.queue.label.jump')},
                    {value: 2, name: this.$t('queue.queue.label.adjustment')}
                ]
            }
        },
        created() {
            // this.query();
        },
        /* 事件 */
        methods: {
            // 点击查询按钮
            query() {
                if (!this.searchInfo.orgId) {
                    this.searchInfo.orgId = store.getters.userInfo.orgId;
                }
                return new Promise((resolve, reject) => {
                    this.requestVO(this.searchInfo, queueManageAPI.selectLog).then(data => {
                            resolve(data.context)
                        }
                    ).catch(body => {
                            this.$msgInfoErrorCaller(body.stateMsg);
                        }
                    );
                })
            },
            // 搜索框选择机构
            singleSelectComplete(val) {
                this.searchInfo.orgId = val.orgId;
            },
            search(){
                this.$refs.Table.refresh();
            },
        }
    }
</script>

<style scoped>

</style>