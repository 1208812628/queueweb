import topic from './topic' // 导入定义的后台服务
export const mediaScreenAPI = {
     
    /* 媒体大屏 */
    queryMediaScreenListPage: topic.mediaScreenTopic + "/mediaScreen/queryMediaScreenListPage",//查询媒体大屏分页
    getMediaScreenList: topic.mediaScreenTopic + "/mediaScreen/getMediaScreenList",//查询媒体大屏
    addMediaScreen: topic.mediaScreenTopic + "/mediaScreen/addMediaScreen",//新增媒体大屏
    updateMediaScreen: topic.mediaScreenTopic + "/mediaScreen/updateMediaScreen",//更新媒体大屏
    deleteMediaScreen: topic.mediaScreenTopic + "/mediaScreen/deleteMediaScreen",//删除媒体大屏

}
