<template>
    <span :class="['k-value', { finished }]" @transitionend="finished = false">
        <span class="value">{{ calculatedValue }}</span>
        <span class="suffix" v-if="suffix">{{ suffix }}</span>
    </span>
</template>

<script>
function easeOutCubic(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b
}

export default {
    name: 'KValue',

    inject: ['filters'],

    props: {
        value: {
            type: Number,
        },

        precision: {
            type: Number,
            default: 1,
        },

        // per second
        speed: {
            type: Number,
            default: 200,
        },

        minDuration: {
            type: Number,
            default: 1000,
        },

        forcePrefix: {
            type: Boolean,
            default: false,
        },

        suffix: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            currentValue: this.value,
            nextValue: 0,
            animationId: null,
            startTime: null,
            endTime: null,
            finished: false,
        }
    },

    computed: {
        calculatedValue() {
            return this.filters.number(this.currentValue, this.precision, this.forcePrefix)
        },
    },

    methods: {
        start(newValue) {
            this.nextValue = newValue === 0 ? 0 : newValue

            const delta = this.nextValue - this.currentValue
            // console.log('start', this.currentValue, this.nextValue, delta)
            if (!delta) {
                return
            }

            const duration = Math.min(
                2000,
                Math.max(this.minDuration, (Math.abs(delta) / this.speed) * 1000),
            )
            // console.log(duration)

            this.finished = false
            this.startTime = null
            this.endTime = null
            this.animationId = window.requestAnimationFrame(
                this.animate.bind(this, this.currentValue, delta, duration),
            )
        },

        stop() {
            // console.log('stop')
            this.currentValue = this.nextValue

            if (this.animationId) {
                window.cancelAnimationFrame(this.animationId)
                this.animationId = null
            }
        },

        animate(value, delta, duration, timestamp) {
            if (!this.startTime) {
                this.startTime = timestamp
                this.endTime = this.startTime + duration
            }

            const eased = easeOutCubic(timestamp - this.startTime, value, delta, duration)
            // console.log(eased, duration, this.endTime - timestamp)

            this.currentValue = eased

            if (timestamp < this.endTime) {
                this.animationId = window.requestAnimationFrame(
                    this.animate.bind(this, value, delta, duration),
                )
            } else {
                this.currentValue = this.nextValue
                this.animationId = null
                this.finished = true
            }
        },
    },

    watch: {
        value(newValue) {
            const v = parseFloat(newValue) || 0
            this.stop()
            this.start(v)
        },
    },

    beforeUnmount() {
        this.stop()
    },
}
</script>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.k-value {
    // transition: text-shadow 0.4s $ease-out-cubic;

    &.finished {
        // text-shadow: 0 0 2px rgba(#000, 0.25), 0 0 6px rgba(#000, 0.25), 0 0 12px rgba(#000, 0.25);

        // body.body--dark & {
        //     text-shadow: 0 0 2px rgba(#fff, 0.75), 0 0 6px rgba(#fff, 0.75),
        //         0 0 12px rgba(#fff, 0.75);
        // }
    }

    .value {
        margin-right: 0.25rem;
    }
}
</style>
