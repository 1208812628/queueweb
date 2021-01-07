import topic from './topic' // 导入定义的后台服务
export const assetAttrAPI = {
  	
  	//分类相关接口
    addAssetClassify: topic.assetTopic + "/assetClassify/addAssetClassify",
    updateAssetClassify: topic.assetTopic + "/assetClassify/updateAssetClassify",
    delAssetClassify: topic.assetTopic + "/assetClassify/delAssetClassify",
    getChildren: topic.assetTopic + "/assetClassify/getAllChildren",
    getAllChildrenState: topic.assetTopic + "/assetClassify/getAllChildrenState",

    pageClassify: topic.assetTopic + "/assetClassify/pageClassify",
    getAssetClassifyInfo : topic.assetTopic + "/assetClassify/getAssetClassifyInfo",
    listAssetClassify : topic.assetTopic + "/assetClassify/listAssetClassify",
    //类型相关接口
    addAssetType: topic.assetTopic + "/assetType/addAssetType",
    updateAssetType: topic.assetTopic + "/assetType/updateAssetType",
    delAssetType: topic.assetTopic + "/assetType/delAssetType",
    listAssetType: topic.assetTopic + "/assetType/listAssetType",
    listAllAssetType: topic.assetTopic + "/assetType/listAllAssetType",
    pageAssetType : topic.assetTopic + "/assetType/pageAssetType",
    getAssetTypeById : topic.assetTopic + "/assetType/getAssetTypeById",
    discardAssetType : topic.assetTopic + "/assetType/discardAssetType",
    //品牌相关接口
    addAssetBrand: topic.assetTopic + "/assetBrand/addAssetBrand",
    updateAssetBrand: topic.assetTopic + "/assetBrand/updateAssetBrand",
    delAssetBrand: topic.assetTopic + "/assetBrand/delAssetBrand",
    listAssetBrand: topic.assetTopic + "/assetBrand/listAssetBrand",
    listAllAssetBrand: topic.assetTopic + "/assetBrand/listAllAssetBrand",
    pageAssetBrand : topic.assetTopic + "/assetBrand/pageAssetBrand",
    getAssetBrandById : topic.assetTopic + "/assetBrand/getAssetBrandById",
    discardAssetBrand : topic.assetTopic + "/assetBrand/discardAssetBrand",
    //型号相关接口
    addAssetModel: topic.assetTopic + "/assetModel/addAssetModel",
    updateAssetModel: topic.assetTopic + "/assetModel/updateAssetModel",
    delAssetModel: topic.assetTopic + "/assetModel/delAssetModel",
    listAssetModel: topic.assetTopic + "/assetModel/listAssetModel",
    pageAssetModel : topic.assetTopic + "/assetModel/pageAssetModel",
    getAssetModelDetial : topic.assetTopic + "/assetModel/getAssetModelDetial",
    discardAssetModel : topic.assetTopic + "/assetModel/discardAssetModel",
    listModeInfoTree : topic.assetTopic + "/assetModel/listModeInfoTree",

    //部件相关接口
    addAssetPart: topic.assetTopic + "/assetPart/addAssetPart",
    updateAssetPart: topic.assetTopic + "/assetPart/updateAssetPart",
    delAssetPart: topic.assetTopic + "/assetPart/delAssetPart",
    listAssetPart: topic.assetTopic + "/assetPart/listAssetPart",
    pageAssetPart : topic.assetTopic + "/assetPart/pageAssetPart",
    getAssetPartById : topic.assetTopic + "/assetPart/getAssetPartById",
    
    pageTerm : topic.assetTopic + "/asset-device/queryTermPage",
    
    //模块相关
    listPartModule:topic.assetTopic + "/assetModule/listPartModule",
    addModuleError:topic.assetTopic + "/assetModule/addModuleError",

    addModuleErrorInfo:topic.assetTopic + "/assetModule/addModuleErrorInfo",
    updateModuleError:topic.assetTopic + "/assetModule/updateModuleError",
    delModuleError:topic.assetTopic + "/assetModule/delModuleError",
    listModuleError:topic.assetTopic + "/assetModule/listModuleError",
    listModuleErrorFromTemplate:topic.assetTopic + "/assetModule/listModuleErrorFromTemplate",
    listDictItem: topic.businessUserTopic + "/dict/listDictItem",
    getModuleError:topic.assetTopic + "/assetModule/getModuleError",

};
