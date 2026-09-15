<template>
  <div class="image-uploader">
    <el-upload
      :action="uploadUrl"
      list-type="picture-card"
      :file-list="fileList"
      :multiple="multiple"
      :limit="limit"
      :accept="accept"
      :headers="headers"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :auto-upload="false"
    >
      <el-icon><Plus /></el-icon>
      <template #tip>
        <div class="upload-tip">
          <span v-if="limit">最多上传 {{ limit }} 张图片</span>
          <span>支持 {{ accept }} 格式</span>
        </div>
      </template>
    </el-upload>

    <el-dialog v-model="previewVisible" title="图片预览">
      <img :src="previewUrl" alt="preview" class="preview-image" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  uploadUrl: {
    type: String,
    default: '/api/upload'
  },
  multiple: {
    type: Boolean,
    default: true
  },
  limit: {
    type: Number,
    default: 9
  },
  maxSize: {
    type: Number,
    default: 5
  },
  accept: {
    type: String,
    default: 'image/jpeg,image/png,image/gif,image/webp'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const fileList = ref([])
const previewVisible = ref(false)
const previewUrl = ref('')

const headers = computed(() => ({
  Authorization: `Bearer ${getToken()}`
}))

const beforeUpload = (file) => {
  const isImage = props.accept.split(',').some((type) => file.type === type.trim())
  const isLtSize = file.size / 1024 / 1024 < props.maxSize

  if (!isImage) {
    ElMessage.error(`只能上传 ${props.accept} 格式的图片!`)
    return false
  }
  if (!isLtSize) {
    ElMessage.error(`图片大小不能超过 ${props.maxSize}MB!`)
    return false
  }
  return true
}

const handleSuccess = (response, file) => {
  if (response.code === 200 || response.url) {
    const url = response.url || response.data?.url
    file.url = url
    updateModelValue()
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

const handleRemove = () => {
  updateModelValue()
}

const handlePreview = (file) => {
  previewUrl.value = file.url
  previewVisible.value = true
}

const handleExceed = () => {
  ElMessage.warning(`最多只能上传 ${props.limit} 张图片`)
}

const updateModelValue = () => {
  const urls = fileList.value.map((f) => f.url).filter(Boolean)
  emit('update:modelValue', urls)
  emit('change', urls)
}
</script>

<style lang="scss" scoped>
.upload-tip {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.preview-image {
  width: 100%;
  height: auto;
}
</style>
