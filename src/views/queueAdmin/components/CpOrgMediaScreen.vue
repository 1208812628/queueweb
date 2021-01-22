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
            <el-form slot="filter" :inline="true" size="small">
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="addHandle" plain style="margin-right:50px;">
                    {{$t('queue.common.button.add')}}</el-button>
            </el-form>
            <template slot-scope="scope" slot="tableAction">
                <gwi-ui-dropButton-group :actions="actions" :row-data="scope.row"
                                         @action-click="actionClick" lang-url="queue.userType.actions">
                </gwi-ui-dropButton-group>
            </template>
        </gwi-ui-table-view>
        <!-- 添加修改 --->
        <el-dialog v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="1000px"
                   @close="dialogClose" class="gwi-dialog" center :append-to-body="true"
                   :close-on-click-modal="isDetail">
            <el-form :inline="false" :model="dialogFormInfo" ref="dialogFormInfo"
                     :status-icon="true" :inline-message="true" label-position="right" label-width="120px"
                     size="mini" class="dialog-form">
                <el-form-item :label="$t('queue.queue.label.mediaScreenName')">
                    <el-input type="text" v-model="dialogFormInfo.mediaScreenName" maxlength="20" minlength="1"
                              :placeholder="$t('queue.common.placeholder.input')"/>
                </el-form-item>

                <el-form-item :label="$t('queue.queue.label.deviceId')" style="text-align: left">
                    <el-input :placeholder="$t('queue.queue.msg.placeholder_select_asset')"
                              v-model="dialogFormInfo.assetId"
                              @click="selectToAsset"
                              class="input-with-select"
                              readonly
                              disabled style="width:300px">
                        <el-button slot="append"
                                   type="primary"
                                   icon="el-icon-search"
                                   @click="selectToAsset"
                                   :disabled="buttonDisabled">
                        </el-button>
                    </el-input>
                </el-form-item>

                <el-form-item :label="$t('queue.queue.label.mediaScreenContext')">
                    <div class="btn-container">
                        <el-button size="mini" type="primary" @click="toAddRule" icon="el-icon-plus" v-if="!isDetail" plain>{{$t('queue.common.button.add')}}</el-button>
                    </div>

                    <div class="btn-container">
                        示例: 请{queueNum}到{windowCode}号窗口办理业务
                    </div>
                    <div class="btn-container">
                        example: please{queueNum}go to window{windowCode}service
                    </div>

                    <el-row v-for="(item, index) in selectedRules">
                        <el-col :span="4">
                            <el-select-dict v-model="item.language"
                                            :key="item.language"
                                            code="language"
                                            app-id="manage-queue"
                                            :placeholder="$t('queue.queue.msg.placeholder_select_language')">
                            </el-select-dict>
                        </el-col>
                        <el-col :span="19">
                            <el-input type="text" v-model="item.context" maxlength="200" @input="change($event,index)"
                                      minlength="1"/>
                        </el-col>
                        <el-col :span="1">
                            <el-button type="danger" icon="el-icon-delete" @click="toDelRule(index)" v-if="!isDetail"
                                       circle/>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="">
                    {{$t('queue.queue.msg.screenDescription')}}
                </el-form-item>

                <el-form-item :label="$t('queue.queue.label.isEnable')">
                    <el-switch v-model="dialogFormInfo.mediaScreenEnable" :active-value="1" :inactive-value="0"/>
                </el-form-item>

            </el-form>

            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogClose">{{$t('queue.common.button.cancel')}}</el-button>
                <el-button @click="submitDialog('dialogFormInfo')" type="primary" v-if="!isDetail">
                    {{$t('queue.common.button.submit')}}
                </el-button>
            </div>

            <select-asset-dialog ref="selectAssetDialog" v-if="selectAssetVisible" @submitComplete="submitAssetComplete"></select-asset-dialog>

        </el-dialog>
    </gwi-ui-list-page-container>


    <div>
        <div class="bottom-container">
            <div class="main-bottom">
                <div class="btn-container">
                    <el-button size="mini" type="primary" @click="toAdd" icon="el-icon-plus" plain>
                        {{$t('queue.common.button.add')}}
                    </el-button>
                </div>
                <div class="table-container">
                    <el-table :data="tableData" border size="mini" :empty-text="emptyText" @row-dblclick="rowDblclick" v-loading="dataListLoading">
                        <el-table-column type="index" :label="$t('queue.common.label.serialNumber')" :index="tableIndex" align="center" width="50"/>
                        <el-table-column prop="mediaScreenName" :label="$t('queue.queue.label.mediaScreenName')" min-width="150"/>
                        <el-table-column prop="mediaScreenContext" :label="$t('queue.queue.label.mediaScreenContext')" min-width="600"/>
                        <el-table-column prop="mediaScreenEnable" :label="$t('queue.queue.label.enableState')" :formatter="formatterEnable" width="100"/>
                        <el-table-column width="150" :label="$t('queue.common.label.operation')">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="toDetail(scope.row)">{{$t('queue.common.button.detail')}}
                                </el-button>
                                <el-button type="text" size="small" @click="toModify(scope.row.id)">{{$t('queue.common.button.edit')}}
                                </el-button>
                                <el-button type="text" size="small" @click="del(scope.row, scope.$index)">{{$t('queue.common.button.delete')}}
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination-container">
                    <el-pagination background layout="total, prev, pager, next, jumper"
                                   :page-size="pageInfo.pageSize"
                                   :total="pageInfo.total"
                                   :current-page="pageInfo.pageNum"
                                   @current-change="currentChange">
                    </el-pagination>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
    import {mediaScreenAPI} from "../../../api/modules/mediaScreenAPI";
    import topic from "../../../api/modules/topic";
    import SelectAssetDialog from "./selectAssetDialog";
    import cfgMixin from '../../mixin/cfgMixin';

    export default {
        name: "mediaScreenMange",
        mixins: [cfgMixin],
        data() {
            return {
                emptyText: this.$t('queue.common.list.dataNull'),
                tableData: [],// 列表的数据
                dataListLoading: false,
                pageInfo: {
                    pageNum: 1,
                    start: 0,
                    pageSize: 10,
                    total: 0
                },
                languages: [],
                selectedRules: [{
                    language: "",
                    context: ""
                }],
                // 列表分页
                dialogFormInfo: {},
                dialogFormVisible: false, // 是否显示和隐藏弹出框
                dialogUpdateFlag: true, // true 编辑  false: 添加
                dialogTitle: '',// 弹出窗口的标题
                isDetail: false,  // 是否查看详情
                selectAssetVisible: false,
                buttonDisabled: false
            }
        },
        props: {
            orgId: {},
            showColumns: {},
            formFieldsDefine: {},
            formShowColumns: {},
            actions: {},
        },
        watch: {
            orgId(val) {
                if (val) {
                    this.pageInfo.orgId = val;
                    this.queryMediaScreenList();
                }
            }
        },
        created() {
            this.pageInfo.orgId = this.orgId;
            this.request(topic.businessUserTopic + "/dict/listDictItem", {"typeCode": "languageCode"}, "post").then(data => {
                this.languages = data.context;
            })
            this.queryMediaScreenList();
        },
        components: {
            SelectAssetDialog
        },
        methods: {
            selectToAsset() {
                this.selectAssetVisible = true;
                this.$nextTick(() => {
                    console.log(this.$refs.selectAssetDialog)
                    this.$refs.selectAssetDialog.init(this.orgId);
                })
            },

            /* 弹出框提交后回调函数，需要在此处理关闭弹出框操作 */
            submitAssetComplete(val) {
                console.log("回调:" + JSON.stringify(val));
                this.dialogFormInfo.assetId = val.assetNo;
            },

            // 格式化启用状态
            formatterEnable(row, column, cellValue, index) {
                if (cellValue == 1) {
                    return this.$t('queue.queue.label.enable');
                } else {
                    return this.$t('queue.queue.label.disable');
                }
            },

            // 格式化启用状态
            change(val, index) {
                console.log("---------------" + val);
                console.log("+++++++++++++++" + index);
                this.selectedRules[index].context = val;
                console.log("===============" + this.selectedRules[index].context);
                // this.$forceUpdate();
            },

            // 查询媒体多媒体大屏列表
            queryMediaScreenList() {
                this.dataListLoading = true;
                this.requestVO(this.pageInfo, mediaScreenAPI.queryMediaScreenListPage).then(data => {
                    let context = data.context;
                    this.tableData = context.list;
                    this.pageInfo.total = context.total;
                    this.dataListLoading = false;
                }).catch(body => {
                    this.dataListLoading = false;
                    this.$msgInfoErrorCaller(body.stateMsg);
                })
            },

            // 翻页
            currentChange(val) {
                console.log('当前页:', val);
                this.pageInfo.pageNum = val;
                this.queryMediaScreenList();
            },

            // 数据表序号
            tableIndex(index) {
                let page = this.pageInfo.pageNum;
                let limit = this.pageInfo.pageSize;
                return (page - 1) * limit + index + 1;
            },

            // 关闭弹出框
            dialogClose() {
                this.dialogFormInfo = {};
                this.dialogFormVisible = false;
                this.selectedRules = [{
                    language: "",
                    context: ""
                }]
            },

            // 添加多媒体大屏
            toAdd() {
                this.isDetail = false;
                this.dialogUpdateFlag = false;
                this.dialogFormVisible = true;
                this.dialogTitle = this.$t('queue.queue.title.add_mediaScreen');
                this.dialogFormInfo = {
                    orgId: this.orgId,
                    mediaScreenName: "",
                    assetId: "",
                    mediaScreenEnable: 1
                }
            },

            // 添加规则
            toAddRule() {
                if (this.selectedRules.length >= 3) {
                    this.$msgInfoErrorCaller(this.$t('queue.queue.msg.validate_media_max'));
                } else {
                    var json = {};
                    json.language = "";
                    json.context = "";
                    this.selectedRules = this.selectedRules.concat(json);
                }
            },

            // 删除显示规则
            toDelRule(index) {
                if (this.selectedRules.length == 1) {
                    this.$msgInfoErrorCaller(this.$t('queue.queue.msg.validate_media_min'));
                } else {
                    var temp = this.selectedRules.splice(index, 1);
                }
            },

            // 检查语言显示设置是否重复
            validRules() {
                var find = true;
                for (var i = 0; i < this.selectedRules.length; i++) {
                    for (var j = i + 1; j < this.selectedRules.length; j++) {
                        if (this.selectedRules[i].language === this.selectedRules[j].language) {
                            find = false;
                            break;
                        }
                    }
                }
                return find;
            },

            // 检查语言显示设置格式是否正确
            checkRules() {
                var find = true;
                for (var i = 0; i < this.selectedRules.length; i++) {
                    if ("" === this.selectedRules[i].context) {
                        find = false;
                    } else if (-1 == this.selectedRules[i].context.indexOf("{")) {
                        find = false;
                    } else if (-1 == this.selectedRules[i].context.indexOf("}")) {
                        find = false;
                    }
                }
                return find;
            },

            // 弹出框提交
            submitDialog(formName) {
                this.dialogFormInfo.mediaScreenContext = JSON.stringify(this.selectedRules);
                if (this.dialogFormInfo.mediaScreenName === "") {
                    this.$msgInfoErrorCaller(this.$t('queue.queue.msg.validate_media_mediaName'));
                } else if (this.dialogFormInfo.assetId === "") {
                    this.$msgInfoErrorCaller(this.$t('queue.queue.msg.validate_media_asset'));
                } else if (!this.validRules()) {
                    this.$msgInfoErrorCaller(this.$t('queue.queue.msg.validate_media_language'));
                } else if (!this.checkRules()) {
                    this.$msgInfoErrorCaller(this.$t('queue.queue.msg.validate_media_mediaContent'));
                } else {
                    this.showLoading();
                    this.requestVO(this.dialogFormInfo, this.dialogUpdateFlag ? mediaScreenAPI.updateMediaScreen : mediaScreenAPI.addMediaScreen).then(body => {
                        this.$notify({
                            title: this.$t('queue.common.title.success'),
                            message: this.dialogUpdateFlag ?
                                this.$t('queue.queue.title.add_success') : this.$t('queue.queue.title.edit_success'),
                            type: 'success'
                        });
                        this.dialogFormInfo = {};
                        this.dialogFormVisible = false;
                        this.selectedRules = [{
                            language: "",
                            context: ""
                        }];
                        this.queryMediaScreenList();
                        this.pageInfo.page = 1;
                        this.hideLoading();
                    }).catch(body => {
                        this.hideLoading();
                        this.$msgInfoErrorCaller(body.stateMsg);
                    })
                }
            },

            // 编辑多媒体大屏
            toModify(id) {
                this.dialogUpdateFlag = true;
                this.dialogTitle = this.$t('queue.queue.title.edit_mediaScreen');
                this.isDetail = false;
                this.getData(id)
            },

            //查看多媒体大屏详情
            toDetail(row) {
                this.dialogTitle = this.$t('queue.queue.title.detail_mediaScreen');
                this.isDetail = true;
                this.getData(row.id)
            },

            rowDblclick(v) {
                this.toDetail(v);
            },

            getData(id) {
                this.dialogFormVisible = true;
                this.requestVO({id: id}, mediaScreenAPI.getMediaScreenList).then(data => {
                    this.dialogFormInfo = data.context[0];
                    this.selectedRules = JSON.parse(data.context[0].mediaScreenContext);
                }).catch(body => {
                    this.$msgInfoErrorCaller(body.stateMsg);
                })
            },

            // 刪除多媒体大屏
            del(row, index) {
                console.log("要删除:", row);
                this.$confirm(this.$t('queue.queue.msg.delete_confirm') + row.mediaScreenName, this.$t('queue.common.title.delete'), {
                    confirmButtonText: this.$t('queue.common.button.confirm'),
                    cancelButtonText: this.$t('queue.common.button.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.requestDelete(row.id, mediaScreenAPI.deleteMediaScreen).then(body => {
                        this.$message({
                            type: 'success',
                            message: this.$t('queue.common.msg.delete_success')
                        });
                        this.queryMediaScreenList();
                        if (this.pageInfo.pageNum !== 1) {
                            // 删除的是某页的第一条数据
                            let tmp = (index + 1) % this.pageInfo.pageSize;
                            if (tmp === 1) {
                                this.pageInfo.pageNum--;
                            }
                        }
                        this.queryMediaScreenList();
                    }).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('queue.common.msg.cancel_delete')
                    })
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .main-top {
        margin: 0;
        border-bottom: #F2F6FC solid 1px;
    }

    .gwi-dialog {
        .el-dialog__title {
            color: #fff;
        }

        .el-input--mini {
            width: 80%;
        }

        .el-select--mini {
            width: 80%;
        }

        .el-textarea {
            width: 80%;
        }
    }
</style>
