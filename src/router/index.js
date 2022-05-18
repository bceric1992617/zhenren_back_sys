import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect:'/business/businessList',
        },
        {
            path: '/',
            component: () => import('../components/common/Whole.vue'),
            meta: {
                title: '整体页面布局'
            },
            children: [



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
                        {
                            path: 'UserDetail',
                            component: () => import('../page/business/businessManagement/userDetail.vue'),
                            meta: {
                                title: '用户查看'
                            }
                        },
                    ]
                },
                {
                    path: '/dataCenter',
                    component: () => import('../page/dataCenter/index.vue'),
                    meta: {
                        title: '数据中心'
                    },
                    redirect:'/dataCenter/registerList',
                    children:[
                        {
                            path: 'registerList',
                            component: () => import('../page/dataCenter/registerList.vue'),
                            meta: {
                                title: '注册查询'
                            }
                        },
                        {
                            path: 'tradeList',
                            component: () => import('../page/dataCenter/tradeList.vue'),
                            meta: {
                                title: '交易记录查询'
                            }
                        },
                        {
                            path: 'tradeRecord',
                            component: () => import('../page/dataCenter/tradeRecord.vue'),
                            meta: {
                                title: '账变记录'
                            }
                        },
                    ]
                },

                {
                    path: '/settingCenter',
                    component: () => import('../page/settingCenter/index.vue'),
                    meta: {
                        title: '设置中心'
                    },
                    redirect:'/settingCenter/levelSetting',
                    children:[
                        {
                            path: 'levelSetting',
                            component: () => import('../page/settingCenter/levelSetting.vue'),
                            meta: {
                                title: '商户等级设置'
                            }
                        },
                        {
                            path: 'rateSetting',
                            component: () => import('../page/settingCenter/rateSetting.vue'),
                            meta: {
                                title: '平台费率设置'
                            }
                        },
    
                    ]
                },
                
                {
                    path: '/sysCenter',
                    component: () => import('../page/sysCenter/index.vue'),
                    meta: {
                        title: '系统管理'
                    },
                    redirect:'/sysCenter/roleManagement',
                    children:[
                        {
                            path: 'roleManagement',
                            component: () => import('../page/sysCenter/roleManagement.vue'),
                            meta: {
                                title: '角色权限管理'
                            }
                        },
                        {
                            path: 'accountManagement',
                            component: () => import('../page/sysCenter/accountManagement.vue'),
                            meta: {
                                title: '账户管理'
                            }
                        },
    
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