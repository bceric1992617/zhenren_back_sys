import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import('../components/common/Whole.vue'),
            meta: {
                title: '整体页面布局'
            },
            children: [
                {
                    path: '/dashboard',
                    component: () => import('../page/Dashboard.vue'),
                    meta: {
                        title: '首页'
                    },
                    redirect:'/home',     // 该配置是若点击选择父目录时，默认选中该父目录下的子路径页面
                    children: [
                        {
                            path: '/home',
                            component: () => import('../page/Dashboard.vue'),
                            meta: {
                                title: '首页'
                            },
                        }               
                    ]
                },


                {
                    path: '/business',
                    component: () => import('../page/business/index.vue'),
                    meta: {
                        title: '商户配置管理'
                    },
                    redirect:'/business/businessList',
                    children:[
                        {
                            path: 'businessManagement',
                            meta: {
                                title: '商户配置管理'
                            },
                        },
                        {
                            path: 'businessList',
                            component: () => import('../page/business/businessManagement/businessList.vue'),
                            meta: {
                                title: '商户管理'
                            }
                        },
                        {
                            path: 'User',
                            component: () => import('../page/business/businessManagement/user.vue'),
                            meta: {
                                title: '投注用户管理'
                            }
                        },
                        // {
                        //     path: 'bannerSetting',
                        //     component: () => import('../page/business/businessManagement/bannerSetting.vue'),
                        //     meta: {
                        //         title: '游戏分类管理'
                        //     }
                        // },
                        // {
                        //     path: 'operatelog',
                        //     component: () => import('../page/business/businessManagement/operatelog.vue'),
                        //     meta: {
                        //         title: '游戏分类管理'
                        //     }
                        // },
                    ]
                },


                {
                    path: '/404',
                    component: () => import('../page/404.vue'),
                    meta: {
                        title: '404'
                    }
                },
                {
                    path: '/403',
                    component: () => import('../page/403.vue'),
                    meta: {
                        title: '403'
                    }
                },
            ]
        },
        {
            // 登录页面
            path: '/login',
            component: () => import('../page/Login.vue'),
            meta: {
                title: '登录'
            }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});