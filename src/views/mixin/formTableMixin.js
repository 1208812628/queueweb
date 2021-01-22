export default {
    props: {
      datas:{
        default () {
          return [];
        }
      }
    },
    data () {
      return {
        syncData:this.datas
      };
    },
    watch:{
      syncData (val) {
        this.$emit('update:datas', val);
      }
    }
}