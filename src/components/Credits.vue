<template>
    <div class="credits">
        Präsentiert von:<br />
        <template v-for="item of list" :key="item.name">
            <a class="anchor" :href="item.url" target="_blank"
                ><span class="text">{{ item.name }}</span></a
            >
            ({{ item.contribution }})<br />
        </template>
    </div>
</template>

<script>
export default {
    name: 'Credits',

    inject: ['i18n'],

    computed: {
        list() {
            return this.i18n.raw('credits').filter((i) => i.type !== 'material')
        },
    },
}
</script>

<style scoped lang="scss">
.anchor {
    --anchor-color: #000;
}
</style>
