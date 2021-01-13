const TABLE_COLUMNS_DEFINE = {
    factorCode: {field: 'factorCode'},
    factorName: {field: 'factorName'},
    numberPrefix:{field:'numberPrefix'},
    priority: {field: 'priority'},
    overTime: {field: 'overTime'}
};

const DEFAULT_SHOW_COLUMN = ['factorCode', 'factorName', 'numberPrefix', 'priority', 'overTime'];

const Table_Actions = [
    {key:'edit', lang:'ui.common.edit', icon:'el-icon-edit'},
    {key:'delete', lang:'ui.common.delete', icon:'el-icon-delete'},
];

const CONFIG_MENU_ACTIONS = [
    {key:'edit', lang:'ui.common.edit', icon:'el-icon-edit', color:'blue'},
    {key:'delete', lang:'ui.common.close', icon:'el-icon-close', color:'red'}
];

export default {
    Table_Actions,
    TABLE_COLUMNS_DEFINE,
    DEFAULT_SHOW_COLUMN,
    CONFIG_MENU_ACTIONS
};
