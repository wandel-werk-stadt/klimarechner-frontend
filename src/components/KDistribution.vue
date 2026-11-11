<template>
    <div class="k-distribution">
        <div class="title">
            <h6>
                {{ title }}
            </h6>
            <div class="suffix"><slot name="suffix"></slot></div>
        </div>

        <div class="bar" @mouseleave="hoveredItem = null">
            <div class="inner">
                <div
                    v-for="item of sortedItems"
                    :key="item.label"
                    :style="{
                        '--item-color': 'var(--k-color-' + item.color + ')',
                        left: item.position + '%',
                        width: item.width + '%',
                    }"
                    @mouseenter="hoveredItem = item"
                    @mouseleave="hoveredItem = null"
                    :class="['item', { hover: hoveredItem?.label === item.label }]"
                >
                    <span>{{ Math.round(item.width) + '%' }}</span>
                </div>
            </div>
        </div>

        <ul @mouseleave="hoveredItem = null">
            <li
                v-for="item of formattedItems"
                :key="item.label"
                :style="{ '--item-color': 'var(--k-color-' + item.color + ')' }"
                @mouseenter="hoveredItem = item"
                @mouseleave="hoveredItem = null"
                :class="{ hover: hoveredItem?.label === item.label }"
            >
                {{ item.label }}
            </li>
        </ul>

        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        },

        items: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            hoveredItem: null,
            colors: ['red', 'orange', 'yellow', 'green', 'blue', 'pink'],
        }
    },

    mounted() {
        setTimeout(() => {
            // this.$nextTick(() => {
            this.$el.classList.add('show')
            // })
        }, 100)
    },

    computed: {
        formattedItems() {
            let position = 0
            return this.items.map((item, index) => {
                const data = {
                    ...item,
                    width: item.value * 100,
                    position,
                    color: item.color || this.colors[index],
                }

                position += data.width

                return data
            })
        },

        sortedItems() {
            let position = 0
            const items = [].slice.call(this.formattedItems)
            items
                .sort((a, b) => b.value - a.value)
                .forEach((item) => {
                    item.position = position
                    position += item.width
                })

            return items
        },
    },
}
</script>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.k-distribution {
    display: flex;
    flex-flow: column;

    &.show {
        .bar .item {
            transform: scalex(1);
        }
    }
}

.title {
    display: flex;
    align-items: center;
    margin-bottom: 0.25rem;
    height: calc(0.875rem * 2);

    h6 {
        font-size: 0.875rem;
        line-height: 1.2;
        font-weight: 500;
    }

    .suffix {
        margin-left: auto;
    }
}

.bar {
    position: relative;
    width: 100%;
    height: 16px;
    margin-bottom: 1rem;
    background-color: var(--k-color-distribution-base);
    border-radius: 0.25rem;
    overflow: hidden;

    .inner {
        position: relative;
        width: 100%;
        height: 100%;
        // transform: scalex(0);
        // transform-origin: left center;
        // transition: transform 0.6s $ease-out-cubic;
    }

    .item {
        position: absolute;
        top: 0;
        height: 100%;
        color: var(--item-color);
        background-color: var(--item-color);
        z-index: 1;
        // background-clip: content-box;
        // padding: 2px 0;
        // transform: scale(1, 1);
        transform: scalex(0);
        transform-origin: left center;
        transition: transform 0.25s $ease-out-sine;

        @for $i from 1 through 10 {
            &:nth-child(#{$i}) {
                transition-delay: 0.25s * ($i - 1);
            }
        }

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: var(--item-color);
            opacity: 0;
            transform: scale(1, 1);
            transition: transform 0.2s, opacity 0.2s;
        }

        &:first-child {
            &,
            &::before {
                border-top-left-radius: 0.25rem;
                border-bottom-left-radius: 0.25rem;
            }
        }

        &:last-child {
            &,
            &::before {
                border-top-right-radius: 0.25rem;
                border-bottom-right-radius: 0.25rem;
            }
        }

        &.hover {
            z-index: 2;

            &::before {
                opacity: 1;
                transform: scale(1, 1.25);
            }

            span {
                opacity: 1;
            }
        }

        span {
            position: absolute;
            left: 50%;
            top: 50%;
            display: block;
            color: #fff;
            font-size: 0.75rem;
            font-weight: 400;
            opacity: 0;
            transform: translate(-50%, -50%);
            pointer-events: none;
        }
    }
}

ul {
    flex: auto 1 0;
    margin: 0 0 auto;
    display: flex;
    flex-flow: column;
    gap: 0;

    li {
        display: flex;
        flex-flow: row;
        align-items: center;
        font-size: 0.75rem;
        cursor: default;
        transition: font 0.2s;
        padding: 0.2rem 0;

        &::before {
            content: '';
            display: block;
            width: 0.75rem;
            height: 0.3125rem;
            border-radius: 0.25rem;
            margin-right: 0.5rem;
            // vertical-align: middle;
            background-color: var(--item-color);
            transition: transform 0.2s;
        }

        &.hover {
            font-weight: 600;

            &::before {
                transform: scale(1, 1.6);
            }
        }

        // @for $i from 1 through 5 {
        //     &:nth-child(#{$i}) {
        //         &::before {
        //             background-color: var(--k-color-distribution-#{$i});
        //         }
        //     }
        // }
    }
}
</style>
