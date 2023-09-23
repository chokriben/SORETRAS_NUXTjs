<template>
    <!-- loading="blue-darken-1" -->
    <v-card max-width="500" max-height="268">
        <nuxt-link href=''>
            <v-list>
                <a v-for="(item, index) in items" :key="index" :href="item.link">
                    <v-list-item>
                        <v-list-item-content>
                            {{ item.title }}
                        </v-list-item-content>
                    </v-list-item>
                </a>
            </v-list>
        </nuxt-link>
    </v-card>
</template>

<script>
export default {
    data: () => ({
        items: [

            {
                title: 'Videothéque',
                link: '/videos',

                value: 2,
                // props: {
                //     appendIcon: 'mdi-close',
                // },
            },
            {
                title: 'Photothéque',
                link: '/photos',

                value: 3,
                props: {
                    color: 'primary',
                },
            },
            {
                title: 'Communication média',
                link: '/communication-media',

                value: 4,
                props: {
                    color: 'primary',
                },
            },

        ],
    }),
}
</script>

<style lang="scss" scoped></style>