import topic from './topic' // 导入定义的后台服务
export const windowAPI = {

    /* 窗口管理 */
    queryWindowListPage: topic.windowTopic + "/window/queryWindowListPage",//查询窗口分页
    getWindowList: topic.windowTopic + "/window/getWindowList",//查询窗口
    addWindow: topic.windowTopic + "/window/addWindow",//新增窗口
    updateWindow: topic.windowTopic + "/window/updateWindow",//更新窗口
    deleteWindow: topic.windowTopic + "/window/deleteWindow"//更新窗口

}
