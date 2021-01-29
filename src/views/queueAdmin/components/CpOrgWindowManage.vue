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
                                         @action-click="actionClick" lang-url="queue.actions.actions">
                </gwi-ui-dropButton-group>
            </template>
        </gwi-ui-table-view>

        <!-- 添加修改 -->
        <el-dialog v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="600px"
                   @close="dialogClose" class="gwi-dialog" center :append-to-body="true"
                   :close-on-click-modal="isDetail"
                   top="15px">
            <el-form :inline="false" :model="dialogFormInfo" ref="dialogFormInfo"
                     :status-icon="true" :inline-message="true" label-position="right" label-width="140px"
                     size="mini" class="dialog-form" :rules="rule">
                <el-form-item :label="$t('queue.queue.label.windowCode')" prop="windowCode">
                    <el-input-number v-model="dialogFormInfo.windowCode" size="mini" :min="1" :max="10"
                                     :disabled="isDetail"/>
                </el-form-item>
                <el-form-item :label="$t('queue.queue.label.windowScreenList')">
                    <el-select v-model="selectedScreen" :disabled="isDetail" multiple>
                        <el-option
                                v-for="ms in mediaScreenList"
                                :key="ms.id"
                                :label="ms.mediaScreenName"
                                :value="ms.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('queue.queue.label.windowLocation')" prop="windowLocation">
                    <el-input type="text" v-model="dialogFormInfo.windowLocation"
                              maxlength="20" minlength="1" :disabled="isDetail"
                              :placeholder="$t('queue.common.placeholder.input')">
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('queue.queue.label.windowBusinessList')">
                    <div class="table-container">
                        <el-table :data="selectedBusiness"
                                  border size="mini"
                                  :empty-text="emptyText"
                                  tooltip-effect="dark"
                                  class="window-table">
                            <el-table-column prop="selected" width="55" :label="$t('queue.queue.label.change')">
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.selected"></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column prop="businessName"
                                             :label="$t('queue.queue.label.businessName')"></el-table-column>
                            <el-table-column :label="$t('queue.queue.label.priority')" width="200">
                                <template slot-scope="scope">
                                    <el-input-number v-model="scope.row.priority"
                                                     controls-position="right"
                                                     :disabled="!scope.row.selected"
                                                     size="mini"
                                                     :min="1"
                                                     :max="99"/>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form-item>
                <el-form-item label="">
                    {{$t('queue.queue.msg.description')}}
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogClose">{{$t('queue.common.button.cancel')}}</el-button>
                <el-button @click="submitDialog('dialogFormInfo')" type="primary" v-if="!isDetail">
                    {{$t('queue.common.button.submit')}}
                </el-button>
            </div>
        </el-dialog>
    </gwi-ui-list-page-container>
</template>

