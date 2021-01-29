<template>
    <gwi-ui-list-page-container>
        <gwi-ui-table-view :columns-define="fieldsDefine"
                           :show-columns="showColumns"
                           :column-res="fieldsI18nRes"
                           :dict-res="dictI18nRes"
                           :api-handle="query"
                           :datas.sync="tableData"
                           :has-filter="false"
                           ref="Table">
            <div slot="filter" >
                <el-button size="mini" type="primary" @click="toAdd" icon="el-icon-plus" plain>
                    {{$t('queue.common.button.add')}}
                </el-button>
            </div>
            <template slot-scope="scope" slot="tableAction">
                <gwi-ui-dropButton-group :actions="actions" :row-data="scope.row"
                                         @action-click="actionClick" lang-url="queue.orgMediaScreen.actions">
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
</template>

<script>
    import {mediaScreenAPI} from "../../../api/modules/mediaScreenAPI";
    import topic from "../../../api/modules/topic";
    import SelectAssetDialog from "./selectAssetDialog";
    import cfgMixin from '../../../mixin/cfgMixin';

    export default {
        name: "mediaScreenMange",
        mixins: [cfgMixin],
        data() {
            return {
                emptyText: this.$t('queue.common.list.dataNull'),
                tableData: [],// 列表的数据
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
                    this.search();
                }
            }
        },
        created() {
            this.request(topic.businessUserTopic + "/dict/listDictItem", {"typeCode": "languageCode"}, "post").then(data => {
                this.languages = data.context;
            });
        },
        components: {
            SelectAssetDialog
        },
        methods: {
            search() {
                this.$refs.Table.refresh();
            },

            query() {
                return new Promise((resolve, reject) => {
                    let param = {
                        "orgId":this.orgId
                    };
                    this.requestVO(param, mediaScreenAPI.queryMediaScreenListPage).then(data => {
                        resolve(data.context)
                    }).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                        reject(body.stateMsg)
                    })
                })
            },

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
                        this.search();
                        this.hideLoading();
                    }).catch(body => {
                        this.hideLoading();
                        this.$msgInfoErrorCaller(body.stateMsg);
                    })
                }
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
                        this.toDelete(rowData,2);
                        break;
                    default:
                        this.toDetail(rowData)
                }
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

            //查看多媒体大屏详情
            toDetail(row) {
                this.dialogTitle = this.$t('queue.queue.title.detail_mediaScreen');
                this.isDetail = true;
                this.getData(row.id)
            },

            // 编辑多媒体大屏
            toModify(id) {
                this.dialogUpdateFlag = true;
                this.dialogTitle = this.$t('queue.queue.title.edit_mediaScreen');
                this.isDetail = false;
                this.getData(id)
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
                        this.search();
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
