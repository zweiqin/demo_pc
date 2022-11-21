/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const monitor = {
	// 操作日志
	path: '/monitor',
	component: Layout,
	redirect: '/monitor/operlog',
	name: '操作',
	meta: {
		title: '操作管理', icon: 'el-icon-platform-eleme'
	},
	children: [
		{
			path: '/monitor/operlog',
			component: () => import('@/views/monitor/operlog'),
			name: '操作日志',
			meta: { title: '操作日志' }
		}
	]
}

export default monitor
