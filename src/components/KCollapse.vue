<template>
    <article tabindex="0" :class="['collapse', { active: state }]">
        <header v-if="$slots.header" class="header" @click.prevent.stop="handleTitleClick">
            <slot name="header" />
            <!-- <sl-icon name="arrow-down"></sl-icon> -->
            <!-- <icon name="arrow-up" /> -->
        </header>

        <div
            ref="contentWrapper"
            class="content-wrapper"
            @transitionend="
                (ev) => ev.propertyName === 'max-height' && $emit(state ? 'opened' : 'closed')
            "
        >
            <div ref="content" :class="['content']">
                <slot />
            </div>
        </div>
    </article>
</template>

<script>
import resizeWatcher from '@/tools/resizeWatcher'

export default {
    props: {
        state: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:state', 'opened', 'closed'],

    data() {
        return {
            maxHeight: 0,
        }
    },

    mounted() {
        this.updateMaxHeight()

        this.removeResizeWatcher = resizeWatcher.on(() => {
            this.updateMaxHeight()
        })
    },

    beforeUnmount() {
        if (this.removeResizeWatcher) {
            this.removeResizeWatcher()
        }
    },

    methods: {
        handleTitleClick() {
            this.$emit('update:state', !this.state)
        },

        updateMaxHeight() {
            const { contentWrapper } = this.$refs
            const { content } = this.$refs

            const height = content.clientHeight
            this.maxHeight = height
            contentWrapper.style.maxHeight = `${height}px`
        },
    },
}
</script>

<style lang="scss" scoped>
@import 'src/assets/tools.scss';

.collapse {
    --collapse-time: 0.4s;
    outline: none !important;

    &:not(.active) {
        .header {
            sl-icon {
                transform: translate(0%, -50%) rotate(180deg);
            }
        }

        .content-wrapper {
            visibility: hidden;
            max-height: 0 !important;
            transition-delay: 0s, var(--collapse-time);
        }

        .content {
            opacity: 0;
        }
    }
}

.header {
    position: relative;
    padding: 1.5rem 0;
    // padding-right: 1.5rem;
    user-select: none;
    cursor: pointer;

    // sl-icon {
    //     position: absolute;
    //     right: 0;
    //     top: 50%;
    //     width: 1.5rem;
    //     transform: translate(0%, -50%) rotate(0deg);
    //     transform-origin: center center;
    //     transition: transform var(--collapse-time) 0s $ease-out-quad;
    // }
}

.content-wrapper {
    visibility: visible;
    overflow: hidden;

    transition: max-height var(--collapse-time) 0s $ease-out-quad, visibility 0s 0s;
}

.content {
    display: block !important;
    padding: 0.125rem 0;
    opacity: 1;
    // @apply text-sm;
    // @apply font-semibold;
    transition: opacity calc(var(--collapse-time) / 2);
}
</style>
