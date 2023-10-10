<script setup>
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>
<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
        <div class="extra">
          <!-- 具名插槽 -->
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <!-- 默认插槽 -->
    <slot></slot>
  </el-card>
</template>
<style lang="scss" scoped>
.box-card {
  height: 100%;
  box-sizing: border-box;
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
