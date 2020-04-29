import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false) 如果设置为true，项目将不会显示在边栏中(默认值为false)
 * alwaysShow: true               if set true, will always show the root menu 如果设置为true，将始终显示根菜单
 *                                if not set alwaysShow, when item has more than one children route, 如果不设置alwaysShow，当项目有多个子路由时，
 *                                it will becomes nested mode, otherwise not show the root menu 它将变成嵌套模式，否则不显示根菜单
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb  如果设置了noRedirect，将不会在面包屑中重定向
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)  控制页面角色(您可以设置多个角色)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)  边栏和面包屑中显示的名称(推荐集)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)  如果设置为true，页面将不会被缓存(默认值为false)
    affix: true                  if set true, the tag will affix in the tags-view 如果设置为true，标签将粘贴在标签视图中
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)  如果设置为false，该项目将隐藏在面包屑中(默认为true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * 没有权限要求的基本页面
 * 所有权限通用路由表 
 * 如首页和登录页和一些不用权限的公用页面
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'home', affix: true }
      }
    ]
  },
  

  // {
  //   path: '/assemble',
  //   component: Layout,
  //   redirect: '/assemble/list',
  //   name: 'Assemble',
  //   meta: {
  //     title: '拼团管理',
  //     icon: 'pintuan2'
  //   },
  //   children: [
  //     {
  //       path: 'assemble-list',
  //       component: () => import('@/views/assemble/list'),
  //       name: 'AssembleList',
  //       meta: { title: '拼团列表', icon: 'peoples' , noCache: true}
  //     },
  //     {
  //       path: 'assemble-product-list',
  //       component: () => import('@/views/assemble/product/list'),
  //       name: 'AssembleProductList',
  //       meta: { title: '拼团商品', icon: 'list' , noCache: true}
  //     },
  //     {
  //       path: 'assemble-product-add',
  //       component: () => import('@/views/assemble/product/create'),
  //       name: 'AssembleProductAdd',
  //       meta: { title: '拼团商品添加', icon: 'edit' , noCache: true},
  //       hidden: true
  //     },
  //     {
  //       path: 'assemble-product-edit/:id(\\d+)',
  //       component: () => import('@/views/assemble/product/edit'),
  //       name: 'AssembleProductEdit',
  //       meta: { title: '拼团商品修改', icon: 'edit' , noCache: true},
  //       hidden: true
  //     },
  //     {
  //       path: 'assemble-order-list',
  //       component: () => import('@/views/assemble/order/list'),
  //       name: 'AssembleOrderList',
  //       meta: { title: '拼团订单', icon: 'order' , noCache: true}
  //     },
  //     {
  //       path: 'assemble-order-detail/:id(\\d+)',
  //       component: () => import('@/views/assemble/order/detail'),
  //       name: 'AssembleOrderDetail',
  //       meta: { title: '拼团订单详情', icon: 'order' , noCache: true},
  //       hidden: true
  //     },
  //   ]
  // },
]

