<template>
  <p>{{ greeting }}</p>
</template>

<script>
/* module.exports = {
  data: function() {
    greeting: 'Hello, World!'
  }
}; */
/* ES module export */
export default {
  data: () => ({ greeting: 'Hello, World!' }),
};
</script>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
</style>
