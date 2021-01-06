import topic from './topic' // 导入定义的后台服务
export const queueManageAPI = {
    addBaseBusinessType: topic.manageQueue + "/baseBusiness/addBaseBusinessType",
    queryBaseBusinessTypePage: topic.manageQueue + "/baseBusiness/queryBaseBusinessTypePage",
    selectBaseBusinessTypePage: topic.manageQueue + "/baseBusiness/selectBaseBusinessTypePage",
    deleteBaseBusinessType: topic.manageQueue + "/baseBusiness/deleteBaseBusinessType/",
    updateBaseBusinessType: topic.manageQueue + "/baseBusiness/updateBaseBusinessType",
    getBaseBusinessType: topic.manageQueue + "/baseBusiness/getBaseBusinessType",
    getBaseBusinessList: topic.manageQueue + "/baseBusiness/getBaseBusinessList",
    getOtherLanguageList: topic.manageQueue + "/baseBusiness/getOtherLanguageList",

    addOrgBusinessType: topic.manageQueue + "/orgBusiness/addOrgBusinessType",
    syncOrgBusinessType: topic.manageQueue + "/orgBusiness/syncOrgBusinessType",
    queryOrgBusinessTypePage: topic.manageQueue + "/orgBusiness/queryOrgBusinessTypePage",
    deleteOrgBusinessType: topic.manageQueue + "/orgBusiness/deleteOrgBusinessType/",
    updateOrgBusinessType: topic.manageQueue + "/orgBusiness/updateOrgBusinessType",
    getOrgBusinessType: topic.manageQueue + "/orgBusiness/getOrgBusinessType",
    listOrgBusinessType: topic.manageQueue + "/orgBusiness/listOrgBusinessType",
    listNoStrategyBusiness: topic.manageQueue + "/orgBusiness/listNoStrategyBusiness",

    addOrgAppointmentStrategy: topic.manageQueue + "/orgAppointment/addOrgAppointmentStrategy",
    queryOrgAppointmentStrategyPage: topic.manageQueue + "/orgAppointment/queryOrgAppointmentStrategyPage",
    deleteOrgAppointmentStrategy: topic.manageQueue + "/orgAppointment/deleteOrgAppointmentStrategy/",
    updateOrgAppointmentStrategy: topic.manageQueue + "/orgAppointment/updateOrgAppointmentStrategy",
    getOrgAppointmentStrategy: topic.manageQueue + "/orgAppointment/getOrgAppointmentStrategy",

    insertOrgLimit: topic.manageQueue + "/orgTakeLimit/insertOrgLimit",
    getOrgLimitCount: topic.manageQueue + "/orgTakeLimit/getOrgLimitCount",

    addOrgTakeSlip: topic.manageQueue + "/orgTake/addOrgTakeSlip",
    updateOrgTakeSlip: topic.manageQueue + "/orgTake/updateOrgTakeSlip",
    getOrgTakeSlip: topic.manageQueue + "/orgTake/getOrgTakeSlip",

    insertBaseTakeSlip: topic.manageQueue + "/baseSlip/insertTakeSlip",
    getBaseTakeSlip: topic.manageQueue + "/baseSlip/getTakeSlip",

    getBaseAppointDetail: topic.manageQueue + "/baseAppoint/getBaseAppointDetail",
    insertBaseAppoint: topic.manageQueue + "/baseAppoint/insertBaseAppoint",
    updateBaseAppoint: topic.manageQueue + "/baseAppoint/updateBaseAppoint",
    enableAppointParam: topic.manageQueue + "/baseAppoint/enableAppointParam",

    addUserType: topic.manageQueue + "/userType/addUserType", // 新增用户类型
    updateUserType: topic.manageQueue + "/userType/updateUserType",// 修改用户类型
    deleteUserType: topic.manageQueue + "/userType/deleteUserType",// 删除用户类型
    selectUserType: topic.manageQueue + "/userType/selectUserType",// 分页查询用户类型
    selectUserTypeList: topic.manageQueue + "/userType/selectUserTypeList", // 查询启用状态的用户类型列表
    selectUserTypeDetail: topic.manageQueue + "/userType/selectUserTypeDetail",// 查询用户类型详细信息

    insertLabel: topic.manageQueue + "/evaluate-label/insertLabel",// 添加评价标签
    updateLabel: topic.manageQueue + "/evaluate-label/updateLabel",// 修改评价标签
    deleteLabel: topic.manageQueue + "/evaluate-label/deleteLabel",// 删除评价标签
    selectLabel: topic.manageQueue + "/evaluate-label/selectLabel",// 分页查询评价标签信息
    listLabel: topic.manageQueue + "/evaluate-label/listLabel",// 按条件查找评价标签信息
    getLabelDetail: topic.manageQueue + "/evaluate-label/getLabelDetail",// 获取评价标签详情

    selectLog: topic.manageQueue + "/shunt-log/getShuntList",// 分页查询评价标签信息

    downTemplate: topic.manageQueue + "/customerLevel/downTemplate",// 导出模板下载
    importCustomer: topic.manageQueue + "/customerLevel/importCustomer",// 导入基本信息
    insertCustomerLevel: topic.manageQueue + "/customerLevel/insertCustomerLevel",// 新增基本信息
    updateCustomerLevel: topic.manageQueue + "/customerLevel/updateCustomerLevel",// 修改基本信息
    deleteCustomerLevel: topic.manageQueue + "/customerLevel/deleteCustomerLevel",// 删除基本信息
    getCustomerLevelDetail: topic.manageQueue + "/customerLevel/getCustomerLevelDetail",// 查询基本信息详情
    queryCustomerLevelPage: topic.manageQueue + "/customerLevel/queryCustomerLevelPage",// 查询基本信息列表

};
