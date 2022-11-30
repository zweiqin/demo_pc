<template>
	<div class="info">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<!-- s搜索区 -->
				<div class="container">
					<el-form inline size="small" :label-position="labelPosition">

						<el-form-item label="员工账号：" style="display:inline-block">
							<el-input v-model="infoForm.phone_like" placeholder="请输入员工账号" clearable />
						</el-form-item>

						<el-form-item label="员工姓名：" style="display:inline-block">
							<el-input v-model="infoForm.real_name_like" placeholder="请输入员工姓名" clearable />
						</el-form-item>

						<!-- 👇可以改成在搜索去添加一个是否是已删除员工的搜索条件 -->
						<el-button v-if="is_del === 0" type="danger" label="default" size="small" @click="hadDelStaff">显示禁用的员工
						</el-button>
						<el-button v-else type="success" label="default" size="small" @click="hadOnlineStaff">显示启用的员工</el-button>
						<el-button class="ResetSearch mr10" size="small" type="reset" @click="reset('infoForm')">重置</el-button>
						<el-button type="primary" label="default" size="small" @click="infoSearch">查询</el-button>
					</el-form>
				</div>
				<!-- e搜索区 -->

				<el-button type="primary" label="default" size="small" @click="addClick()">新增员工</el-button>
			</div>

			<!-- s表格 -->
			<el-table :data="tableData.data" style="width: 100%" size="small" highlight-current-row>

				<el-table-column prop="id" label="人员编号" min-width="100" />
				<el-table-column prop="account" label="人员账号" min-width="100" />
				<el-table-column prop="real_name" label="人员姓名" min-width="100" />

				<el-table-column prop="admin_roles_list" label="角色" min-width="100">
					<template v-slot="scope">
						{{ getRoleName(scope.row) }}
					</template>
				</el-table-column>

				<el-table-column prop="is_del" label="状态" min-width="100">
					<template v-slot="scope">
						<el-switch
							:value="scope.row.is_del"
							class="switch"
							:active-value="0"
							:inactive-value="1"
							active-text="启用中"
							inactive-text="已禁用"
							@change="switchStatus(scope.row)"
						/>
					</template>
				</el-table-column>

				<el-table-column label="操作" min-width="120" fixed="right" align="center">
					<template v-slot="scope">
						<!--						<el-button v-if="!is_del" type="text" size="small" class="mr10" @click="changePwd(scope.row)">修改密码</el-button>-->
						<el-button
							v-if="!scope.row.is_del"
							type="text"
							size="small"
							class="mr10"
							@click="edit(scope.row)"
						>编辑
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<div class="block">
				<el-pagination
					:page-sizes="[10, 20, 30, 60, 80]"
					:page-size="infoForm.limit"
					:current-page="infoForm.page"
					layout="total, sizes, prev, pager, next, jumper"
					:total="tableData.total"
					@size-change="handle_size_change"
					@current-change="page_change"
				/>
			</div>
			<!-- e表格 -->

		</el-card>

		<!-- s新增员工 -->
		<el-dialog title="新增员工" :visible.sync="add_visible" :close-on-click-modal="false" class="add_staff" width="70%">

			<el-form ref="addForm" :model="addForm" :rules="addRules">

				<el-form-item label="员工帐号：" :label-width="formLabelWidth" prop="account">
					<el-input
						v-model="addForm.account"
						autocomplete="off"
						placeholder="请输入员工帐号"
						@change="checkAccount(addForm.account)"
					/>
				</el-form-item>

				<el-form-item label="员工姓名：" :label-width="formLabelWidth" prop="real_name">
					<el-input v-model="addForm.real_name" autocomplete="off" placeholder="请输入员工姓名" />
				</el-form-item>

				<!-- s总门店角色 -->

				<el-table
					:data="allAddWorkInfo"
					:header-cell-style="{background:'#F5F7FA',color:'#2F3033',fontWeight:'normal'}"
					style="width: 100%"
					size="small"
					highlight-current-row
				>
					<el-table-column label="请选择角色" min-width="100">
						<template v-slot="scope">
							<el-select
								v-model="scope.row.id"
								placeholder="请选择角色"
								@change="mySelect(scope.row,scope.$index,'allAddWorkInfo')"
							>
								<el-option
									v-for="item in admin_role_list"
									:key="item.id"
									:label="item.role_name"
									:value="item.id"
								/>
							</el-select>
						</template>
					</el-table-column>

					<el-table-column label="操作" min-width="120" fixed="right" align="center">
						<template v-slot="scope">
							<el-button type="text" size="small" class="mr10" @click="allDelRole(scope.$index,'allAddWorkInfo')">
								删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-button size="small" class="addBtn" @click="allAddRole">添加</el-button>
				<!-- s总门店角色 -->

				<div style="margin-top: 10px;"></div>

			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addSubmit('addForm')">保存修改</el-button>
			</div>
		</el-dialog>
		<!-- e新增员工 -->

		<!-- s编辑员工信息 -->
		<el-dialog
			title="编辑员工"
			:visible.sync="edit_visible"
			:close-on-click-modal="false"
			class="add_staff"
			width="70%"
		>

			<el-form ref="editForm" :model="editForm" :rules="editRules">

				<el-form-item label="员工帐号：" :label-width="formLabelWidth" prop="account">
					<el-input v-model="editForm.account" autocomplete="off" placeholder="请输入员工帐号" disabled />
				</el-form-item>

				<el-form-item label="员工姓名：" :label-width="formLabelWidth" prop="real_name">
					<el-input v-model="editForm.real_name" autocomplete="off" placeholder="请输入员工姓名" />
				</el-form-item>

				<el-form-item label="密码：" :label-width="formLabelWidth" prop="pwd">
					<el-input
						v-model="editForm.pwd"
						show-password
						autocomplete="off"
						placeholder="6-16位密码，必须包含数字字母"
					/>
				</el-form-item>

				<el-form-item label="确认密码：" :label-width="formLabelWidth" prop="cPwd">
					<el-input
						v-model="editForm.cPwd"
						show-password
						autocomplete="off"
						placeholder="6-16位密码，必须包含数字字母"
					/>
				</el-form-item>

				<!-- s总门店角色 -->
				<div v-if="!editForm.is_del && isMax(editForm)">
					<el-table
						:data="allEditWorkInfo"
						:header-cell-style="{background:'#F5F7FA',color:'#2F3033',fontWeight:'normal'}"
						style="width: 100%"
						size="small"
						highlight-current-row
					>

						<el-table-column prop="role" label="总后台角色" min-width="100">
							<template v-slot="scope">
								<el-select
									v-model="scope.row.id"
									placeholder="请选择角色"
									@change="mySelect(scope.row,scope.$index,'allEditWorkInfo')"
								>
									<el-option
										v-for="item in admin_role_list"
										:key="item.id"
										:label="item.role_name"
										:value="item.id"
									/>
								</el-select>
							</template>
						</el-table-column>

						<el-table-column label="操作" min-width="120" fixed="right" align="center">
							<template v-slot="scope">
								<el-button type="text" size="small" class="mr10" @click="allDelRole(scope.$index,'allEditWorkInfo')">
									删除
								</el-button>
							</template>
						</el-table-column>

					</el-table>
					<el-button size="small" class="editBtn" @click="allEditRole">添加</el-button>
				</div>
				<!-- e总门店角色 -->
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="editSubmit('editForm')">保存修改</el-button>
			</div>
		</el-dialog>
		<!-- e编辑员工信息 -->

	</div>
