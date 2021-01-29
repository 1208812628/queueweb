export default {
    props:{
        langUrl:{},
        fieldsDefine:{}
    },
    data(){
        return{

        }
    },
    methods:{
        generateFieldsLang (fieldsDefine, langUrl) {
            let endityFields18n = {};
            Object.keys(fieldsDefine).forEach((key) => {
                let langRes = this.$t(`${langUrl}.${key}`);
                if (langRes.dis || langRes.help) {
                    endityFields18n[key] = {
                        name:langRes.name
                    };
                    if (langRes.dis) {
                        endityFields18n[key].dis = langRes.dis;
                    }
                    if (langRes.help) {
                        endityFields18n[key].help = langRes.help;
                    }
                } else {
                    endityFields18n[key] = this.$t(`${langUrl}.${key}.name`);
                }    
            });
            return endityFields18n;
        },

        generateSelectOption (mapData, dictKey) {
            let arrayData = [];
            mapData.forEach((item) => {
                if (dictKey) {
                    item.label = this.dictI18nRes[dictKey][item.value];
                }    
                arrayData.push(item);
            });
            return arrayData;
        }
    },    
    computed:{
        dictI18nRes () {
            let dictI18n = {};
            Object.keys(this.fieldsDefine).forEach((key) => {
                let dictResUrl = this.fieldsDefine[key].dictResUrl;
                let dictDefine = this.fieldsDefine[key].dict;
                if (dictResUrl && dictDefine) {
                    dictI18n[key] = {};
                    dictDefine.forEach((value, dictKey) => {
                        dictI18n[key][dictKey] = this.$t(`${dictResUrl}.${value.key}.name`);
                        console.log(this.$t(`${dictResUrl}.${value.key}.name`),"lie222");
                    });
                }
            });
            return dictI18n;    
        },
        fieldsI18nRes () {
            let i18nColumnResourse = {};
            if (this.langUrl) {
                i18nColumnResourse = this.generateFieldsLang(this.fieldsDefine, this.langUrl);
            }
            return i18nColumnResourse;
        }
    }
}