import topic from './topic'

export const systemSetting = {
    //login:"/auth-server/oauth/auth/form",
    login:topic.authTopic + "/oauth/auth/form",
    changePosition:topic.authTopic + "/oauth/auth/changePosition",
    getUserInfo: topic.authTopic +"/oauth/auth/getUserloginInfo", //获取用户信息

    logoutUser:"", // 注销用户
    //
    listResourceByLoginType: topic.businessUserTopic + "/resource/listResourceByLoginType",//获取资源管理集合(登录用户默认资源列表)
    getPositionAndDefault: topic.businessUserTopic + "/position/getPositionAndDefault",//获取岗位信息
    getPositionAndDefaultByUserId: topic.businessUserTopic + "/position/getPositionAndDefaultByUserId",//根据用户唯一ID获取岗位信息
    doAssignPosition: topic.businessUserTopic + "/user/doAssignPosition",//设置用户岗位信息

    fileDownload : topic.fileTopic+"/file/download/",
    fileUpload : topic.fileTopic+"/file/upload",

    /* 用户 */
    addUser: topic.businessUserTopic + "/user/addUser",//添加用户信息
    delLogicUser: topic.businessUserTopic + "/user/delLogicUser",//删除用户信息
    delUser: topic.businessUserTopic + "/user/delWebUser",//删除用户信息
    doAssignPasswd: topic.businessUserTopic + "/user/doAssignPasswd",//重新设置用户密码
    doAssignRoles: topic.businessUserTopic + "/user/doAssignRoles",//设置用户角色权限
    doResetPasswd: topic.businessUserTopic + "/user/doResetPasswd",//重置用户密码
    doResetPasswdByUserId: topic.businessUserTopic + "/user/doResetPasswdByUserId",
    getUser: topic.businessUserTopic + "/user/getUser",//获取用户信息
    getUserByCode: topic.businessUserTopic + "/user/getUserByCode",//获取用户信息
    listUser: topic.businessUserTopic + "/user/listUser",//获取用户信息集合
    queryUser: topic.businessUserTopic + "/user/queryUser",//查询用户信息
    searchUser: topic.businessUserTopic + "/user/searchUser",//获取用户信息集合
    updateUser: topic.businessUserTopic + "/user/updateUser",//修改用户信息
    resetSecret: topic.businessUserTopic +"/client/resetClientSecret", //设备秘钥重置
    //getUserInfo: topic.businessUserTopic +"/user/getUserInfo", //获取用户信息
    lockOrUnlockLoginUser: topic.businessUserTopic +"/loginUser/lockOrUnlockLoginUser", //锁定或解锁用户登录状态
    getUserInfoBySrcb: topic.customTopic +"/manage-custom/user-srcb/getUserInfoBySrcb", //检查用户账号在行方是否存在
    doAssignUserGroup: topic.businessUserTopic + "/user/doAssignGroup",//设置用户组用户


    /* 角色 */
    addRole: topic.businessUserTopic + "/role/addRole",//添加角色信息
    delRole: topic.businessUserTopic + "/role/delRole",//删除角色信息
    doAssignResource: topic.businessUserTopic + "/role/doAssignResource",//设置角色资源信息
    getRole: topic.businessUserTopic + "/role/getRole",//获取角色信息
    listRole: topic.businessUserTopic + "/role/listRole",//获取角色管理集合
    searchRole: topic.businessUserTopic + "/role/searchRole",//获取角色管理集合
    updateRole: topic.businessUserTopic + "/role/updateRole",//修改角色管理

    /* 资源 */
    addResource: topic.businessUserTopic + "/resource/addResource",//添加资源管理
    delResource: topic.businessUserTopic + "/resource/delResource",//删除资源管理
    getResource: topic.businessUserTopic + "/resource/getResource",//获取资源管理
    getResourceByCode: topic.businessUserTopic + "/resource/getResourceByCode",//获取资源管理
    listResource: topic.businessUserTopic + "/resource/listResource",//获取资源管理集合
    searchResource: topic.businessUserTopic + "/resource/searchResource",//获取资源管理集合
    updateResource: topic.businessUserTopic + "/resource/updateResource",//修改资源管理

    /* 组织机构 */
    addOrg: topic.businessUserTopic + "/org/addOrg",//添加组织信息
    delLogicOrg: topic.businessUserTopic + "/org/delLogicOrg",//删除组织信息
    delOrg: topic.businessUserTopic + "/org/delWebOrg",//删除组织信息
    getOrg: topic.businessUserTopic + "/org/getOrg",//获取组织信息
    getOrgAndExt: topic.businessUserTopic + "/org/getOrgAndExt",//获取组织信息和组织扩展信息
    getOrgByCode: topic.businessUserTopic + "/org/getOrgByCode",//获取组织信息
    listOrg: topic.businessUserTopic + "/org/listOrg",//获取组织信息集合
    searchOrg: topic.businessUserTopic + "/org/searchOrg",//获取组织信息集合
    updateOrg: topic.businessUserTopic + "/org/updateOrg",//修改组织信息
    downloadOrgTemplate: topic.businessUserTopic + "/org/download/orgImportTemplate",//下载机构模板
    uploadOrgTemplate: topic.businessUserTopic + "/org/upload/orgImportTemplate",//批量导入机构信息

    /* 用户组 */
    addGroup: topic.businessUserTopic + "/group/addGroup",//添加用户组信息
    delGroup: topic.businessUserTopic + "/group/delGroup",//删除用户组信息
    doGroupAssignRole: topic.businessUserTopic + "/group/doAssignRole",//设置用户组角色权限
    getGroup: topic.businessUserTopic + "/group/getGroup",//获取用户组信息
    getGroupByCode: topic.businessUserTopic + "/group/getGroupByCode",//获取用户组信息
    listGroup: topic.businessUserTopic + "/group/listGroup",//获取用户组信息集合
    listWebGroup: topic.businessUserTopic + "/group/listWebGroup",//加了权限的listGroup
    searchGroup: topic.businessUserTopic + "/group/searchGroup",//获取用户组信息集合
    searchWebGroup: topic.businessUserTopic + "/group/searchWebGroup",
    updateGroup: topic.businessUserTopic + "/group/updateGroup",//修改用户组信息
    getGroupByPositionId: topic.businessUserTopic + "/group/getGroupByPositionId",//根据岗位获取用户组信息
    doAssignUser: topic.businessUserTopic + "/group/doAssignUser",//设置用户组用户
    groupTransfer: topic.businessUserTopic + "/group/doAssignTransfer",//群组转让
    listUserPosition: topic.businessUserTopic + "/user/listUserPosition",//by id
    unlockLoginUser: topic.businessUserTopic + "/user/unlockLoginUser",
    listLoginUserAuthKey: topic.businessUserTopic + "/user/listLoginUserAuthKey",

    /* 岗位管理 */
    addPosition: topic.businessUserTopic + "/position/addPosition",//添加岗位信息
    delPosition: topic.businessUserTopic + "/position/delPosition",//删除岗位信息
    doAssignGroup: topic.businessUserTopic + "/position/doAssignGroup",//设置岗位的用户组
    getPosition: topic.businessUserTopic + "/position/getPosition",//获取岗位信息
    getPositionByCode: topic.businessUserTopic + "/position/getPositionByCode",//获取岗位信息
    listPosition: topic.businessUserTopic + "/position/listPosition",//获取岗位信息集合
    searchPosition: topic.businessUserTopic + "/position/searchPosition",//获取岗位信息集合
    updatePosition: topic.businessUserTopic + "/position/updatePosition",//修改岗位信息
    doAssignPositionOrg:topic.businessUserTopic +"/position/doAssignPositionOrg",//设置岗位组织范围
    listPositionOrgs:topic.businessUserTopic +"/position/listPositionOrgs",//设置岗位组织李彪
    listOrgById: topic.businessUserTopic + "/position/listOrgById",

    /* 字典管理 */
    addDictItem: topic.businessUserTopic + "/dict/addDictItem", //添加字典条例
    addDictType: topic.businessUserTopic + "/dict/addDictType", //添加字典类型
    delDictItem: topic.businessUserTopic + "/dict/delDictItem", //删除字典条例
    delDictType: topic.businessUserTopic + "/dict/delDictType", //删除字典类型
    queryDictItemPage: topic.businessUserTopic + "/dict/searchDictItem", //分页查询字典条例
    queryDictTypePage: topic.businessUserTopic + "/dict/searchDictType", //分页查询字典类型
    upDictItem: topic.businessUserTopic + "/dict/updateDictItem", //修改字典条例
    upDictType: topic.businessUserTopic + "/dict/updateDictType", //修改字典类型
    getDictType: topic.businessUserTopic + "/dict/getDictType", //获取字典类型
    getDictItem: topic.businessUserTopic + "/dict/getDictItem", //获取字典
    listDictTypeAndItemByTypeCode: topic.businessUserTopic + "/dict/listDictTypeAndItemByTypeCode",//获取字典信息
    //listDictItem: topic.businessUserTopic + "/api/dict/listDictItem",//获取字典信息(带翻译)
    listDictItem: topic.businessUserTopic + "/dict/listDictItem",//获取字典信息(带翻译)

    /* 运行参数设置 */
    addSysParam: topic.businessUserTopic + "/sysParam/addSysParam", // 添加系统运行参数
    delSysParam: topic.businessUserTopic + "/sysParam/delSysParam", // 删除系统运行参数
    querySysParamPage: topic.businessUserTopic + "/sysParam/searchSysParam", // 分页系统运行参数
    listSysParam: topic.businessUserTopic + "/sysParam/listSysParam", // 系统运行参数
    upSysParam: topic.businessUserTopic + "/sysParam/updateSysParam", // 修改系统运行参数
    getSysParam: topic.businessUserTopic + "/sysParam/getSysParam", // 获取系统运行参数

    /*首页请求*/
    queryWaitPage: topic.customTopic + "/web/kind/searchWait", //我的待办
    queryWaitCount: topic.customTopic + "/web/kind/getWaitCount", //查询待办数量

    sendOA: topic.customTopic + "/oaScheduling/sendOA", //查询待办数量


    addResourceShow: topic.businessUserTopic + "/resourceShow/addResourceShow",// 添加资源展示项
    delResourceShow: topic.businessUserTopic + "/resourceShow/delResourceShow",// 删除资源展示项
    doSettingResourceShowTree: topic.businessUserTopic + "/resourceShow/doSettingResourceShowTree",// 设置资源树形数据
    listResourceShowTree: topic.businessUserTopic + "/resourceShow/listResourceShowTree",// 获取资源树形数据
    updateResourceShow: topic.businessUserTopic + "/resourceShow/updateResourceShow",// 修改资源展示项

    listArea: topic.businessUserTopic + "/area/listArea",//获取区域信息集合
};
