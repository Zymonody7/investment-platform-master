<template>
  <el-card class="h-160">
    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item class="bg-white" v-for="item in 6" :key="item">
        <h3 text="2xl" justify="center">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
  </el-card>
</template>

<script setup lang="ts"></script>

<style scoped></style>
