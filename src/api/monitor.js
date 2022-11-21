import request from '@/utils/request.js'

/*
**
**权限管理相关接口
**
 */

// 角色列表查询/demo
export function GetSystemOperLogList(data) {
	return request.get('/v1/SystemOperLog/GetSystemOperLogList', data)
}
