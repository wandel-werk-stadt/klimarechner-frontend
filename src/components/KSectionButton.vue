<template>
    <div class="k-section-button">
        <q-btn class="discreet pill" rounded outline size="sm" @click="$emit('click')"
            ><slot></slot
        ></q-btn>
    </div>
</template>

<script>
export default {
    emits: ['click'],
}
</script>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.k-section-button {
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    &:after,
    &:before {
        content: ' ';
        display: block;
        width: auto;
        flex: auto 1 0;
        height: 1px;
        background-color: var(--k-color-section-border);
    }
}
</style>
