<template>
    <div>
        <div class="bottom-container">
            <div class="main-bottom">
                <div class="btn-container">
                    <el-button size="mini" type="primary" @click="toAdd" icon="el-icon-plus" plain>{{$t('queue.common.button.add')}}</el-button>
                </div>
                <div class="table-container">
                    <el-table :data="tableData" border size="mini" :empty-text="emptyText" @row-dblclick="rowDblclick" v-loading="dataListLoading">
                        <!-- <el-table-column type="index" label="序号" :index="tableIndex" align="center" width="50"/>-->
                        <el-table-column prop="windowCode" :label="$t('queue.queue.label.windowCode')" width="120" align="center"/>
                        <el-table-column prop="windowBusinessList" :label="$t('queue.queue.label.windowBusinessList')" :formatter="formatterContext" width="500"/>
                        <el-table-column prop="windowLocation" :label="$t('queue.queue.label.windowLocation')" width="120"/>
                        <el-table-column prop="windowScreenList" :label="$t('queue.queue.label.windowScreenList')" width="130" :formatter="formatterScreen"/>
                        <el-table-column :label="$t('queue.common.label.operation')" width="180">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="toDetail(scope.row)">{{$t('queue.common.button.detail')}}</el-button>
                                <el-button type="text" size="small" @click="toModify(scope.row.id)">{{$t('queue.common.button.edit')}}</el-button>
                                <el-button type="text" size="small" @click="toCopy(scope.row.id)">{{$t('queue.common.button.copy')}}</el-button>
                                <el-button type="text" size="small" @click="del(scope.row, scope.$index)">{{$t('queue.common.button.delete')}}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination-container">
                    <el-pagination background layout="total, prev, pager, next,jumper"
                                   :page-size="pageInfo.pageSize"
                                   :total="pageInfo.total"
                                   :current-page="pageInfo.pageNum"
                                   @current-change="currentChange">
                    </el-pagination>
                </div>
            </div>
        </div>

        <!-- 添加修改 -->
        <el-dialog v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="600px"
                   @close="dialogClose" class="gwi-dialog" center :append-to-body="true" :close-on-click-modal="isDetail"
                    top="15px">
            <el-form :inline="false" :model="dialogFormInfo" ref="dialogFormInfo"
                     :status-icon="true" :inline-message="true" label-position="right" label-width="140px"
                     size="mini" class="dialog-form" :rules="rule">
                <el-form-item :label="$t('queue.queue.label.windowCode')" prop="windowCode">
                    <el-input-number v-model="dialogFormInfo.windowCode" size="mini" :min="1" :max="9999" :disabled="isDetail"/>
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
                            <el-table-column prop="businessName" :label="$t('queue.queue.label.businessName')"></el-table-column>
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
                <el-button @click="cancelDialog">{{$t('queue.common.button.cancel')}}</el-button>
                <el-button @click="submitDialog('dialogFormInfo')" type="primary" v-if="!isDetail">
                    {{$t('queue.common.button.submit')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {windowAPI} from "../../../api/modules/windowAPI";
    import {mediaScreenAPI} from "../../../api/modules/mediaScreenAPI";
    import {queueManageAPI} from "../../../api/modules/queueManageAPI";

    export default {
        name: "WindowMange",
        data() {
            return {
                emptyText: this.$t('queue.common.list.dataNull'),// 列表loading效果
                tableData: [],// 列表的数据
                dataListLoading: false,
                mediaScreenList: [],// 多媒体大屏列表
                // 列表分页
                pageInfo: {
                    pageNum: 1,
                    start: 0,
                    pageSize: 10,
                    total: 0
                },
                rule: {
                    windowCode: [
                        {required: true, message: this.$t('queue.queue.msg.validate_window_windowCode'), trigger: 'blur'}, // 非空验证
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
        props: [
            'orgId'
        ],
        watch: {
            orgId(val) {
                if (val) {
                    this.pageInfo.orgId = val;
                    this.queryWindowList();
                }
            }
        },
        created() {
            this.pageInfo.orgId = this.orgId;
            // 查询窗口列表
            this.queryWindowList();
            // 查询可办业务列表
            this.listOrgBusinessType();
            // 查询媒体大屏列表
            this.getMediaScreenList();
        },

        methods: {
            // 查询媒体大屏列表
            getMediaScreenList() {
                this.requestVO({mediaScreenEnable: 1, orgId: this.orgId}, mediaScreenAPI.getMediaScreenList).then(data => {
                    this.hideLoading();
                    this.mediaScreenList = data.context;
                }).catch(body => {
                    this.$msgInfoErrorCaller(body.stateMsg);
                })
            },

            //查询可办业务列表
            listOrgBusinessType() {
                this.requestVO({enableFlag: "1", isShow: "1", orgId: this.orgId}, queueManageAPI.listOrgBusinessType).then(data => {
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

            // 查询窗口列表
            queryWindowList() {
                this.dataListLoading = true;
                this.requestVO(this.pageInfo, windowAPI.queryWindowListPage).then(data => {
                    this.dataListLoading = false;
                    this.tableData = data.context.list;
                    this.pageInfo.total = data.context.total;
                    this.hideLoading();
                }).catch(body => {
                    this.dataListLoading = false;
                    this.hideLoading();
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

            // 翻页
            currentChange(val) {
                console.log('当前页:', val);
                this.pageInfo.pageNum = val;
                this.queryWindowList();
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
                this.selectedBusiness = [];
                this.selectedScreen = [];
                this.listOrgBusinessType();
            },

            // 关闭弹出框
            cancelDialog() {
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
                                this.queryWindowList();
                                this.pageInfo.page = 1;
                                this.hideLoading();
                            }).catch(body => {
                                this.hideLoading();
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
                this.dialogTitle =  this.$t('queue.queue.title.add_window');;
                this.dialogFormInfo = {
                    orgId: this.orgId,
                    windowCode: "",
                    windowLocation: ""
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

            rowDblclick(v) {
                this.toDetail(v);
            },

            getData(id) {
                this.dialogFormVisible = true;
                this.requestVO({id: id}, windowAPI.getWindowList).then(data => {
                    this.dialogFormInfo = data.context[0];
                    if(!this.dialogUpdateFlag){
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
            del(row, index) {
                console.log("要删除:", row);
                this.$confirm(this.$t('queue.queue.msg.delete_window_confirm'), this.$t('queue.common.title.delete'),  {
                    confirmButtonText: this.$t('queue.common.button.confirm'),
                    cancelButtonText: this.$t('queue.common.button.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.requestDelete(row.id, windowAPI.deleteWindow).then(body => {
                        this.$message({
                            type: 'success',
                            message: this.$t('queue.common.msg.delete_success')
                        });
                        this.queryWindowList();
                        if (this.pageInfo.pageNum !== 1) {
                            // 删除的是某页的第一条数据
                            let tmp = (index + 1) % this.pageInfo.pageSize;
                            if (tmp === 1) {
                                this.pageInfo.pageNum--;
                            }
                        }
                        this.queryWindowList();
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
    @import "../../../assets/css/max-inbodyTree-style.css";

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
	.window-table{
		height:260px;overflow-y: auto;
	}
	.el-table::before{
		z-index: 0;
	}
</style>
