const TABLE_COLUMNS_DEFINE = {
    labelName: {field: 'labelName'},
    labelClassify: {field: 'labelClassify'},
};

const DEFAULT_SHOW_COLUMN = ['labelName', 'labelClassify'];

const FORM_COLUMNS_DEFINE = {
    labelName: {field: 'labelName', editType:'text', required:true},
    labelClassify: {field: 'labelClassify', editType:'text', required:true},
};

const DEFAULT_FORM_SHOW_COLUMN = ['labelName', 'labelClassify'];

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
