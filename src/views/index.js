export default {
    userType: () => import('./userType/views/UserType'), // 用户类型管理
    baseBusinessType: () => import('./businessType/views/BusinessType'), // 基本业务类型管理
    orgBusinessType: () => import('./queue/orgBusiness/orgBusinessType'), // 网点业务类型管理
    takeSlipManage: () => import('./queue/orgTake/TakeSlipManage'), // 凭条管理
    baseAppointParam:  () => import('./queue/queueAdmin/QueueAppoint'), // 预约客户管理
    queuePlan: () => import('./queue/queueAdmin/QueuePlan'), // 网点排队方案管理
    // queueEcharts: () => import('./queue/queueEcharts/graphicReport'), // 排队机图表
    baseLabel: () => import('./evaluateLabel/views/EvaluateLabel'), // 评价标签管理
    baseLog: () => import('./dispatchLog/views/DispatchLog'), // 调度日志管理
    customerInfo: () => import('./queue/queueAdmin/CustomerInfo'), // 客户基本信息管理
};