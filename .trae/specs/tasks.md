# 本地生活服务点评平台 - 实现计划

## Task 1: 数据库表结构设计与初始化脚本
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - 设计核心表：用户表(user)、商户表(merchant)、商户品类表(category)、点评表(review)、点评图片表(review_image)、收藏表(favorite)、点赞表(review_like)、预约表(reservation)、商户入驻申请表(merchant_application)、举报表(report)
  - 编写 MySQL DDL 建表脚本（含主键、外键、索引、字段注释）
  - 编写测试数据初始化脚本（预置管理员账户、品类、测试商户、点评数据）
  - 创建项目根目录 `database/` 存放 SQL 脚本
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-14
- **Test Requirements**:
  - `rule` TR-1.1: DDL 脚本在 MySQL 8.0 空库中一次性执行成功，所有表创建成功无报错
  - `rule` TR-1.2: 初始化数据脚本执行后，用户表中存在 admin 账户，商户表≥5条，点评表≥10条，品类表≥4条
  - `rule` TR-1.3: 外键关系正确，删除商户后关联点评/预约记录不丢失（软删或保留策略符合设计）

---

## Task 2: 后端项目基础框架搭建
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - 创建 `server/` 后端项目目录，初始化 npm 项目（package.json）
  - 安装核心依赖：express、sequelize、mysql2、jsonwebtoken、bcryptjs、multer、cors、dotenv、joi、express-async-handler
  - 设计目录结构：`config/`（配置）、`models/`（Sequelize模型）、`routes/`（路由）、`controllers/`（控制器）、`services/`（业务逻辑）、`middleware/`（中间件）、`utils/`（工具）、`uploads/`（图片存储）
  - 配置环境变量隔离：`.env.development`、`.env.production`，配置项含端口、数据库连接、JWT密钥、上传路径
  - 实现 Express 应用入口：跨域处理(CORS)、JSON解析、静态资源服务、统一错误处理中间件、404处理
  - 配置 Sequelize 数据库连接，测试连通性
- **Acceptance Criteria Addressed**: FR-13, FR-14, FR-15, NFR-5
- **Test Requirements**:
  - `rule` TR-2.1: 执行 `npm install` 成功，`npm start` 启动后端口监听正常，访问健康检查接口返回 200
  - `rule` TR-2.2: 前端从不同端口访问接口，CORS 预检请求(OPTIONS)返回 204，实际请求无跨域错误
  - `rule` TR-2.3: 未定义路由返回 404 JSON，业务异常返回统一格式 `{code, message, data}`

---

## Task 3: 后端用户认证与权限模块开发
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 2
- **Description**:
  - 创建 User 模型（id, phone, password_hash, nickname, avatar, role[user/merchant/admin], created_at 等）
  - 实现 JWT 工具：签发 Token、验证 Token 中间件、角色权限校验中间件
  - 实现接口：
    - POST `/api/auth/send-code` 发送验证码（模拟，固定123456）
    - POST `/api/auth/login` 手机号验证码登录（新用户自动注册，role=user）
    - POST `/api/auth/logout` 退出登录（前端清除Token即可）
    - GET `/api/user/profile` 获取当前用户信息
    - PUT `/api/user/profile` 更新用户昵称/头像
    - POST `/api/auth/admin-login` 管理员账号密码登录
  - 密码使用 bcryptjs 加密存储，验证码校验接口限流（简单内存计数）
- **Acceptance Criteria Addressed**: AC-3, FR-3, FR-13
- **Test Requirements**:
  - `rule` TR-3.1: 手机号+123456首次登录自动创建用户，返回包含JWT的响应；再次登录不重复建用户
  - `rule` TR-3.2: 携带有效 JWT 请求 `/api/user/profile` 返回对应用户信息，不携带/过期JWT返回401
  - `rule` TR-3.3: admin/admin123 管理员登录成功，需要 admin 权限的接口普通用户访问返回403

---

## Task 4: 后端商户浏览与搜索接口开发
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 3
- **Description**:
  - 创建 Category 模型、Merchant 模型（含字段：name, category_id, address, phone, business_hours, description, cover_image, images(JSON), rating, review_count, status[pending/approved/rejected], user_id(商户关联用户ID) 等）
  - 实现接口：
    - GET `/api/categories` 获取所有品类列表
    - GET `/api/merchants` 商户列表（支持 query 参数：category_id, keyword, min_rating, page, page_size, sort_by）
    - GET `/api/merchants/:id` 商户详情（含关联品类信息、评分统计、环境图）
    - GET `/api/regions` 获取区域列表（简化实现，可从商户地址聚合或固定字典）