</template>

<script>
import { type } from '@/settings'
import { AdminSearch, GetUserInfo, OperateAdmin } from '@/api/admin'
import { GetRoleList } from '@/api/system_role'
import localstorage from '@/utils/localStorage'

export default {
	name: 'info',
	data() {
		return {
			new_role: { id: '' },
			formLabelWidth: '120px',
			tableData: {
				data: [],
				total: 0
			},
			labelPosition: 'right',
			is_del: 0, // 是否已删除员工列表，1是0否
			infoForm: {
				page: 1,
				limit: 30,
				is_del: '',
				admin_type: type,
				mer_id: localstorage.get('admin_info').mer_id,
				provider_id: localstorage.get('admin_info').provider_id,
				real_name_like: '',
				phone_like: ''
			},
			// 总后台角色列表
			admin_role_list: [],
			// 商家角色列表
			mer_role_list: [],
			// 商家列表
			mer_list: [],
			// 新增员工
			add_visible: false,
			addForm: {
				account: '',
				real_name: '',
				admin_type: type,
				mer_id: localstorage.get('admin_info').mer_id,
				provider_id: localstorage.get('admin_info').provider_id
			},
			// 总门店角色
			allAddWorkInfo: [],
			addRules: {
				account: [ { required: true, message: '员工帐号不能为空', change: 'blue' } ],
				real_name: [ { required: true, message: '员工姓名不能为空', change: 'blue' } ]
			},
			// 编辑
			// 新增员工
			edit_visible: false,
			editForm: {
				id: '',
				account: '',
				real_name: '',
				admin_type: '',
				mer_id: '',
				provider_id: '',
				is_del: '',
				pwd: '',
				cPwd: ''
			},
			// 总门店角色
			allEditWorkInfo: [],
			// 角色
			editRules: {
				account: [ { required: true, message: '员工帐号不能为空', change: 'blue' } ],
				real_name: [ { required: true, message: '员工姓名不能为空', change: 'blue' } ],
				nickname: [ { required: true, message: '支付宝姓名不能为空', change: 'blue' } ],
				alipay_account: [ { required: true, message: '支付宝帐号不能为空', change: 'blue' } ],
				group: [ { type: 'number', required: true, message: '员工分组不能为空', change: 'blue' } ],
				scheduling_mer_id: [ { type: 'number', required: true, message: '所属门店不能为空', change: 'blue' } ],
				is_operator: [ { type: 'number', required: true, change: 'blue' } ]
			}
		}
	},
	mounted() {
		this.getList('')
		this.getAdminRole()
	},
	methods: {
		switchStatus(e) {
			console.log(e)
			// this.$confirm('确定删除该用户?', '提示', {
			//   confirmButtonText: '确定',
			//   cancelButtonText: '取消',
			//   type: 'warning'
			// }).then(() => {
			// 传多一个admin_type参数，判断是否是总后台用户，防止同步到平台的删除时出现错误（仅商户后台需要同步到平台）
			OperateAdmin({ id: e.id, is_del: e.is_del === 0 ? 1 : 0, admin_type: e.admin_type })
				.then(() => {
					this.$message.success('操作成功！')
					this.getList()
				})
				.catch((err) => {
					this.$message.error(err.data.msg)
				})
			// })
			//   .catch(() => {
			//     this.$message({
			//       type: 'info',
			//       message: '已取消删除'
			//     })
			//   })
		},
		isMax(row) {
			let flag = true
			// if (row.admin_roles_list) {
			//   const roles = row.admin_roles_list
			if (this.allEditWorkInfo.length) {
				const roles = this.allEditWorkInfo
				roles.forEach((item) => {
					if (item.id === 2 || item.id === 3 || item.id === 4) {
						flag = false
					}
				})
			}
			return flag
		},
		getRoleName(row) {
			if (row.admin_roles_list) {
				const name = row.admin_roles_list.map((item) => item.role_name)
				return name.join(',')
			}
		},
		// 打开新增页面
		addClick() {
			this.add_visible = true
			this.$nextTick(() => {
				this.$refs.addForm.resetFields()
			})
			this.allAddWorkInfo = []
		},
		// // 根据admin_id取用户信息
		// getAdminById(id) {
		// 	this.allEditWorkInfo = []
		// 	this.editWorkInfo = []
		// 	GetUserInfo({ id })
		// 		.then((res) => {
		// 			const all = []
		// 			const data = {}
		// 			this.editForm.id = id
		// 			this.editForm.account = res.data.account
		// 			this.editForm.real_name = res.data.real_name
		// 			this.editForm.admin_type = res.data.admin_type
		// 			this.editForm.mer_id = res.data.mer_id
		// 			this.editForm.provider_id = res.data.provider_id
		// 			console.log(res)
		// 			res.data.AdminRolesList.forEach((item) => {
		// 				data.id = item.id
		// 				all.push(this.$deepClone(data))
		// 			})
		// 			this.allEditWorkInfo = all
		// 		})
		// 		.catch((err) => {
		// 			console.log(err)
		// 		})
		// },
		// 检测帐号
		checkAccount(data) {
			const reg_phone = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
			if (!reg_phone.test(data)) {
				this.$message.error('帐号必须为手机号码')
				this.addForm.account = ''
			}
		},
		mySelect(row, index, data) {
			const new_data = this.$deepClone(this[data])
			new_data.splice(index, 1)
			if (new_data.length > 0) {
				if (new_data.filter((item) => item.id === row.id).length > 0) {
					this.$message.error('该角色已选，请不要重复选取。')
					this[data][index].id = ''
				}
			}
		},
		// 取总后台角色
		async getAdminRole() {
			await GetRoleList({ role_type: type, mer_id: localstorage.get('admin_info').mer_id, provider_id: localstorage.get('admin_info').mer_id, is_developers: 0 })
				.then((res) => {
					this.admin_role_list = res.data
				})
				.catch((err) => {
					this.$message.error(err.data.msg)
				})
		},
		// 查询
		infoSearch() {
			this.getList(1)
		},
		// 列表
		getList(num) {
			this.infoForm.page = num || this.infoForm.page
			const param = this.infoForm
			AdminSearch(param)
				.then((res) => {
					this.tableData.data = res.data.items
					this.tableData.total = res.data.total
				})
				.catch((res) => {
					this.$message.error(res.data.msg)
				})
		},
		// 分页
		page_change(page) {
			this.infoForm.page = page
			this.getList('')
		},
		handle_size_change(val) {
			this.infoForm.limit = val
			this.getList('')
		},
		// 重置
		reset() {
			this.infoForm = {
				page: 1,
				limit: 30,
				is_del: '',
				admin_type: type,
				mer_id: localstorage.get('admin_info').mer_id,
				provider_id: localstorage.get('admin_info').provider_id,
				real_name_like: '',
				phone_like: ''
			}
			this.is_del = 0
			this.getList('')
		},
		// 编辑
		edit(e) {
			// this.getAdminById(e.id)
			this.allEditWorkInfo = []
			const all = []
			const data = {}
			this.editForm.id = e.id
			this.editForm.account = e.account
			this.editForm.real_name = e.real_name
			this.editForm.admin_type = e.admin_type
			this.editForm.mer_id = e.mer_id
			this.editForm.provider_id = e.provider_id
			this.editForm.is_del = e.is_del
			this.editForm.pwd = ''
			this.editForm.cPwd = ''
			e.admin_roles_list && e.admin_roles_list.forEach((item) => {
				data.id = item.id
				all.push(this.$deepClone(data))
			})
			this.allEditWorkInfo = all
			this.edit_visible = true
		},
		// 已删除员工
		hadDelStaff() {
			this.infoForm = {
				page: 1,
				limit: 30,
				is_del: 1,
				admin_type: type,
				mer_id: localstorage.get('admin_info').mer_id,
				provider_id: localstorage.get('admin_info').provider_id,
				real_name_like: '',
				phone_like: ''
			}
			this.is_del = 1
			this.getList('')
		},
		// 在线员工
		hadOnlineStaff() {
			this.infoForm = {
				page: 1,
				limit: 30,
				is_del: 0,
				admin_type: type,
				mer_id: localstorage.get('admin_info').mer_id,
				provider_id: localstorage.get('admin_info').provider_id,
				real_name_like: '',
				phone_like: ''
			}
			this.is_del = 0
			this.getList('')
		},
		// s新增员工
		// 总角色-添加
		allAddRole() {
			this.allAddWorkInfo.push(this.$deepClone(this.new_role))
		},
		// 保存修改
		addSubmit(formName) {
			this.$refs[formName].validate((valid) => {
				// 若必填项不为空
				if (valid) {
					let flag = 0
					const add_data = {}
					const data = JSON.parse(JSON.stringify(this.allAddWorkInfo))
					this.allAddWorkInfo.forEach((item) => {
						if (item.id === '') {
							this.$message.error('请选择总后台角色！')
							flag = 1
							return false
						}
					})
					if (flag === 0) {
						if (data.length === 0) {
							this.$message.error('请创建角色。')
						} else {
							add_data.account = this.addForm.account
							add_data.real_name = this.addForm.real_name
							add_data.admin_type = this.addForm.admin_type
							add_data.mer_id = this.addForm.mer_id
							add_data.provider_id = this.addForm.provider_id
							const data2 = JSON.parse(JSON.stringify(data))
							add_data.admin_roles_list = data2.map((item) => item.id)

							OperateAdmin(add_data)
								.then(() => {
									this.$message.success('新增成功！')
									this.add_visible = false
									this.getList()
								})
								.catch((err) => {
									this.$message.error(err.data.msg)
								})
						}
					}
				} else {
					return false
				}
			})
		},
		// e新增员工

		// s编辑员工
		// 总角色-添加
		allEditRole() {
			this.allEditWorkInfo.push(JSON.parse(JSON.stringify(this.new_role)))
		},
		// 总角色-删除
		allDelRole(index, data) {
			this[data].splice(index, 1)
		},
		// 保存修改
		editSubmit(formName) {
			this.$refs[formName].validate(async (valid) => {
				// 若必填项不为空
				if (valid) {
					// if (this.editForm.pwd !== this.editForm.cPwd) {
					if ((this.editForm.pwd || this.editForm.cPwd) && (this.editForm.pwd !== this.editForm.cPwd)) {
						this.$message.error('两次输入的密码不相同，请重新输入！')
						this.editForm.pwd = ''
						this.editForm.cPwd = ''
						return
					}

					let flag = 0
					const edit_data = {}
					const data = JSON.parse(JSON.stringify(this.allEditWorkInfo))
					this.allEditWorkInfo.forEach((item) => {
						if (item.id === '') {
							this.$message.error('请选择总后台角色！')
							flag = 1
							return false
						}
					})
					if (flag === 0) {
						if (data.length === 0) {
							this.$message.error('请创建角色。')
						} else {
							edit_data.id = this.editForm.id
							edit_data.account = this.editForm.account
							edit_data.real_name = this.editForm.real_name
							edit_data.admin_type = this.editForm.admin_type
							edit_data.mer_id = this.editForm.mer_id
							edit_data.provider_id = this.editForm.provider_id
							edit_data.is_del = this.editForm.is_del
							edit_data.pwd = this.editForm.cPwd
							const data2 = JSON.parse(JSON.stringify(data))
							edit_data.admin_roles_list = data2.map((item) => item.id)
							console.log(edit_data.admin_roles_list)
							OperateAdmin(edit_data)
								.then(() => {
									this.$message.success('修改成功！')
									this.edit_visible = false
									this.getList()
								})
								.catch((err) => {
									this.$message.error(err.data.msg)
								})
						}
					}
				} else {
					return false
				}
			})
		}
		// e编辑员工
	}
}
</script>

