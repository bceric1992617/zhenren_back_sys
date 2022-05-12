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
                    // index: 'businessManagement',
                    title: '商户配置管理',
                    nextItems: [
                        {
                            index: 'businessList',
                            title: '商户管理'
                        },
                        {
                            index: 'user',
                            title: '投注用户管理'
                        },
                        // {
                        //     index: 'bannerSetting',
                        //     title: 'banner配置'
                        // },
                        // {
                        //     index: 'operatelog',
                        //     title: '操作记录'
                        // },
                    ]
                }
            ]
        }
    },
};
</script>

<style>
</style>
