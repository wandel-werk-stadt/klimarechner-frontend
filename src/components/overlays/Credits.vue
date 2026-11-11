<template>
    <q-card class="credits-overlay">
        <q-card-section class="header">
            <header>
                <span>Über den Klimarechner</span>
                <q-space />
                <q-btn icon="o_close" flat round dense v-close-popup />
            </header>
        </q-card-section>

        <q-card-section class="credits">
            <h4>Projektteam</h4>
            <p>
                <div class="row" v-for="item of team" :key="item.name">
                    <span class="label">{{ item.contribution }}</span>
                    <a class="anchor" :href="item.url" target="_blank"
                        ><span class="text">{{ item.name }}</span></a
                    >
                </div>
            </p>
        </q-card-section>

        <q-card-section class="rights">
            <h4>Weitere Referenzen</h4>
            <p>
                <div class="row" v-for="item of material" :key="item.name">
                    <span class="label">{{ item.contribution }}</span>
                    <a class="anchor" :href="item.url" target="_blank"
                        ><span class="text">{{ item.name }}</span></a
                    >
                </div>
            </p>
        </q-card-section>

        <q-card-section>
            <Partners />
        </q-card-section>
    </q-card>
</template>

<script>
import Partners from '@/components/Partners.vue'

export default {
    components: {
        Partners,
    },

    inject: ['i18n'],

    computed: {
        list() {
            return this.i18n.raw('credits')
        },

        team() {
            return this.list.filter((item) => item.type === 'team')
        },

        material() {
            return this.list.filter((item) => item.type === 'material')
        },
    },
}
</script>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.credits-overlay {
    background-color: var(--k-color-section-base);
    padding: 0 1.5rem 1.5rem;
    border-radius: 0.25rem;
    color: #000;
    font-size: 0.875rem;
    max-width: calc(var(--k-page-max-width) - var(--k-page-padding-x) * 2);
    width: calc(100% - var(--k-page-padding-x) * 2);

    @include bp-lg{
        width:80vw;
    }

    @include bp-xl{
        width:75vw;
    }

    @include bp-2xl{
        width:60vw;
    }

    header {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        font-size: 1.25rem;
        line-height: 1.2;
        font-weight: 700;
    }

    h4 {
        font-size: 1rem;
        margin: 0 0 0.5rem;
        line-height: 1.2;
        font-weight: 700;
    }
}

.q-card__section {
    padding: 1.5rem 0 0;

    &.header {
        padding: 1rem 0;
        border-bottom: 1px solid #d7dadd;
    }

    p {
        margin-top: 1rem;
    }
}

.q-separator {
    margin: 0 0 1rem;
}

.row {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    border-top: 1px solid #d7dadd;
    padding: 0.25rem 0;

    &:last-child {
        border-bottom: 1px solid #d7dadd;
    }

    .label {
        display: block;
        font-weight: 700;
        width: 30ch;
    }

    .anchor{
        margin-left:auto;
    }
}
</style>
