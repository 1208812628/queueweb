<template>
    <div style="height: 600px;">
        <cp-view lang-url="queue.businessType.columns" :fields-define="fieldsDefine"
                      :show-columns="showFields" :form-show-columns="formShowFields"
                      :form-fields-define="formFieldsDefine" :actions="actions">
        </cp-view>
    </div>
</template>

<script>
    import CpView from "../components/CpBusinessType";
    import cfg from '../cfg/businessType.js';

    export default {
        components: {
            CpView
        },
        name: "UserType",
        data() {
            return {
                actions: [].concat(cfg.Table_Actions),
                showFields: [].concat(cfg.DEFAULT_SHOW_COLUMN),
                fieldsDefine: cfg.TABLE_COLUMNS_DEFINE,
                formFieldsDefine: cfg.FORM_COLUMNS_DEFINE,
                formShowFields: cfg.DEFAULT_FORM_SHOW_COLUMN,
            }
        },
        watch: {},
        created() {
        },
        /* 事件 */
        methods: {}
    }
</script>