/**
 * asyncRoutes  异步挂载的路由
 * the routes that need to be dynamically loaded based on user roles  需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [
  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    name: 'Product',
    meta: {
      title: '商品管理',
      icon: 'component'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/product/list'),
        name: 'ProductList',
        meta: {  title: '商品列表', icon: 'list', noCache: true }
      },
      {
        path: 'create',
        component: () => import('@/views/product/create'),
        name: 'ProductCreate',
        meta: {  title: '商品添加', icon: 'edit' },
        hidden: true
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/product/edit'),
        name: 'ProductEdit',
        meta: {  title: '编辑商品', noCache: true, activeMenu: '/product/list' },
        hidden: true
      },
      {
        path: 'info/:id(\\d+)',
        component: () => import('@/views/product/manage/info'),
        name: 'ProductManage',
        meta: { roles: ['shop'], title: '产品管理', noCache: true, activeMenu: '/product/info' },
        hidden: true
      },
      {
        path: 'guigelist/:id(\\d+)',
        component: () => import('@/views/product/manage/guigelist'),
        name: 'ProductManageList',
        meta: { roles: ['shop'], title: '规格列表', noCache: true, activeMenu: '/product/guigelist' },
        hidden: true
      },
      {
        path: 'attribute',
        component: () => import('@/views/product/attribute/index'), // Parent router-view
        name: 'ProductAttribute',
        meta: { roles: ['shop'], title: '商品规格属性', icon: 'size' },
        redirect: '/product/attribute/index',
        children: [
          {
            path: 'list',
            component: () => import('@/views/product/attribute/list'),
            name: 'ProductAttributeList',
            meta: { roles: ['shop'], title: '属性列表' }
          },
          {
            path: 'add',
            component: () => import('@/views/product/attribute/add'),
            name: 'ProductAttributeAdd',
            meta: { roles: ['shop'], title: '添加属性' }
          },
          {
            path: 'edit/:id(\\d+)',
            component: () => import('@/views/product/attribute/edit'),
            name: 'ProductAttributeEdit',
            meta: { roles: ['shop'], title: '编辑属性', noCache: true, activeMenu: '/product/attribute/edit' },
            hidden: true
          }
        ]
      },
      {
        path: 'store-classify-list',
        component: () => import('@/views/store/classify/list'),
        name: 'StoreClassifyList',
        meta: { title: '商品分类', icon: 'classify' , noCache: true}
      },
      {
        path: 'store-classify-add',
        component: () => import('@/views/store/classify/add'),
        name: 'StoreClassifyAdd',
        meta: { title: '添加商品分类', icon: 'edit' , noCache: true},
        hidden: true
      },
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    name: 'Order',
    meta: {
      roles: ['shop'],
      title: '订单管理',
      icon: 'order'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/order/list'),
        name: 'OrderList',
        meta: { roles: ['shop'], title: '订单管理', icon: 'order', noCache: true }
      },
      {
        path: 'detail/:id(\\d+)',
        component: () => import('@/views/order/detail'),
        name: 'OrderDetail',
        meta: { roles: ['shop'], title: '订单详情', noCache: true, activeMenu: '/order/detail' },
        hidden: true
      },
    ]
  },
  {
    path: '/freight',
    component: Layout,
    redirect: '/freight/list',
    name: 'Freight',
    meta: {
      roles: ['shop'],
      title: '运费模板',
      icon: 'tree'
    },
    children: [
      {
        path: 'freight-list',
        component: () => import('@/views/freight/list'),
        name: 'FreightList',
        meta: { roles: ['shop'], title: '模板列表', icon: 'list', noCache: true }
      },
      {
        path: 'freight-add',
        component: () => import('@/views/freight/add'),
        name: 'FreightAdd',
        meta: { roles: ['shop'], title: '添加模板', icon: 'edit' , noCache: true}
      },
      {
        path: 'freight-edit/:id(\\d+)',
        component: () => import('@/views/freight/edit'),
        name: 'FreightEdit',
        meta: { roles: ['shop'], title: '编辑模板', noCache: true, activeMenu: '/freight/list' },
        hidden: true
      },
    ]
  },
  {
    path: '/restaurant',
    component: Layout,
    redirect: '/restaurant/order/list',
    name: 'Order',
    meta: {
      roles: ['restaurant'],
      title: '订单管理',
      icon: 'order'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/restaurant/order/list'),
        name: 'RestaurantOrderList',
        meta: { roles: ['restaurant'], title: '订单管理', icon: 'order', noCache: true }
      },
      {
        path: 'detail/:id(\\d+)',
        component: () => import('@/views/restaurant/order/detail'),
        name: 'RestaurantOrderDetail',
        meta: { roles: ['restaurant'], title: '订单详情', noCache: true, activeMenu: '/restaurant/order/detail' },
        hidden: true
      },
    ]
  },
  {
    path: '/store',
    component: Layout,
    redirect: '/store/info',
    name: 'Store',
    meta: {
      title: '店铺管理',
      icon: 'store'
    },
    children: [
      {
        path: 'store-info',
        component: () => import('@/views/store/info'),
        name: 'StoreInfo',
        meta: { title: '店铺信息', icon: 'store', noCache: true }
      },
      {
        path: 'store-classify-edit/:id(\\d+)',
        component: () => import('@/views/store/classify/edit'),
        name: 'StoreClassifyEdit',
        meta: { title: '编辑商品分类', icon: 'edit' , noCache: true},
        hidden: true
      },
      {
        path: 'store-cashout-list',
        component: () => import('@/views/store/cashout/list'),
        name: 'StoreCashoutList',
        meta: { title: '提现管理', icon: 'cash' , noCache: true}
      },
      {
        path: 'store-swiper-list',
        component: () => import('@/views/store/swiper/list'),
        name: 'StoreSwiperList',
        meta: { title: '广告列表', icon: 'list' , noCache: true}
      },
      {
        path: 'store-swiper-add',
        component: () => import('@/views/store/swiper/add'),
        name: 'StoreSwiperAdd',
        meta: { title: '添加广告', icon: 'list' , noCache: true},
        hidden: true
      },
      {
        path: 'store-swiper-edit/:id(\\d+)',
        component: () => import('@/views/store/swiper/edit'),
        name: 'StoreSwiperEdit',
        meta: { title: '编辑广告', icon: 'list' , noCache: true},
        hidden: true
      },
      {
        path: 'store-password',
        component: () => import('@/views/store/password'),
        name: 'StorePassword',
        meta: { title: '重置密码', icon: 'password' , noCache: true}
      },
    ]
  },

  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'Icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },
  

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
