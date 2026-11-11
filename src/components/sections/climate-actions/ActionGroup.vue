<template>
    <div class="action-group">
        <legend>{{ label }}</legend>

        <div class="items">
            <slot></slot>
        </div>

        <div class="footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
        },
    },
}
</script>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.action-group {
    border-radius: 0.25rem;
    overflow: hidden;
    box-shadow: 0 0.125rem 0.25rem 0.125rem rgba(#000, 0.125);
    background-color: var(--k-color-section-base);
    padding: 0 0 0.5rem;

    legend {
        display: block;
        width: 100%;
        font-weight: 700;
        font-size: 1rem;
        padding: 0.25rem 0.5rem;
        background-color: var(--k-color-primary-base);
        color: var(--k-color-primary-base-text);
    }

    .items {
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: stretch;
        gap: var(--k-gap);
        padding: 0 0 0;
        gap: 0;
    }

    .footer {
        padding: 0.5rem 1.5rem;
    }

    :deep(.action) {
        position: relative;
        width: 100%;
        padding: 0.75rem 1rem;
        // border-right: 1px solid red;

        &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 15%;
            display: block;
            width: 1px;
            height: 70%;
            background-color: var(--k-color-section-border);
        }

        // &:after {
        //     content: '';
        //     position: absolute;
        //     left: 15%;
        //     bottom: 0;
        //     display: block;
        //     width: 70%;
        //     height: 1px;
        //     background-color: var(--k-color-section-border);
        //     // background-color: red;
        // }

        // &:nth-child(1n + 4) {
        //     &:after {
        //         display: none;
        //     }
        // }
    }

    :deep(.divider) {
        position: relative;
        display: block;
        width: calc(100% - 3rem);
        height: 1px;
        margin: 0.5rem auto;
        background-color: var(--k-color-section-border);
    }

    @include bp-sm {
        :deep(.action) {
            width: 50%;

            &:nth-child(3n + 1) {
                &:before {
                    display: none;
                }
            }
        }
    }

    @include bp-md {
        :deep(.action) {
            width: calc(100% / 3);

            &:nth-child(2n) {
                &:before {
                    display: block;
                }
            }

            &:nth-child(3n) {
                &:before {
                    display: none;
                }
            }
        }
    }
}
</style>
