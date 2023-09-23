<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <div class="newsletter-area">
                    <h2>Inscrivez-vous à la newsletter</h2>
                    <v-row>
                        <v-col cols="12" sm="5">
                            <v-text-field label="Email" append-inner-icon="mdi-email" variant="solo"></v-text-field>

                            <v-btn :loading="loading[1]" :disabled="loading[1]" @click="load(1)">S'inscrire</v-btn>





                        </v-col>
                        <v-col cols="12" sm="2">
                            <img class="bus-img-newsletter" src="/images/newsletter-img.png" alt="newsletter image">
                        </v-col>

                    </v-row>


                </div>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>
export default {
    data() {
        return {
            loading: [],
        }
    },
    methods: {
        load(i) {
            this.loading[i] = true
            setTimeout(() => (this.loading[i] = false), 3000)
        },
    },
}
</script>

<style lang="scss" scoped>
.newsletter-area {
    position: relative;
    background: #0383ff;
    padding: 20px;
    border-radius: 10px;
    z-index: 1;
    min-height: 200px;


    h2 {
        color: #fff;
        font-size: 33px;
        font-weight: 700;
        margin-bottom: 25px;
        line-height: 1;
    }
}


.bus-img-newsletter {
    position: absolute;
    right: 25px;
    top: -20px;
    max-width: 270px;
    animation: img-scale 5s infinite linear;
}

@-webkit-keyframes img-scale {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }

    50% {
        -webkit-transform: scale(0.9);
        transform: scale(0.9);
    }

    100% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}

@keyframes img-scale {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }

    50% {
        -webkit-transform: scale(0.9);
        transform: scale(0.9);
    }

    100% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}
</style>