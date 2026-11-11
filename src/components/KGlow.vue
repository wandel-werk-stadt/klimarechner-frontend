<template>
    <svg
        :class="['k-glow', type]"
        viewBox="0 0 363 302"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g :filter="'url(#' + filterId + ')'" v-if="type === 'top'" class="top">
            <path
                d="M185.2-105.5c-41-20.4-102-19.7-132-14.9-20.1 6.2-63.9 25.5-79 53.2-18.7 34.7-39 96-1.6 98.6C10 34 32.2-27 69.8 7.4 107.5 41.7 137 55 190.4 62c53.4 6.9 101.6-45.6 96-87.7-5.7-42-60.4-59.5-101.2-79.8Z"
                fill="#0AB480"
            />
            <path
                d="M-44.7 4.4c-44.6-5.6-59.8 28.5-61.7 46.2 1.7 17.4 7.5 56.7 17 74.6 12 22.4 69.6 10.7 111-27.3C63 60 93 115 84 61.4c-9-53.7-73-50-128.8-57Z"
                fill="#FFE27B"
            />
            <path
                d="M47.2 122.5c-12.5-40-74-39.6-107.5-52-40.7-4.3-126.3-2.8-143.4 37-21.2 49.8 79 12.6 116.9 75.7 37.9 63 52 42.3 103.1 23 51-19.3 43.5-43.7 31-83.7Z"
                fill="#FBB174"
            />
        </g>

        <g :filter="'url(#' + filterId + ')'" v-if="type === 'bottom'" class="bottom">
            <path
                d="M-162.48 273.887C-139.431 326.093 -80.2703 374.266 -47.3908 393.745C-23.1934 403.795 34.3562 420.242 70.9762 405.632C116.751 387.37 185.242 344.651 151.386 312.204C117.529 279.757 47.4605 320.68 38.6826 257.543C29.9047 194.406 12.206 158.059 -33.5789 108.673C-79.3638 59.2859 -167.744 71.2513 -195.971 116.204C-224.199 161.157 -185.529 221.681 -162.48 273.887Z"
                fill="#0AB480"
            />
            <path
                d="M324.815 340.388C375.705 364.305 406.901 329.69 416.138 309.392C420.84 288.016 429.152 239.022 424.777 214.05C419.309 182.834 346.203 174.466 282.296 203.492C218.388 232.518 203.933 155.471 193.801 222.744C183.669 290.016 261.201 310.491 324.815 340.388Z"
                fill="#FFE27B"
            />
            <path
                d="M310.763 436.599C295.014 486.572 218.278 486.118 176.28 501.65C125.395 506.953 18.3005 505.114 -2.99451 455.326C-29.6133 393.091 95.6678 439.561 143.092 360.756C190.516 281.95 208.2 307.846 272.072 331.977C335.945 356.108 326.513 386.626 310.763 436.599Z"
                fill="#FBB174"
            />
        </g>

        <defs>
            <filter
                :id="filterId"
                x="-282.6"
                y="-199.2"
                width="645.4"
                height="500.7"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
            >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="38" result="effect1_foregroundBlur_435_68470" />
            </filter>
        </defs>
    </svg>
</template>

<script>
let glowIndex = 0

export default {
    name: 'KGlow',

    props: {
        type: {
            type: String,
            default: 'top',
        },
    },

    data() {
        return {
            glowIndex: glowIndex++,
            filterId: 'k-glow-filter-' + glowIndex,
        }
    },
}
</script>

<style scoped lang="scss">
.k-glow {
    position: absolute;
    z-index: 1;
    pointer-events: none;

    g {
        display: none;
    }

    &.top {
        g.top {
            display: block;
        }
    }

    &.bottom {
        g.bottom {
            display: block;
        }
    }
}
</style>
