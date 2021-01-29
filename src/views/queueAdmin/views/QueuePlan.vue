<template>
    <div>
        <cp-view :business-fields-define="businessFieldsDefine"
                 :business-show-fields="businessShowFields"
                 :business-form-fields-define="businessFormFieldsDefine"
                 :business-form-show-fields="businessFormShowFields"
                 :business-actions="businessActions"
                 :media-fields-define="mediaFieldsDefine"
                 :media-show-fields="mediaShowFields"
                 :media-form-fields-define="mediaFormFieldsDefine"
                 :media-form-show-fields="mediaFormShowFields"
                 :media-actions="mediaActions"
                 :window-fields-define="windowFieldsDefine"
                 :window-show-fields="windowShowFields"
                 :window-form-fields-define="windowFormFieldsDefine"
                 :window-form-show-fields="windowFormShowFields"
                 :window-actions="windowActions"
                 :appoint-fields-define="appointFieldsDefine"
                 :appoint-show-fields="appointShowFields"
                 :appoint-form-fields-define="appointFormFieldsDefine"
                 :appoint-form-show-fields="appointFormShowFields"
                 :appoint-actions="appointActions">
        </cp-view>
    </div>
</template>

<script>
    import CpView from "../components/CpQueuePlan";
    import businessCfg from '../cfg/orgBusinessType.js';
    import mediaCfg from '../cfg/orgMediaScreen.js';
    import windowCfg from '../cfg/orgWindowManage.js';
    import appointCfg from '../cfg/orgAppointStrategy.js';

    export default {
        components: {
            CpView
        },
        name: "QueuePlan",
        data() {
            return {
                businessFieldsDefine: businessCfg.TABLE_COLUMNS_DEFINE,
                businessShowFields: [].concat(businessCfg.DEFAULT_SHOW_COLUMN),
                businessFormFieldsDefine: businessCfg.FORM_COLUMNS_DEFINE,
                businessFormShowFields: businessCfg.DEFAULT_FORM_SHOW_COLUMN,
                businessActions: [].concat(businessCfg.Table_Actions),
                mediaFieldsDefine: mediaCfg.TABLE_COLUMNS_DEFINE,
                mediaShowFields: [].concat(mediaCfg.DEFAULT_SHOW_COLUMN),
                mediaFormFieldsDefine: mediaCfg.FORM_COLUMNS_DEFINE,
                mediaFormShowFields: mediaCfg.DEFAULT_FORM_SHOW_COLUMN,
                mediaActions: [].concat(mediaCfg.Table_Actions),
                windowFieldsDefine: windowCfg.TABLE_COLUMNS_DEFINE,
                windowShowFields: [].concat(windowCfg.DEFAULT_SHOW_COLUMN),
                windowFormFieldsDefine: windowCfg.FORM_COLUMNS_DEFINE,
                windowFormShowFields: windowCfg.DEFAULT_FORM_SHOW_COLUMN,
                windowActions: [].concat(windowCfg.Table_Actions),
                appointFieldsDefine: appointCfg.TABLE_COLUMNS_DEFINE,
                appointShowFields: [].concat(appointCfg.DEFAULT_SHOW_COLUMN),
                appointFormFieldsDefine: appointCfg.FORM_COLUMNS_DEFINE,
                appointFormShowFields: appointCfg.DEFAULT_FORM_SHOW_COLUMN,
                appointActions: [].concat(appointCfg.Table_Actions),
            }
        },
        watch: {},
        created() {
        },
        /* 事件 */
        methods: {}
    }
</script>