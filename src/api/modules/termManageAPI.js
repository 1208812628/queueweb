import topic from './topic'
export const termManageAPI = {

    queryTermPage: topic.deviceTopic + "/asset-device/queryTermPage", //查询设备列表
    listTerm: topic.deviceTopic + "/asset-device/listTerm",
    querySoftPage: topic.deviceTopic + "/asset-device/querySoftPage",
    getTermByDevNo:topic.deviceTopic + "/asset-device/getTermByAssertno",//根据id获取设备信息
    delTerm:topic.deviceTopic + "/asset-device/delTerm",//根据id获取设备信息
    getTerm:topic.deviceTopic + "/asset-device/getTerm",//根据id获取设备信息
    addTerm:topic.deviceTopic + "/asset-device/addTerm",//修改设备信息
    updateTerm:topic.deviceTopic + "/asset-device/updateTerm",//修改设备信息
    queryProcessPage: topic.deviceTopic + "/asset-device/queryProcessPage",
    listBrand: topic.assetManageTopic + "/assetBrand/listAssetBrand",//设备品牌(厂家)
    listType: topic.assetManageTopic + "/assetType/listAssetType",//设备类型
    listModel: topic.assetManageTopic + "/assetModel/listAssetModel",//设备型号
    listAssetModelByType: topic.maintenanceTopic + "/assetModel/listAssetModelByType",
    queryRegisterPage: topic.deviceTopic + "/asset-device/queryRegisterPage",//查询注册失败的终端
    termCmd: topic.deviceTopic + "/asset-device/termCmd",//终端指令下发
    queryTermCmdListResult: topic.deviceTopic + "/asset-device/queryTermCmdListResult",//查询终端指令执行结果
    queryTermCmdList: topic.deviceTopic + "/asset-device/queryTermCmdList",
    listFilePath: topic.deviceTopic + "/asset-device/listFilePath",//查询文件路径列表
    delCmdPath: topic.deviceTopic + "/asset-device/delCmdPath",//查询文件路径列表
    getTermStateCount: topic.deviceTopic + "/asset-monitor/getTermStateCount",//
    getOrgStateCount: topic.deviceTopic + "/asset-monitor/getOrgStateCount",//
    getDevPartList: topic.deviceTopic + "/asset-monitor/getDevPartList",//
    getDevPartListByAssetNo: topic.deviceTopic + "/asset-monitor/getDevPartListByAssetNo",//
    pageTermStateInfo: topic.deviceTopic + "/asset-monitor/pageTermStateInfo",//

    listDictItem: topic.businessUserTopic + "/dict/listDictItem",

    addFilePath:topic.deviceTopic+"/asset-device/addFilePath",

    pageFilePath:topic.deviceTopic+"/asset-device/pageFilePath",

    getFilePathById:topic.deviceTopic+"/asset-device/getFilePathById",

    updateFilePath:topic.deviceTopic+"/asset-device/updateFilePath",

    delFilePath:topic.deviceTopic+"/asset-device/delFilePathById",

    pageTermIssDetail:topic.issuedTopic+"/issResult/pageTermIssDetail"
};
