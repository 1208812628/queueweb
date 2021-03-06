const TABLE_COLUMNS_DEFINE = {
    orgName: {field: 'orgName'},
    queueNum: {field: 'queueNum'},
    takeTime:{field:'takeTime'},
    customerName: {field: 'customerName'},
    queueType: {field: 'queueType'},
    operatorName: {field: 'operatorName'},
    operatorTime: {field: 'operatorTime'},
    orgId: {field: 'orgId'},
};

const DEFAULT_SHOW_COLUMN = ['orgName', 'queueNum', 'takeTime', 'customerName', 'queueType','operatorName','operatorTime'];

const FORM_COLUMNS_DEFINE = {
    factorCode: {field: 'factorCode', editType:'text', required:true},
    factorName: {field: 'factorName', editType:'text', required:true},
    numberPrefix: {field: 'numberPrefix', editType:'text', required:true},
    priority:{field:'priority', editType:'text', required:true},
    overTime:{field:'overTime', editType:'text'},
};

const DEFAULT_FORM_SHOW_COLUMN = ['factorCode', 'factorName', 'numberPrefix', 'priority', 'overTime'];

const Table_Actions = [
    {key:'edit', lang:'queue.userType.actions.edit.name', icon:'el-icon-edit'},
    {key:'delete', lang:'queue.userType.actions.delete.name', icon:'el-icon-delete'},
];

const CONFIG_MENU_ACTIONS = [
    {key:'edit', lang:'ui.common.edit', icon:'el-icon-edit', color:'blue'},
    {key:'delete', lang:'ui.common.close', icon:'el-icon-close', color:'red'}
];

export default {
    TABLE_COLUMNS_DEFINE,
    FORM_COLUMNS_DEFINE,
    DEFAULT_SHOW_COLUMN,
    DEFAULT_FORM_SHOW_COLUMN,
    Table_Actions,
    CONFIG_MENU_ACTIONS
};
