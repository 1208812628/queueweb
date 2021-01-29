import {ENABLE_MAP} from "../../../dict";

const TABLE_COLUMNS_DEFINE = {
    orgBusinessName: {field: 'orgBusinessName'},
    orgBusinessNameList: {field: 'orgBusinessNameList'},
    initialLetter:{field:'initialLetter'},
    numberLength: {field: 'numberLength'},
    customerTypeShow: {field: 'customerTypeShow'},
    enableTime:{field:'enableTime'},
    enableFlag:{field:'enableFlag',dictResUrl:'queue.dict.enable', dict:ENABLE_MAP},
};

const DEFAULT_SHOW_COLUMN = ['orgBusinessName', 'orgBusinessNameList', 'initialLetter', 'numberLength',
    'customerTypeShow','enableTime','enableFlag'];

const FORM_COLUMNS_DEFINE = {
    factorCode: {field: 'factorCode', editType:'text', required:true},
    factorName: {field: 'factorName', editType:'text', required:true},
    numberPrefix: {field: 'numberPrefix', editType:'text', required:true},
    priority:{field:'priority', editType:'text', required:true},
    overTime:{field:'overTime', editType:'text'},
};

const DEFAULT_FORM_SHOW_COLUMN = ['factorCode', 'factorName', 'numberPrefix', 'priority', 'overTime'];

const Table_Actions = [
    {key:'edit', lang:'queue.actions.actions.edit.name', icon:'el-icon-edit'},
    {key:'delete', lang:'queue.actions.actions.delete.name', icon:'el-icon-delete'},
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