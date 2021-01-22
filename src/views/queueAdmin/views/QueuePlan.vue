<template>
    <div class="gwi-module-container">
        <div class="bottom-container">
            <div class="bottom-tree">
                <el-input :placeholder="this.$t('queue.queue.label.searchOrg')" v-model="filterText" size="small"
                          suffix-icon="el-icon-search" clearable>
                </el-input>
                <el-tree :data="treeData" :props="treeProps"
                         node-key="id" ref="tree"
                         :filter-node-method="filterNode"
                         :highlight-current="true"
                         @node-click="treeClick" :empty-text="$t('queue.common.list.dataNull')" >
                    <span  slot-scope="{ node, data }">
                        <span class="el-icon-office-building" v-if="!data.disable"> {{ node.label }}</span>
                        <span class="el-icon-discover" v-else> {{ node.label }}</span>
                    </span>
                </el-tree>
            </div>
            <div class="main-bottom">
                <div class="container-head" v-if="!visible6">
                    <el-row class="container-btn">
                        <el-steps :active="active-1" align-center>
                            <el-step :title="$t('queue.queue.button.businessManage')" @click.native="show(1)"></el-step>
                            <el-step :title="$t('queue.queue.button.mediaManage')" @click.native="show(2)"></el-step>
                            <el-step :title="$t('queue.queue.button.windowManage')" @click.native="show(3)"></el-step>
                            <el-step :title="$t('queue.queue.button.takeManage')" @click.native="show(4)"></el-step>
                            <el-step :title="$t('queue.queue.button.slipManage')" @click.native="show(5)"></el-step>
                        </el-steps>
                    </el-row>
                </div>
                <div class="container-contain">
                    <template v-if="visible1&&!visible6">
                        <org-business ref="OrgBusiness" v-bind:org-id="currentOrg"></org-business>
                    </template>
                    <template v-if="visible2&&!visible6">
                        <media-screen ref="MediaScreen" v-bind:org-id="currentOrg"></media-screen>
                    </template>
                    <template v-if="visible3&&!visible6">
                        <window-manager ref="WindowManager" v-bind:org-id="currentOrg"></window-manager>
                    </template>
                    <template v-if="visible4&&!visible6">
                        <org-appoint ref="OrgAppoint" v-bind:org-id="currentOrg"></org-appoint>
                    </template>
                    <template v-if="visible5&&!visible6">
                        <org-take ref="OrgTake" v-bind:org-id="currentOrg"></org-take>
                    </template>
                    <template v-if="visible6">
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {systemSetting} from "../../../api/modules/systemSetting";
    import {util} from "@gwi/bi-common";
    import OrgBusiness from "../components/orgBusinessType";
    import MediaScreen from "../components/mediaScreenManager";
    import WindowManager from "../components/windowManager";
    import OrgAppoint from "../components/orgAppointmentStrategy";
    import OrgTake from "../components/orgTakeSlip";
    import store from "@/store";

    export default {
        name: "QueuePlan",
        components:{
            OrgBusiness,
            MediaScreen,
            WindowManager,
            OrgAppoint,
            OrgTake,
        },
        data(){
            return{
                treeData:[],
                treeProps: {
                    label: "orgName",
                    children: "children",
                },
                filterText:"",
                active:1,
                visible1:false,
                visible2:false,
                visible3:false,
                visible4:false,
                visible5:false,
                visible6:false,
                currentOrg:"",
                currentClassify:"",
                orgClassifyList:['0','1','2'], // 除开网点，部门，分理处机构字典值
            }
        },
        created() {
            this.createTree();
            this.init();
        },
        watch: {
            filterText(val){
                this.$refs.tree.filter(val)
            }
        },
        methods:{
            init(){
                this.currentOrg = store.getters.userInfo.orgId;
                this.requestGet(this.currentOrg,systemSetting.getOrg).then(data=>{
                    this.currentClassify = data.context.orgClassify;
                    this.visible1 = true;
                    this.visible6 = this.orgClassifyList.indexOf(this.currentClassify)>-1
                })
            },
            createTree() {
                this.requestVO({"downOrgId": [store.getters.userInfo.orgId]}, systemSetting.listOrg).then(data => {
                    let context = data.context;
                    let treeDataTmp = [];
                    let root = util.findOrgParentId(context); // 最上层的根元素
                    if (root !== null) {
                        treeDataTmp.push(root);
                        console.log("机构的顶级目录:", treeDataTmp);
                        util.findAllChildren(treeDataTmp[0], context, "parentId", "id");
                        console.log("整理后的树状结构菜单是:", treeDataTmp);
                        this.treeData = treeDataTmp;
                    }
                }).catch(body => {
                    this.$msgInfoErrorCaller(body.stateMsg);
                });
            },
            treeClick(resInfo) {
                console.log("点击的节点是:", resInfo);
                if(this.currentOrg!==resInfo.id){
                    this.currentClassify = resInfo.orgClassify;
                    this.currentOrg = resInfo.id;
                    this.visible6 = this.orgClassifyList.indexOf(this.currentClassify) > -1;
                    if(!this.visible6){
                        this.active = 1;
                        this.toShow(this.active);
                    }
                }
            },
            filterNode(value, data, node) {
                if (!value) return true;
                if(data.orgName.indexOf(value) !== -1  || data.orgCode.indexOf(value) !== -1){
                    return true;
                }
                return this.checkBelongToChooseNode(value, data, node);
            },
            // 判断传入的节点是不是选中节点的子节点
            checkBelongToChooseNode(value, data, node) {
                let level = node.level;
                // 如果传入的节点本身就是一级节点就不用校验了
                if (level === 1) {
                    return false;
                }
                // 先取当前节点的父节点
                let parentData = node.parent;
                // 遍历当前节点的父节点
                let index = 0;
                while (index < level - 1) {
                    // 如果匹配到直接返回
                    if (parentData.data.orgName.indexOf(value) !== -1 || data.orgCode.indexOf(value) !== -1) {
                        return true;
                    }
                    // 否则的话再往上一层做匹配
                    parentData = parentData.parent;
                    index ++;
                }
                // 没匹配到返回false
                return false;
            },
            getType(active){
                if(active<=this.active){
                    return "primary";
                }
                return "info";
            },
            show(active){
                if(this.active===active){
                    return;
                }
                this.active = active;
                if(this.orgClassifyList.indexOf(this.currentClassify)>-1){
                    this.visible6 = true;
                    return;
                }
                this.toShow(active);
            },
            next(){
                this.active ===5?this.active =1:this.active +=1;
                if(this.orgClassifyList.indexOf(this.currentClassify)>-1){
                    this.visible6 = true;
                    return;
                }
                this.toShow(this.active);
            }
            ,
            toShow(active){
                this.visible1 = false;
                this.visible2 = false;
                this.visible3 = false;
                this.visible4 = false;
                this.visible5 = false;
                this.visible6 = false;
                if(active===1){
                    this.visible1 = true;
                }
                if(active===2){
                    this.visible2 = true;
                }
                if(active===3){
                    this.visible3 = true;
                }
                if(active===4){
                    this.visible4 = true;
                }
                if(active===5){
                    this.visible5 = true;
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .main-bottom{
        padding: 0;
        min-width: 0 !important;
    }
    .bottom-tree{
        padding: 0;
        margin-right: 0;
    }
    .bottom-tree .el-input{
        font-size: 12px;
    }
    .container-head{
        width: 100%;
        height: 60px;
        background-color: #f6f8fb;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    }
    .container-btn{
        margin-top: 10px;
        margin-left: 20px;
        margin-bottom: 15px;
    }
    .container-contain{
        background-color: #f6f8fb;
        width: 100%;
        height: auto;
        margin-top: 10px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    }
    .nextTip{
        float: right;
        margin-right: 20px;
    }
    ::v-deep .el-step__title {
        font-size: 13px;
        line-height: 30px;
    }
</style>