- **Acceptance Criteria Addressed**: AC-1, AC-2, FR-1, FR-2
- **Test Requirements**:
  - `rule` TR-4.1: 商户列表接口传 category_id=X 时仅返回该品类商户，keyword 模糊匹配名称/地址，min_rating 过滤平均分，分页参数正确
  - `rule` TR-4.2: 商户详情接口返回 404 时不存在的 id，存在时返回字段完整，评分保留1位小数
  - `rule` TR-4.3: 商户列表仅返回 status=approved 的商户，pending/rejected 商户不展示

---

## Task 5: 后端点评与互动模块接口开发
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 4
- **Description**:
  - 创建 Review 模型（merchant_id, user_id, rating[1-5], content, images_count, status[normal/removed], created_at）
  - 创建 ReviewImage 模型（review_id, url, sort）
  - 创建 ReviewLike 模型（review_id, user_id，联合唯一索引）
  - 实现接口：
    - GET `/api/merchants/:id/reviews` 商户点评列表（分页，含用户信息、图片、点赞数、当前用户是否已点赞）
    - POST `/api/reviews` 发布点评（登录用户，参数校验：评分1-5，文字≤1000，图片≤3张；发布后更新商户 rating 和 review_count）
    - POST `/api/reviews/:id/like` 点赞/取消点赞（切换，幂等）
    - GET `/api/user/reviews` 我的点评列表
  - 图片上传接口：POST `/api/upload/image`（multer 处理，大小限制5MB，类型限制jpg/png/webp，返回访问URL）
- **Acceptance Criteria Addressed**: AC-5, AC-6, FR-5, FR-6
- **Test Requirements**:
  - `rule` TR-5.1: 发布点评评分0或>5、文字>1000字、图片>3张时，接口返回400并提示原因
  - `rule` TR-5.2: 同一条点评同一用户连续点赞两次，点赞数只+1，再次点赞取消（-1）
  - `rule` TR-5.3: 发布新点评后查询商户详情，review_count 比发布前+1，rating 重新计算（所有 normal 状态点评平均分）
  - `rule` TR-5.4: 图片上传接口返回的 URL 可通过静态资源服务直接访问

---

## Task 6: 后端收藏与预约模块接口开发
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 4
- **Description**:
  - 创建 Favorite 模型（user_id, merchant_id，联合唯一索引）
  - 创建 Reservation 模型（user_id, merchant_id, date, time_slot, contact_phone, remark, status[pending/confirmed/completed/cancelled], created_at）
  - 实现接口：
    - POST `/api/favorites/:merchantId` 收藏/取消收藏商户（切换）
    - GET `/api/favorites` 我的收藏列表（含商户基本信息）
    - GET `/api/merchants/:id/is-favorited` 当前用户是否已收藏该商户
    - POST `/api/reservations` 提交预约（登录用户，校验商户存在、时段未过期、同一商户同日同时段不重复提交同一用户）
    - GET `/api/user/reservations` 我的预约列表
    - GET `/api/merchants/:id/available-slots` 查询某日可预约时段（09:00-21:00整点）
- **Acceptance Criteria Addressed**: AC-4, AC-7, FR-4, FR-7
- **Test Requirements**:
  - `rule` TR-6.1: 收藏接口幂等，连续调用不产生重复记录，收藏列表增删正确
  - `rule` TR-6.2: 提交过去日期预约返回400，同一用户同一商户同日同时段第二次提交返回400
  - `rule` TR-6.3: 预约创建后 status=pending，出现在用户预约列表中，关联商户信息完整

---

## Task 7: 后端商户入驻与商户后台接口开发
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 3
- **Description**:
  - 创建 MerchantApplication 模型（user_id, business_license, store_name, category_id, address, contact_name, contact_phone, status[pending/approved/rejected], reject_reason, submitted_at, reviewed_at, reviewer_id）
  - 实现商户端接口（角色=merchant 或 role=user 但申请通过关联 merchant.user_id）：
    - POST `/api/merchant-applications` 提交入驻申请
    - GET `/api/merchant-applications/mine` 我的申请状态
    - GET `/api/merchant/profile` 获取当前商户信息（登录商户关联的商户）
    - PUT `/api/merchant/profile` 编辑商户信息（名称、地址、电话、营业时间、描述、封面图、环境图，仅 status=approved 可编辑）
    - GET `/api/merchant/reservations` 商户查看预约列表（按状态筛选）
    - PUT `/api/merchant/reservations/:id/status` 修改预约状态（状态流转校验：pending→confirmed/cancelled；confirmed→completed/cancelled）
  - 入驻申请通过时，自动创建 merchant 记录并关联 user_id，将该用户 role 更新为 merchant（或保留 user 但关联 merchant_id）