<style lang="scss" scoped>

/* switch按钮样式 */
::v-deep .switch .el-switch__label {
  position: absolute;
  display: none;
  color: #fff !important;
}
/*打开时文字位置设置*/
::v-deep .switch .el-switch__label--right {
  z-index: 1;
}
/* 调整打开时文字的显示位子 */
::v-deep .switch .el-switch__label--right span{
  margin-left: 9px;
}
/*关闭时文字位置设置*/
::v-deep .switch .el-switch__label--left {
  z-index: 1;
}
/* 调整关闭时文字的显示位子 */
::v-deep .switch .el-switch__label--left span{
  margin-left: 21px;
}
/*显示文字*/
::v-deep .switch .el-switch__label.is-active {
  display: block;
}
/* 调整按钮的宽度 */
::v-deep .switch.el-switch .el-switch__core,
::v-deep .el-switch .el-switch__label {
  width: 70px !important;
  margin: 0;
}

.info {
  .box-card {
    margin: 20px 20px
  }

  .container {
    min-width: 821px;
  }

  .block {
    float: right;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .add_staff {
    .el-form-item {
      margin-bottom: 20px;
    }

    ::v-deep .el-input__inner {
      text-align: left;
    }
  }

  .el-input__inner {
    text-align: left;
  }

  .end_input {
    display: block;
    position: absolute;
    top: 1px;
    left: 140px;
    width: 40px;
    height: 38px;
    line-height: 38px;
    border-radius: 0 8px 8px 0;
    font-size: 14px;
    color: #111111;
    text-align: center;
    background: rgba(0, 0, 0, 0.02);
  }

  .addBtn,.editBtn {
    margin-top: 10px;
  }
}

</style>
