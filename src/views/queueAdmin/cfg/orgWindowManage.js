const TABLE_COLUMNS_DEFINE = {
    windowCode: {field: 'windowCode'},
    windowBusinessList: {field: 'windowBusinessList'},
    windowLocation: {field: 'windowLocation'},
    windowScreenList:{field:'windowScreenList'},
};

const DEFAULT_SHOW_COLUMN = ['windowCode', 'windowBusinessList', 'windowLocation','windowScreenList'];

const Table_Actions = [
    {key:'view', lang:'queue.actions.actions.view.name', icon:'el-icon-view'},
    {key:'edit', lang:'queue.actions.actions.edit.name', icon:'el-icon-edit'},
    {key:'copy', lang:'queue.actions.actions.edit.name', icon:'el-icon-document-copy'},
    {key:'delete', lang:'queue.actions.actions.delete.name', icon:'el-icon-delete'},
];

export default {
    TABLE_COLUMNS_DEFINE,
    DEFAULT_SHOW_COLUMN,
    Table_Actions,
};