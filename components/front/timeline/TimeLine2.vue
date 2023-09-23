<template>
    <!-- loading="blue-darken-1" -->
    <v-card title="Actualités" subtitle="2023" class="mt-4">
        <v-timeline side="end" align="start">
            <v-timeline-item dot-color="logo" size="small">
                <div class="d-flex">
                    <strong class="me-4">06/03</strong>
                    <div>
                        <strong>Event 1</strong>
                        <div class="text-caption">
                            Lorem ipsum dolor sit amet consectetur.
                        </div>
                    </div>
                </div>
            </v-timeline-item>

            <v-timeline-item dot-color="rose" size="small">
                <div class="d-flex">
                    <strong class="me-4">05/03</strong>
                    <div>
                        <strong>Event 2</strong>
                        <div class="text-caption">
                            Lorem ipsum dolor sit amet consectetur.
                        </div>
                    </div>
                </div>
            </v-timeline-item>


        </v-timeline>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="outlined" color="#0383ff">{{ $t('menu.voir_plus') }}</v-btn>
        </v-card-actions>

    </v-card>
</template>