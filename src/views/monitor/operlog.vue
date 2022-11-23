<template>
	<div class="app-container">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<!-- s搜索区 -->
				<div class="container">

					<el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
						<el-form-item label="模块标题" prop="interface_tags_like	">
							<el-input
								v-model="queryParams.interface_tags_like"
								placeholder="请输入接口模块标题"
								clearable
								style="width: 240px;"
								size="small"
								@keyup.enter.native="handleQuery"
							/>
						</el-form-item>
						<!--						<el-form-item label="接口地址" prop="interface_url">-->
						<!--							<el-input-->
						<!--								v-model="queryParams.interface_url"-->
						<!--								placeholder="请输入接口地址"-->
						<!--								clearable-->
						<!--								style="width: 240px;"-->
						<!--								size="small"-->
						<!--								@keyup.enter.native="handleQuery"-->
						<!--							/>-->
						<!--						</el-form-item>-->
						<!--						<el-form-item label="接口简介" prop="interface_dc">-->
						<!--							<el-input-->
						<!--								v-model="queryParams.interface_dc"-->
						<!--								placeholder="请输入接口简介"-->
						<!--								clearable-->
						<!--								style="width: 240px;"-->
						<!--								size="small"-->
						<!--								@keyup.enter.native="handleQuery"-->
						<!--							/>-->
						<!--						</el-form-item>-->
						<!--						<el-form-item label="请求方式" prop="interface_dc">-->
						<!--							<el-input-->
						<!--								v-model="queryParams.request_method_like"-->
						<!--								placeholder="请输入请求方式"-->
						<!--								clearable-->
						<!--								style="width: 240px;"-->
						<!--								size="small"-->
						<!--								@keyup.enter.native="handleQuery"-->
						<!--							/>-->
						<!--						</el-form-item>-->
						<el-form-item label="请求方式" prop="operator_type">
							<el-select
								v-model="queryParams.request_method_like"
								placeholder="请输入请求方式"
								clearable
								size="small"
								style="width: 240px"
							>
								<el-option label="Get" value="Get" />
								<el-option label="Post" value="Post" />
								<el-option label="Put" value="Put" />
								<el-option label="Delete" value="Delete" />
							</el-select>
						</el-form-item>
						<el-form-item label="用户类别" prop="operator_type">
							<el-select
								v-model="queryParams.operator_type"
								placeholder="操作用户类别"
								clearable
								size="small"
								style="width: 240px"
							>
								<el-option
									v-for="dict in typeOptions"
									:key="dict.key"
									:label="dict.value"
									:value="dict.key"
								/>
							</el-select>
						</el-form-item>
						<el-form-item label="人员账号" prop="oper_name_like">
							<el-input
								v-model="queryParams.oper_name_like"
								placeholder="请输入操作人员账号"
								clearable
								style="width: 240px;"
								size="small"
								@keyup.enter.native="handleQuery"
							/>
						</el-form-item>
						<!--						<el-form-item label="请求地址" prop="oper_url">-->
						<!--							<el-input-->
						<!--								v-model="queryParams.oper_url"-->
						<!--								placeholder="请输入请求地址"-->
						<!--								clearable-->
						<!--								style="width: 240px;"-->
						<!--								size="small"-->
						<!--								@keyup.enter.native="handleQuery"-->
						<!--							/>-->
						<!--						</el-form-item>-->
						<!--						<el-form-item label="主机地址" prop="oper_ip">-->
						<!--							<el-input-->
						<!--								v-model="queryParams.oper_ip"-->
						<!--								placeholder="请输入主机地址"-->
						<!--								clearable-->
						<!--								style="width: 240px;"-->
						<!--								size="small"-->
						<!--								@keyup.enter.native="handleQuery"-->
						<!--							/>-->
						<!--						</el-form-item>-->
						<!--						<el-form-item label="操作地点" prop="oper_location">-->
						<!--							<el-input-->
						<!--								v-model="queryParams.oper_ip"-->
						<!--								placeholder="请输入操作地点"-->
						<!--								clearable-->
						<!--								style="width: 240px;"-->
						<!--								size="small"-->
						<!--								@keyup.enter.native="handleQuery"-->
						<!--							/>-->
						<!--						</el-form-item>-->
						<!--						<el-form-item label="请求参数" prop="oper_param">-->
						<!--							<el-input-->
						<!--								v-model="queryParams.oper_param"-->
						<!--								placeholder="请输入请求参数"-->
						<!--								clearable-->
						<!--								style="width: 240px;"-->
						<!--								size="small"-->
						<!--								@keyup.enter.native="handleQuery"-->
						<!--							/>-->
						<!--						</el-form-item>-->
						<!--						<el-form-item label="返回参数" prop="oper_result">-->
						<!--							<el-input-->
						<!--								v-model="queryParams.oper_result"-->
						<!--								placeholder="请输入返回参数"-->
						<!--								clearable-->
						<!--								style="width: 240px;"-->
						<!--								size="small"-->
						<!--								@keyup.enter.native="handleQuery"-->
						<!--							/>-->
						<!--						</el-form-item>-->
						<el-form-item label="状态" prop="status">
							<el-select
								v-model="queryParams.status"
								placeholder="操作状态"
								clearable
								size="small"
								style="width: 240px"
							>
								<el-option
									v-for="dict in statusOptions"
									:key="dict.key"
									:label="dict.value"
									:value="dict.key"
								/>
							</el-select>
						</el-form-item>
						<!--						<el-form-item label="错误信息" prop="error_msg">-->
						<!--							<el-input-->
						<!--								v-model="queryParams.error_msg"-->
						<!--								placeholder="请输入错误信息"-->
						<!--								clearable-->
						<!--								style="width: 240px;"-->
						<!--								size="small"-->
						<!--								@keyup.enter.native="handleQuery"-->
						<!--							/>-->
						<!--						</el-form-item>-->
						<el-form-item label="操作时间">
							<el-date-picker
								v-model="dateRange"
								size="small"
								style="width: 240px"
								value-format="yyyy-MM-dd"
								type="daterange"
								range-separator="-"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
							></el-date-picker>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
							<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
						</el-form-item>
					</el-form>
					<!-- e搜索区 -->
				</div>
				<!-- e表格 -->
			</div>

			<el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
				<!--				<el-table-column type="selection" width="55" align="center" />-->
				<el-table-column label="日志编号" width="80" align="center" prop="id" />
				<el-table-column label="接口模块标题" align="left" prop="interface_tags" />
				<el-table-column label="接口地址" min-width="120" align="left" prop="interface_url" :show-overflow-tooltip="true" />
				<el-table-column label="接口简介" align="left" prop="interface_dc" :show-overflow-tooltip="true" />
				<el-table-column label="请求方式" align="center" prop="request_method" />

				<el-table-column label="操作用户类别" min-width="80" align="center" prop="operator_type">
					<template v-slot="scope">
						<div>
							<el-tag v-if="scope.row.operator_type === 0">总后台</el-tag>
							<el-tag v-else-if="scope.row.operator_type === 1" type="success">服务商</el-tag>
							<el-tag v-else type="info">商户端</el-tag>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="操作人员" align="center" prop="real_name" />
				<el-table-column label="人员账号" align="center" prop="oper_name" />
				<!--				<el-table-column label="请求地址" align="center" prop="oper_url" width="130" :show-overflow-tooltip="true" />-->
				<!--				<el-table-column label="主机地址" align="center" prop="oper_ip" :show-overflow-tooltip="true" />-->
				<!--				<el-table-column label="操作地点" align="center" prop="oper_location" :show-overflow-tooltip="true" />-->
				<!--				<el-table-column label="请求参数" align="center" prop="oper_param" :show-overflow-tooltip="true" />-->
				<!--				<el-table-column label="返回参数" align="center" prop="oper_result" :show-overflow-tooltip="true" />-->
				<el-table-column
					label="操作状态" align="center" prop="status"
					:formatter="(row, column, cellValue, index)=>cellValue===0?'正常':'异常'"
				>
					<template v-slot="scope">
						<div>
							<el-tag v-if="scope.row.status === 0" type="success">正常</el-tag>
							<el-tag v-else type="danger">异常</el-tag>
						</div>
					</template>
				</el-table-column>
				<!--				<el-table-column label="错误信息" align="center" prop="error_msg	" :show-overflow-tooltip="true" />-->
				<el-table-column label="操作时间" align="center" prop="oper_time" width="180" />

				<el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button
							size="mini"
							type="text"
							icon="el-icon-view"
							@click="handleView(scope.row,scope.index)"
						>详细
						</el-button>
					</template>
				</el-table-column>

			</el-table>

			<div class="block">
				<el-pagination
					:page-sizes="[10, 20, 30, 60, 80]"
					:page-size="queryParams.limit"
					:current-page="queryParams.page"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
					@size-change="handle_size_change"
					@current-change="page_change"
				/>
			</div>

		</el-card>

		<!-- 操作日志详细 -->
		<el-dialog title="操作日志详细" :visible.sync="open" width="900px" append-to-body top="5vh">
			<el-form ref="form" :model="form" label-position="left" label-width="100px" size="mini">
				<el-row>

					<el-col :span="12">
						<el-form-item label="日志编号：">{{ form.id }}</el-form-item>
						<el-form-item label-width="110px" label="接口模块标题：">{{ form.interface_tags }}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="接口地址：">{{ form.interface_url }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="接口简介：">{{ form.interface_dc||"无" }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="请求方式：">{{ form.request_method }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label-width="110px" label="操作用户类别：">
							<div>
								<el-tag v-if="form.operator_type === 0">总后台</el-tag>
								<el-tag v-else-if="form.operator_type === 1" type="success">服务商</el-tag>
								<el-tag v-else type="info">商户端</el-tag>
							</div>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="操作人员：">{{ form.real_name }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="人员账号：">{{ form.oper_name }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="请求地址：">{{ form.oper_url }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="主机地址：">{{ form.oper_ip }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="操作地点：">{{ form.oper_location }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="请求参数：">{{ form.oper_param }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="返回参数：">{{ form.oper_result }}</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="操作状态：">
							<div>
								<el-tag v-if="form.status === 0" type="success">正常</el-tag>
								<el-tag v-else type="danger">异常</el-tag>
							</div>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="错误信息：">{{ form.error_msg||"无" }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="操作时间：">{{ form.oper_time }}</el-form-item>
					</el-col>

				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="open = false">关 闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { GetSystemOperLogList } from '@/api/monitor'

export default {
	name: 'Operlog',
	data() {
		return {
			// 遮罩层
			loading: true,
			// // 选中数组
			// ids: [],
			// // 非多个禁用
			// multiple: true,
			// 总条数
			total: 0,
			// 表格数据
			list: [],
			// 是否显示弹出层
			open: false,
			// 类型数据字典
			typeOptions: [
				{ value: '总后台', key: 0 },
				{ value: '服务商', key: 1 },
				{ value: '商户端', key: 2 }
			],
			// 类型数据字典
			statusOptions: [
				{ value: '正常', key: 0 },
				{ value: '异常', key: 1 }
			],
			// 日期范围
			dateRange: [],
			// 表单参数
			form: {},
			// 查询参数
			queryParams: {
				page: 1,
				limit: 30,
				interface_tags_like: undefined,
				interface_url: '',
				interface_dc: '',
				request_method_like: '',
				operator_type: '',
				oper_name_like: '',
				oper_url: '',
				oper_ip: '',
				oper_location: undefined,
				oper_param: undefined,
				oper_result: undefined,
				status: undefined,
				error_msg: undefined,
				oper_time_l: undefined,
				oper_time_r: undefined
			}
		}
	},
	created() {
		this.getList()
	},
	methods: {
		// 查询登录日志
		getList() {
			this.loading = true
			this.queryParams.oper_time_r = this.dateRange[1] || ''
			this.queryParams.oper_time_l = this.dateRange[0] || ''
			GetSystemOperLogList(this.queryParams)
				.then((response) => {
					this.list = response.data.items
					this.total = response.data.total
					this.loading = false
				})
		},

		// 搜索按钮操作
		handleQuery() {
			this.queryParams.pageNum = 1
			this.getList()
		},

		// 重置按钮操作
		resetQuery() {
			this.dateRange = []
			this.queryParams = {
				page: 1,
				limit: 30,
				interface_tags_like: '',
				interface_url: '',
				interface_dc: '',
				request_method_like: '',
				operator_type: '',
				oper_name_like: '',
				oper_url: '',
				oper_ip: '',
				oper_location: '',
				oper_param: '',
				oper_result: '',
				status: '',
				error_msg: '',
				oper_time_l: '',
				oper_time_r: ''
			}
			this.handleQuery()
		},
		// 多选框选中数据
		handleSelectionChange(selection) {
			// this.ids = selection.map((item) => item.operId)
			// this.multiple = !selection.length
		},

		// 详细按钮操作
		handleView(row) {
			this.open = true
			this.form = row
		},

		page_change(page) {
			this.queryParams.page = page
			this.getList('')
		},
		handle_size_change(val) {
			this.queryParams.limit = val
			this.getList('')
		}
	}
}
</script>

<style lang="scss" scoped>

.block {
  float: right;
}
</style>
