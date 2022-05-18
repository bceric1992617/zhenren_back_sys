<template>
<div>
    <el-aside>
        <SideMenu :items="items"></SideMenu>
    </el-aside>
    <el-main>
        <router-view></router-view>
    </el-main>
</div>
</template>

<script>
import SideMenu from '@/components/sidemenu/SideMenu';
export default {
    components: {
        SideMenu
    },
    data() {
        return {
            items: [
                
                {
                    index: 'registerList',
                    title: '注册查询'
                },
                {
                    index: 'tradeList',
                    title: '交易记录查询'
                },
                {
                    index: 'tradeRecord',
                    title: '账变记录'
                },
            ]
        }
    },
};
</script>

<style>
</style>
