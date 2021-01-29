const TABLE_COLUMNS_DEFINE = {
    orgBusinessId: {field: 'orgBusinessId'},
    businessNameList: {field: 'businessNameList'},
    startTime: {field: 'startTime'},
    endTime: {field: 'endTime'},
    takeTimePeriod:{field:'takeTimePeriod'},
};

const DEFAULT_SHOW_COLUMN = ['businessNameList', 'startTime', 'endTime','takeTimePeriod'];

const Table_Actions = [
    {key:'view', lang:'queue.actions.actions.view.name', icon:'el-icon-view'},
    {key:'edit', lang:'queue.actions.actions.edit.name', icon:'el-icon-edit'},
    {key:'delete', lang:'queue.actions.actions.delete.name', icon:'el-icon-delete'},
];

export default {
    TABLE_COLUMNS_DEFINE,
    DEFAULT_SHOW_COLUMN,
    Table_Actions,
};