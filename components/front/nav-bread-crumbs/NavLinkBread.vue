<template>
    <div>
      <!--  <v-breadcrumbs :items="items">
            <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
        </v-breadcrumbs>-->
    </div>
</template>
<script>
export default {
    data: () => ({
        items: [
            {
                title: 'Link 0',
                disabled: false,
                href: '#',
            },
            {
                title: 'Link 1',
                disabled: false,
                href: '#',
            },
            {
                title: 'Link 2',
                disabled: true,
                href: '#',
            },
        ],
    }),
}
</script>