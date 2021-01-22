const TABLE_COLUMNS_DEFINE = {
    mediaScreenName: {field: 'mediaScreenName'},
    mediaScreenContext: {field: 'mediaScreenContext'},
    assetId: {field: 'assetId'},
    mediaScreenEnable:{field:'mediaScreenEnable'},
};

const DEFAULT_SHOW_COLUMN = ['mediaScreenName', 'mediaScreenName', 'mediaScreenEnable'];

const FORM_COLUMNS_DEFINE = {
    mediaScreenName: {field: 'mediaScreenName', editType:'text', required:true},
    assetId: {field: 'assetId', editType:'text', required:true},
    mediaScreenEnable: {field: 'mediaScreenEnable', editType:'text', required:true},
};

const DEFAULT_FORM_SHOW_COLUMN = ['mediaScreenName', 'assetId', 'mediaScreenEnable'];

const Table_Actions = [
    {key:'detail', lang:'ui.common.view', icon:'el-icon-view'},
    {key:'edit', lang:'ui.common.edit', icon:'el-icon-edit'},
    {key:'delete', lang:'ui.common.close', icon:'el-icon-delete'},
];

const CONFIG_MENU_ACTIONS = [
    {key:'detail', lang:'ui.common.view', icon:'el-icon-view', color:'blue'},
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