<script>
    import {windowAPI} from "../../../api/modules/windowAPI";
    import {mediaScreenAPI} from "../../../api/modules/mediaScreenAPI";
    import {queueManageAPI} from "../../../api/modules/queueManageAPI";
    import cfgMixin from '../../../mixin/cfgMixin';

    export default {
        name: "WindowMange",
        props: {
            orgId: {},
            showColumns: {},
            formFieldsDefine: {},
            formShowColumns: {},
            actions: {},
        },
        mixins: [cfgMixin],
        data() {
            return {
                emptyText: this.$t('queue.common.list.dataNull'),// 列表loading效果
                tableData: [],// 列表的数据
                mediaScreenList: [],// 多媒体大屏列表
                rule: {
                    windowCode: [
                        {
                            required: true,
                            message: this.$t('queue.queue.msg.validate_window_windowCode'),
                            trigger: 'blur'
                        }, // 非空验证
                    ],
                    windowLocation: [
                        {
                            pattern: /^[a-z0-9A-Z\u4E00-\u9FA5\s*]{0,20}$/,
                            message: this.$t('queue.queue.msg.validate_window_windowLocation'),
                            trigger: ['blur', 'change']
                        },
                    ],
                },
                selectedBusiness: [],//用户选择的业务列表
                selectedScreen: [],//用户选择要关联的大屏
                dialogFormInfo: {},// 弹出框表单提交
                dialogFormVisible: false, // 是否显示和隐藏弹出框
                dialogUpdateFlag: true, //true 编辑  false: 添加
                isDetail: false, // 是否查看详情
                dialogTitle: ''// 弹出窗口的标题
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
            // 查询可办业务列表
            this.listOrgBusinessType();
            // 查询媒体大屏列表
            this.getMediaScreenList();
        },

        methods: {
            query(){
                let param = {
                    "orgId":this.orgId
                };
                return new Promise((resolve, reject) => {
                    this.requestVO(param, windowAPI.queryWindowListPage).then(data => {
                        resolve(data.context);
                    }).catch(body => {
                        this.$msgInfoErrorCaller(body.stateMsg);
                        reject(body.stateMsg);
                    })
                })

            },
            search(){
                this.$refs.Table.refresh();
            },
            // 查询媒体大屏列表
            getMediaScreenList() {
                this.requestVO({
                    mediaScreenEnable: 1,
                    orgId: this.orgId
                }, mediaScreenAPI.getMediaScreenList).then(data => {
                    this.hideLoading();
                    this.mediaScreenList = data.context;
                }).catch(body => {
                    this.$msgInfoErrorCaller(body.stateMsg);
                })
            },

            //查询可办业务列表
            listOrgBusinessType() {
                this.requestVO({
                    enableFlag: "1",
                    isShow: "1",
                    orgId: this.orgId
                }, queueManageAPI.listOrgBusinessType).then(data => {
                        if (null != data.context) {
                            var temp = data.context;
                            for (var i = 0; i < temp.length; i++) {
                                var json = {};
                                json.businessId = temp[i].id;
                                json.customerTypeId = temp[i].customerTypeId;
                                json.customerTypeName = temp[i].customerTypeName;
                                json.businessName = temp[i].orgBusinessName;
                                json.businessCode = temp[i].orgBusinessCode;
                                json.priority = 0;
                                json.selected = false;
                                this.selectedBusiness = this.selectedBusiness.concat(json);
                            }
                        }
                    }
                ).catch(body => {
                    this.$msgInfoErrorCaller(body.stateMsg);
                })
            },

            // 格式化显示格式
            formatterContext(row, column, cellValue, index) {
                var jsonArray = cellValue;
                // var jsonArray = JSON.parse(cellValue);
                var str = "";
                for (var i = 0; i < jsonArray.length; i++) {
                    str += jsonArray[i].customerTypeName + "-" + jsonArray[i].businessName + "/" + jsonArray[i].priority;
                    if (i != jsonArray.length - 1) {
                        str += "；";
                    }
                }
                return str;
            },

            // 格式化显示格式
            formatterScreen(row, column, cellValue, index) {
                var jsonArray = cellValue;
                var str = "";
                for (var i = 0; i < jsonArray.length; i++) {
                    str += jsonArray[i].mediaScreenName;
                    if (i != jsonArray.length - 1) {
                        str += "；";
                    }
                }
                return str;
            },

            // 关闭弹出框
            dialogClose() {
                this.dialogFormInfo = {};
                this.dialogFormVisible = false;
                this.selectedBusiness = [];
                this.selectedScreen = [];
            },

            //检查用户所选择的业务
            checkSelectedBusiness() {
                var temp = 0;
                var tempList = [];
                for (var i = 0; i < this.selectedBusiness.length; i++) {
                    if (this.selectedBusiness[i].selected) {
                        tempList = tempList.concat(this.selectedBusiness[i])
                        temp++;
                    }
                }
                // this.dialogFormInfo.windowContext = JSON.stringify(tempList);
                this.dialogFormInfo.windowBusinessList = tempList;
                return temp;
            },

            //检查用户选择要关联的大屏
            checkSelectedScreen() {
                var tempList = [];
                for (var i = 0; i < this.mediaScreenList.length; i++) {
                    var id = this.mediaScreenList[i].id;
                    for (var j = 0; j < this.selectedScreen.length; j++) {
                        if (this.selectedScreen[j] == id) {
                            tempList.push(this.mediaScreenList[i]);
                        }
                    }
                }
                this.dialogFormInfo.windowScreenList = tempList;
                return this.dialogFormInfo.windowScreenList.length;
            },

            // 弹出框提交
            submitDialog(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.dialogFormInfo.windowCode === "") {
                            this.$msgInfoErrorCaller(this.$t('queue.queue.msg.validate_window_windowCode'));
                        } else if (0 == this.checkSelectedScreen()) {
                            this.$msgInfoErrorCaller(this.$t('queue.queue.msg.validate_window_media'));
                        } else if (0 == this.checkSelectedBusiness()) {
                            this.$msgInfoErrorCaller(this.$t('queue.queue.msg.validate_window_business'));
                        } else {
                            this.showLoading();
                            this.requestVO(this.dialogFormInfo, this.dialogUpdateFlag ? windowAPI.updateWindow : windowAPI.addWindow).then(body => {
                                this.$notify({
                                    title: this.$t('queue.common.title.success'),
                                    message: this.dialogUpdateFlag ?
                                        this.$t('queue.queue.title.add_success') : this.$t('queue.queue.title.edit_success'),
                                    type: 'success'
                                });
                                this.dialogFormInfo = {};
                                this.selectedBusiness = [];
                                this.selectedScreen = [];
                                this.dialogFormVisible = false;
                                this.search();
                            }).catch(body => {
                                this.$msgInfoErrorCaller(body.stateMsg);
                            })
                        }
                    } else {
                        this.$msgInfoErrorCaller(this.$t('queue.common.msg.validate_error'));
                        return false;
                    }
                });
            },

            // 添加窗口
            toAdd() {
                this.isDetail = false;
                this.dialogUpdateFlag = false;
                this.dialogFormVisible = true;
                this.dialogTitle = this.$t('queue.queue.title.add_window');
                this.dialogFormInfo = {
                    orgId: this.orgId,
                    windowCode: "",
                    windowLocation: ""
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
                    case 'copy':
                        this.toCopy(rowData.id);
                        break;
                    case 'delete':
                        this.toDelete(rowData);
                        break;
                    default:
                        this.toDetail(rowData)
                }
            },

            // 编辑窗口
            toModify(id) {
                this.dialogUpdateFlag = true;
                this.dialogTitle = this.$t('queue.queue.title.edit_window');
                this.isDetail = false;
                this.getData(id)
            },

            toCopy(id) {
                this.dialogUpdateFlag = false;
                this.dialogTitle = this.$t('queue.queue.title.copy_window');
                this.isDetail = false;
                this.getData(id);
            },

            //查看窗口详情
            toDetail(row) {
                this.dialogTitle = this.$t('queue.queue.title.detail_window');
                this.isDetail = true;
                this.getData(row.id)
            },

            getData(id) {
                this.dialogFormVisible = true;
                this.requestVO({id: id}, windowAPI.getWindowList).then(data => {
                    this.dialogFormInfo = data.context[0];
                    if (!this.dialogUpdateFlag) {
                        this.dialogFormInfo.id = "";
                        this.dialogFormInfo.orgId = this.orgId;
                        this.dialogFormInfo.windowCode = "";
                        this.dialogFormInfo.windowLocation = undefined;
                    }
                    let windowBusinessList = data.context[0].windowBusinessList;
                    for (let i = 0; i < windowBusinessList.length; i++) {
                        for (let j = 0; j < this.selectedBusiness.length; j++) {
                            if (windowBusinessList[i].businessId === this.selectedBusiness[j].businessId) {
                                this.selectedBusiness[j].selected = true;
                                this.selectedBusiness[j].priority = windowBusinessList[i].priority;
                            }
                        }
                    }
                    let wsl = data.context[0].windowScreenList;
                    for (let a = 0; a < wsl.length; a++) {
                        this.selectedScreen.push(wsl[a].mediaScreenId);
                    }
                }).catch(body => {
                    this.$msgInfoErrorCaller(body.stateMsg);
                })
            },

            // 刪除窗口
            toDelete(row) {
                console.log("要删除:", row);
                this.$confirm(this.$t('queue.queue.msg.delete_window_confirm'), this.$t('queue.common.title.delete'), {
                    confirmButtonText: this.$t('queue.common.button.confirm'),
                    cancelButtonText: this.$t('queue.common.button.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.requestDelete(row.id, windowAPI.deleteWindow).then(body => {
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
</style>
