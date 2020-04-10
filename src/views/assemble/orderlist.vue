<template>
    <div style="padding:30px">
        订单列表
    </div>
</template>

<script>
import {assembleOrderList} from "@/api/assemble";
export default {
    data(){
        return {
            list:[],
            total:0,
        }
    },
    created(){
        this.getList();
    },
    methods:{
        getList(){
            assembleOrderList().then(res=>{

            })
        }
    }
}
</script>

