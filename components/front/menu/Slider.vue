<template>
    <v-carousel cycle min-h-0 max-h-full hide-delimiter-background show-arrows="hover" class=" slide-y mb-0 mt-3">
        <v-carousel-item>
            <v-row class="justify-center">
                <v-col cols="5" class="container-carousel-content">
                    <div class="c-carousel-text">
                        <div class="text-carousel text-center">
                            <v-col cols="12">
                                <h4 class="title">services de transport fiables et efficaces à nos clients</h4>
                            </v-col>
                            <v-col cols="12">
                                <v-row class="justify-center">
                                    <div class="flex" cols="12" sm="4" text-xs-center>
                                        <div>
                                            <router-link to="/abonnements">
                                                <v-btn depressed :rounded="6" color="#1414ff" class="y">Abonnements</v-btn>
                                            </router-link>
                                        </div>

                                    </div>
                                    <div class="flex" cols="12" sm="4" text-xs-center>

                                        <div>
                                            <router-link to="/contact">
                                                <v-btn depressed :rounded="6" color="#1414ff" class="y">Contactez
                                                    nous</v-btn>
                                            </router-link>
                                        </div>
                                    </div>
                                </v-row>
                            </v-col>

                        </div>
                    </div>
                </v-col>
            </v-row>

            <v-img :aspect-ratio="16 / 9" cover :src="`/images/cam/10.jpg`"></v-img>

        </v-carousel-item>
        <v-carousel-item>
            <v-row class="justify-center">
                <v-col cols="5" class="container-carousel-content">
                    <div class="c-carousel-text">
                        <div class="text-carousel text-center">
                            <v-col cols="12">
                                <h4 class="title">services de transport fiables et efficaces à nos clients</h4>
                            </v-col>
                            <v-col cols="12">
                                <v-row class="justify-center">

                                    <div class="flex" cols="12" sm="4" text-xs-center>
                                        <div>
                                            <router-link to="/abonnements">
                                                <v-btn depressed :rounded="6" color="#1414ff" class="y">Abonnements</v-btn>
                                            </router-link>
                                        </div>

                                    </div>
                                    <div class="flex" cols="12" sm="4" text-xs-center>

                                        <div>
                                            <router-link to="/contact">
                                                <v-btn depressed :rounded="6" color="#1414ff" class="y">Contactez
                                                    nous</v-btn>
                                            </router-link>
                                        </div>
                                    </div>
                                </v-row>

                            </v-col>

                        </div>
                    </div>
                </v-col>
            </v-row>

            <v-img :aspect-ratio="16 / 9" cover :src="`/images/cam/21.jpg`"></v-img>

        </v-carousel-item>
    </v-carousel>
</template>

<script>
export default {
    data() {
        return {
            slides: [
                'First',
                'Second',
                'Third',

            ],
        }
    },
}
</script>

<style lang="scss" scoped>
.slide-y {
    height: 500px;
}

.c-carousel-text {
    position: relative;
    z-index: 999;

    .text-carousel {
        position: absolute;
    }

    .y {
        margin: 3px;
        color: #fff;
    }

    .title {
        margin-top: 5%;
        color: #000;
        font-size: 35px;
        font-weight: 500;
        margin-bottom: 25px;
        line-height: 1;
        width: 100%;

    }
}

.text-carousel {
    margin-top: 25%;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 10px;
    padding-bottom: 15px;

}

@media screen and (max-width: 600px) {
    .slide-y {
        height: 250px !important;
    }

    .c-carousel-text {
        position: relative;
        z-index: 999;
        width: 40%;

        .text-carousel {
            position: absolute;
        }

        .y {
            margin: 3px;
        }

        .title {
            margin-top: 5%;
            color: #000;
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 0px;
            line-height: 1;
            width: 100%;

        }
    }

}

.btn-slider {
    &:hover {
        color: #fff;
    }
}
</style>
