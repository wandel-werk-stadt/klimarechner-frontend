<template>
    <section class="k-section">
        <div class="back" v-if="$slots.background">
            <slot name="background"></slot>
        </div>

        <KSectionInner v-bind="$props">
            <slot></slot>
            <template v-slot:title-suffix>
                <slot name="title-suffix"></slot>
            </template>
            <template v-slot:description>
                <slot name="description"></slot>
            </template>
            <template v-slot:footer>
                <slot name="footer"></slot>
            </template>
        </KSectionInner>

        <slot name="sub-section"></slot>
    </section>
</template>

<script>
import KSectionInner from './KSectionInner.vue'

export default {
    components: { KSectionInner },

    props: {
        title: {
            type: String,
            required: true,
        },
    },
}
</script>

<style scoped lang="scss">
.k-section {
    position: relative;
    background-color: var(--k-section-background-color);
    color: var(--k-section-color);
    border: 1px solid var(--k-section-border-color);
    border-radius: 0.25rem;
    user-select: none;
    transition: color 0.25s, background-color 0.25s, border-color 0.25s;

    > .back {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        border-radius: 0.25rem;
        overflow: hidden;
        z-index: 1;
    }
}
</style>
