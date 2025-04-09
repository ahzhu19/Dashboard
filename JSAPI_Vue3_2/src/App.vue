<template>
  <a-config-provider :theme="{ token: { colorPrimary: '#00b96b' } }">
    <router-view></router-view>
  </a-config-provider>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background: #f5f7fa;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
