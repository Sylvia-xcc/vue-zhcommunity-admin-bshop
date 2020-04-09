import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
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
        meta: { title: '商品列表', icon: 'list', noCache: true }
      },
      {
        path: 'create',
        component: () => import('@/views/product/create'),
        name: 'ProductCreate',
        meta: { title: '商品添加', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/product/edit'),
        name: 'ProductEdit',
        meta: { title: '编辑商品', noCache: true, activeMenu: '/product/list' },
        hidden: true
      },
      {
        path: 'info/:id(\\d+)',
        component: () => import('@/views/product/manage/info'),
        name: 'ProductManage',
        meta: { title: '产品管理', noCache: true, activeMenu: '/product/info' },
        hidden: true
      },
      {
        path: 'guigelist/:id(\\d+)',
        component: () => import('@/views/product/manage/guigelist'),
        name: 'ProductManageList',
        meta: { title: '规格列表', noCache: true, activeMenu: '/product/guigelist' },
        hidden: true
      },
      {
        path: 'attribute',
        component: () => import('@/views/product/attribute/index'), // Parent router-view
        name: 'ProductAttribute',
        meta: { title: '商品规格属性', icon: 'size' },
        redirect: '/product/attribute/index',
        children: [
          {
            path: 'list',
            component: () => import('@/views/product/attribute/list'),
            name: 'ProductAttributeList',
            meta: { title: '属性列表' }
          },
          {
            path: 'add',
            component: () => import('@/views/product/attribute/add'),
            name: 'ProductAttributeAdd',
            meta: { title: '添加属性' }
          },
          {
            path: 'edit/:id(\\d+)',
            component: () => import('@/views/product/attribute/edit'),
            name: 'ProductAttributeEdit',
            meta: { title: '编辑属性', noCache: true, activeMenu: '/product/attribute/edit' },
            hidden: true
          }
        ]
      },
      // {
      //   path: 'orderlist',
      //   component: () => import('@/views/product/order/list'),
      //   name: 'ProductOrderList',
      //   meta: { title: '订单管理', icon: 'list', noCache: true }
      // },
      // {
      //   path: 'detail/:id(\\d+)',
      //   component: () => import('@/views/product/order/detail'),
      //   name: 'ProductOrderDetail',
      //   meta: { title: '订单详情', noCache: true, activeMenu: '/product/detail' },
      //   hidden: true
      // },
      // {
      //   path: 'freight',
      //   component: () => import('@/views/freight/index'), // Parent router-view
      //   name: 'Freight',
      //   meta: { title: '运费模板', icon: 'tree' },
      //   redirect: '/freight/index',
      //   children: [
      //     {
      //       path: 'list',
      //       component: () => import('@/views/freight/list'),
      //       name: 'FreightList',
      //       meta: { title: '运费模板列表' }
      //     },
      //     {
      //       path: 'add',
      //       component: () => import('@/views/freight/add'),
      //       name: 'FreightAdd',
      //       meta: { title: '添加模板' }
      //     },
      //     {
      //       path: 'edit/:id(\\d+)',
      //       component: () => import('@/views/product/attribute/edit'),
      //       name: 'ProductAttributeEdit',
      //       meta: { title: '编辑属性', noCache: true, activeMenu: '/product/attribute/edit' },
      //       hidden: true
      //     }
      //   ]
      // }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    name: 'Order',
    meta: {
      title: '订单管理',
      icon: 'order'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/order/list'),
        name: 'OrderList',
        meta: { title: '订单管理', icon: 'order', noCache: true }
      },
      {
        path: 'detail/:id(\\d+)',
        component: () => import('@/views/order/detail'),
        name: 'OrderDetail',
        meta: { title: '订单详情', noCache: true, activeMenu: '/order/detail' },
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
      title: '运费模板',
      icon: 'tree'
    },
    children: [
      {
        path: 'freight-list',
        component: () => import('@/views/freight/list'),
        name: 'FreightList',
        meta: { title: '模板列表', icon: 'list', noCache: true }
      },
      {
        path: 'freight-add',
        component: () => import('@/views/freight/add'),
        name: 'FreightAdd',
        meta: { title: '添加模板', icon: 'edit' , noCache: true}
      },
      {
        path: 'freight-edit/:id(\\d+)',
        component: () => import('@/views/freight/edit'),
        name: 'FreightEdit',
        meta: { title: '编辑模板', noCache: true, activeMenu: '/freight/list' },
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
        path: 'store-classify',
        component: () => import('@/views/store/classify'),
        name: 'StoreClassify',
        meta: { title: '商品分类', icon: 'classify' , noCache: true}
      },
    ]
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'Example',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'Create Article', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'Article List', icon: 'list' }
  //     }
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'Error Log', icon: 'bug' }
  //     }
  //   ]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'Export Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'Export Selected' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'Merge Header' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'Export Zip' }
  //     }
  //   ]
  // },

  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: 'PDF', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   hidden: true
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'Theme', icon: 'theme' }
  //     }
  //   ]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'Clipboard', icon: 'clipboard' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'External Link', icon: 'link' }
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