- **Acceptance Criteria Addressed**: AC-8, AC-9, AC-10, FR-8, FR-9, FR-10
- **Test Requirements**:
  - `rule` TR-7.1: 普通用户提交入驻申请成功，状态为 pending；未申请的用户访问商户后台接口返回403
  - `rule` TR-7.2: 商户编辑信息时 status 非 approved 返回403；必填字段为空返回400
  - `rule` TR-7.3: 预约状态 pending → completed 直接修改返回400（需先 confirmed），非法流转均拦截
  - `rule` TR-7.4: 商户确认预约后，用户端查询预约列表状态同步更新

---

## Task 8: 后端平台管理后台接口开发
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 7, Task 5
- **Description**:
  - 实现管理员接口（role=admin 中间件保护）：
    - GET `/api/admin/merchant-applications` 入驻申请列表（分页、按状态筛选）
    - PUT `/api/admin/merchant-applications/:id/approve` 审核通过（创建 merchant 记录、更新用户 role、记录审核人和时间）
    - PUT `/api/admin/merchant-applications/:id/reject` 审核驳回（传 reject_reason，更新状态）
    - GET `/api/admin/reviews` 点评列表（分页、按关键词/商户筛选）
    - PUT `/api/admin/reviews/:id/remove` 下架点评（status=removed，记录操作人，同时更新商户 rating 和 review_count）
    - GET `/api/admin/merchants` 商户列表（含状态筛选）
    - PUT `/api/admin/merchants/:id/status` 更新商户状态（启用/禁用）
