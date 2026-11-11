<template>
    <div class="inner">
        <header>
            <div class="title">
                <h2>
                    {{ title }}
                </h2>

                <slot name="title-suffix"></slot>
            </div>
            <p v-if="$slots.description"><slot name="description"></slot></p>
        </header>
        <div class="content">
            <slot></slot>
        </div>
        <footer>
            <slot name="footer"></slot>
        </footer>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
    },
}
</script>

<style scoped lang="scss">
.inner {
    > header,
    > .content,
    > footer {
        position: relative;
        z-index: 10;
    }

    > header {
        padding: 1.5rem 1.5rem 0;
        margin-bottom: 2.5rem;

        .title {
            display: flex;
            flex-flow: row wrap;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;

            h2 {
                line-height: 1.2;
                font-size: 1.125rem;
            }

            :deep(.btn) {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                gap: 0.5rem;
                color: var(--k-color-label);
                cursor: pointer;
                user-select: none;
                transition: color 0.2s;

                &:hover {
                    color: #000;
                }

                .q-icon {
                    $size: 1.125rem;
                    width: $size;
                    height: $size;
                    font-size: $size;
                }
            }
        }

        p {
            font-size: 0.875rem;
            font-weight: 400;
            color: var(--k-section-description-color);
        }
    }

    > .content {
        padding: 0 1.5rem 1.5rem;
    }
}
</style>
