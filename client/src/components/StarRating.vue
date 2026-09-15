<template>
  <div class="star-rating" :class="{ readonly: readonly }">
    <el-tooltip
      v-for="(star, index) in maxScore"
      :key="index"
      :content="getTooltipText(index + 1)"
      placement="top"
      :disabled="readonly"
    >
      <span
        class="star-item"
        :class="{ active: index < currentScore, half: isHalfStar(index) }"
        @click="handleClick(index + 1)"
        @mousemove="handleMouseMove(index + 1, $event)"
        @mouseleave="hoverValue = null"
      >
        <el-icon v-if="index < displayValue && !isHalfStar(index)" class="star-icon"><StarFilled /></el-icon>
        <el-icon v-else-if="isHalfStar(index)" class="star-icon"><Star /></el-icon>
        <el-icon v-else class="star-icon empty"><Star /></el-icon>
      </span>
    </el-tooltip>
    <span v-if="showText" class="rating-text">{{ displayValue.toFixed(1) }}分</span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Star, StarFilled } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    default: 5
  },
  readonly: {
    type: Boolean,
    default: false
  },
  showText: {
    type: Boolean,
    default: false
  },
  allowHalf: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const hoverValue = ref(null)

const displayValue = computed(() => hoverValue.value ?? props.modelValue)

const currentScore = computed(() => Math.floor(displayValue.value))

const isHalfStar = (index) => {
  if (!props.allowHalf) return false
  return index < displayValue.value && index + 0.5 >= displayValue.value
}

const getTooltipText = (value) => {
  const texts = ['很差', '较差', '一般', '较好', '很好']
  return texts[value - 1] || `${value}分`
}

const handleClick = (value) => {
  if (props.readonly) return
  emit('update:modelValue', value)
  emit('change', value)
}

const handleMouseMove = (value, event) => {
  if (props.readonly || !props.allowHalf) return
  const rect = event.currentTarget.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  hoverValue.value = percent < 0.5 ? value - 0.5 : value
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.star-rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:not(.readonly) {
    .star-item {
      cursor: pointer;
    }
  }
}

.star-item {
  display: inline-flex;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
}

.star-icon {
  font-size: 20px;
  color: #f5d430;

  &.empty {
    color: #dcdfe6;
  }
}

.rating-text {
  margin-left: 8px;
  font-size: 14px;
  color: $text-regular;
}
</style>