- **Acceptance Criteria Addressed**: AC-8, AC-11, FR-11, FR-12
- **Test Requirements**:
  - `rule` TR-8.1: 非管理员访问 /api/admin/* 接口返回403；管理员访问返回200
  - `rule` TR-8.2: 审核通过入驻申请后，用户 role 变更为 merchant，merchant 表新增关联记录，商户状态 status=approved
  - `rule` TR-8.3: 下架点评后，商户详情页点评列表中该条不再展示，商户平均分重新计算（排除 removed）
  - `rule` TR-8.4: 驳回入驻申请需传 reject_reason，不传返回400

---

## Task 9: 前端项目基础框架搭建
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 2
- **Description**:
  - 创建 `client/` 前端项目目录，使用 Vite 初始化 Vue 3 项目
  - 安装核心依赖：vue-router、pinia、element-plus、@element-plus/icons-vue、axios、sass、dayjs
  - 配置目录结构：
    - `src/api/`：按模块封装所有后端接口请求（user.js, merchant.js, review.js等）
    - `src/router/`：路由配置 + 路由守卫（登录态校验、角色权限）
    - `src/stores/`：Pinia 状态管理（user.js 用户信息+Token持久化）
    - `src/views/`：页面组件（按子系统分子目录 user/ merchant/ admin/）
    - `src/components/`：通用组件（Header/图片上传器/评分选择器/空状态等）
    - `src/layouts/`：布局组件（用户端主布局、商户后台布局、管理员后台布局）
    - `src/utils/`：工具函数（request.js axios 封装、auth.js Token 管理、format.js 格式化）
  - 配置 Vite 代理（开发环境 `/api` 代理到后端端口）
  - 配置 Element Plus 全局/按需引入，设置基础主题色
  - 配置全局响应式断点（CSS 变量或 SCSS mixin），≥375px 适配
- **Acceptance Criteria Addressed**: NFR-1, NFR-5, FR-14
- **Test Requirements**:
  - `rule` TR-9.1: `npm install` 成功，`npm run dev` 启动后浏览器访问首页正常渲染，无控制台报错
  - `rule` TR-9.2: 开发环境前端请求 `/api/*` 被正确代理到后端端口，浏览器Network中无302跨域
  - `rule` TR-9.3: axios 请求拦截器自动携带 Authorization Header，401响应自动跳登录页
  - `rubric` TR-9.4: 目录结构规范性；scale 1-5；anchors 1=无结构/3=基础分层/5=按模块清晰分层，职责单一；threshold >= 4；evidence 目录树截图

---

## Task 10: 前端用户端核心页面开发
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 9, Task 4, Task 5, Task 6
- **Description**:
  - 页面清单：
    1. **登录/注册页** (`/login`)：手机号输入、验证码输入（提示固定123456）、登录按钮、管理员登录入口
    2. **商户列表首页** (`/`)：顶部搜索框、品类Tab筛选、区域/评分下拉筛选、商户卡片列表（封面图、名称、品类、评分、点评数、地址）、分页
    3. **商户详情页** (`/merchant/:id`)：商户轮播图、名称、品类标签、评分星星+数值、点评数、收藏按钮、地址电话营业时间、环境图集、点评发布入口、点评列表（用户头像+昵称+评分+时间+文字+图片+点赞按钮+数）
    4. **发布点评弹窗/页**：评分星星选择器（1-5）、文本域（1000字计数）、多图上传（3张限制+预览+删除）、提交按钮
    5. **预约弹窗/页**：日期选择器、时段选择器（09:00-21:00网格）、联系电话、备注、提交按钮
    6. **个人中心** (`/profile`)：用户信息卡片、菜单导航（我的收藏/我的点评/我的预约/修改资料）
    7. **我的收藏页** (`/profile/favorites`)：收藏商户卡片网格，支持取消收藏
    8. **我的点评页** (`/profile/reviews`)：点评列表（含商户名跳转链接）
    9. **我的预约页** (`/profile/reservations`)：预约列表（商户名、日期时段、状态标签）
    10. **编辑资料弹窗**：修改昵称、头像上传
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, NFR-1
- **Test Requirements**:
  - `rule` TR-10.1: 商户列表筛选组合（品类+关键词+评分）调用接口参数正确，结果渲染一致
  - `rule` TR-10.2: 详情页收藏按钮点击切换状态并调用接口，刷新后状态保持
  - `rule` TR-10.3: 发布点评表单前端校验（评分必填、字数≤1000、图≤3），提交成功后列表刷新显示
  - `rule` TR-10.4: 预约表单禁用过期时段，提交成功后列表显示状态为"待确认"
  - `rubric` TR-10.5: 375px 移动端适配；scale 1-5；anchors 1=布局错乱/3=可点击但挤压/5=布局合理无横向滚动，控件尺寸适合触摸；threshold >= 4；evidence DevTools 移动端截图

---

## Task 11: 前端商户管理后台页面开发
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 9, Task 7
- **Description**:
  - 商户后台独立路由前缀 `/merchant/`，使用侧边栏布局（左侧菜单+顶部用户信息）
  - 页面清单：
    1. **入驻申请引导页**：未申请/待审核/已驳回状态引导，申请表单（营业执照号、门店名、品类选择、地址、联系人信息）
    2. **商户信息编辑页** (`/merchant/profile`)：表单字段（门店名、品类、地址、电话、营业时间[开始-结束时间选择]、描述、封面图上传、环境图多图上传），保存按钮
    3. **预约管理页** (`/merchant/reservations`)：预约列表表格（用户、日期、时段、联系电话、备注、状态、操作时间），状态筛选Tab，操作按钮（确认/完成/取消，按当前状态显示对应可操作按钮）
    4. **商户后台首页** (`/merchant/dashboard`)：数据概览（预约总数、待确认数、今日预约数、点评总数，可选简单图表）
  - 路由守卫：未关联商户的用户访问商户后台，跳入驻申请引导页；非商户角色访问403
- **Acceptance Criteria Addressed**: AC-8, AC-9, AC-10, NFR-1
- **Test Requirements**:
  - `rule` TR-11.1: 入驻申请表单提交后状态页显示"待审核"，刷新后状态不变
  - `rule` TR-11.2: 信息编辑页保存后返回商户详情页（C端）信息同步更新
  - `rule` TR-11.3: 预约状态流转按钮按当前状态正确显示（pending显示确认+取消；confirmed显示完成+取消；其他状态无操作按钮），操作后列表状态立即更新
  - `rubric` TR-11.4: 后台页面布局完整性；scale 1-5；anchors 1=导航缺失/3=基本功能可用/5=侧边栏折叠正常，表格响应式（移动端卡片化），面包屑导航正确；threshold >= 4；evidence 截图

---

## Task 12: 前端平台管理后台页面开发
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 9, Task 8
- **Description**:
  - 平台后台独立路由前缀 `/admin/`，侧边栏布局，独立管理员登录入口（登录页切换tab）
  - 页面清单：
    1. **入驻审核页** (`/admin/applications`)：申请列表表格（申请时间、门店名、联系人、品类、状态），状态筛选，详情弹窗（展示资质信息），操作按钮（通过/驳回，驳回弹输入框填写原因）
    2. **点评管理页** (`/admin/reviews`)：点评列表表格（点评内容摘要、评分、用户、商户、状态、时间），关键词搜索、状态筛选，操作按钮（下架），下架二次确认
    3. **商户管理页** (`/admin/merchants`)：商户列表（名称、品类、状态、评分、创建时间），状态筛选，启用/禁用操作
    4. **平台首页** (`/admin/dashboard`)：数据概览（商户总数、待审核申请、今日点评、已下架点评）
  - 路由守卫：非 admin 角色访问返回403页
- **Acceptance Criteria Addressed**: AC-8, AC-11, NFR-1
- **Test Requirements**:
  - `rule` TR-12.1: 审核通过后商户列表中新增该商户状态为"已通过"，该商户用户可登录商户后台
  - `rule` TR-12.2: 驳回申请时不传原因禁止提交，驳回后商户端可看到驳回原因
  - `rule` TR-12.3: 下架点评操作有二次确认，下架后C端商户详情页该点评消失
  - `rule` TR-12.4: 商户禁用后C端商户列表不再展示该商户，详情页返回404

---

## Task 13: 部署文档与接口文档编写
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 1, Task 2
- **Description**:
  - 编写根目录 `README.md`：
    - 项目简介、功能特性、技术栈说明
    - 环境要求（Node.js 18+, MySQL 8.0+）
    - 快速开始：数据库初始化（执行 database/schema.sql + data.sql）、后端配置（.env 示例）、后端启动、前端配置、前端启动
    - 默认账户说明（admin/admin123，测试用户手机号说明，验证码123456）
    - 目录结构说明（前后端各层职责）
    - 常见问题（端口冲突、数据库连接失败等）
  - 编写 `docs/API.md`：按模块分类的接口文档（URL、Method、请求参数、响应示例、错误码说明），核心接口≥30个
  - 编写 `.env.example` 文件（前端后端各一个），展示所有环境变量项
- **Acceptance Criteria Addressed**: FR-14, FR-15, NFR-5
- **Test Requirements**:
  - `rule` TR-13.1: 按 README 步骤从空目录（含代码）执行到系统可访问的流程，无遗漏步骤
  - `rule` TR-13.2: 每个已实现接口在 API.md 中有对应条目，请求参数名与后端 Controller 接收参数一致
  - `rubric` TR-13.3: 文档清晰度与可操作性；scale 1-5；anchors 1=步骤缺失无法部署/3=步骤有但需自行排错/5=步骤详尽，含截图/示例命令，新手可复现；threshold >= 4；evidence 文档评审

---

## Task 14: 端到端功能测试与兼容性修复
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 10, Task 11, Task 12
- **Description**:
  - 按 AC-14 清单执行完整端到端流程测试，记录每个步骤结果
  - 测试并修复 Chrome / Edge / Safari 最新版兼容性
  - 测试 375px / 768px / 1200px 三断点布局，修复排版错乱
  - 后端：对关键接口编写基础单元测试（Jest/Mocha 任选），覆盖用户认证、商户筛选、点评发布核心逻辑
  - 前端：核心组件添加基础测试用例或进行手动回归测试记录
  - 性能检查：首屏加载时间优化（路由懒加载、图片压缩、组件按需引入）
- **Acceptance Criteria Addressed**: AC-12, AC-14, NFR-2, NFR-4
- **Test Requirements**:
  - `rule` TR-14.1: 用户端核心流程（注册→浏览→搜索→详情→收藏→点评→点赞→预约）3次执行全部成功
  - `rule` TR-14.2: 商户端流程（申请→审核→编辑信息→处理预约）3次执行全部成功
  - `rule` TR-14.3: 平台端流程（审核入驻→下架点评→禁用商户）3次执行全部成功
  - `rule` TR-14.4: Chrome/Edge/Safari 最新版各断点下无控制台 error，无布局错乱，所有按钮可正常点击
  - `rubric` TR-14.5: 页面加载性能；scale 1-5；anchors 1=首屏>8s/3=首屏4-8s/5=首屏<3s，接口平均响应<500ms；threshold >= 3；evidence Network 面板截图
