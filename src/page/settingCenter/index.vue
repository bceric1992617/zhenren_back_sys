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
                    index: 'levelSetting',
                    title: '商户等级设置'
                },
                {
                    index: 'rateSetting',
                    title: '平台费率设置'
                },
            ]
        }
    },
};
</script>

<style>
</style>
